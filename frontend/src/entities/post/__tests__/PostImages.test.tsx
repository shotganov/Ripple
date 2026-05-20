import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostImages } from '../ui/PostImages'

const getImgs = (container: HTMLElement) => container.querySelectorAll('img')

describe('PostImages', () => {
  it('renders single image', () => {
    const { container } = render(
      <PostImages images={['https://example.com/img.jpg']} onImageClick={jest.fn()} />,
    )
    expect(getImgs(container)).toHaveLength(1)
  })

  it('calls onImageClick with index 0 for single image', async () => {
    const onClick = jest.fn()
    const { container } = render(
      <PostImages images={['https://example.com/img.jpg']} onImageClick={onClick} />,
    )
    await userEvent.click(getImgs(container)[0])
    expect(onClick).toHaveBeenCalledWith(0)
  })

  it('renders two images', () => {
    const { container } = render(
      <PostImages
        images={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
        onImageClick={jest.fn()}
      />,
    )
    expect(getImgs(container)).toHaveLength(2)
  })

  it('renders three images', () => {
    const { container } = render(
      <PostImages images={['a.jpg', 'b.jpg', 'c.jpg']} onImageClick={jest.fn()} />,
    )
    expect(getImgs(container)).toHaveLength(3)
  })

  it('renders four images', () => {
    const { container } = render(
      <PostImages images={['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg']} onImageClick={jest.fn()} />,
    )
    expect(getImgs(container)).toHaveLength(4)
  })

  it('calls onImageClick with correct index for grid images', async () => {
    const onClick = jest.fn()
    const { container } = render(
      <PostImages images={['a.jpg', 'b.jpg']} onImageClick={onClick} />,
    )
    await userEvent.click(getImgs(container)[1])
    expect(onClick).toHaveBeenCalledWith(1)
  })
})
