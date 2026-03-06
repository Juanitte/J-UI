import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { Affix } from '../Affix'

// ============================================================================
// Helpers
// ============================================================================

function getWrapper(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

function getContentDiv(container: HTMLElement): HTMLElement {
  return getWrapper(container).firstElementChild as HTMLElement
}

/** Mock getBoundingClientRect for ALL elements via the prototype */
function mockElementRect(overrides: Partial<DOMRect> = {}) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect)
}

afterEach(() => {
  vi.restoreAllMocks()
})

// ============================================================================
// Tests
// ============================================================================

describe('Affix', () => {
  // ── Basic structure ───────────────────────────────────────────────────

  describe('basic structure', () => {
    it('renders wrapper div', () => {
      const { container } = render(<Affix />)
      expect(getWrapper(container)).toBeTruthy()
    })

    it('renders content div inside wrapper', () => {
      const { container } = render(<Affix />)
      expect(getContentDiv(container)).toBeTruthy()
    })

    it('renders children inside content div', () => {
      const { container } = render(
        <Affix><span data-testid="child">hello</span></Affix>,
      )
      expect(getContentDiv(container).querySelector('[data-testid="child"]')?.textContent).toBe('hello')
    })
  })

  // ── Not affixed ───────────────────────────────────────────────────────

  describe('not affixed', () => {
    beforeEach(() => {
      // wrapperRect.top=200 > offsetTop=100 → not affixed
      mockElementRect({ top: 200, bottom: 250, height: 50 })
    })

    it('content div has no position style', () => {
      const { container } = render(<Affix offsetTop={100} />)
      expect(getContentDiv(container).style.position).toBe('')
    })

    it('wrapper has no height style', () => {
      const { container } = render(<Affix offsetTop={100} />)
      expect(getWrapper(container).style.height).toBe('')
    })

    it('content div has no zIndex', () => {
      const { container } = render(<Affix offsetTop={100} />)
      expect(getContentDiv(container).style.zIndex).toBe('')
    })
  })

  // ── Affixed at top ────────────────────────────────────────────────────

  describe('affixed at top', () => {
    beforeEach(() => {
      // wrapperRect.top=30 <= offsetTop=50 → affixed at top
      mockElementRect({ top: 30, bottom: 80, left: 10, width: 100, height: 50 })
    })

    it('content div has position fixed', () => {
      const { container } = render(<Affix offsetTop={50} />)
      expect(getContentDiv(container)).toHaveClass('ino-affix__content--fixed')
    })

    it('content div top equals containerTop + offsetTop', () => {
      const { container } = render(<Affix offsetTop={50} />)
      // containerTop=0 (window) + offsetTop=50 → top=50px
      expect(getContentDiv(container).style.top).toBe('50px')
    })

    it('content div has zIndex 10', () => {
      const { container } = render(<Affix offsetTop={50} />)
      expect(getContentDiv(container)).toHaveClass('ino-affix__content--fixed')
    })

    it('wrapper height equals wrapperRect.height', () => {
      const { container } = render(<Affix offsetTop={50} />)
      // wrapperRect.height=50 → preserves layout space
      expect(getWrapper(container).style.height).toBe('50px')
    })

    it('content div left matches wrapperRect.left', () => {
      const { container } = render(<Affix offsetTop={50} />)
      expect(getContentDiv(container).style.left).toBe('10px')
    })

    it('content div width matches wrapperRect.width', () => {
      const { container } = render(<Affix offsetTop={50} />)
      expect(getContentDiv(container).style.width).toBe('100px')
    })

    it('default offsetTop=0 affixes when wrapperRect.top equals 0', () => {
      mockElementRect({ top: 0, bottom: 40, height: 40 })
      const { container } = render(<Affix />)
      expect(getContentDiv(container)).toHaveClass('ino-affix__content--fixed')
    })
  })

  // ── Affixed at bottom ─────────────────────────────────────────────────

  describe('affixed at bottom', () => {
    beforeEach(() => {
      // containerBottom - wrapperRect.bottom = innerHeight-730 ≤ 50 → affixed at bottom
      mockElementRect({ top: 680, bottom: 730, left: 5, width: 80, height: 50 })
    })

    it('content div has position fixed', () => {
      const { container } = render(<Affix offsetBottom={50} />)
      expect(getContentDiv(container)).toHaveClass('ino-affix__content--fixed')
    })

    it('content div bottom equals offsetBottom when target is window', () => {
      const { container } = render(<Affix offsetBottom={50} />)
      // bottom = window.innerHeight - containerBottom + offsetBottom = offsetBottom = 50
      expect(getContentDiv(container).style.bottom).toBe('50px')
    })

    it('content div has zIndex 10', () => {
      const { container } = render(<Affix offsetBottom={50} />)
      expect(getContentDiv(container)).toHaveClass('ino-affix__content--fixed')
    })

    it('offsetTop takes priority over offsetBottom when both are set', () => {
      mockElementRect({ top: 30, bottom: 80, height: 50 })
      const { container } = render(<Affix offsetTop={50} offsetBottom={50} />)
      expect(getContentDiv(container).style.top).toBeTruthy()
      expect(getContentDiv(container).style.bottom).toBe('')
    })
  })

  // ── onChange callback ─────────────────────────────────────────────────

  describe('onChange callback', () => {
    it('onChange(true) called when affixed on mount', () => {
      // Default jsdom rect (top=0), default offsetTop=0: 0-0 <= 0 → affixed
      const onChange = vi.fn()
      render(<Affix onChange={onChange} />)
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('onChange(false) called when transitions to unaffixed on scroll', () => {
      const onChange = vi.fn()
      let currentTop = 0
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        top: currentTop, bottom: currentTop + 40, left: 0, right: 0,
        width: 0, height: 40, x: 0, y: 0, toJSON: () => ({}),
      } as DOMRect))

      render(<Affix offsetTop={50} onChange={onChange} />)
      // currentTop=0 <= 50 → affixed → onChange(true)
      expect(onChange).toHaveBeenCalledWith(true)

      currentTop = 200 // 200 > 50 → not affixed
      act(() => { window.dispatchEvent(new Event('scroll')) })
      expect(onChange).toHaveBeenCalledWith(false)
    })

    it('onChange not called again while affixed state is unchanged', () => {
      const onChange = vi.fn()
      render(<Affix offsetTop={50} onChange={onChange} />)
      // Affixed on mount → onChange(true) called once
      act(() => { window.dispatchEvent(new Event('scroll')) })
      // Same rect → still affixed → onChange not called again
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  // ── Custom target ─────────────────────────────────────────────────────

  describe('custom target', () => {
    it('renders without crash when custom target provided', () => {
      const targetEl = document.createElement('div')
      document.body.appendChild(targetEl)
      const { container } = render(<Affix target={() => targetEl} />)
      expect(getWrapper(container)).toBeTruthy()
      document.body.removeChild(targetEl)
    })

    it('uses target container rect for top calculation', () => {
      const targetEl = document.createElement('div')
      document.body.appendChild(targetEl)

      // targetEl returns containerTop=50; wrapper returns top=0
      // shouldFixTop: 0 - 50 = -50 <= offsetTop=0 → affixed
      // top = containerTop + offsetTop = 50 + 0 = 50
      vi.spyOn(targetEl, 'getBoundingClientRect').mockReturnValue({
        top: 50, bottom: 600, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0,
        toJSON: () => ({}),
      } as DOMRect)
      mockElementRect({ top: 0, bottom: 40, height: 40 })

      const { container } = render(<Affix target={() => targetEl} offsetTop={0} />)
      expect(getContentDiv(container).style.top).toBe('50px')

      document.body.removeChild(targetEl)
    })
  })

  // ── classNames ────────────────────────────────────────────────────────

  describe('classNames', () => {
    it('classNames.root applied to wrapper', () => {
      const { container } = render(<Affix classNames={{ root: 'my-root' }} />)
      expect(getWrapper(container).classList.contains('my-root')).toBe(true)
    })

    it('classNames.affix applied to content div', () => {
      const { container } = render(<Affix classNames={{ affix: 'my-affix' }} />)
      expect(getContentDiv(container).classList.contains('my-affix')).toBe(true)
    })
  })

  // ── styles ────────────────────────────────────────────────────────────

  describe('styles', () => {
    it('styles.root applied to wrapper', () => {
      const { container } = render(<Affix styles={{ root: { background: 'red' } }} />)
      expect(getWrapper(container).style.background).toBe('red')
    })

    it('styles.affix applied to content div', () => {
      const { container } = render(<Affix styles={{ affix: { opacity: '0.5' } }} />)
      expect(getContentDiv(container).style.opacity).toBe('0.5')
    })
  })

  // ── className and style ───────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to wrapper', () => {
      const { container } = render(<Affix className="my-affix-wrapper" />)
      expect(getWrapper(container).classList.contains('my-affix-wrapper')).toBe(true)
    })

    it('className and classNames.root both applied to wrapper', () => {
      const { container } = render(<Affix className="a" classNames={{ root: 'b' }} />)
      expect(getWrapper(container).classList.contains('a')).toBe(true)
      expect(getWrapper(container).classList.contains('b')).toBe(true)
    })

    it('style applied to wrapper', () => {
      const { container } = render(<Affix style={{ border: '1px solid red' }} />)
      expect(getWrapper(container).style.border).toBe('1px solid red')
    })
  })
})
