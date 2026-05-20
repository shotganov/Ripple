import { render, screen } from '@testing-library/react'
import { ModalContent } from '../ModalContent'

describe('ModalContent', () => {
  it('renders children', () => {
    render(<ModalContent>Контент модалки</ModalContent>)
    expect(screen.getByText('Контент модалки')).toBeInTheDocument()
  })

  it('renders with custom width', () => {
    const { container } = render(<ModalContent width={400}>Содержимое</ModalContent>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with custom maxHeight', () => {
    const { container } = render(<ModalContent maxHeight="80vh">Содержимое</ModalContent>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
