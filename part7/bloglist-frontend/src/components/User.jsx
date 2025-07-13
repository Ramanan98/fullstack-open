import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

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
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
