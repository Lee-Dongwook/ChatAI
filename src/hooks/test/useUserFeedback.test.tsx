import { renderHook, waitFor } from '@testing-library/react';
import { useUserFeedback } from '@/hooks/useUserFeedback';
import { getDocs, type Timestamp } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Feedback } from '@/types';

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

describe('useUserFeedback', () => {
  const mockUserId = 'user123';
  const mockFeedbacks: Feedback[] = [
    {
      id: 'feedback1',
      userId: mockUserId,
      sessionId: 'session1',
      rating: 5,
      comment: 'Great session!',
      createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
    },
    {
      id: 'feedback2',
      userId: mockUserId,
      sessionId: 'session2',
      rating: 4,
      comment: 'Very informative.',
      createdAt: { seconds: 1628880300, nanoseconds: 0 } as Timestamp,
    },
  ];

  it('성공적으로 유저의 피드백 목록을 가져와야 한다', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockFeedbacks.map((feedback) => ({
        id: feedback.id,
        data: () => feedback,
      })),
    });

    const { result } = renderHook(() => useUserFeedback(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockFeedbacks);
  });

  it('쿼리 실패 시 에러를 반환해야 한다', async () => {
    const errorMessage = 'Failed to fetch user feedback';
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useUserFeedback(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
