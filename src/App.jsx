import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
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
      notifyWith(`User ${user.name} logged in successfully`)
    } catch (exception) {
      console.log(exception)
      notifyWith('Wrong credentials', true)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    notifyWith(`User (${user.name}) logout successfully`)
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </Togglable>
  )


  const createBlog = async (blogObject) => {
    try {

      const addedBlog = await blogService.create(blogObject)
      console.log(addedBlog)
      setBlogs(blogs.concat(addedBlog))
      notifyWith(`A new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (exception) {
      console.log(exception)
      notifyWith(`Could't create blog: ${exception.message}`, true)
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }

  const deleteBlog = (blogId) => {
    setBlogs(blogs.filter(blog => blog.id !== blogId))
    notifyWith('Blog deleted successfully')
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}> Logout </button></p>
          <h2>Create new</h2>
          <Togglable buttonLabel="New Blog">
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <h2>Blogs</h2>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} onBlogDelete={deleteBlog} />
          )}
        </div>
      }

    </div>
  )
}

export default App