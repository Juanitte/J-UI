import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  // ─── Wrapping mode ────────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Badge count={5}><span>child</span></Badge>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('renders count indicator when wrapping children', () => {
    render(<Badge count={5}><span>child</span></Badge>)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('displays overflowCount+ when count exceeds overflowCount', () => {
    render(<Badge count={100}><span>child</span></Badge>)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('respects custom overflowCount', () => {
    render(<Badge count={15} overflowCount={10}><span>child</span></Badge>)
    expect(screen.getByText('10+')).toBeInTheDocument()
  })

  it('does not overflow when count is within limit', () => {
    render(<Badge count={99}><span>child</span></Badge>)
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('hides indicator when count is 0 by default', () => {
    const { container } = render(<Badge count={0}><span>child</span></Badge>)
    expect(container.querySelector('sup')).not.toBeInTheDocument()
  })

  it('shows indicator when count is 0 and showZero is true', () => {
    render(<Badge count={0} showZero><span>child</span></Badge>)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  // ─── Dot mode ─────────────────────────────────────────────────────────────────

  it('renders dot without text content', () => {
    const { container } = render(<Badge dot><span>child</span></Badge>)
    const sup = container.querySelector('sup')
    expect(sup).toBeInTheDocument()
    expect(sup?.textContent).toBe('')
  })

  it('does not render dot when count is explicitly 0 and showZero is false', () => {
    const { container } = render(<Badge dot count={0}><span>child</span></Badge>)
    expect(container.querySelector('sup')).not.toBeInTheDocument()
  })

  // ─── Size ─────────────────────────────────────────────────────────────────────

  it('renders small count indicator', () => {
    const { container } = render(<Badge count={5} size="small"><span>child</span></Badge>)
    const sup = container.querySelector('sup') as HTMLElement
    expect(sup.style.height).toBe('1rem')
  })

  it('renders default count indicator', () => {
    const { container } = render(<Badge count={5} size="default"><span>child</span></Badge>)
    const sup = container.querySelector('sup') as HTMLElement
    expect(sup.style.height).toBe('1.25rem')
  })

  // ─── Title ────────────────────────────────────────────────────────────────────

  it('applies title from count by default', () => {
    const { container } = render(<Badge count={5}><span>child</span></Badge>)
    const sup = container.querySelector('sup')
    expect(sup?.getAttribute('title')).toBe('5')
  })

  it('applies custom title when provided', () => {
    const { container } = render(<Badge count={5} title="custom"><span>child</span></Badge>)
    const sup = container.querySelector('sup')
    expect(sup?.getAttribute('title')).toBe('custom')
  })

  // ─── Custom color ─────────────────────────────────────────────────────────────

  it('applies custom color to indicator', () => {
    const { container } = render(<Badge count={5} color="#ff0000"><span>child</span></Badge>)
    const sup = container.querySelector('sup') as HTMLElement
    expect(sup.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  // ─── Offset ───────────────────────────────────────────────────────────────────

  it('applies offset to indicator transform', () => {
    const { container } = render(<Badge count={5} offset={[10, 10]}><span>child</span></Badge>)
    const sup = container.querySelector('sup') as HTMLElement
    expect(sup.style.transform).toContain('translate(-10px, 10px)')
  })

  // ─── Status-only mode ─────────────────────────────────────────────────────────

  it('renders status dot with text label', () => {
    render(<Badge status="success" text="Success" />)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('renders all status colors', () => {
    const statuses = ['success', 'processing', 'default', 'error', 'warning'] as const
    statuses.forEach((status) => {
      const { container } = render(<Badge status={status} text={status} />)
      const root = container.firstChild as HTMLElement
      expect(root.style.display).toBe('inline-flex')
      expect(root.style.alignItems).toBe('center')
    })
  })

  it('renders processing animation span for processing status', () => {
    const { container } = render(<Badge status="processing" text="Processing" />)
    // The status dot span contains a child animation span
    const dots = container.querySelectorAll('span')
    // root > dot wrapper > animation span + text span
    let hasAnimation = false
    dots.forEach((span) => {
      if (span.style.animation.includes('j-badge-processing')) {
        hasAnimation = true
      }
    })
    expect(hasAnimation).toBe(true)
  })

  // ─── Standalone mode ──────────────────────────────────────────────────────────

  it('renders standalone count (no children, no status)', () => {
    render(<Badge count={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('returns null for standalone badge with no count and no status', () => {
    const { container } = render(<Badge />)
    expect(container.firstChild).toBeNull()
  })

  // ─── ReactNode count ──────────────────────────────────────────────────────────

  it('renders ReactNode as count', () => {
    render(<Badge count={<span data-testid="custom-count">!</span>}><span>child</span></Badge>)
    expect(screen.getByTestId('custom-count')).toBeInTheDocument()
  })

  // ─── Semantic DOM ─────────────────────────────────────────────────────────────

  it('applies className and style to root', () => {
    const { container } = render(
      <Badge count={5} className="my-badge" style={{ margin: 10 }}><span>child</span></Badge>,
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('my-badge')
    expect(root.style.margin).toBe('10px')
  })

  it('applies classNames and styles to indicator', () => {
    const { container } = render(
      <Badge
        count={5}
        classNames={{ indicator: 'my-indicator' }}
        styles={{ indicator: { fontSize: '2rem' } }}
      >
        <span>child</span>
      </Badge>,
    )
    const sup = container.querySelector('sup')
    expect(sup).toHaveClass('my-indicator')
    expect((sup as HTMLElement).style.fontSize).toBe('2rem')
  })

  // ─── Badge.Ribbon ─────────────────────────────────────────────────────────────

  describe('Ribbon', () => {
    it('renders ribbon text', () => {
      render(
        <Badge.Ribbon text="Hot">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      expect(screen.getByText('Hot')).toBeInTheDocument()
      expect(screen.getByText('Card')).toBeInTheDocument()
    })

    it('renders ribbon on the end by default', () => {
      const { container } = render(
        <Badge.Ribbon text="New">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      // The ribbon div is positioned with right: 0
      const divs = container.querySelectorAll('div')
      let hasRight = false
      divs.forEach((div) => {
        if (div.style.right === '0px') hasRight = true
      })
      expect(hasRight).toBe(true)
    })

    it('renders ribbon on the start when placement=start', () => {
      const { container } = render(
        <Badge.Ribbon text="New" placement="start">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      const divs = container.querySelectorAll('div')
      let hasLeft = false
      divs.forEach((div) => {
        if (div.style.left === '0px') hasLeft = true
      })
      expect(hasLeft).toBe(true)
    })

    it('applies custom color to ribbon', () => {
      const { container } = render(
        <Badge.Ribbon text="Sale" color="#ff0000">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      const divs = container.querySelectorAll('div')
      let hasColor = false
      divs.forEach((div) => {
        if (div.style.backgroundColor === 'rgb(255, 0, 0)') hasColor = true
      })
      expect(hasColor).toBe(true)
    })

    it('applies className to wrapper', () => {
      const { container } = render(
        <Badge.Ribbon text="Test" className="ribbon-wrap">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      expect(container.firstChild).toHaveClass('ribbon-wrap')
    })

    it('applies darkened filter and scaleY to corner', () => {
      const { container } = render(
        <Badge.Ribbon text="New">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      const divs = container.querySelectorAll('div')
      let corner: HTMLElement | null = null
      divs.forEach((div) => {
        if (div.style.filter === 'brightness(0.75)') corner = div
      })
      expect(corner).not.toBeNull()
      expect(corner!.style.transform).toContain('scaleY(0.75)')
    })

    it('resolves preset color name in ribbon', () => {
      const { container } = render(
        <Badge.Ribbon text="Sale" color="red">
          <div>Card</div>
        </Badge.Ribbon>,
      )
      const divs = container.querySelectorAll('div')
      let hasPresetColor = false
      divs.forEach((div) => {
        // #f5222d is the preset value for 'red'
        if (div.style.backgroundColor === 'rgb(245, 34, 45)') hasPresetColor = true
      })
      expect(hasPresetColor).toBe(true)
    })
  })

  // ─── Preset Colors ──────────────────────────────────────────────────────────

  describe('Preset Colors', () => {
    it('resolves preset color name to hex value', () => {
      const { container } = render(
        <Badge count={5} color="green"><span>child</span></Badge>,
      )
      const sup = container.querySelector('sup') as HTMLElement
      // #52c41a is the preset value for 'green'
      expect(sup.style.backgroundColor).toBe('rgb(82, 196, 26)')
    })

    it('passes through non-preset color as-is', () => {
      const { container } = render(
        <Badge count={5} color="#abcdef"><span>child</span></Badge>,
      )
      const sup = container.querySelector('sup') as HTMLElement
      expect(sup.style.backgroundColor).toBe('rgb(171, 205, 239)')
    })

    it('resolves preset color in status-only mode', () => {
      const { container } = render(
        <Badge status="success" color="purple" text="test" />,
      )
      const spans = container.querySelectorAll('span')
      let hasPresetColor = false
      spans.forEach((span) => {
        // #722ed1 is the preset value for 'purple'
        if (span.style.backgroundColor === 'rgb(114, 46, 209)') hasPresetColor = true
      })
      expect(hasPresetColor).toBe(true)
    })
  })
})
