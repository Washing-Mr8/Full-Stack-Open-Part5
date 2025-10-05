import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    createBlog(newBlog)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div className="blog-form">
      <form onSubmit={addBlog}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="url">Url</label>
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Create</button>
      </form>
    </div>
  )
}

export default BlogForm