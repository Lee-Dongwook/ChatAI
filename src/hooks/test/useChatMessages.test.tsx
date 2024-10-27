import { renderHook, waitFor } from '@testing-library/react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { getDocs } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
}));

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
};

describe('useChatMessages 테스트', () => {
  const mockSessionId = 'session123';

  it('성공적으로 채팅 메시지를 가져와야 한다.', async () => {
    const mockMessages = [
      { id: '1', message: 'Hello', sender: 'user', createdAt: new Date() },
      { id: '2', message: 'Hi there!', sender: 'bot', createdAt: new Date() },
    ];

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockMessages.map((message) => ({
        id: message.id,
        data: () => message,
      })),
    });

    const { result } = renderHook(() => useChatMessages(mockSessionId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockMessages);
  });

  it('채팅 메시지 가져오기 실패 시 에러를 반환한다.', async () => {
    const errorMessage = 'Failed to fetch messages';

    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useChatMessages(mockSessionId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });

  it('sessionId가 없으면 쿼리가 실행되지 않아야 한다.', async () => {
    const { result } = renderHook(() => useChatMessages(''), {
      wrapper,
    });

    expect(result.current.isPaused).toBe(true);
  });
});
