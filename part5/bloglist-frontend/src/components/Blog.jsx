import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const addLike = async () => {
    const updatedBlog = await blogService.update(blog.id, {
      likes: likes + 1,
    })
    setLikes(updatedBlog.likes)
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {likes}
            <button onClick={addLike}>
              Like
            </button>
          </div>
          {blog.user && <div>{blog.user.username}</div>}
        </div>
      )}
    </div>
  )
}

export default Blog