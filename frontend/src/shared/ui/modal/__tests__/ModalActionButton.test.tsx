import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalActionButton } from '../ModalActionButton'

describe('ModalActionButton', () => {
  it('renders label text', () => {
    render(<ModalActionButton variant="primary" onClick={jest.fn()}>Сохранить</ModalActionButton>)
    expect(screen.getByText('Сохранить')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ModalActionButton variant="secondary" onClick={onClick}>Отмена</ModalActionButton>)
    await userEvent.click(screen.getByText('Отмена'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as disabled when disabled prop is true', () => {
    render(
      <ModalActionButton variant="primary" onClick={jest.fn()} disabled>
        Сохранить
      </ModalActionButton>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders secondary variant without crashing', () => {
    render(<ModalActionButton variant="secondary" onClick={jest.fn()}>Отменить</ModalActionButton>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
