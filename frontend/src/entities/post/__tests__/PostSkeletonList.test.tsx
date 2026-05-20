import { render } from '@testing-library/react'
import { PostSkeletonList } from '../ui/skeleton/PostSkeletonList'

describe('PostSkeletonList', () => {
  it('renders default 7 skeletons', () => {
    const { container } = render(<PostSkeletonList />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders custom count of skeletons', () => {
    const { container } = render(<PostSkeletonList count={3} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
