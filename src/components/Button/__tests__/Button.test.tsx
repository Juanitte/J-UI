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

  it('applies sm size class', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--sm')
  })

  it('applies lg size class', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--lg')
  })

  it('applies block class', () => {
    const { container } = render(<Button block>Block</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--block')
  })

  it('applies outline variant class', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--outline')
  })

  it('applies dashed variant class', () => {
    const { container } = render(<Button variant="dashed">Dashed</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--dashed')
  })

  it('applies ghost variant class', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--ghost')
  })

  it('applies link variant class', () => {
    const { container } = render(<Button variant="link">Link</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--link')
  })

  it('applies custom className and style', () => {
    const { container } = render(
      <Button className="custom-btn" style={{ margin: 5 }}>Styled</Button>
    )
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('custom-btn')
    expect(button.style.margin).toBe('5px')
  })

  it('applies shadow class', () => {
    const { container } = render(<Button shadow="lg">Shadow</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--shadow-lg')
  })

  it('applies bordered class to non-outline variant', () => {
    const { container } = render(<Button bordered>Bordered</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--bordered')
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

  it('applies BEM base class and variant class', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn')
    expect(button).toHaveClass('ino-btn--primary')
    expect(button).toHaveClass('ino-btn--md')
  })

  it('applies gradient class when gradient prop is set', () => {
    const { container } = render(<Button gradient="success">Gradient</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button).toHaveClass('ino-btn--gradient')
  })

  it('sets color bridge CSS custom properties', () => {
    const { container } = render(<Button color="success">Success</Button>)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.getPropertyValue('--_base')).toBe('var(--j-success)')
    expect(button.style.getPropertyValue('--_hover')).toBe('var(--j-success-hover)')
  })
})
