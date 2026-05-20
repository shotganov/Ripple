import { render } from '@testing-library/react'
import { PostSkeleton } from '../ui/skeleton/PostSkeleton'

describe('PostSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<PostSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with bordered prop', () => {
    const { container } = render(<PostSkeleton bordered />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
