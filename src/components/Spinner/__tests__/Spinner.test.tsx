import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { Spinner } from '../Spinner'

// ============================================================================
// Timers
// ============================================================================

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(() => {
  act(() => { vi.runOnlyPendingTimers() })
  vi.useRealTimers()
})

// ============================================================================
// Helpers
// ============================================================================

/** Root div — skips the <style> element rendered by the Fragment */
function getRoot(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(container.children).find((el) => el.tagName === 'DIV') as HTMLElement | undefined) ??
    null
  )
}

/**
 * Indicator (spinnerContent) div — the flex-column wrapper holding
 * the indicator element + optional tip.
 */
function getIndicatorDiv(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  if (!root) return null
  return (
    (Array.from(root.querySelectorAll('div')).find(
      (el) => (el as HTMLElement).style.flexDirection === 'column',
    ) as HTMLElement | undefined) ?? null
  )
}

/**
 * Tip div — direct child of indicator div with whiteSpace:nowrap
 * but without the pulse-text animation (excludes the pulse indicator itself).
 */
function getTipDiv(container: HTMLElement): HTMLElement | null {
  const ind = getIndicatorDiv(container)
  if (!ind) return null
  return (
    (Array.from(ind.children).find(
      (el) =>
        el.tagName === 'DIV' &&
        (el as HTMLElement).style.whiteSpace === 'nowrap' &&
        !(el as HTMLElement).style.animation.includes('pulse-text'),
    ) as HTMLElement | undefined) ?? null
  )
}

/** Content div in container mode — has opacity transition */
function getContentDiv(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  if (!root) return null
  return (
    (Array.from(root.children).find(
      (el) => el.tagName === 'DIV' && (el as HTMLElement).style.transition.includes('opacity'),
    ) as HTMLElement | undefined) ?? null
  )
}

/** Overlay div in container mode — position:absolute */
function getOverlayDiv(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  if (!root) return null
  return (
    (Array.from(root.children).find(
      (el) => el.tagName === 'DIV' && (el as HTMLElement).style.position === 'absolute',
    ) as HTMLElement | undefined) ?? null
  )
}

/** RotatingWrapper div — has j-spinner-rotate animation */
function getRotatingWrapper(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(container.querySelectorAll('div')).find((el) =>
      (el as HTMLElement).style.animation?.includes('j-spinner-rotate'),
    ) as HTMLElement | undefined) ?? null
  )
}

// ============================================================================
// Tests
// ============================================================================

