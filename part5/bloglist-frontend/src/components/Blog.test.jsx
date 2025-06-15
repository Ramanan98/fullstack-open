import { render } from "@testing-library/react"
import Blog from "./Blog"

describe("Blog component", () => {
  test("displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default", () => {
    const blog = {
      title: "10 Tips to Improve Your JavaScript Skills",
      author: "Jane Doe",
      url: "https://devinsights.io/javascript-tips",
      likes: 128,
      user: {
        username: "janedoe_dev",
      },
    }

    const { container } = render(
      <Blog blog={blog} auth={true} onDelete={() => {}} />
    )

    let title_div = container.querySelector(".titleAuthor")
    expect(title_div).toHaveTextContent(blog.title)

    let author_div = container.querySelector(".titleAuthor")
    expect(author_div).toHaveTextContent(blog.author)

    let url_div = container.querySelector(".url")
    expect(url_div).toBeNull()

    let likes_div = container.querySelector(".likes")
    expect(likes_div).toBeNull()
  })
})