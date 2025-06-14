import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({})
  const [showAll, setShowAll] = useState(true)
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    console.log(newBlog)
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
        setNotifyMessage(`${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => {
          setNotifyMessage(null)
        }, 5000)
      })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
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

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      Title<input
        name="title"
        value={newBlog.title || ''}
        onChange={handleBlogChange}
      /><br />
      Author<input
        name="author"
        value={newBlog.author || ''}
        onChange={handleBlogChange}
      /><br />
      URL<input
        name="url"
        value={newBlog.url || ''}
        onChange={handleBlogChange}
      /><br />
      <button type="submit">Create</button>
    </form>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notifyMessage} />

      {!user && loginForm()}

      {user && <div>
        <p>{user.username} logged in</p>
        <button onClick={handleLogout}>Log out</button>
        <h2>Create new</h2>
        {blogForm()}
      </div>
      }

      {user && (
        <>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      )}
    </div>
  )
}

export default App