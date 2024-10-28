import { renderHook, act, waitFor } from '@testing-library/react';
import { usePaginatedMessages } from '@/hooks/usePaginatedMessages';
import { getDocs, Timestamp } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatMessage } from '@/types';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  getDocs: jest.fn(),
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

describe('usePaginatedMessages 테스트', () => {
  const mockSessionId = 'session123';
  const mockPageSize = 10;

  it('성공적으로 첫 페이지의 메시지 목록을 가져와야 한다', async () => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'text',
        message: 'Hello',
        sender: 'user',
        createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      },
      {
        id: '2',
        type: 'text',
        message: 'Hi there',
        sender: 'bot',
        createdAt: { seconds: 1628880300, nanoseconds: 0 } as Timestamp,
      },
    ];

    const mockSnapshot = {
      docs: mockMessages.map((msg) => ({
        id: msg.id,
        data: () => ({ ...msg }),
      })),
    };

    (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

    const { result } = renderHook(
      () => usePaginatedMessages(mockSessionId, mockPageSize),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].messages).toEqual(mockMessages);
  });

  it('다음 페이지의 메시지 목록을 가져와야 한다', async () => {
    const mockMessages: ChatMessage[] = [
      {
        id: '3',
        type: 'text',
        message: 'How are you?',
        sender: 'user',
        createdAt: { seconds: 1628880600, nanoseconds: 0 } as Timestamp,
      },
    ];

    const mockSnapshot = {
      docs: mockMessages.map((msg) => ({
        id: msg.id,
        data: () => ({ ...msg }),
      })),
    };

    (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

    const { result } = renderHook(
      () => usePaginatedMessages(mockSessionId, mockPageSize),
      { wrapper }
    );

    await act(async () => {
      result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[1].messages).toEqual(mockMessages);
  });

  it('Firestore 호출 실패 시 에러를 반환해야 한다', async () => {
    const errorMessage = 'Failed to fetch messages';

    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(
      () => usePaginatedMessages(mockSessionId, mockPageSize),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
