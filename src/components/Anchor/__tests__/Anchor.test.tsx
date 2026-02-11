import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Anchor } from '../Anchor'

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

describe('Anchor', () => {
  const items = [
    { key: '1', href: '#section1', title: 'Section 1' },
    { key: '2', href: '#section2', title: 'Section 2' },
    { key: '3', href: '#section3', title: 'Section 3' },
  ]

  it('renders all link items', () => {
    render(<Anchor items={items} />)
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByText('Section 3')).toBeInTheDocument()
  })

  it('renders links as <a> elements with href', () => {
    render(<Anchor items={items} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '#section1')
    expect(links[1]).toHaveAttribute('href', '#section2')
  })

  it('renders vertical direction by default', () => {
    const { container } = render(<Anchor items={items} />)
    // Vertical has a track (background line)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.paddingLeft).toBe('2px')
  })

  it('renders horizontal direction', () => {
    const { container } = render(<Anchor items={items} direction="horizontal" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.display).toBe('flex')
  })

  it('calls onClick when a link is clicked', () => {
    const handleClick = vi.fn()
    render(<Anchor items={items} onClick={handleClick} />)

    fireEvent.click(screen.getByText('Section 1'))
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(
      expect.any(Object),
      { title: 'Section 1', href: '#section1' }
    )
  })

  it('calls onChange when active link changes', () => {
    // Create target elements so the Anchor click handler doesn't bail out
    const section = document.createElement('div')
    section.id = 'section2'
    document.body.appendChild(section)

    const handleChange = vi.fn()
    render(<Anchor items={items} onChange={handleChange} />)

    fireEvent.click(screen.getByText('Section 2'))
    expect(handleChange).toHaveBeenCalledWith('#section2')

    document.body.removeChild(section)
  })

  it('renders nested items in vertical mode', () => {
    const nestedItems = [
      {
        key: '1',
        href: '#parent',
        title: 'Parent',
        children: [
          { key: '1-1', href: '#child1', title: 'Child 1' },
          { key: '1-2', href: '#child2', title: 'Child 2' },
        ],
      },
    ]
    render(<Anchor items={nestedItems} />)
    expect(screen.getByText('Parent')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Anchor items={items} className="my-anchor" />)
    expect(container.firstChild).toHaveClass('my-anchor')
  })

  it('renders with empty items array', () => {
    const { container } = render(<Anchor items={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
