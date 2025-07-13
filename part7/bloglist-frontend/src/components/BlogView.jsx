import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, addComment } from '../reducers/blogsReducer'
import { useState } from 'react'

const BlogView = () => {
  const { blogId } = useParams()
  const blog = useSelector(state => state.blogs.find(b => b.id === blogId))
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  if (!blog) return null

  const addLike = () => {
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }))
  }

  const handleComment = event => {
    event.preventDefault()
    // Don't do anything if no comment added
    if (!comment.trim()) return
    dispatch(addComment(blog.id, comment))
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button onClick={addLike}>like</button>
      </div>
      <div>added by {blog.user && blog.user.name}</div>
      <h2>comments</h2>
      <form onSubmit={handleComment}>
        <input type="text" value={comment} onChange={event => setComment(event.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
