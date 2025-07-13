import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    // Using local storage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then(returnedBlog => {
      const blogWithUser = {
        ...returnedBlog,
        user: user,
      }
      setBlogs(blogs.concat(blogWithUser))
      setNotifyMessage(`${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    })
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifyMessage('wrong credentials')
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }

  const handleLogout = event => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleDeleteBlog = id => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} data-testid="loginForm">
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          data-testid="username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          data-testid="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notifyMessage} />

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}>Log out</button>
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      {user && (
        <>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                auth={user.username === blog.user?.username}
                onDelete={handleDeleteBlog}
              />
            ))}
        </>
      )}
    </div>
  )
}

export default App
