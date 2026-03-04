import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { Watermark } from '../Watermark'

// ============================================================================
// Canvas mock — jsdom has no canvas implementation; mock it globally
// ============================================================================

const mockCtx = {
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillText: vi.fn(),
  drawImage: vi.fn(),
  font: '',
  fillStyle: '',
  textAlign: '',
  textBaseline: '',
  globalAlpha: 1,
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as any)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,FAKE')
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

/** Watermark overlay div — position:absolute, direct child of root */
function getWatermarkDiv(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  return (
    (Array.from(root.children).find(
      (el) => el.tagName === 'DIV' && (el as HTMLElement).style.position === 'absolute',
    ) as HTMLElement | undefined) ?? null
  )
}

// ============================================================================
// Tests
// ============================================================================

describe('Watermark', () => {
  // ── Root structure ────────────────────────────────────────────────────

  describe('root structure', () => {
    it('always renders root div', () => {
      const { container } = render(<Watermark />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('root has position relative', () => {
      const { container } = render(<Watermark />)
      expect(getRoot(container).style.position).toBe('relative')
    })
  })

  // ── Children ──────────────────────────────────────────────────────────

  describe('children', () => {
    it('renders children inside root', () => {
      const { container } = render(
        <Watermark content="©2024">
          <p data-testid="child">Hello</p>
        </Watermark>,
      )
      expect(getRoot(container).querySelector('[data-testid="child"]')?.textContent).toBe('Hello')
    })

    it('renders without children', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getRoot(container)).toBeTruthy()
    })
  })

  // ── Watermark overlay ─────────────────────────────────────────────────

  describe('watermark overlay', () => {
    it('string content → watermark div rendered', () => {
      const { container } = render(<Watermark content="Confidential" />)
      expect(getWatermarkDiv(container)).not.toBeNull()
    })

    it('array content → watermark div rendered', () => {
      const { container } = render(<Watermark content={['Line 1', 'Line 2']} />)
      expect(getWatermarkDiv(container)).not.toBeNull()
    })

    it('no content → no watermark div', () => {
      const { container } = render(<Watermark />)
      expect(getWatermarkDiv(container)).toBeNull()
    })

    it('empty array content → no watermark div', () => {
      const { container } = render(<Watermark content={[]} />)
      expect(getWatermarkDiv(container)).toBeNull()
    })

    it('watermark div has position absolute', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.position).toBe('absolute')
    })

    it('watermark div has pointerEvents none', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.pointerEvents).toBe('none')
    })

    it('watermark div has default zIndex 9', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.zIndex).toBe('9')
    })

    it('custom zIndex prop applied', () => {
      const { container } = render(<Watermark content="test" zIndex={100} />)
      expect(getWatermarkDiv(container)!.style.zIndex).toBe('100')
    })

    it('watermark div has backgroundRepeat repeat', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.backgroundRepeat).toContain('repeat')
    })

    it('watermark div has a backgroundImage set', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.backgroundImage).not.toBe('')
    })

    it('default backgroundSize is 220px 164px (width=120+gap=100, height=64+gap=100)', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.backgroundSize).toBe('220px 164px')
    })

    it('custom width affects backgroundSize', () => {
      const { container } = render(<Watermark content="test" width={80} />)
      // tileW = 80 + 100 = 180, tileH = 64 + 100 = 164
      expect(getWatermarkDiv(container)!.style.backgroundSize).toBe('180px 164px')
    })

    it('custom height affects backgroundSize', () => {
      const { container } = render(<Watermark content="test" height={40} />)
      // tileW = 120 + 100 = 220, tileH = 40 + 100 = 140
      expect(getWatermarkDiv(container)!.style.backgroundSize).toBe('220px 140px')
    })

    it('custom gap affects backgroundSize', () => {
      const { container } = render(<Watermark content="test" gap={[50, 50]} />)
      // tileW = 120 + 50 = 170, tileH = 64 + 50 = 114
      expect(getWatermarkDiv(container)!.style.backgroundSize).toBe('170px 114px')
    })

    it('default backgroundPosition is 0px 0px', () => {
      const { container } = render(<Watermark content="test" />)
      expect(getWatermarkDiv(container)!.style.backgroundPosition).toBe('0px 0px')
    })

    it('custom offset affects backgroundPosition', () => {
      const { container } = render(<Watermark content="test" offset={[20, 30]} />)
      expect(getWatermarkDiv(container)!.style.backgroundPosition).toBe('20px 30px')
    })

    it('image prop: root renders without crash', () => {
      const { container } = render(<Watermark image="logo.png" />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('image prop: no watermark div before image loads', () => {
      const { container } = render(<Watermark image="logo.png" />)
      expect(getWatermarkDiv(container)).toBeNull()
    })
  })

  // ── classNames ────────────────────────────────────────────────────────

  describe('classNames', () => {
    it('classNames.root applied to root', () => {
      const { container } = render(<Watermark classNames={{ root: 'my-root' }} />)
      expect(getRoot(container).classList.contains('my-root')).toBe(true)
    })

    it('classNames.watermark applied to watermark div', () => {
      const { container } = render(
        <Watermark content="test" classNames={{ watermark: 'my-wm' }} />,
      )
      expect(getWatermarkDiv(container)?.classList.contains('my-wm')).toBe(true)
    })
  })

  // ── styles ────────────────────────────────────────────────────────────

  describe('styles', () => {
    it('styles.root applied to root', () => {
      const { container } = render(<Watermark styles={{ root: { background: 'pink' } }} />)
      expect(getRoot(container).style.background).toBe('pink')
    })

    it('styles.watermark applied to watermark div', () => {
      const { container } = render(
        <Watermark content="test" styles={{ watermark: { opacity: '0.5' } }} />,
      )
      expect(getWatermarkDiv(container)?.style.opacity).toBe('0.5')
    })
  })

  // ── className and style ───────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to root', () => {
      const { container } = render(<Watermark className="my-watermark" />)
      expect(getRoot(container).classList.contains('my-watermark')).toBe(true)
    })

    it('className and classNames.root both applied to root', () => {
      const { container } = render(
        <Watermark className="a" classNames={{ root: 'b' }} />,
      )
      expect(getRoot(container).classList.contains('a')).toBe(true)
      expect(getRoot(container).classList.contains('b')).toBe(true)
    })

    it('style applied to root', () => {
      const { container } = render(<Watermark style={{ border: '1px solid red' }} />)
      expect(getRoot(container).style.border).toBe('1px solid red')
    })
  })
})
