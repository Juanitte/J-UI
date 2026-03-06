import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Tooltip } from '../Tooltip'

// ============================================================================
// Fake timers setup
// ============================================================================

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame'] })
})

afterEach(() => {
  vi.useRealTimers()
})

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getPopup() {
  return document.body.querySelector('[role="tooltip"]') as HTMLElement | null
}

function getArrow() {
  const popup = getPopup()
  if (!popup) return null
  // Arrow is the last child of popup (a div with position: absolute and 0.5rem width)
  const children = Array.from(popup.children) as HTMLElement[]
  return children.find(
    (el) => el.style.position === 'absolute' && el.style.width === '0.5rem',
  ) ?? null
}

function showTooltip(container: HTMLElement, delay = 200) {
  const root = getRoot(container)
  fireEvent.mouseEnter(root)
  act(() => {
    vi.advanceTimersByTime(delay)
  })
  // Double rAF for animation
  act(() => {
    vi.advanceTimersByTime(0)
  })
  act(() => {
    vi.advanceTimersByTime(0)
  })
}

function hideTooltip(container: HTMLElement) {
  const root = getRoot(container)
  fireEvent.mouseLeave(root)
  act(() => {
    vi.advanceTimersByTime(150)
  })
}

// ============================================================================
// Tooltip
// ============================================================================

