import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const seedPage = {
  content: [
    {
      id: 1,
      tag: 'PC-001',
      name: 'Dell OptiPlex 7090',
      type: 'Desktop',
      assignedTo: 'Sara Al-Hassan',
      department: 'Finance',
      status: 'In Use',
      purchaseDate: '2024-03-12',
    },
    {
      id: 2,
      tag: 'LP-014',
      name: 'Lenovo ThinkPad X1 Carbon',
      type: 'Laptop',
      assignedTo: 'Omar Saleh',
      department: 'Engineering',
      status: 'In Use',
      purchaseDate: '2025-01-20',
    },
  ],
  totalElements: 2,
  totalPages: 1,
  size: 5,
  number: 0,
}

describe('RectAssets app', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    window.history.pushState({}, '', '/')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url, options = {}) => {
        const method = options.method || 'GET'
        const href = String(url)

        if (method === 'GET' && href.includes('/api/assets?')) {
          return {
            ok: true,
            status: 200,
            json: async () => seedPage,
          }
        }

        if (method === 'GET' && /\/api\/assets\/\d+$/.test(href)) {
          return {
            ok: true,
            status: 200,
            json: async () => seedPage.content[0],
          }
        }

        if (method === 'POST' && href.endsWith('/api/assets')) {
          const body = JSON.parse(options.body)
          return {
            ok: true,
            status: 201,
            json: async () => ({ id: 99, ...body }),
          }
        }

        if (method === 'DELETE') {
          return { ok: true, status: 204, json: async () => null }
        }

        return {
          ok: false,
          status: 500,
          json: async () => ({ message: `Unhandled mock: ${method} ${href}` }),
        }
      }),
    )
  })

  it('renders the assets list from the API', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /computer assets/i })).toBeInTheDocument()
    expect(await screen.findByText('PC-001')).toBeInTheDocument()
    expect(screen.getByText('Dell OptiPlex 7090')).toBeInTheDocument()
  })

  it('navigates to About and shows team members', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: /^about$/i }))
    expect(screen.getByRole('heading', { name: /^about$/i })).toBeInTheDocument()
    expect(screen.getByText(/team members/i)).toBeInTheDocument()
    expect(screen.getByText('Member One')).toBeInTheDocument()
  })

  it('adds a new asset through the form', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByText('PC-001')
    await user.click(screen.getAllByRole('link', { name: /add asset/i })[0])
    expect(screen.getByRole('heading', { name: /add asset/i })).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/lp-021/i), 'LP-099')
    await user.type(screen.getByPlaceholderText(/macbook/i), 'Test Laptop')
    await user.type(screen.getByPlaceholderText(/employee name/i), 'Test User')
    await user.click(screen.getByRole('button', { name: /^add asset$/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/assets'),
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  it('deletes an asset after confirmation', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<App />)
    const tag = await screen.findByText('PC-001')
    const row = tag.closest('tr')
    expect(row).toBeTruthy()

    await user.click(within(row).getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/assets/1'),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    confirmSpy.mockRestore()
  })

  it('searches for an asset by id', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('PC-001')

    await user.type(screen.getByPlaceholderText(/search by asset id/i), '1')
    await user.click(screen.getByRole('button', { name: /find by id/i }))

    expect(await screen.findByText(/search result — id 1/i)).toBeInTheDocument()
  })
})
