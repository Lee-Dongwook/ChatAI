/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { getDocs, Query } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  Query: jest.fn(),
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

describe('useFirestoreQuery 테스트', () => {
  const mockQueryKey = 'testQuery';
  const mockFirestoreQuery = {} as Query;

  it('성공적으로 Firestore 데이터를 가져와야 한다', async () => {
    const mockData = [
      { id: '1', name: 'Document 1' },
      { id: '2', name: 'Document 2' },
    ];

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockData.map((doc) => ({
        id: doc.id,
        data: () => ({ name: doc.name }),
      })),
    });

    const { result } = renderHook(
      () =>
        useFirestoreQuery<(typeof mockData)[0]>(
          mockQueryKey,
          mockFirestoreQuery
        ),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('Firestore 호출 실패 시 에러를 반환해야 한다', async () => {
    const errorMessage = 'Failed to fetch data';

    (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(
      () => useFirestoreQuery<any>(mockQueryKey, mockFirestoreQuery),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