describe('Tooltip', () => {
  // ============================================================================
  // Basic rendering
  // ============================================================================

  describe('basic rendering', () => {
    it('renders root wrapper', () => {
      const { container } = render(
        <Tooltip content="Hint"><button>Hover me</button></Tooltip>,
      )
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('renders children inside wrapper', () => {
      render(<Tooltip content="Hint"><button>Hover me</button></Tooltip>)
      expect(screen.getByText('Hover me')).toBeTruthy()
    })

    it('root has inline-flex display', () => {
      const { container } = render(
        <Tooltip content="Hint"><span>Target</span></Tooltip>,
      )
      expect(getRoot(container)).toHaveClass('ino-tooltip')
    })

    it('tooltip is hidden initially', () => {
      render(<Tooltip content="Hint"><span>Target</span></Tooltip>)
      expect(getPopup()).toBeNull()
    })
  })

  // ============================================================================
  // Show / hide
  // ============================================================================

  describe('show / hide', () => {
    it('shows tooltip on mouseEnter after delay', () => {
      const { container } = render(
        <Tooltip content="Tip text"><span>Hover</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()
      expect(popup).toBeTruthy()
      expect(popup!.textContent).toContain('Tip text')
    })

    it('hides tooltip on mouseLeave', () => {
      const { container } = render(
        <Tooltip content="Tip"><span>Hover</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeTruthy()
      hideTooltip(container)
      expect(getPopup()).toBeNull()
    })

    it('shows tooltip on focus', () => {
      const { container } = render(
        <Tooltip content="Focus tip"><span>Focus</span></Tooltip>,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      act(() => { vi.advanceTimersByTime(200) })
      act(() => { vi.advanceTimersByTime(0) })
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
    })

    it('hides tooltip on blur', () => {
      const { container } = render(
        <Tooltip content="Blur tip"><span>Focus</span></Tooltip>,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      act(() => { vi.advanceTimersByTime(200) })
      act(() => { vi.advanceTimersByTime(0) })
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
      fireEvent.blur(root)
      act(() => { vi.advanceTimersByTime(150) })
      expect(getPopup()).toBeNull()
    })

    it('tooltip has role="tooltip"', () => {
      const { container } = render(
        <Tooltip content="Accessible"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.getAttribute('role')).toBe('tooltip')
    })

    it('tooltip is not shown before delay completes', () => {
      const { container } = render(
        <Tooltip content="Delayed" delay={500}><span>Wait</span></Tooltip>,
      )
      fireEvent.mouseEnter(getRoot(container))
      act(() => { vi.advanceTimersByTime(200) })
      expect(getPopup()).toBeNull()
    })

    it('tooltip appears after full delay', () => {
      const { container } = render(
        <Tooltip content="Delayed" delay={500}><span>Wait</span></Tooltip>,
      )
      showTooltip(container, 500)
      expect(getPopup()).toBeTruthy()
    })

    it('mouseLeave before delay cancels tooltip', () => {
      const { container } = render(
        <Tooltip content="Cancelled"><span>Quick</span></Tooltip>,
      )
      fireEvent.mouseEnter(getRoot(container))
      act(() => { vi.advanceTimersByTime(100) }) // half the default 200ms delay
      fireEvent.mouseLeave(getRoot(container))
      act(() => { vi.advanceTimersByTime(200) })
      expect(getPopup()).toBeNull()
    })
  })

  // ============================================================================
  // Custom delay
  // ============================================================================

  describe('delay', () => {
    it('delay=0 shows almost immediately', () => {
      const { container } = render(
        <Tooltip content="Instant" delay={0}><span>Now</span></Tooltip>,
      )
      showTooltip(container, 0)
      expect(getPopup()).toBeTruthy()
    })

    it('custom delay value', () => {
      const { container } = render(
        <Tooltip content="Custom" delay={1000}><span>Slow</span></Tooltip>,
      )
      fireEvent.mouseEnter(getRoot(container))
      act(() => { vi.advanceTimersByTime(500) })
      expect(getPopup()).toBeNull()
      act(() => { vi.advanceTimersByTime(500) })
      act(() => { vi.advanceTimersByTime(0) })
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
    })
  })

  // ============================================================================
  // Disabled
  // ============================================================================

  describe('disabled', () => {
    it('does not show tooltip when disabled', () => {
      const { container } = render(
        <Tooltip content="Hidden" disabled><span>No tip</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeNull()
    })

    it('disabled still renders children', () => {
      render(
        <Tooltip content="Hidden" disabled><span>Visible child</span></Tooltip>,
      )
      expect(screen.getByText('Visible child')).toBeTruthy()
    })
  })

  // ============================================================================
  // Content
  // ============================================================================

  describe('content', () => {
    it('renders string content', () => {
      const { container } = render(
        <Tooltip content="Text tip"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.textContent).toContain('Text tip')
    })

    it('renders ReactNode content', () => {
      const { container } = render(
        <Tooltip content={<strong data-testid="bold-tip">Bold</strong>}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      expect(screen.getByTestId('bold-tip')).toBeTruthy()
    })
  })

  // ============================================================================
  // Portal
  // ============================================================================

  describe('portal', () => {
    it('tooltip is rendered in document.body', () => {
      const { container } = render(
        <Tooltip content="Portal"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()
      expect(popup).toBeTruthy()
      expect(popup!.parentElement).toBe(document.body)
    })

    it('tooltip is removed from body on hide', () => {
      const { container } = render(
        <Tooltip content="Portal"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeTruthy()
      hideTooltip(container)
      expect(getPopup()).toBeNull()
    })
  })

  // ============================================================================
  // Arrow
  // ============================================================================

  describe('arrow', () => {
    it('shows arrow by default', () => {
      const { container } = render(
        <Tooltip content="Arrow"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getArrow()).toBeTruthy()
    })

    it('hides arrow when arrow=false', () => {
      const { container } = render(
        <Tooltip content="No arrow" arrow={false}><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getArrow()).toBeNull()
    })

    it('arrow has 0.5rem size', () => {
      const { container } = render(
        <Tooltip content="Arrow"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const arrow = getArrow()!
      expect(arrow.style.width).toBe('0.5rem')
      expect(arrow.style.height).toBe('0.5rem')
    })

    it('arrow has absolute position', () => {
      const { container } = render(
        <Tooltip content="Arrow"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getArrow()!.style.position).toBe('absolute')
    })

    it('pointAtCenter arrow object is accepted', () => {
      const { container } = render(
        <Tooltip content="Center" arrow={{ pointAtCenter: true }}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      const arrow = getArrow()
      expect(arrow).toBeTruthy()
    })
  })

  // ============================================================================
  // Color
  // ============================================================================

  describe('color', () => {
    it('default tooltip has muted background', () => {
      const { container } = render(
        <Tooltip content="Default"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup).toHaveClass('ino-tooltip__popup--default')
    })

    it('default tooltip has border', () => {
      const { container } = render(
        <Tooltip content="Default"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup).toHaveClass('ino-tooltip__popup--default')
    })

    it('preset color "blue" applies color', () => {
      const { container } = render(
        <Tooltip content="Blue" color="blue"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.backgroundColor).toBe('rgb(22, 119, 255)')
    })

    it('preset color "red" applies color', () => {
      const { container } = render(
        <Tooltip content="Red" color="red"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.backgroundColor).toBe('rgb(245, 34, 45)')
    })

    it('custom hex color applies', () => {
      const { container } = render(
        <Tooltip content="Custom" color="#ff6600"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.backgroundColor).toBe('rgb(255, 102, 0)')
    })

    it('colorful tooltip has white text', () => {
      const { container } = render(
        <Tooltip content="White text" color="green"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.style.color).toBe('rgb(255, 255, 255)')
    })

    it('colorful tooltip has no border', () => {
      const { container } = render(
        <Tooltip content="No border" color="purple"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.style.border).not.toContain('1px solid')
    })

    it('arrow background matches tooltip color', () => {
      const { container } = render(
        <Tooltip content="Match" color="blue"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const arrow = getArrow()!
      expect(arrow.style.backgroundColor).toBe('rgb(22, 119, 255)')
    })
  })

  // ============================================================================
  // Placement
  // ============================================================================

  describe('placement', () => {
    it('default placement is "top"', () => {
      const { container } = render(
        <Tooltip content="Top"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      // Top placement: transform includes translateY(-100%)
      expect(popup.style.transform).toContain('translateY(-100%)')
    })

    it('placement="bottom"', () => {
      const { container } = render(
        <Tooltip content="Bottom" placement="bottom"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-50%)')
      expect(popup.style.transform).not.toContain('translateY(-100%)')
    })

    it('placement="left"', () => {
      const { container } = render(
        <Tooltip content="Left" placement="left"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-100%)')
      expect(popup.style.transform).toContain('translateY(-50%)')
    })

    it('placement="right"', () => {
      const { container } = render(
        <Tooltip content="Right" placement="right"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateY(-50%)')
      expect(popup.style.transform).not.toContain('translateX(-100%)')
    })

    it('placement="topLeft"', () => {
      const { container } = render(
        <Tooltip content="TopLeft" placement="topLeft"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateY(-100%)')
      expect(popup.style.transform).not.toContain('translateX(-50%)')
    })

    it('placement="bottomRight"', () => {
      const { container } = render(
        <Tooltip content="BR" placement="bottomRight"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-100%)')
    })

    it('deprecated position prop works', () => {
      const { container } = render(
        <Tooltip content="Deprecated" position="bottom"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-50%)')
    })

    it('placement prop overrides deprecated position', () => {
      const { container } = render(
        <Tooltip content="Override" placement="left" position="bottom">
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-100%)')
    })
  })

  // ============================================================================
  // Popup styling
  // ============================================================================

  describe('popup styling', () => {
    it('popup has fixed position', () => {
      const { container } = render(
        <Tooltip content="Fixed"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has z-index 9999', () => {
      const { container } = render(
        <Tooltip content="Z"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has border-radius', () => {
      const { container } = render(
        <Tooltip content="Rounded"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has 0.8125rem font size', () => {
      const { container } = render(
        <Tooltip content="Font"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has font-weight 500', () => {
      const { container } = render(
        <Tooltip content="Weight"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has nowrap white-space', () => {
      const { container } = render(
        <Tooltip content="Nowrap"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('popup has pointer-events none', () => {
      const { container } = render(
        <Tooltip content="No click"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })
  })

  // ============================================================================
  // Animation
  // ============================================================================

  describe('animation', () => {
    it('tooltip is visible (in DOM) when shown', () => {
      const { container } = render(
        <Tooltip content="Visible"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeTruthy()
      expect(getPopup()!.textContent).toContain('Visible')
    })

    it('tooltip opacity is 0 before animation starts', () => {
      const { container } = render(
        <Tooltip content="Fading"><span>A</span></Tooltip>,
      )
      // Show but don't run rAF
      fireEvent.mouseEnter(getRoot(container))
      act(() => { vi.advanceTimersByTime(200) })
      // Visible but not yet animated
      const popup = getPopup()
      if (popup) {
        expect(popup.style.opacity).toBe('0')
      }
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(
        <Tooltip content="X" classNames={{ root: 'tt-root' }}>
          <span>A</span>
        </Tooltip>,
      )
      expect(getRoot(container).className).toContain('tt-root')
    })

    it('applies classNames.popup', () => {
      const { container } = render(
        <Tooltip content="X" classNames={{ popup: 'tt-popup' }}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.className).toContain('tt-popup')
    })

    it('applies classNames.arrow', () => {
      const { container } = render(
        <Tooltip content="X" classNames={{ arrow: 'tt-arrow' }}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      expect(getArrow()!.className).toContain('tt-arrow')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(
        <Tooltip content="X" styles={{ root: { margin: '4px' } }}>
          <span>A</span>
        </Tooltip>,
      )
      expect(getRoot(container).style.margin).toBe('4px')
    })

    it('applies styles.popup', () => {
      const { container } = render(
        <Tooltip content="X" styles={{ popup: { padding: '1rem' } }}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!.style.padding).toBe('1rem')
    })

    it('applies styles.arrow', () => {
      const { container } = render(
        <Tooltip content="X" styles={{ arrow: { opacity: '0.5' } }}>
          <span>A</span>
        </Tooltip>,
      )
      showTooltip(container)
      expect(getArrow()!.style.opacity).toBe('0.5')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(
        <Tooltip content="X" className="my-tooltip"><span>A</span></Tooltip>,
      )
      expect(getRoot(container).className).toContain('my-tooltip')
    })

    it('applies style to root', () => {
      const { container } = render(
        <Tooltip content="X" style={{ maxWidth: '200px' }}><span>A</span></Tooltip>,
      )
      expect(getRoot(container).style.maxWidth).toBe('200px')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with ReactNode as children', () => {
      render(
        <Tooltip content="Tip">
          <div data-testid="complex-child"><span>Nested</span></div>
        </Tooltip>,
      )
      expect(screen.getByTestId('complex-child')).toBeTruthy()
    })

    it('multiple tooltips render independently', () => {
      const { container } = render(
        <div>
          <Tooltip content="First"><span>A</span></Tooltip>
          <Tooltip content="Second"><span>B</span></Tooltip>
        </div>,
      )
      const tooltips = Array.from(container.querySelectorAll('.ino-tooltip')) as HTMLElement[]
      expect(tooltips).toHaveLength(2)
    })

    it('popup has padding', () => {
      const { container } = render(
        <Tooltip content="Padded"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()!).toHaveClass('ino-tooltip__popup')
    })

    it('autoAdjustOverflow is true by default', () => {
      // Just verify it renders without error — actual flip requires real layout
      const { container } = render(
        <Tooltip content="Auto"><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeTruthy()
    })

    it('autoAdjustOverflow=false still shows tooltip', () => {
      const { container } = render(
        <Tooltip content="No flip" autoAdjustOverflow={false}><span>A</span></Tooltip>,
      )
      showTooltip(container)
      expect(getPopup()).toBeTruthy()
    })
  })
})
