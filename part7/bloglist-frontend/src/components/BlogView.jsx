import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogsReducer'

const BlogView = () => {
  const { blogId } = useParams()
  const blog = useSelector(state => state.blogs.find(b => b.id === blogId))
  const dispatch = useDispatch()

  if (!blog) return null

  const addLike = () => {
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }))
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
    </div>
  )
}

export default BlogView
