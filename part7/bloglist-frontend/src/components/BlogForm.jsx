import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleBlogChange = event => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value,
    })
  }

  const addBlog = event => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: '',
    })
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Create a new blog</Typography>
      <form onSubmit={addBlog}>
        <TextField
          label="Title"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
          placeholder="enter title"
          data-testid="title"
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Author"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
          placeholder="enter author"
          data-testid="author"
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="URL"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
          placeholder="enter url"
          data-testid="url"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained">Create</Button>
      </form>
    </Paper>
  )
}

export default BlogForm