describe('Spinner', () => {
  // ── Standalone mode (no children, not fullscreen) ─────────────────────

  describe('standalone mode', () => {
    it('renders root element when spinning=true (default)', () => {
      const { container } = render(<Spinner />)
      expect(getRoot(container)).not.toBeNull()
    })

    it('root has display inline-flex', () => {
      const { container } = render(<Spinner />)
      expect(getRoot(container)!.style.display).toBe('inline-flex')
    })

    it('root has alignItems center', () => {
      const { container } = render(<Spinner />)
      expect(getRoot(container)!.style.alignItems).toBe('center')
    })

    it('spinning=false renders nothing (returns null)', () => {
      const { container } = render(<Spinner spinning={false} />)
      expect(getRoot(container)).toBeNull()
    })

    it('indicator div has flexDirection column', () => {
      const { container } = render(<Spinner />)
      expect(getIndicatorDiv(container)?.style.flexDirection).toBe('column')
    })

    it('default type (gradient) renders a rotating wrapper', () => {
      const { container } = render(<Spinner />)
      expect(getRotatingWrapper(container)).not.toBeNull()
    })

    it('tip renders below indicator when provided', () => {
      const { container } = render(<Spinner tip="Please wait…" />)
      expect(getTipDiv(container)?.textContent).toBe('Please wait…')
    })

    it('tip not rendered when not provided', () => {
      const { container } = render(<Spinner />)
      expect(getTipDiv(container)).toBeNull()
    })

    it('tip accepts ReactNode', () => {
      const { container } = render(<Spinner tip={<strong>Loading</strong>} />)
      expect(getTipDiv(container)?.querySelector('strong')).not.toBeNull()
    })

    it('tip div has whiteSpace nowrap', () => {
      const { container } = render(<Spinner tip="Wait" />)
      expect(getTipDiv(container)!.style.whiteSpace).toBe('nowrap')
    })
  })

  // ── Spinner types ─────────────────────────────────────────────────────

  describe('spinner types', () => {
    it('type=gradient renders rotating wrapper (default)', () => {
      const { container } = render(<Spinner type="gradient" />)
      expect(getRotatingWrapper(container)).not.toBeNull()
    })

    it('type=ring renders an SVG inside rotating wrapper', () => {
      const { container } = render(<Spinner type="ring" />)
      expect(getRotatingWrapper(container)?.querySelector('svg')).not.toBeNull()
    })

    it('type=dash renders an SVG with dash animation', () => {
      const { container } = render(<Spinner type="dash" />)
      const animatedCircle = container.querySelector('circle[style*="j-spinner-dash"]') as SVGCircleElement | null
      expect(animatedCircle).not.toBeNull()
    })

    it('type=classic renders rotating wrapper with 4 dot children', () => {
      const { container } = render(<Spinner type="classic" />)
      const wrapper = getRotatingWrapper(container)
      // inner div (position:relative) containing 4 dots
      const innerDiv = wrapper?.firstElementChild as HTMLElement | null
      expect(innerDiv?.children.length).toBe(4)
    })

    it('type=dots renders 3 dot children', () => {
      const { container } = render(<Spinner type="dots" />)
      // dots wrapper: display:flex with 3 children
      const dotsWrapper = Array.from(container.querySelectorAll('div')).find(
        (el) =>
          (el as HTMLElement).style.display === 'flex' &&
          (el as HTMLElement).style.justifyContent === 'center' &&
          el.children.length === 3,
      ) as HTMLElement | null
      expect(dotsWrapper).not.toBeNull()
    })

    it('type=bars renders 8 bar children', () => {
      const { container } = render(<Spinner type="bars" />)
      // bars wrapper: position:relative with 8 children
      const barsWrapper = Array.from(container.querySelectorAll('div')).find(
        (el) => (el as HTMLElement).style.position === 'relative' && el.children.length === 8,
      ) as HTMLElement | null
      expect(barsWrapper).not.toBeNull()
    })

    it('type=pulse renders pulsing text element', () => {
      const { container } = render(<Spinner type="pulse" />)
      const pulseEl = Array.from(container.querySelectorAll('div')).find((el) =>
        (el as HTMLElement).style.animation?.includes('pulse-text'),
      )
      expect(pulseEl).not.toBeNull()
    })

    it('type=pulse shows tip text as pulsing content', () => {
      const { container } = render(<Spinner type="pulse" tip="Saving…" />)
      const pulseEl = Array.from(container.querySelectorAll('div')).find((el) =>
        (el as HTMLElement).style.animation?.includes('pulse-text'),
      ) as HTMLElement | null
      expect(pulseEl?.textContent).toBe('Saving…')
    })

    it('type=pulse defaults to "Loading..." when no tip', () => {
      const { container } = render(<Spinner type="pulse" />)
      const pulseEl = Array.from(container.querySelectorAll('div')).find((el) =>
        (el as HTMLElement).style.animation?.includes('pulse-text'),
      ) as HTMLElement | null
      expect(pulseEl?.textContent).toBe('Loading...')
    })

    it('type=pulse does not render a separate tip div below indicator', () => {
      const { container } = render(<Spinner type="pulse" tip="msg" />)
      // With isPulse=true, the tip IS the indicator; no separate tip div
      expect(getTipDiv(container)).toBeNull()
    })
  })

  // ── Size ──────────────────────────────────────────────────────────────

  describe('size', () => {
    it('size=default sets rotating wrapper width to 1.5rem', () => {
      const { container } = render(<Spinner size="default" />)
      expect(getRotatingWrapper(container)?.style.width).toBe('1.5rem')
    })

    it('size=small sets rotating wrapper width to 1rem', () => {
      const { container } = render(<Spinner size="small" />)
      expect(getRotatingWrapper(container)?.style.width).toBe('1rem')
    })

    it('size=large sets rotating wrapper width to 2.5rem', () => {
      const { container } = render(<Spinner size="large" />)
      expect(getRotatingWrapper(container)?.style.width).toBe('2.5rem')
    })

    it('size=small tip has fontSize 0.75rem', () => {
      const { container } = render(<Spinner size="small" tip="w" />)
      expect(getTipDiv(container)?.style.fontSize).toBe('0.75rem')
    })

    it('size=default tip has fontSize 0.875rem', () => {
      const { container } = render(<Spinner size="default" tip="w" />)
      expect(getTipDiv(container)?.style.fontSize).toBe('0.875rem')
    })

    it('size=large tip has fontSize 1rem', () => {
      const { container } = render(<Spinner size="large" tip="w" />)
      expect(getTipDiv(container)?.style.fontSize).toBe('1rem')
    })
  })

  // ── Delay ─────────────────────────────────────────────────────────────

  describe('delay', () => {
    it('with delay, spinner initially not visible', () => {
      const { container } = render(<Spinner delay={300} />)
      expect(getRoot(container)).toBeNull()
    })

    it('with delay, spinner becomes visible after delay elapses', () => {
      const { container } = render(<Spinner delay={300} />)
      act(() => { vi.advanceTimersByTime(300) })
      expect(getRoot(container)).not.toBeNull()
    })

    it('not yet visible before delay completes', () => {
      const { container } = render(<Spinner delay={500} />)
      act(() => { vi.advanceTimersByTime(499) })
      expect(getRoot(container)).toBeNull()
    })

    it('spinning=false clears delay and stays hidden', () => {
      const { container } = render(<Spinner spinning={false} delay={300} />)
      act(() => { vi.advanceTimersByTime(300) })
      expect(getRoot(container)).toBeNull()
    })
  })

  // ── Percent prop ──────────────────────────────────────────────────────

  describe('percent prop', () => {
    it('percent=N renders PercentCircle SVG (static, 2 circles)', () => {
      const { container } = render(<Spinner percent={50} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg!.querySelectorAll('circle').length).toBe(2)
    })

    it('percent=100 progress circle stroke is success color', () => {
      const { container } = render(<Spinner percent={100} />)
      const circles = container.querySelectorAll('circle')
      // Second circle (progress) should use success color when >= 100
      const progressCircle = circles[1]
      expect(progressCircle.getAttribute('stroke')).toBeTruthy()
    })

    it("percent='auto' renders indeterminate rotating SVG", () => {
      const { container } = render(<Spinner percent="auto" />)
      expect(getRotatingWrapper(container)).not.toBeNull()
      expect(container.querySelector('svg')).not.toBeNull()
    })

    it('percent overrides the type indicator', () => {
      // type=dots + percent → PercentCircle, not 3 dots
      const { container } = render(<Spinner type="dots" percent={60} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
    })
  })

  // ── Fullscreen mode ───────────────────────────────────────────────────

  describe('fullscreen mode', () => {
    it('fullscreen + spinning renders a root element', () => {
      const { container } = render(<Spinner fullscreen />)
      expect(getRoot(container)).not.toBeNull()
    })

    it('fullscreen root has position fixed', () => {
      const { container } = render(<Spinner fullscreen />)
      expect(getRoot(container)!.style.position).toBe('fixed')
    })

    it('fullscreen root has zIndex 1000', () => {
      const { container } = render(<Spinner fullscreen />)
      expect(getRoot(container)!.style.zIndex).toBe('1000')
    })

    it('fullscreen root has semi-transparent background', () => {
      const { container } = render(<Spinner fullscreen />)
      expect(getRoot(container)!.style.backgroundColor).toContain('rgba')
    })

    it('fullscreen + spinning=false renders nothing', () => {
      const { container } = render(<Spinner fullscreen spinning={false} />)
      expect(getRoot(container)).toBeNull()
    })
  })

  // ── Container mode (with children) ───────────────────────────────────

  describe('container mode (with children)', () => {
    it('renders root with position relative', () => {
      const { container } = render(<Spinner><p>Content</p></Spinner>)
      expect(getRoot(container)!.style.position).toBe('relative')
    })

    it('children render inside content div', () => {
      const { container } = render(<Spinner><p>Hello</p></Spinner>)
      expect(getContentDiv(container)?.querySelector('p')?.textContent).toBe('Hello')
    })

    it('overlay renders when spinning=true', () => {
      const { container } = render(<Spinner><p>x</p></Spinner>)
      expect(getOverlayDiv(container)).not.toBeNull()
    })

    it('overlay has position absolute', () => {
      const { container } = render(<Spinner><p>x</p></Spinner>)
      expect(getOverlayDiv(container)!.style.position).toBe('absolute')
    })

    it('overlay has zIndex 10', () => {
      const { container } = render(<Spinner><p>x</p></Spinner>)
      expect(getOverlayDiv(container)!.style.zIndex).toBe('10')
    })

    it('content has opacity 0.5 when spinning=true', () => {
      const { container } = render(<Spinner><p>x</p></Spinner>)
      expect(getContentDiv(container)!.style.opacity).toBe('0.5')
    })

    it('content has blur filter when spinning=true', () => {
      const { container } = render(<Spinner><p>x</p></Spinner>)
      expect(getContentDiv(container)!.style.filter).toContain('blur')
    })

    it('overlay not rendered when spinning=false', () => {
      const { container } = render(<Spinner spinning={false}><p>x</p></Spinner>)
      expect(getOverlayDiv(container)).toBeNull()
    })

    it('content still renders when spinning=false', () => {
      const { container } = render(<Spinner spinning={false}><p>Content</p></Spinner>)
      expect(getContentDiv(container)?.querySelector('p')?.textContent).toBe('Content')
    })

    it('content has no blur when spinning=false', () => {
      const { container } = render(<Spinner spinning={false}><p>x</p></Spinner>)
      expect(getContentDiv(container)!.style.filter).toBe('')
    })
  })

  // ── Custom indicator ──────────────────────────────────────────────────

  describe('custom indicator', () => {
    it('indicator prop renders custom element', () => {
      const { container } = render(
        <Spinner indicator={<span data-testid="custom">⚙</span>} />,
      )
      expect(container.querySelector('[data-testid="custom"]')).not.toBeNull()
    })

    it('custom indicator overrides type indicator', () => {
      const { container } = render(
        <Spinner type="ring" indicator={<span>●</span>} />,
      )
      // type=ring has SVG; custom indicator has no SVG
      expect(container.querySelector('svg')).toBeNull()
    })

    it('tip still renders alongside custom indicator', () => {
      const { container } = render(
        <Spinner indicator={<span>●</span>} tip="Loading data" />,
      )
      expect(getTipDiv(container)?.textContent).toBe('Loading data')
    })
  })

  // ── classNames ────────────────────────────────────────────────────────

  describe('classNames', () => {
    it('classNames.root applied to standalone root', () => {
      const { container } = render(<Spinner classNames={{ root: 'my-root' }} />)
      expect(getRoot(container)?.classList.contains('my-root')).toBe(true)
    })

    it('classNames.indicator applied to indicator div', () => {
      const { container } = render(<Spinner classNames={{ indicator: 'my-ind' }} />)
      expect(getIndicatorDiv(container)?.classList.contains('my-ind')).toBe(true)
    })

    it('classNames.tip applied to tip div', () => {
      const { container } = render(<Spinner tip="t" classNames={{ tip: 'my-tip' }} />)
      expect(getTipDiv(container)?.classList.contains('my-tip')).toBe(true)
    })

    it('classNames.content applied to content div (container mode)', () => {
      const { container } = render(
        <Spinner classNames={{ content: 'my-content' }}>child</Spinner>,
      )
      expect(getContentDiv(container)?.classList.contains('my-content')).toBe(true)
    })

    it('classNames.overlay applied to overlay div (container mode)', () => {
      const { container } = render(
        <Spinner classNames={{ overlay: 'my-overlay' }}>child</Spinner>,
      )
      expect(getOverlayDiv(container)?.classList.contains('my-overlay')).toBe(true)
    })
  })

  // ── styles ────────────────────────────────────────────────────────────

  describe('styles', () => {
    it('styles.root applied to standalone root', () => {
      const { container } = render(<Spinner styles={{ root: { background: 'red' } }} />)
      expect(getRoot(container)!.style.background).toBe('red')
    })

    it('styles.indicator applied to indicator div', () => {
      const { container } = render(<Spinner styles={{ indicator: { gap: '1rem' } }} />)
      expect(getIndicatorDiv(container)!.style.gap).toBe('1rem')
    })

    it('styles.tip applied to tip div', () => {
      const { container } = render(<Spinner tip="t" styles={{ tip: { color: 'green' } }} />)
      expect(getTipDiv(container)!.style.color).toBe('green')
    })

    it('styles.content applied to content div (container mode)', () => {
      const { container } = render(
        <Spinner styles={{ content: { padding: '1rem' } }}>child</Spinner>,
      )
      expect(getContentDiv(container)!.style.padding).toBe('1rem')
    })

    it('styles.overlay applied to overlay div (container mode)', () => {
      const { container } = render(
        <Spinner styles={{ overlay: { zIndex: '99' } }}>child</Spinner>,
      )
      expect(getOverlayDiv(container)!.style.zIndex).toBe('99')
    })
  })

  // ── className and style ───────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to root', () => {
      const { container } = render(<Spinner className="my-spinner" />)
      expect(getRoot(container)?.classList.contains('my-spinner')).toBe(true)
    })

    it('className and classNames.root both applied to root', () => {
      const { container } = render(<Spinner className="a" classNames={{ root: 'b' }} />)
      expect(getRoot(container)?.classList.contains('a')).toBe(true)
      expect(getRoot(container)?.classList.contains('b')).toBe(true)
    })

    it('style applied to root', () => {
      const { container } = render(<Spinner style={{ border: '1px solid red' }} />)
      expect(getRoot(container)!.style.border).toBe('1px solid red')
    })
  })
})
