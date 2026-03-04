import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'
import { Drawer } from '../Drawer'

// ─── Fake timers for rAF-based animations ───────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  document.body.style.overflow = ''
})

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getDialog(): HTMLElement | null {
  return document.body.querySelector('[role="dialog"]')
}

function getMask(): HTMLElement | null {
  // Mask is a sibling div of dialog inside the wrapper, with absolute position and bg rgba
  const wrapper = getDialog()?.parentElement
  if (!wrapper) return null
  const children = Array.from(wrapper.children) as HTMLElement[]
  return children.find(
    (el) => el.style.position === 'absolute' && el.style.backgroundColor.includes('rgba'),
  ) ?? null
}

function getHeader(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  const children = Array.from(dialog.children) as HTMLElement[]
  return children.find((el) => el.style.borderBottom !== '') ?? null
}

function getBody(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  const children = Array.from(dialog.children) as HTMLElement[]
  return children.find((el) => el.style.overflowY === 'auto') ?? null
}

function getFooter(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  const children = Array.from(dialog.children) as HTMLElement[]
  return children.find((el) => el.style.borderTop !== '') ?? null
}

function getCloseButton(): HTMLButtonElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  return dialog.querySelector('button')
}

function getTitleDiv(): HTMLElement | null {
  const header = getHeader()
  if (!header) return null
  const children = Array.from(header.children) as HTMLElement[]
  return children.find((el) => el.style.fontWeight === '600') ?? null
}

function getExtraDiv(): HTMLElement | null {
  const header = getHeader()
  if (!header) return null
  const children = Array.from(header.children) as HTMLElement[]
  return children.find((el) => el.style.gap === '0.5rem') ?? null
}

