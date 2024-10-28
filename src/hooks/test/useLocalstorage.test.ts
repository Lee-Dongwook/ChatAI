import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage 테스트', () => {
  const mockKey = 'testKey';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('초기 값이 localStorage에 없을 때 기본 값을 반환해야 한다', () => {
    const { result } = renderHook(() => useLocalStorage(mockKey, 'initial'));

    const [storedValue] = result.current;

    expect(storedValue).toBe('initial');
    expect(localStorage.getItem(mockKey)).toBe(JSON.stringify('initial'));
  });

  it('localStorage에 값이 있을 때 해당 값을 반환해야 한다', () => {
    localStorage.setItem(mockKey, JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorage(mockKey, 'initial'));

    const [storedValue] = result.current;

    expect(storedValue).toBe('storedValue');
  });

  it('값을 업데이트하면 localStorage에 저장되어야 한다', () => {
    const { result } = renderHook(() => useLocalStorage(mockKey, 'initial'));

    const [, setValue] = result.current;

    act(() => {
      setValue('newValue');
    });

    const [updatedValue] = result.current;

    expect(updatedValue).toBe('newValue');
    expect(localStorage.getItem(mockKey)).toBe(JSON.stringify('newValue'));
  });

  it('localStorage에서 데이터를 가져오거나 설정할 때 오류가 발생하면 기본 값을 반환해야 한다', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Failed to get item');
    });

    const { result } = renderHook(() => useLocalStorage(mockKey, 'initial'));

    const [storedValue] = result.current;

    expect(storedValue).toBe('initial');
  });

  it('setItem에서 오류가 발생하면 콘솔에 에러를 출력해야 한다', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Failed to set item');
    });

    const { result } = renderHook(() => useLocalStorage(mockKey, 'initial'));

    const [, setValue] = result.current;

    act(() => {
      setValue('newValue');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to set localStorage item:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
