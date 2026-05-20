import { render, screen } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar', () => {
  it('renders an img element', () => {
    render(<Avatar src="https://example.com/avatar.png" size={48} />)
    const img = screen.getByRole('img', { name: /avatar/i })
    expect(img).toBeInTheDocument()
  })

  it('passes src through resolveAssetUrl (absolute url unchanged)', () => {
    render(<Avatar src="https://example.com/avatar.png" size={48} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toBe('https://example.com/avatar.png')
  })

  it('renders with given size', () => {
    render(<Avatar src="" size={64} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
