import { renderHook } from '@testing-library/react';
import { useMounted } from './useMounted';

describe('useMounted', () => {
  it('should report true once the component is running on the client', () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(true);
  });
});
