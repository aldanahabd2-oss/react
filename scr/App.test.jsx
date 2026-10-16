import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('RectAssets app', () => {
  it('renders the assets list with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /computer assets/i })).toBeInTheDocument()
    expect(screen.getByText('PC-001')).toBeInTheDocument()
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

    await user.click(screen.getByRole('link', { name: /add asset/i }))
    expect(screen.getByRole('heading', { name: /add asset/i })).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/lp-021/i), 'LP-099')
    await user.type(screen.getByPlaceholderText(/macbook/i), 'Test Laptop')
    await user.type(screen.getByPlaceholderText(/employee name/i), 'Test User')
    await user.click(screen.getByRole('button', { name: /^add asset$/i }))

    expect(await screen.findByText('LP-099')).toBeInTheDocument()
    expect(screen.getByText('Test Laptop')).toBeInTheDocument()
  })

  it('deletes an asset after confirmation', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<App />)
    const row = screen.getByText('PC-001').closest('tr')
    expect(row).toBeTruthy()

    await user.click(within(row).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('PC-001')).not.toBeInTheDocument()

    confirmSpy.mockRestore()
  })
})
