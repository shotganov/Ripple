import { act, renderHook } from '@testing-library/react'
import { useDebouncedValue } from '../useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial'))

    expect(result.current).toBe('initial')
  })

  it('updates value after debounce delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('clears previous timeout when value changes again', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'one' },
    })

    rerender({ value: 'two' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'three' })
    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(result.current).toBe('one')

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current).toBe('three')
  })
})
