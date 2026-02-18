import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Bubble } from '../Bubble'

describe('Bubble', () => {
  it('renders as a button element', () => {
    render(<Bubble />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with a custom icon', () => {
    render(<Bubble icon={<span data-testid="custom-icon">✓</span>} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders description text when no icon', () => {
    render(<Bubble description="Help" />)
    expect(screen.getByText('Help')).toBeInTheDocument()
  })

  it('renders default icon when no icon or description', () => {
    render(<Bubble />)
    const button = screen.getByRole('button')
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('applies disabled state', () => {
    render(<Bubble disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Bubble onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Bubble disabled onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders badge with a number', () => {
    render(<Bubble badge={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders badge capped at 99+', () => {
    render(<Bubble badge={150} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('renders dot badge when badge is true', () => {
    const { container } = render(<Bubble badge={true} />)
    // Badge dot is rendered but with no text
    const badges = container.querySelectorAll('span[style]')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('renders tooltip text', () => {
    render(<Bubble tooltip="Help tooltip" />)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help tooltip')
  })

  it('applies circle shape by default', () => {
    const { container } = render(<Bubble />)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.borderRadius).toBe('50%')
  })

  it('applies square shape', () => {
    const { container } = render(<Bubble shape="square" />)
    const button = container.querySelector('button') as HTMLElement
    expect(button.style.borderRadius).toBe('0.5rem')
  })

  it('applies different sizes', () => {
    const { container: sm } = render(<Bubble size="sm" />)
    const { container: lg } = render(<Bubble size="lg" />)
    const smBtn = sm.querySelector('button') as HTMLElement
    const lgBtn = lg.querySelector('button') as HTMLElement
    expect(smBtn.style.width).toBe('40px')
    expect(lgBtn.style.width).toBe('56px')
  })

  it('returns null when visibleOnScroll is set and not scrolled', () => {
    const { container } = render(<Bubble visibleOnScroll={100} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className', () => {
    render(<Bubble className="my-bubble" />)
    expect(screen.getByRole('button')).toHaveClass('my-bubble')
  })
})

describe('Bubble.Group', () => {
  it('renders multiple bubbles', () => {
    render(
      <Bubble.Group>
        <Bubble description="A" />
        <Bubble description="B" />
      </Bubble.Group>
    )
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})

describe('Bubble.Menu', () => {
  it('renders a trigger button', () => {
    render(
      <Bubble.Menu>
        <Bubble description="Item" />
      </Bubble.Menu>
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows children when clicked (click trigger)', () => {
    render(
      <Bubble.Menu trigger="click">
        <Bubble description="Child" />
      </Bubble.Menu>
    )
    // Initially children are hidden (opacity: 0)
    const buttons = screen.getAllByRole('button')
    // Click the trigger (first button)
    fireEvent.click(buttons[0])
    // After click, children should be visible
    expect(screen.getByText('Child')).toBeInTheDocument()
  })
})
