import { render, screen, fireEvent } from '@testing-library/react'
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu'

jest.mock('../../assets/icons/icon-more.svg?react', () => () => <svg data-testid="more-icon" />)

const TrashIcon = () => <svg />

const renderDropdown = (children?: React.ReactNode) =>
  render(
    <DropdownMenu>
      {children ?? <DropdownMenuItem icon={TrashIcon} onClick={jest.fn()}>Удалить</DropdownMenuItem>}
    </DropdownMenu>,
  )

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    renderDropdown()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('menu is not visible initially', () => {
    renderDropdown()
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument()
  })

  it('opens menu on trigger click', () => {
    renderDropdown()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Удалить')).toBeInTheDocument()
  })

  it('closes menu on second trigger click', () => {
    renderDropdown()
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(screen.getByText('Удалить')).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument()
  })

  it('closes menu on Escape key', () => {
    renderDropdown()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Удалить')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument()
  })

  it('calls onClick when menu item is clicked', () => {
    const handleClick = jest.fn()
    render(
      <DropdownMenu>
        <DropdownMenuItem icon={TrashIcon} onClick={handleClick}>Действие</DropdownMenuItem>
      </DropdownMenu>,
    )
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Действие'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders danger item with different style flag', () => {
    render(
      <DropdownMenu>
        <DropdownMenuItem icon={TrashIcon} onClick={jest.fn()} danger>Опасно</DropdownMenuItem>
      </DropdownMenu>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Опасно')).toBeInTheDocument()
  })

  it('supports children as render function', () => {
    render(
      <DropdownMenu>
        {(close) => (
          <button onClick={close}>Закрыть</button>
        )}
      </DropdownMenu>,
    )
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText('Закрыть')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Закрыть'))
    expect(screen.queryByText('Закрыть')).not.toBeInTheDocument()
  })
})
