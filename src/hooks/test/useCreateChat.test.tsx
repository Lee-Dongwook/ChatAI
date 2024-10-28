import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateChat } from '@/hooks/useCreateChat';
import { addDoc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

describe('useCreateChat 테스트', () => {
  const mockSessionName = 'New Chat Session';

  it('성공적으로 채팅 세션을 생성해야 한다', async () => {
    const mockDocRef = { id: 'chat123' };
    (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);

    const { result } = renderHook(() => useCreateChat(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(mockSessionName);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sessionName: mockSessionName,
        createdAt: expect.any(Object),
        lastActivity: expect.any(Object),
      })
    );

    expect(result.current.data).toEqual({
      sessionName: mockSessionName,
      createdAt: expect.any(Object),
      lastActivity: expect.any(Object),
      id: 'chat123',
    });
  });

  it('채팅 세션 생성 실패 시 에러를 반환해야 한다', async () => {
    const errorMessage = 'Failed to create chat session';
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCreateChat(), { wrapper });

    await act(async () => {
      result.current.mutate(mockSessionName);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
