import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct details when form is submitted', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    // Encontrar los inputs por sus labels
    const titleInput = screen.getByLabelText('Title')
    const authorInput = screen.getByLabelText('Author')
    const urlInput = screen.getByLabelText('Url')
    const submitButton = screen.getByRole('button', { name: 'Create' })

    // Llenar el formulario
    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://test-url.com')

    // Enviar el formulario
    await user.click(submitButton)

    // Verificar que createBlog fue llamado con los datos correctos
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://test-url.com'
    })
  })

  test('clears form fields after submission', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    // Encontrar los inputs
    const titleInput = screen.getByLabelText('Title')
    const authorInput = screen.getByLabelText('Author') 
    const urlInput = screen.getByLabelText('Url')
    const submitButton = screen.getByRole('button', { name: 'Create' })

    // Llenar y enviar el formulario
    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://test-url.com')
    await user.click(submitButton)

    // Verificar que los campos se limpiaron
    expect(titleInput).toHaveValue('')
    expect(authorInput).toHaveValue('')
    expect(urlInput).toHaveValue('')
  })
})