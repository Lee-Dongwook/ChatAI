import { renderHook, waitFor } from '@testing-library/react';
import { useCheckUserRole } from '@/hooks/useCheckUserRole';
import { getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserRole } from '@/redux/slice/userSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { UserRole } from '@/types';

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
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

describe('useChecUserRole 테스트', () => {
  const mockUserId = 'user123';
  const dispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
  });

  it('성공적으로 사용자 역할을 가져와서 Redux 상태를 업데이트 한다.', async () => {
    const mockUserRole: UserRole = 'user';

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: true,
      data: () => ({ role: mockUserRole }),
    });

    const { result } = renderHook(() => useCheckUserRole(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(mockUserRole);
    expect(dispatch).toHaveBeenCalledWith(setUserRole(mockUserRole));
  });
  it('사용자 역할이 없는 경우 에러를 반환해야 한다', async () => {
    const errorMessage = 'User role not found';

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    const { result } = renderHook(() => useCheckUserRole(mockUserId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });

  it('userId가 없을 때 쿼리가 실행되지 않아야 한다', async () => {
    const { result } = renderHook(() => useCheckUserRole(''), {
      wrapper,
    });

    expect(result.current.isPaused).toBe(true);
  });
});
