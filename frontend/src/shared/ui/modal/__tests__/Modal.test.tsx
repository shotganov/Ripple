import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../Modal'

jest.mock('@shared/hooks/useLockBodyScroll', () => ({
  useLockBodyScroll: jest.fn(),
}))

const renderModal = (onClose: () => void, props: Partial<Parameters<typeof Modal>[0]> = {}) =>
  render(
    <Modal onClose={onClose} {...props}>
      <div>Modal content</div>
    </Modal>,
  )

describe('Modal', () => {
  it('renders children into document.body via portal', () => {
    renderModal(jest.fn())
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when backdrop mousedown fires on the overlay itself', () => {
    const onClose = jest.fn()
    renderModal(onClose)

    // createPortal appends after the testing-library container, so use lastElementChild
    const backdrop = document.body.lastElementChild as HTMLElement
    fireEvent.mouseDown(backdrop)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when child content is clicked', () => {
    const onClose = jest.fn()
    renderModal(onClose)

    const content = screen.getByText('Modal content')
    fireEvent.mouseDown(content)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders with placement top without errors', () => {
    renderModal(jest.fn(), { placement: 'top' })
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders with placement center without errors', () => {
    renderModal(jest.fn(), { placement: 'center' })
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })
})
