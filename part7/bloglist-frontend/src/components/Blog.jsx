import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../blogsReducer'

const Blog = ({ blog, auth }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)

  const dispatch = useDispatch()
  const addLike = () => {
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }))
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div className="titleAuthor">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div className="url">{blog.url}</div>
          <div className="likes">
            likes {blog.likes}
            <button onClick={addLike}>Like</button>
          </div>
          {blog.user && <div>{blog.user.username}</div>}
          {auth && <button onClick={removeBlog}>Remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
