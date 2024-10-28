import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce 테스트', () => {
  it('지연 시간 후에 값이 업데이트 되어야 한다.', () => {
    const initialDelay = 500;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: initialDelay },
      }
    );
    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: initialDelay });

    act(() => {
      jest.advanceTimersByTime(initialDelay);
    });

    expect(result.current).toBe('updated');
  });

  it('지연 시간 내에 여러 값이 변경되어도 마지막 값만 반영되어야 한다.', () => {
    const initialDelay = 500;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: initialDelay },
      }
    );

    rerender({ value: 'first change', delay: initialDelay });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'second change', delay: initialDelay });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('second change');
  });

  it('지연 시간이 변경되면 타이머가 초기화되어야 한다.', () => {
    const initialDelay = 300;
    const updatedDelay = 500;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: initialDelay },
      }
    );

    rerender({ value: 'first change', delay: initialDelay });
    act(() => {
      jest.advanceTimersByTime(150);
    });

    rerender({ value: 'first change', delay: updatedDelay });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('first change');
  });
});