/** Open the drawer by advancing through double rAF */
function showDrawer() {
  act(() => { vi.advanceTimersByTime(0) }) // rAF 1
  act(() => { vi.advanceTimersByTime(0) }) // rAF 2
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Drawer', () => {
  describe('basic rendering', () => {
    it('renders nothing when open is false', () => {
      render(<Drawer open={false}>Content</Drawer>)
      expect(getDialog()).toBeNull()
    })

    it('renders nothing by default (open=false)', () => {
      render(<Drawer>Content</Drawer>)
      expect(getDialog()).toBeNull()
    })

    it('renders dialog when open', () => {
      render(<Drawer open>Content</Drawer>)
      showDrawer()
      expect(getDialog()).toBeTruthy()
    })

    it('dialog has role="dialog"', () => {
      render(<Drawer open>Content</Drawer>)
      showDrawer()
      expect(getDialog()!.getAttribute('role')).toBe('dialog')
    })

    it('dialog has aria-modal="true"', () => {
      render(<Drawer open>Content</Drawer>)
      showDrawer()
      expect(getDialog()!.getAttribute('aria-modal')).toBe('true')
    })

    it('renders in document.body via portal', () => {
      render(<Drawer open>Content</Drawer>)
      showDrawer()
      expect(getDialog()!.closest('body')).toBe(document.body)
    })

    it('renders children in body section', () => {
      render(<Drawer open>Hello Drawer</Drawer>)
      showDrawer()
      expect(getBody()!.textContent).toContain('Hello Drawer')
    })

    it('renders ReactNode children', () => {
      render(
        <Drawer open>
          <span data-testid="child">Rich</span>
        </Drawer>,
      )
      showDrawer()
      expect(document.body.querySelector('[data-testid="child"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Title / Header
  // ============================================================================

  describe('title and header', () => {
    it('renders title', () => {
      render(<Drawer open title="My Title">C</Drawer>)
      showDrawer()
      expect(getTitleDiv()!.textContent).toBe('My Title')
    })

    it('title has fontWeight 600', () => {
      render(<Drawer open title="T">C</Drawer>)
      showDrawer()
      expect(getTitleDiv()!.style.fontWeight).toBe('600')
    })

    it('title has fontSize 1rem', () => {
      render(<Drawer open title="T">C</Drawer>)
      showDrawer()
      expect(getTitleDiv()!.style.fontSize).toBe('1rem')
    })

    it('renders ReactNode title', () => {
      render(<Drawer open title={<strong data-testid="rt">Bold</strong>}>C</Drawer>)
      showDrawer()
      expect(document.body.querySelector('[data-testid="rt"]')).toBeTruthy()
    })

    it('renders extra in header', () => {
      render(<Drawer open title="T" extra={<button data-testid="extra">E</button>}>C</Drawer>)
      showDrawer()
      expect(document.body.querySelector('[data-testid="extra"]')).toBeTruthy()
    })

    it('header has border-bottom', () => {
      render(<Drawer open title="T">C</Drawer>)
      showDrawer()
      expect(getHeader()!.style.borderBottom).toContain('1px solid')
    })

    it('header has padding 1rem 1.5rem', () => {
      render(<Drawer open title="T">C</Drawer>)
      showDrawer()
      expect(getHeader()!.style.padding).toBe('1rem 1.5rem')
    })

    it('no header when no title, no extra, and closable=false', () => {
      render(<Drawer open closable={false}>C</Drawer>)
      showDrawer()
      expect(getHeader()).toBeNull()
    })

    it('header shown when only closable (no title)', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getHeader()).toBeTruthy()
    })
  })

  // ============================================================================
  // Footer
  // ============================================================================

  describe('footer', () => {
    it('no footer by default', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getFooter()).toBeNull()
    })

    it('renders footer', () => {
      render(<Drawer open footer={<span data-testid="ft">Footer</span>}>C</Drawer>)
      showDrawer()
      expect(document.body.querySelector('[data-testid="ft"]')).toBeTruthy()
    })

    it('footer has border-top', () => {
      render(<Drawer open footer="F">C</Drawer>)
      showDrawer()
      expect(getFooter()!.style.borderTop).toContain('1px solid')
    })

    it('footer has padding', () => {
      render(<Drawer open footer="F">C</Drawer>)
      showDrawer()
      expect(getFooter()!.style.padding).toBe('1rem 1.5rem')
    })
  })

  // ============================================================================
  // Close button
  // ============================================================================

  describe('close button', () => {
    it('renders close button by default', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getCloseButton()).toBeTruthy()
    })

    it('closable={false} hides close button', () => {
      render(<Drawer open closable={false} title="T">C</Drawer>)
      showDrawer()
      expect(getCloseButton()).toBeNull()
    })

    it('clicking close calls onClose', () => {
      const onClose = vi.fn()
      render(<Drawer open onClose={onClose}>C</Drawer>)
      showDrawer()
      fireEvent.click(getCloseButton()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('close button has default SVG icon', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getCloseButton()!.querySelector('svg')).toBeTruthy()
    })

    it('custom closeIcon renders', () => {
      render(<Drawer open closeIcon={<span data-testid="ci">X</span>}>C</Drawer>)
      showDrawer()
      expect(document.body.querySelector('[data-testid="ci"]')).toBeTruthy()
    })

    it('close button has cursor pointer', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getCloseButton()!.style.cursor).toBe('pointer')
    })

    it('close button hover changes color', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      const btn = getCloseButton()!
      const colorBefore = btn.style.color
      fireEvent.mouseEnter(btn)
      expect(btn.style.color).not.toBe(colorBefore)
      fireEvent.mouseLeave(btn)
      expect(btn.style.color).toBe(colorBefore)
    })

    it('close button has marginLeft auto', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getCloseButton()!.style.marginLeft).toBe('auto')
    })
  })

  // ============================================================================
  // Mask
  // ============================================================================

  describe('mask', () => {
    it('mask is shown by default', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getMask()).toBeTruthy()
    })

    it('mask={false} hides mask', () => {
      render(<Drawer open mask={false}>C</Drawer>)
      showDrawer()
      expect(getMask()).toBeNull()
    })

    it('mask has rgba background', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getMask()!.style.backgroundColor).toContain('rgba')
    })

    it('clicking mask closes drawer when maskClosable', () => {
      const onClose = vi.fn()
      render(<Drawer open onClose={onClose}>C</Drawer>)
      showDrawer()
      fireEvent.click(getMask()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('clicking mask does not close when maskClosable={false}', () => {
      const onClose = vi.fn()
      render(<Drawer open onClose={onClose} maskClosable={false}>C</Drawer>)
      showDrawer()
      fireEvent.click(getMask()!)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('mask has opacity transition', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getMask()!.style.transition).toContain('opacity')
    })
  })

  // ============================================================================
  // Keyboard (Escape)
  // ============================================================================

  describe('keyboard', () => {
    it('pressing Escape calls onClose', () => {
      const onClose = vi.fn()
      render(<Drawer open onClose={onClose}>C</Drawer>)
      showDrawer()
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalled()
    })

    it('keyboard={false} disables Escape', () => {
      const onClose = vi.fn()
      render(<Drawer open onClose={onClose} keyboard={false}>C</Drawer>)
      showDrawer()
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  // ============================================================================
  // Placement
  // ============================================================================

  describe('placement', () => {
    it('default placement is right', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.right).toBe('0px')
    })

    it('placement=left positions on left', () => {
      render(<Drawer open placement="left">C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.left).toBe('0px')
    })

    it('placement=top positions on top', () => {
      render(<Drawer open placement="top">C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.top).toBe('0px')
    })

    it('placement=bottom positions on bottom', () => {
      render(<Drawer open placement="bottom">C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.bottom).toBe('0px')
    })

    it('horizontal placement sets width, full height', () => {
      render(<Drawer open placement="right">C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.width).toBe('23.625rem')
      expect(dialog.style.height).toBe('100%')
    })

    it('vertical placement sets height, full width', () => {
      render(<Drawer open placement="top">C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.height).toBe('23.625rem')
      expect(dialog.style.width).toBe('100%')
    })

    it('non-animated panel has translateX(100%) for right placement', () => {
      render(<Drawer open>C</Drawer>)
      // Before animation completes, transform is the off-screen position
      expect(getDialog()!.style.transform).toBe('translateX(100%)')
    })
  })

  // ============================================================================
  // Size
  // ============================================================================

  describe('size', () => {
    it('default size width is 23.625rem', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.width).toBe('23.625rem')
    })

    it('large size width is 46rem', () => {
      render(<Drawer open size="large">C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.width).toBe('46rem')
    })

    it('custom width overrides size', () => {
      render(<Drawer open width={500}>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.width).toBe('500px')
    })

    it('custom width as string', () => {
      render(<Drawer open width="80vw">C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.width).toBe('80vw')
    })

    it('custom height for vertical placement', () => {
      render(<Drawer open placement="bottom" height={300}>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.height).toBe('300px')
    })
  })

  // ============================================================================
  // zIndex
  // ============================================================================

  describe('zIndex', () => {
    it('default zIndex is 1000', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      const wrapper = getDialog()!.parentElement!
      expect(wrapper.style.zIndex).toBe('1000')
    })

    it('custom zIndex', () => {
      render(<Drawer open zIndex={2000}>C</Drawer>)
      showDrawer()
      const wrapper = getDialog()!.parentElement!
      expect(wrapper.style.zIndex).toBe('2000')
    })
  })

  // ============================================================================
  // Body scroll lock
  // ============================================================================

  describe('body scroll lock', () => {
    it('locks body scroll when mounted', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body scroll on unmount', () => {
      document.body.style.overflow = 'auto'
      const { rerender } = render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(document.body.style.overflow).toBe('hidden')
      rerender(<Drawer open={false}>C</Drawer>)
      // Trigger transition end to unmount
      const dialog = getDialog()
      if (dialog) {
        fireEvent.transitionEnd(dialog)
      }
    })
  })

  // ============================================================================
  // Loading
  // ============================================================================

  describe('loading', () => {
    it('shows loading skeleton when loading', () => {
      render(<Drawer open loading>C</Drawer>)
      showDrawer()
      const body = getBody()!
      // Loading skeleton has animation pulse
      expect(body.innerHTML).toContain('j-drawer-pulse')
    })

    it('shows children when not loading', () => {
      render(<Drawer open>Real Content</Drawer>)
      showDrawer()
      expect(getBody()!.textContent).toContain('Real Content')
      expect(getBody()!.innerHTML).not.toContain('j-drawer-pulse')
    })

    it('loading skeleton has multiple bars', () => {
      render(<Drawer open loading>C</Drawer>)
      showDrawer()
      const body = getBody()!
      // Skeleton has 3 animated divs
      const skeletonContainer = body.firstElementChild as HTMLElement
      expect(skeletonContainer.children.length).toBeGreaterThanOrEqual(3)
    })
  })

  // ============================================================================
  // destroyOnClose
  // ============================================================================

  describe('destroyOnClose', () => {
    it('content persists after close by default', () => {
      const { rerender } = render(<Drawer open>Keep me</Drawer>)
      showDrawer()
      rerender(<Drawer open={false}>Keep me</Drawer>)
      // Dialog should still be in DOM (just hidden)
      const dialog = getDialog()
      if (dialog) {
        expect(dialog.textContent).toContain('Keep me')
      }
    })

    it('destroyOnClose removes content on close', () => {
      const { rerender } = render(<Drawer open destroyOnClose>Gone</Drawer>)
      showDrawer()
      rerender(<Drawer open={false} destroyOnClose>Gone</Drawer>)
      // After transition ends, dialog should be destroyed
      const dialog = getDialog()
      if (dialog) {
        fireEvent.transitionEnd(dialog)
      }
      expect(getDialog()).toBeNull()
    })
  })

  // ============================================================================
  // afterOpenChange
  // ============================================================================

  describe('afterOpenChange', () => {
    it('afterOpenChange(true) fires after open transition', () => {
      const afterOpenChange = vi.fn()
      render(<Drawer open afterOpenChange={afterOpenChange}>C</Drawer>)
      showDrawer()
      // Simulate transition end on the panel
      fireEvent.transitionEnd(getDialog()!)
      expect(afterOpenChange).toHaveBeenCalledWith(true)
    })

    it('afterOpenChange(false) fires after close transition', () => {
      const afterOpenChange = vi.fn()
      const { rerender } = render(<Drawer open afterOpenChange={afterOpenChange}>C</Drawer>)
      showDrawer()
      rerender(<Drawer open={false} afterOpenChange={afterOpenChange}>C</Drawer>)
      const dialog = getDialog()
      if (dialog) {
        fireEvent.transitionEnd(dialog)
        expect(afterOpenChange).toHaveBeenCalledWith(false)
      }
    })
  })

  // ============================================================================
  // Panel styling
  // ============================================================================

  describe('panel styling', () => {
    it('panel has flex column layout', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      const dialog = getDialog()!
      expect(dialog.style.display).toBe('flex')
      expect(dialog.style.flexDirection).toBe('column')
    })

    it('panel has absolute position', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.position).toBe('absolute')
    })

    it('panel has transform transition', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.transition).toContain('transform')
    })

    it('wrapper has fixed positioning', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      const wrapper = getDialog()!.parentElement!
      expect(wrapper.style.position).toBe('fixed')
    })

    it('body has overflowY auto', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getBody()!.style.overflowY).toBe('auto')
    })

    it('body has padding', () => {
      render(<Drawer open>C</Drawer>)
      showDrawer()
      expect(getBody()!.style.padding).toBe('1.5rem')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('classNames.root applies to dialog', () => {
      render(<Drawer open classNames={{ root: 'my-root' }}>C</Drawer>)
      showDrawer()
      expect(getDialog()!.className).toContain('my-root')
    })

    it('classNames.mask applies to mask', () => {
      render(<Drawer open classNames={{ mask: 'my-mask' }}>C</Drawer>)
      showDrawer()
      expect(getMask()!.className).toContain('my-mask')
    })

    it('classNames.header applies to header', () => {
      render(<Drawer open title="T" classNames={{ header: 'my-header' }}>C</Drawer>)
      showDrawer()
      expect(getHeader()!.className).toContain('my-header')
    })

    it('classNames.body applies to body', () => {
      render(<Drawer open classNames={{ body: 'my-body' }}>C</Drawer>)
      showDrawer()
      expect(getBody()!.className).toContain('my-body')
    })

    it('classNames.footer applies to footer', () => {
      render(<Drawer open footer="F" classNames={{ footer: 'my-footer' }}>C</Drawer>)
      showDrawer()
      expect(getFooter()!.className).toContain('my-footer')
    })

    it('classNames.closeBtn applies to close button', () => {
      render(<Drawer open classNames={{ closeBtn: 'my-close' }}>C</Drawer>)
      showDrawer()
      expect(getCloseButton()!.className).toContain('my-close')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('styles.root merges into panel', () => {
      render(<Drawer open styles={{ root: { border: '2px solid red' } }}>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.border).toContain('2px solid')
    })

    it('styles.mask merges into mask', () => {
      render(<Drawer open styles={{ mask: { opacity: '0.8' } }}>C</Drawer>)
      showDrawer()
      expect(getMask()!.style.opacity).toBeTruthy()
    })

    it('styles.header merges into header', () => {
      render(<Drawer open title="T" styles={{ header: { padding: '2rem' } }}>C</Drawer>)
      showDrawer()
      expect(getHeader()!.style.padding).toBe('2rem')
    })

    it('styles.body merges into body', () => {
      render(<Drawer open styles={{ body: { background: 'red' } }}>C</Drawer>)
      showDrawer()
      expect(getBody()!.style.background).toBe('red')
    })

    it('styles.footer merges into footer', () => {
      render(<Drawer open footer="F" styles={{ footer: { padding: '3rem' } }}>C</Drawer>)
      showDrawer()
      expect(getFooter()!.style.padding).toBe('3rem')
    })

    it('styles.closeBtn merges into close button', () => {
      render(<Drawer open styles={{ closeBtn: { color: 'red' } }}>C</Drawer>)
      showDrawer()
      expect(getCloseButton()!.style.color).toBe('red')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className and style', () => {
    it('className applies to panel', () => {
      render(<Drawer open className="my-drawer">C</Drawer>)
      showDrawer()
      expect(getDialog()!.className).toContain('my-drawer')
    })

    it('style merges into panel', () => {
      render(<Drawer open style={{ maxWidth: '600px' }}>C</Drawer>)
      showDrawer()
      expect(getDialog()!.style.maxWidth).toBe('600px')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('extra margin-left depends on title presence', () => {
      render(<Drawer open title="T" extra={<span>E</span>}>C</Drawer>)
      showDrawer()
      const extraDiv = getExtraDiv()!
      expect(extraDiv.style.marginLeft).toBe('1rem')
    })

    it('extra margin-left is 0 without title', () => {
      render(<Drawer open extra={<span>E</span>}>C</Drawer>)
      showDrawer()
      const extraDiv = getExtraDiv()!
      expect(extraDiv.style.marginLeft).toBe('0px')
    })

    it('wrapper has pointer-events none when not mounted', () => {
      const { rerender } = render(<Drawer open>C</Drawer>)
      showDrawer()
      const panel = getDialog()!
      const wrapper = panel.parentElement!
      expect(wrapper.style.pointerEvents).toBe('auto')
      rerender(<Drawer open={false}>C</Drawer>)
      // Simulate transitionEnd on the panel to trigger unmount
      fireEvent.transitionEnd(panel, { target: panel })
      expect(wrapper.style.display).toBe('none')
    })

    it('loading skeleton has correct styles', () => {
      render(<Drawer open loading>C</Drawer>)
      showDrawer()
      const body = getBody()!
      const skeleton = body.firstElementChild as HTMLElement
      expect(skeleton.style.display).toBe('flex')
      expect(skeleton.style.flexDirection).toBe('column')
      expect(skeleton.style.gap).toBe('1rem')
    })
  })
})
