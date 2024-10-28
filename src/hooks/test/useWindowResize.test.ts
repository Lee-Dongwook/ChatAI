import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from '@/hooks/useWindowSize';

describe('useWindowSize 테스트', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('초기 창의 크기를 반환한다.', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it('창 크기가 변경되면 업데이트가 된다.', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = 1280;
      window.innerHeight = 960;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({
      width: 1280,
      height: 960,
    });
  });

  it('클린업 수행 시 이벤트 리스너가 제거된다.', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
