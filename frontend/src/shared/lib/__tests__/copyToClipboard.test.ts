import { copyToClipboard } from '../copyToClipboard'

describe('copyToClipboard', () => {
  const originalClipboard = navigator.clipboard

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    })
    jest.restoreAllMocks()
  })

  it('returns true when clipboard write succeeds', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    await expect(copyToClipboard('profile link')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('profile link')
  })

  it('returns false when clipboard write fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
    })

    await expect(copyToClipboard('profile link')).resolves.toBe(false)
  })
})
