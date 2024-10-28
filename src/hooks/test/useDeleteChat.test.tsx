import { renderHook, act, waitFor } from '@testing-library/react';
import { useDeleteChat } from '@/hooks/useDeleteChat';
import { deleteDoc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('firebase/firestore', () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
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

describe('useDeleteChat 테스트', () => {
  const mockUserId = 'user123';
  const mockSessionId = 'session123';

  it('성공적으로 채팅 세션을 삭제해야 한다.', async () => {
    (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteChat(mockUserId), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(mockSessionId);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());

    expect(result.current.status).toBe('success');
  });

  it('채팅 세션 삭제 실패 시 에러를 반환해야 한다.', async () => {
    const errorMessage = 'Failed to delete chat session';
    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useDeleteChat(mockUserId), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(mockSessionId);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
