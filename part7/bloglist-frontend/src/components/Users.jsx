import { useEffect, useState } from 'react'
import usersService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then(data => setUsers(data))
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th><h3>blogs created</h3></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
