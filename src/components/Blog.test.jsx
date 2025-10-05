import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('<Blog />', () => {
    const blog = {
        id: 'test-blog-id-123',
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'https://test-url.com',
        likes: 5,
        user: {
            id: 'user123',
            name: 'Test User'
        }
    }

    const mockUpdateBlog = vi.fn()
    const mockOnBlogDelete = vi.fn()
    const user = { id: 'user123' }

    beforeEach(() => {
         vi.clearAllMocks()
        // blogservice mock
        blogService.update.mockResolvedValue({
            ...blog,
            likes: blog.likes + 1
        })
    })

    test('renders title and author but not URL or likes by default', () => {
        render(
            <Blog
                blog={blog}
                updateBlog={mockUpdateBlog}
                user={user}
                onBlogDelete={mockOnBlogDelete}
            />
        )
        //esperamos que este el boton de view
        expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
        //y que este oculto lo demas
        expect(screen.queryByRole('button', { name: 'Hide' })).not.toBeInTheDocument()
        expect(screen.queryByText('https://test-url.com')).not.toBeVisible()
        expect(screen.queryByText(/Likes:/)).not.toBeVisible()
    })

    test('shows URL and likes when view button is clicked', async () => {
        const user = userEvent.setup()

        render(
            <Blog
                blog={blog}
                updateBlog={mockUpdateBlog}
                user={user}
                onBlogDelete={mockOnBlogDelete}
            />
        )

        // verificar que inicialmente los detalles esten ocultos
        expect(screen.queryByText('https://test-url.com')).not.toBeVisible()
        expect(screen.queryByText(/Likes: 5/)).not.toBeVisible()

        // hacer clic en el boton view
        const viewButton = screen.getByRole('button', { name: 'View' })
        await user.click(viewButton)

        // verificar que ahora los detalles son visibles
        expect(screen.getByText('https://test-url.com')).toBeVisible()
        expect(screen.getByText(/Likes: 5/)).toBeVisible()

        // verificar que el boton cambio a hide
        expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'View' })).not.toBeInTheDocument()
    })

    test('calls updateBlog twice when like button is clicked twice', async () => {
        const user = userEvent.setup()
        render(
            <Blog
                blog={blog}
                updateBlog={mockUpdateBlog}
                user={user}
                onBlogDelete={mockOnBlogDelete}
            />
        )
        // mostrar detalles
        await user.click(screen.getByRole('button', { name: 'View' }))

        // hacer clic dos veces en like
        const likeButton = screen.getByRole('button', { name: 'like' })
        await user.click(likeButton)
        await user.click(likeButton)

        // verificar llamadas
        expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
    })
})