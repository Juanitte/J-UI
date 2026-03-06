import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Layout } from '../Layout'

describe('Layout', () => {
  it('renders children', () => {
    render(<Layout>Content</Layout>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders as a div with flex display', () => {
    const { container } = render(<Layout>Content</Layout>)
    const el = container.firstChild as HTMLElement
    expect(el.nodeName).toBe('DIV')
    expect(el).toHaveClass('ino-layout')
  })

  it('uses column direction by default', () => {
    const { container } = render(<Layout>Content</Layout>)
    expect(container.firstChild).toHaveClass('ino-layout')
  })

  it('uses row direction when hasSider=true', () => {
    const { container } = render(<Layout hasSider>Content</Layout>)
    expect(container.firstChild).toHaveClass('ino-layout--has-sider')
  })

  it('applies custom className', () => {
    const { container } = render(<Layout className="my-layout">C</Layout>)
    expect(container.firstChild).toHaveClass('my-layout')
  })
})

describe('Layout.Header', () => {
  it('renders as a header element', () => {
    render(<Layout.Header>Header</Layout.Header>)
    expect(screen.getByText('Header').closest('header')).toBeInTheDocument()
  })

  it('has default height of 64px', () => {
    const { container } = render(<Layout.Header>H</Layout.Header>)
    expect(container.firstChild).toHaveClass('ino-layout__header')
  })
})

describe('Layout.Footer', () => {
  it('renders as a footer element', () => {
    render(<Layout.Footer>Footer</Layout.Footer>)
    expect(screen.getByText('Footer').closest('footer')).toBeInTheDocument()
  })
})

describe('Layout.Content', () => {
  it('renders as a main element', () => {
    render(<Layout.Content>Main</Layout.Content>)
    expect(screen.getByText('Main').closest('main')).toBeInTheDocument()
  })

  it('has padding of 24px', () => {
    const { container } = render(<Layout.Content>M</Layout.Content>)
    expect(container.firstChild).toHaveClass('ino-layout__content')
  })
})

describe('Layout.Sider', () => {
  it('renders as an aside element', () => {
    render(<Layout.Sider>Sidebar</Layout.Sider>)
    expect(screen.getByText('Sidebar').closest('aside')).toBeInTheDocument()
  })

  it('has default width of 200px', () => {
    const { container } = render(<Layout.Sider>S</Layout.Sider>)
    const aside = container.firstChild as HTMLElement
    expect(aside.style.width).toBe('200px')
  })

  it('renders trigger when collapsible', () => {
    const { container } = render(<Layout.Sider collapsible>S</Layout.Sider>)
    const trigger = container.querySelector('svg')
    expect(trigger).toBeInTheDocument()
  })

  it('does not render trigger when collapsible=false', () => {
    const { container } = render(<Layout.Sider>S</Layout.Sider>)
    // No trigger means no clickable div with svg
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(0)
  })

  it('does not render trigger when trigger=null', () => {
    const { container } = render(<Layout.Sider collapsible trigger={null}>S</Layout.Sider>)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(0)
  })

  it('calls onCollapse when trigger is clicked', () => {
    const onCollapse = vi.fn()
    const { container } = render(
      <Layout.Sider collapsible onCollapse={onCollapse}>S</Layout.Sider>
    )
    const trigger = container.querySelector('svg')!.closest('div')!
    fireEvent.click(trigger)
    expect(onCollapse).toHaveBeenCalledWith(true, 'clickTrigger')
  })

  it('collapses to collapsedWidth', () => {
    const { container } = render(
      <Layout.Sider collapsed collapsedWidth={60}>S</Layout.Sider>
    )
    const aside = container.firstChild as HTMLElement
    expect(aside.style.width).toBe('60px')
  })

  it('applies dark theme by default', () => {
    const { container } = render(<Layout.Sider>S</Layout.Sider>)
    const aside = container.firstChild as HTMLElement
    // jsdom normalizes hex to rgb
    expect(aside).toHaveClass('ino-layout__sider--dark')
  })

  it('applies light theme', () => {
    const { container } = render(<Layout.Sider theme="light">S</Layout.Sider>)
    const aside = container.firstChild as HTMLElement
    expect(aside).toHaveClass('ino-layout__sider--light')
  })
})

describe('Layout composition', () => {
  it('renders a full layout with all parts', () => {
    render(
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout hasSider>
          <Layout.Sider>Sider</Layout.Sider>
          <Layout.Content>Content</Layout.Content>
        </Layout>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Sider')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
