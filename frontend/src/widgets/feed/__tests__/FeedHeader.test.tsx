import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedHeader } from '../ui/FeedHeader'
import type { FeedMode } from '../model/FeedMode'

const tabs = [
  { label: 'Для вас', value: 'forYou' as FeedMode },
  { label: 'Подписки', value: 'following' as FeedMode },
]

describe('FeedHeader', () => {
  it('renders all tab labels', () => {
    render(<FeedHeader activeMode="forYou" onModeChange={jest.fn()} tabs={tabs} />)
    expect(screen.getByText('Для вас')).toBeInTheDocument()
    expect(screen.getByText('Подписки')).toBeInTheDocument()
  })

  it('calls onModeChange with correct value when tab is clicked', async () => {
    const onModeChange = jest.fn()
    render(<FeedHeader activeMode="forYou" onModeChange={onModeChange} tabs={tabs} />)

    await userEvent.click(screen.getByText('Подписки'))

    expect(onModeChange).toHaveBeenCalledWith('following')
  })

  it('calls onModeChange when active tab is clicked again', async () => {
    const onModeChange = jest.fn()
    render(<FeedHeader activeMode="forYou" onModeChange={onModeChange} tabs={tabs} />)

    await userEvent.click(screen.getByText('Для вас'))

    expect(onModeChange).toHaveBeenCalledWith('forYou')
  })

  it('renders with following as active mode', () => {
    render(<FeedHeader activeMode="following" onModeChange={jest.fn()} tabs={tabs} />)
    expect(screen.getByText('Подписки')).toBeInTheDocument()
  })
})
