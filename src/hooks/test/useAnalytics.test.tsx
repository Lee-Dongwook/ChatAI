import { renderHook } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { addDoc } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsEvent } from '@/types';

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

describe('Analytics 테스트', () => {
  it('성공적으로 데이터를 추가해야 한다.', async () => {
    const mockAddDoc = addDoc as jest.Mock;

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    mockAddDoc.mockResolvedValueOnce({ id: '123' });

    const analyticsData = {
      userId: 'user1',
      event: 'session_started' as AnalyticsEvent,
      metaData: { key: 'value' },
    };

    await act(async () => result.current.mutate(analyticsData));

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...analyticsData,
        createdAt: expect.any(Object),
      })
    );
  });
  it('데이터 추가 실패 시 에러를 반환해야 한다', async () => {
    const mockAddDoc = addDoc as jest.Mock;
    const errorMessage = 'Failed to add document';

    mockAddDoc.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    const analyticsData = {
      userId: 'user1',
      event: 'session_started' as AnalyticsEvent,
      metaData: { key: 'value' },
    };

    await act(async () => result.current.mutate(analyticsData));

    expect(addDoc).toHaveBeenCalled();
  });
});
