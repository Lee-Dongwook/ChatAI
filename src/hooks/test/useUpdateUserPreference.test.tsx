import { renderHook, act, waitFor } from '@testing-library/react';
import { useUpdateUserPreference } from '@/hooks/useUpdateUserPreference';
import { updateDoc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUserPreference } from '@/redux/slice/userSlice';
import type { UserPreference } from '@/types';

jest.mock('firebase/firestore', () => ({
  updateDoc: jest.fn(),
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

describe('useUpdateUserPreference 테스트', () => {
  const mockUserId = 'user123';
  const mockPreference: UserPreference = {
    theme: 'dark',
    language: 'en',
  };

  const dispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  it('성공적으로 유저 선호 설정을 업데이트 하고 Redux와 캐시를 갱신한다.', async () => {
    (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUpdateUserPreference(mockUserId), {
      wrapper,
    });

    await act(async () => {
      result.current.updatePreference(mockPreference);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      'preference.theme': mockPreference.theme,
      'preference.language': mockPreference.language,
    });

    expect(dispatch).toHaveBeenCalledWith(setUserPreference(mockPreference));
  });

  it('업데이트 실패 시 에러를 반환한다.', async () => {
    const errorMessage = 'Failed to update user preference';
    (updateDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useUpdateUserPreference(mockUserId), {
      wrapper,
    });

    await act(async () => {
      result.current.updatePreference(mockPreference);
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
