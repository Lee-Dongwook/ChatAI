import { renderHook, waitFor } from '@testing-library/react';
import { useUserChats } from '@/hooks/useUserChats';
import { getDocs, Timestamp } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ChatSession } from '@/types';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
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

describe('useUserChats 테스트', () => {
  const mockUserId = 'user123';
  const mockChatSessions: ChatSession[] = [
    {
      id: 'chat1',
      sessionName: 'Chat 1',
      createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      lastActivity: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
    },
    {
      id: 'chat2',
      sessionName: 'Chat 2',
      createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      lastActivity: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
    },
  ];

  it('성공적으로 유저의 채팅 세션 목록을 가져와야 한다.', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockChatSessions.map((chat) => ({
        id: chat.id,
        data: () => chat,
      })),
    });

    const { result } = renderHook(() => useUserChats(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockChatSessions);
  });

  it('쿼리 실패 시 에러를 반환한다.', async () => {
    const errorMessage = 'Failed to fetch user chats';
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useUserChats(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
