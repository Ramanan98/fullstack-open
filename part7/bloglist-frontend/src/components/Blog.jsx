import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogsReducer'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const Blog = ({ blog, auth }) => {


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

  const userAdded = auth;
  return (
    <Card sx={{ mb: 2, p: 1 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ display: 'inline', cursor: 'pointer', textDecoration: 'underline' }}
          component={Link}
          to={`/blogs/${blog.id}`}
        >
          {blog.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ display: 'inline', ml: 1, cursor: 'pointer', textDecoration: 'underline' }}
          color="text.secondary"
          component={Link}
          to={`/blogs/${blog.id}`}
        >
          by {blog.author}
        </Typography>
        {userAdded && (
          <Button onClick={removeBlog} color="error" size="small" variant="contained" sx={{ ml: 2 }}>delete</Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
