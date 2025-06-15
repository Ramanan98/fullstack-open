import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
                    title:
          <input
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
            placeholder='enter title'
          />
        </div>
        <div>
                    author:
          <input
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
            placeholder='enter author'
          />
        </div>
        <div>
                    url:
          <input
            name="url"
            value={newBlog.url}
            onChange={handleBlogChange}
            placeholder='enter url'
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm