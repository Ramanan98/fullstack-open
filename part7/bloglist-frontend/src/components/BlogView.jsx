import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, addComment } from '../reducers/blogsReducer'
import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const BlogView = () => {
  const { blogId } = useParams()
  const blog = useSelector(state => state.blogs.find(b => b.id === blogId))
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  if (!blog) return null

  const addLike = (e) => {
    if (e) e.preventDefault();
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }))
  }

  // users can add comments to blog posts
  const handleComment = event => {
    event.preventDefault()
    // Don't do anything if no comment added
    if (!comment.trim()) return
    dispatch(addComment(blog.id, comment))
    setComment('')
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">{blog.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {blog.likes} likes
          <Button onClick={e => addLike(e)} size="small" sx={{ ml: 1 }} variant="outlined">like</Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          added by {blog.user && blog.user.name}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>comments</Typography>
        <form onSubmit={handleComment} style={{ marginBottom: 8 }}>
          <TextField
            size="small"
            value={comment}
            onChange={event => setComment(event.target.value)}
            variant="outlined"
            placeholder="Add a comment"
            sx={{ mr: 1 }}
          />
          <Button type="submit" variant="contained" size="small">add comment</Button>
        </form>
        <List>
          {(blog.comments || []).map((c, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>{c}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default BlogView
