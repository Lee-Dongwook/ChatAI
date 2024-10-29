import { renderHook, act, waitFor } from '@testing-library/react';
import { useSendMessage } from '@/hooks/useSendMessage';
import { addDoc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { MessageType } from '@/types';

jest.mock('firebase/firestore', () => {
  addDoc: jest.fn();
  collection: jest.fn();
  severTimestamp: jest.fn(() => ({
    seconds: 1628880000,
    nanoseconds: 0,
  }));
});

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

describe('useSendMessage 테스트', () => {
  const mockSessionId = 'session123';
  const mockMessage = 'Hello, world!';
  const mockSender = 'user';
  const mockType: MessageType = 'text';

  it('성공저긍로 메시지 전송 후 캐시 무효화한다.', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSendMessage(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        sessionId: mockSessionId,
        message: mockMessage,
        sender: mockSender,
        type: mockType,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      message: mockMessage,
      sender: mockSender,
      createdAt: expect.any(Object),
      type: mockType,
    });
  });

  it('메시지 전송 실패 시 에러를 반환한다.', async () => {
    const errorMessage = 'Failed to send message';
    (addDoc as jest.Mock).mockResolvedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useSendMessage(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        sessionId: mockSessionId,
        message: mockMessage,
        sender: mockSender,
        type: mockType,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
