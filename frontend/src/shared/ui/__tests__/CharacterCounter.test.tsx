import { render, screen } from '@testing-library/react'
import { CharacterCounter } from '../CharacterCounter'

describe('CharacterCounter', () => {
  it('renders remaining character count', () => {
    render(<CharacterCounter value={25} max={100} />)

    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('renders negative count after max value is exceeded', () => {
    render(<CharacterCounter value={120} max={100} />)

    expect(screen.getByText('-20')).toBeInTheDocument()
  })

  it('renders full overflow sector when overflow reaches scale limit', () => {
    const { container } = render(<CharacterCounter value={250} max={100} overflowFullScale={100} />)

    expect(screen.getByText('-150')).toBeInTheDocument()
    expect(container.querySelector('path')?.getAttribute('d')).toContain('a 9.2 9.2 0 1 1')
  })
})
