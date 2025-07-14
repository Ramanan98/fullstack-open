import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, logoutUser } from './reducers/userReducer'
import { initializeBlogs, createBlog } from './reducers/blogsReducer'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'

import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import NavigationMenu from './components/NavigationMenu'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import { List } from '@mui/material'
import { ListItem } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const user = useSelector(state => state.user)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`${blogObject.title} by ${blogObject.author} added`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong credentials'))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const handleLogout = event => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logoutUser())
  }

  const loginForm = () => (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          data-testid="loginForm"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username"
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <NavigationMenu onLogout={handleLogout} />
      <Notification />

      <Routes>
        <Route path="/users/:userId" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:blogId" element={<BlogView />} />
        <Route
          path="/blogs"
          element={
            <div>
              <Container maxWidth="sm" sx={{ mt: 3 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Blogs
                  </Typography>
                  {user && (
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>
                  )}
                  {user && (
                    <div style={{ marginTop: 16 }}>
                      {[...blogs]
                        .sort((a, b) => b.likes - a.likes)
                        .map(blog => (
                          <Blog
                            key={blog.id}
                            blog={blog}
                            auth={
                              user &&
                              blog.user &&
                              user.username === (blog.user.username || blog.user.name)
                            }
                          />
                        ))}
                    </div>
                  )}
                </Paper>
              </Container>
            </div>
          }
        />
        <Route
          path="/"
          element={
            user
              ? // Redirect to /blogs if logged in
                window.location.pathname !== '/blogs'
                ? (window.location.replace('/blogs'), null)
                : null
              : loginForm()
          }
        />
      </Routes>
    </div>
  )
}

export default App
