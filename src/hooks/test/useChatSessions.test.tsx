import { renderHook, waitFor } from '@testing-library/react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { getDocs } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
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

describe('useChatSessions 테스트', () => {
  const mockUserId = 'user123';

  it('성공적으로 세션 목록을 가져와야 한다.', async () => {
    const mockSessions = [
      {
        id: '1',
        userIds: ['user123', 'alice'],
        sessionName: 'Chat with Alice',
      },
      { id: '2', userIds: ['user123', 'bob'], sessionName: 'Chat with Bob' },
    ];

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockSessions.map((session) => ({
        id: session.id,
        data: () => session,
      })),
    });

    const { result } = renderHook(() => useChatSessions(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSessions);
  });

  it('Firestore 호출 실패 시 에러를 반환해야 한다.', async () => {
    const errorMessage = 'Failed to fetch sessions';

    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useChatSessions(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(new Error(errorMessage));
  });

  it('사용자 ID가 없을 때, 쿼리가 실행되지 않아야 한다.', async () => {
    const { result } = renderHook(() => useChatSessions(''), {
      wrapper,
    });

    expect(result.current.isPaused).toBe(true);
  });
});
