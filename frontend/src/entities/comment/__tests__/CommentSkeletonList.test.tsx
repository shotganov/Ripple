import { render } from '@testing-library/react'
import { CommentSkeletonList } from '../ui/skeleton/CommentSkeletonList'

describe('CommentSkeletonList', () => {
  it('renders without crashing with default count', () => {
    const { container } = render(<CommentSkeletonList />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with custom count', () => {
    const { container } = render(<CommentSkeletonList count={3} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
