import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    render(<Button>Btn</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('is disabled when disabled=true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading=true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders spinner when loading', () => {
    const { container } = render(<Button loading>Loading</Button>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders icon at start by default', () => {
    const { container } = render(
      <Button icon={<span data-testid="icon">★</span>}>With Icon</Button>
    )
    const button = container.querySelector('button')!
    const icon = screen.getByTestId('icon')
    const text = screen.getByText('With Icon')
    // Icon should come before text in DOM
    expect(button.innerHTML.indexOf('icon')).toBeLessThan(button.innerHTML.indexOf('With Icon'))
    expect(icon).toBeInTheDocument()
    expect(text).toBeInTheDocument()
  })

  it('renders icon at end when iconPlacement="end"', () => {
    const { container } = render(
      <Button icon={<span data-testid="icon">★</span>} iconPlacement="end">With Icon</Button>
    )
    const button = container.querySelector('button')!
    expect(button.innerHTML.indexOf('With Icon')).toBeLessThan(button.innerHTML.indexOf('icon'))
  })

  it('does not render icon when loading', () => {
    render(
      <Button loading icon={<span data-testid="icon">★</span>}>Loading</Button>
    )
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('applies sm size styles', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.fontSize).toBe('0.8125rem')
  })

  it('applies lg size styles', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.fontSize).toBe('1rem')
  })

  it('applies block width', () => {
    const { container } = render(<Button block>Block</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.width).toBe('100%')
  })

  it('applies outline variant border', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.border).toContain('1px solid')
    expect(button.style.backgroundColor).toBe('transparent')
  })

  it('applies dashed variant border', () => {
    const { container } = render(<Button variant="dashed">Dashed</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.border).toContain('1px dashed')
  })

  it('applies ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.backgroundColor).toBe('transparent')
  })

  it('applies link variant with no padding', () => {
    const { container } = render(<Button variant="link">Link</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.backgroundColor).toBe('transparent')
    expect(button.style.padding).toBe('0px')
  })

  it('applies custom className and style', () => {
    const { container } = render(
      <Button className="custom-btn" style={{ margin: 5 }}>Styled</Button>
    )
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('custom-btn')
    expect(button.style.margin).toBe('5px')
  })

  it('applies shadow', () => {
    const { container } = render(<Button shadow="lg">Shadow</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.boxShadow).toBeTruthy()
  })

  it('applies bordered style to non-outline variant', () => {
    const { container } = render(<Button bordered>Bordered</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.border).toContain('1px solid')
  })

  it('passes native button props', () => {
    render(<Button type="submit" aria-label="Submit form">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })

  it('wraps content when classNames.content is provided', () => {
    const { container } = render(
      <Button classNames={{ content: 'btn-content' }}>Wrapped</Button>
    )
    expect(container.querySelector('.btn-content')).toBeInTheDocument()
  })
})
