import { vi, Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as helloWorldCm from 'string-reverser.cm';
import { useGreeting } from '../hooks';

vi.mock('string-reverser.cm', () => ({
  getGreeting: vi.fn(),
  getContractId: vi.fn(),
  validateGreeting: vi.fn(),
}));

describe('useGreeting hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip('should start with no claims and not loading', () => {
    const { result } = renderHook(() => useGreeting());
    expect(result.current.greeting).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading to true when fetchClaims is called', async () => {
    const { result } = renderHook(() => useGreeting());

    // do not await to test isLoading
    act(() => {
      result.current.fetch();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should fetch claims and update state accordingly', async () => {
    const mockClaim = { firstKey: 'test', secondKey: 'claim' };

    (helloWorldCm.getGreeting as Mock).mockResolvedValue(mockClaim);

    const { result, rerender } = renderHook(() => useGreeting());

    await act(async () => {
      await result.current.fetch();
    });

    rerender();

    expect(helloWorldCm.getGreeting).toHaveBeenCalledTimes(1);
    expect(result.current.greeting).toEqual(mockClaim);
  });

  it('should validate claim and update isValid state', async () => {
    const mockClaim = {
      firstKey: 'test',
      secondKey: 'claim',
      body: 'test',
    };

    (helloWorldCm.validateGreeting as Mock).mockReturnValue(true);

    const { result } = renderHook(() => useGreeting());

    await act(async () => {
      await result.current.validate(mockClaim);
    });

    expect(helloWorldCm.validateGreeting).toHaveBeenCalledWith(mockClaim);
    expect(helloWorldCm.validateGreeting).toHaveBeenCalledTimes(1);
    expect(result.current.isValid).toBe(true);
  });
});
