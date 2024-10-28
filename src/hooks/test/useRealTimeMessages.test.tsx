import { renderHook } from '@testing-library/react';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { ChatMessage } from '@/types';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe('useRealTimeMessages', () => {
  const mockSessionId = 'session123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('성공적으로 실시간 메시지를 가져와야 한다', async () => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'text',
        message: 'Hello',
        sender: 'user',
        createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      },
      {
        id: '2',
        type: 'text',
        message: 'Hi there',
        sender: 'bot',
        createdAt: { seconds: 1628880300, nanoseconds: 0 } as Timestamp,
      },
    ];

    (onSnapshot as jest.Mock).mockImplementation((query, onSuccess) => {
      onSuccess({
        docs: mockMessages.map((msg) => ({
          id: msg.id,
          data: () => ({ ...msg }),
        })),
      });
      return jest.fn(); // mock unsubscribe function
    });

    const { result } = renderHook(() => useRealTimeMessages(mockSessionId));

    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.error).toBeNull();
  });

  it('`onSnapshot` 오류 발생 시 에러를 반환해야 한다', async () => {
    const errorMessage = 'Failed to get messages';

    (onSnapshot as jest.Mock).mockImplementation(
      (query, onSuccess, onError) => {
        onError(new Error(errorMessage));
        return jest.fn();
      }
    );

    const { result } = renderHook(() => useRealTimeMessages(mockSessionId));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      '메시지를 불러오는 중 오류가 발생했습니다.'
    );
    expect(result.current.messages).toEqual([]);
  });

  it('컴포넌트 언마운트 시 구독이 해제되어야 한다', () => {
    const unsubscribeMock = jest.fn();

    (onSnapshot as jest.Mock).mockReturnValue(unsubscribeMock);

    const { unmount } = renderHook(() => useRealTimeMessages(mockSessionId));

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
