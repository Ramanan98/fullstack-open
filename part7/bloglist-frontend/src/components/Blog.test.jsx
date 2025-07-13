/* eslint-disable quotes */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    id: '123',
    title: 'Test blog',
    author: 'Test author',
    url: 'https://test.com',
    likes: 42,
    user: {
      username: 'testuser',
    },
  }

  test("displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default", () => {
    const { container } = render(<Blog blog={blog} auth={true} onDelete={() => {}} />)

    let title_div = container.querySelector('.titleAuthor')
    expect(title_div).toHaveTextContent(blog.title)

    let author_div = container.querySelector('.titleAuthor')
    expect(author_div).toHaveTextContent(blog.author)

    let url_div = container.querySelector('.url')
    expect(url_div).toBeNull()

    let likes_div = container.querySelector('.likes')
    expect(likes_div).toBeNull()
  })

  test("the blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
    const { container } = render(<Blog blog={blog} auth={true} onDelete={() => {}} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url_div = container.querySelector('.url')
    expect(url_div).toBeDefined()

    const likes_div = container.querySelector('.likes')
    expect(likes_div).toBeDefined()
  })

  test('clicking the like button twice increases the likes count by 2', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} auth={true} onDelete={() => {}} addLike={mockHandler} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
