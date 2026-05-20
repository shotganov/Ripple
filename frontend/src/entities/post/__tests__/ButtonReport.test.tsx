import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonReport } from '../ui/butons/ButtonReport'

describe('ButtonReport', () => {
  it('renders a button', () => {
    render(<ButtonReport onReportClick={jest.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onReportClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ButtonReport onReportClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
