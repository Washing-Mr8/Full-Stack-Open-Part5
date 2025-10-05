import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, user, onBlogDelete }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      let copy = { ...blog, likes: blog.likes + 1 }
      console.log(blog)
      const updatedBlog = await blogService.update(blog.id, copy)
      updateBlog(updatedBlog)
    }
    catch (exception) {
      console.error('Error al dar like:', exception)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`))
      try {
        await blogService.remove(blog.id)
        onBlogDelete(blog.id)
      }
      catch (exception) {
        console.error('Error al eliminar blog:', exception)
      }
  }

  const isBlogCreator = () => {
    if (!user || !blog.user) return false
    // blog.user puede ser un objeto o un string (id)
    const blogUserId = typeof blog.user === 'string' ? blog.user : blog.user.id || blog.user._id
    return user.id === blogUserId
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="blog-preview">
        {blog.title} <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        {blog.title} <button onClick={toggleVisibility}>Hide</button>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">Likes: {blog.likes} <button onClick={handleLike}>like</button></div>
        <div className="blog-author">{blog.author}</div>
        {isBlogCreator() && (
          <div>
            <button onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        _id: PropTypes.string,
        name: PropTypes.string,
        username: PropTypes.string
      })
    ])
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string
  }),
  onBlogDelete: PropTypes.func.isRequired
}

export default Blog