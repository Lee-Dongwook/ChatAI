import { renderHook, act, waitFor } from '@testing-library/react';
import { useSubmitFeedback } from '@/hooks/useSubmitFeedback';
import { addDoc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Feedback } from '@/types';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => ({
    seconds: 1628880000,
    nanoseconds: 0,
  })),
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

describe('useSubmitFeedback 테스트', () => {
  const mockFeedback: Omit<Feedback, 'createdAt'> = {
    userId: 'user123',
    sessionId: 'session123',
    rating: 5,
    comment: 'Great service!!',
  };

  it('성공적으로 피드백을 제출하고 캐시를 무효화한다.', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSubmitFeedback(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(mockFeedback);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      ...mockFeedback,
      createdAt: expect.any(Object),
    });
  });

  it('피드백 제출 실패 시 에러를 반환한다.', async () => {
    const errorMessage = 'Failed to submit feedback';
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useSubmitFeedback(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(mockFeedback);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
