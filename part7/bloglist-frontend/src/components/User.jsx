import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const User = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    usersService.getAll().then(users => {
      setUser(users.find(u => u.id === userId))
    })
  }, [userId])

  if (!user) {
    return null
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{user.name}</Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>Added blogs</Typography>
      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id} sx={{ pl: 0 }}>{blog.title}</ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default User
