import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'
import { Modal, useModal } from '../Modal'
import type { ModalHookApi } from '../Modal'

// ─── Fake timers (only rAF needed for open animation) ────────────────────────

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame'],
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Flushes the double rAF that triggers setAnimating(true) */
function flushOpenAnimation() {
  act(() => { vi.advanceTimersByTime(50) })
}

function getDialog(): HTMLElement | null {
  return document.body.querySelector('[role="dialog"]')
}

function getPortalWrapper(): HTMLElement | null {
  return Array.from(document.body.children).find(
    (c) => (c as HTMLElement).style?.position === 'fixed',
  ) as HTMLElement ?? null
}

function getMask(): HTMLElement | null {
  const wrapper = getPortalWrapper()
  if (!wrapper) return null
  return Array.from(wrapper.children).find(
    (c) => c.tagName !== 'STYLE' && (c as HTMLElement).style?.position === 'fixed',
  ) as HTMLElement ?? null
}

function getScrollContainer(): HTMLElement | null {
  const wrapper = getPortalWrapper()
  if (!wrapper) return null
  return Array.from(wrapper.children).find(
    (c) => (c as HTMLElement).style?.display === 'flex',
  ) as HTMLElement ?? null
}

function getHeader(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  return Array.from(dialog.children).find(
    (c) => (c as HTMLElement).style?.borderBottom?.includes('solid'),
  ) as HTMLElement ?? null
}

function getBody(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  return Array.from(dialog.children).find(
    (c) => (c as HTMLElement).style?.overflowY === 'auto',
  ) as HTMLElement ?? null
}

function getFooter(): HTMLElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  return Array.from(dialog.children).find(
    (c) => (c as HTMLElement).style?.justifyContent === 'flex-end',
  ) as HTMLElement ?? null
}

/** X button: absolutely-positioned button inside dialog */
function getCloseButton(): HTMLButtonElement | null {
  const dialog = getDialog()
  if (!dialog) return null
  return Array.from(dialog.querySelectorAll('button')).find(
    (b) => (b as HTMLButtonElement).style?.position === 'absolute',
  ) as HTMLButtonElement ?? null
}

/** Last button in footer = OK */
function getOkButton(): HTMLButtonElement | null {
  const footer = getFooter()
  if (!footer) return null
  const btns = footer.querySelectorAll('button')
  return btns.length ? btns[btns.length - 1] as HTMLButtonElement : null
}

/** First of two buttons in footer = Cancel */
function getCancelButton(): HTMLButtonElement | null {
  const footer = getFooter()
  if (!footer) return null
  const btns = footer.querySelectorAll('button')
  return btns.length >= 2 ? btns[0] as HTMLButtonElement : null
}

// ============================================================================
// Modal component
// ============================================================================

describe('Modal', () => {

  // ==========================================================================
  // Basic rendering
  // ==========================================================================

  describe('basic rendering', () => {
    it('returns null when never opened (open=false)', () => {
      render(<Modal />)
      expect(getDialog()).toBeNull()
      expect(getPortalWrapper()).toBeNull()
    })

    it('renders portal to document.body when open', () => {
      render(<Modal open />)
      expect(getDialog()).toBeTruthy()
    })

    it('dialog has role="dialog"', () => {
      render(<Modal open />)
      expect(getDialog()!.getAttribute('role')).toBe('dialog')
    })

    it('dialog has aria-modal="true"', () => {
      render(<Modal open />)
      expect(getDialog()!.getAttribute('aria-modal')).toBe('true')
    })

    it('portal wrapper has position fixed with default zIndex 1000', () => {
      render(<Modal open />)
      const wrapper = getPortalWrapper()!
      expect(wrapper.style.position).toBe('fixed')
      expect(wrapper.style.zIndex).toBe('1000')
    })

    it('dialog is flex column layout', () => {
      render(<Modal open />)
      flushOpenAnimation()
      const dialog = getDialog()!
      expect(dialog.style.display).toBe('flex')
      expect(dialog.style.flexDirection).toBe('column')
    })

    it('portal wrapper is hidden (display:none) after close without destroyOnClose', () => {
      const { rerender } = render(<Modal open />)
      flushOpenAnimation()
      rerender(<Modal open={false} />)
      fireEvent.transitionEnd(getDialog()!)
      expect(getPortalWrapper()!.style.display).toBe('none')
    })
  })

  // ==========================================================================
  // Open / close animation
  // ==========================================================================

  describe('open animation', () => {
    it('dialog starts at scale(0.85) opacity 0 before rAF flush', () => {
      render(<Modal open />)
      const dialog = getDialog()!
      expect(dialog.style.transform).toBe('scale(0.85)')
      expect(dialog.style.opacity).toBe('0')
    })

    it('dialog is scale(1) opacity 1 after rAF flush', () => {
      render(<Modal open />)
      flushOpenAnimation()
      const dialog = getDialog()!
      expect(dialog.style.transform).toBe('scale(1)')
      expect(dialog.style.opacity).toBe('1')
    })

    it('closing resets dialog to scale(0.85) opacity 0', () => {
      const { rerender } = render(<Modal open />)
      flushOpenAnimation()
      rerender(<Modal open={false} />)
      expect(getDialog()!.style.transform).toBe('scale(0.85)')
      expect(getDialog()!.style.opacity).toBe('0')
    })

    it('mask opacity is 0 before animation', () => {
      render(<Modal open />)
      expect(getMask()!.style.opacity).toBe('0')
    })

    it('mask opacity is 1 after animation', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getMask()!.style.opacity).toBe('1')
    })

    it('mask opacity is 0 when closing', () => {
      const { rerender } = render(<Modal open />)
      flushOpenAnimation()
      rerender(<Modal open={false} />)
      expect(getMask()!.style.opacity).toBe('0')
    })
  })

  // ==========================================================================
  // afterOpenChange
  // ==========================================================================

  describe('afterOpenChange', () => {
    it('called with true after open transitionEnd', () => {
      const fn = vi.fn()
      render(<Modal open afterOpenChange={fn} />)
      flushOpenAnimation()
      fireEvent.transitionEnd(getDialog()!)
      expect(fn).toHaveBeenCalledWith(true)
    })

    it('called with false after close transitionEnd', () => {
      const fn = vi.fn()
      const { rerender } = render(<Modal open afterOpenChange={fn} />)
      flushOpenAnimation()
      rerender(<Modal open={false} afterOpenChange={fn} />)
      fireEvent.transitionEnd(getDialog()!)
      expect(fn).toHaveBeenCalledWith(false)
    })
  })

  // ==========================================================================
  // Title / Header
  // ==========================================================================

  describe('title and header', () => {
    it('no header when title is not provided', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getHeader()).toBeNull()
    })

    it('renders title text', () => {
      render(<Modal open title="My Title" />)
      flushOpenAnimation()
      expect(getDialog()!.textContent).toContain('My Title')
    })

    it('renders ReactNode title', () => {
      render(<Modal open title={<span data-testid="title-node">Node</span>} />)
      expect(document.body.querySelector('[data-testid="title-node"]')).toBeTruthy()
    })

    it('header has borderBottom', () => {
      render(<Modal open title="T" />)
      flushOpenAnimation()
      expect(getHeader()!.style.borderBottom).toContain('solid')
    })

    it('title has fontWeight 600', () => {
      render(<Modal open title="T" />)
      flushOpenAnimation()
      const titleDiv = getHeader()!.firstElementChild as HTMLElement
      expect(titleDiv.style.fontWeight).toBe('600')
    })

    it('title has paddingRight when closable=true', () => {
      render(<Modal open title="T" closable />)
      flushOpenAnimation()
      const titleDiv = getHeader()!.firstElementChild as HTMLElement
      expect(titleDiv.style.paddingRight).not.toBe('0px')
    })

    it('title has paddingRight 0 when closable=false', () => {
      render(<Modal open title="T" closable={false} />)
      flushOpenAnimation()
      const titleDiv = getHeader()!.firstElementChild as HTMLElement
      expect(titleDiv.style.paddingRight).toBe('0px')
    })
  })

  // ==========================================================================
  // Body
  // ==========================================================================

  describe('body', () => {
    it('renders children in body', () => {
      render(<Modal open><span data-testid="content">Hello</span></Modal>)
      expect(document.body.querySelector('[data-testid="content"]')).toBeTruthy()
    })

    it('body has overflowY auto', () => {
      render(<Modal open>content</Modal>)
      flushOpenAnimation()
      expect(getBody()!.style.overflowY).toBe('auto')
    })

    it('loading=true shows skeleton instead of children', () => {
      render(
        <Modal open loading>
          <span data-testid="child">child</span>
        </Modal>,
      )
      flushOpenAnimation()
      expect(document.body.querySelector('[data-testid="child"]')).toBeNull()
      expect(getBody()!.querySelector('[style*="animation"]')).toBeTruthy()
    })

    it('loading=false shows children', () => {
      render(
        <Modal open loading={false}>
          <span data-testid="child">child</span>
        </Modal>,
      )
      expect(document.body.querySelector('[data-testid="child"]')).toBeTruthy()
    })

    it('body has padding', () => {
      render(<Modal open>content</Modal>)
      flushOpenAnimation()
      expect(getBody()!.style.padding).toBeTruthy()
    })
  })

  // ==========================================================================
  // Footer
  // ==========================================================================

  describe('footer', () => {
    it('default footer has Cancel and OK buttons', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getFooter()!.querySelectorAll('button').length).toBe(2)
    })

    it('footer=null hides footer', () => {
      render(<Modal open footer={null} />)
      flushOpenAnimation()
      expect(getFooter()).toBeNull()
    })

    it('footer ReactNode renders custom content', () => {
      render(<Modal open footer={<span data-testid="custom-footer">Custom</span>} />)
      expect(document.body.querySelector('[data-testid="custom-footer"]')).toBeTruthy()
    })

    it('footer render function receives OkBtn and CancelBtn', () => {
      const fn = vi.fn(() => <span data-testid="fn-footer">fn</span>)
      render(<Modal open footer={fn} />)
      expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({ OkBtn: expect.any(Function), CancelBtn: expect.any(Function) }),
      )
    })

    it('default cancel button text is "Cancel"', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getCancelButton()!.textContent).toBe('Cancel')
    })

    it('default OK button text is "OK"', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getOkButton()!.textContent).toBe('OK')
    })

    it('okText customizes OK button', () => {
      render(<Modal open okText="Confirm" />)
      flushOpenAnimation()
      expect(getOkButton()!.textContent).toContain('Confirm')
    })

    it('cancelText customizes Cancel button', () => {
      render(<Modal open cancelText="Nope" />)
      flushOpenAnimation()
      expect(getCancelButton()!.textContent).toBe('Nope')
    })

    it('clicking Cancel calls onClose', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      flushOpenAnimation()
      fireEvent.click(getCancelButton()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('clicking OK calls onOk', () => {
      const onOk = vi.fn()
      render(<Modal open onOk={onOk} />)
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      expect(onOk).toHaveBeenCalled()
    })

    it('footer has borderTop', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getFooter()!.style.borderTop).toContain('solid')
    })

    it('okButtonProps spreads onto OK button', () => {
      render(<Modal open okButtonProps={{ 'data-testid': 'ok-btn' }} />)
      expect(document.body.querySelector('[data-testid="ok-btn"]')).toBeTruthy()
    })

    it('cancelButtonProps spreads onto Cancel button', () => {
      render(<Modal open cancelButtonProps={{ 'data-testid': 'cancel-btn' }} />)
      expect(document.body.querySelector('[data-testid="cancel-btn"]')).toBeTruthy()
    })
  })

  // ==========================================================================
  // Closable
  // ==========================================================================

  describe('closable', () => {
    it('closable=true (default) renders X button', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getCloseButton()).toBeTruthy()
    })

    it('closable=false hides X button', () => {
      render(<Modal open closable={false} />)
      flushOpenAnimation()
      expect(getCloseButton()).toBeNull()
    })

    it('clicking X calls onClose', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      flushOpenAnimation()
      fireEvent.click(getCloseButton()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('custom closeIcon renders', () => {
      render(<Modal open closeIcon={<span data-testid="x-icon">X</span>} />)
      expect(document.body.querySelector('[data-testid="x-icon"]')).toBeTruthy()
    })

    it('X button is absolutely positioned', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getCloseButton()!.style.position).toBe('absolute')
    })

    it('X button hover changes color', () => {
      render(<Modal open />)
      flushOpenAnimation()
      const btn = getCloseButton()!
      const colorBefore = btn.style.color
      fireEvent.mouseEnter(btn)
      expect(btn.style.color).not.toBe(colorBefore)
      fireEvent.mouseLeave(btn)
      expect(btn.style.color).toBe(colorBefore)
    })
  })

  // ==========================================================================
  // Mask
  // ==========================================================================

  describe('mask', () => {
    it('mask=true (default) renders mask div', () => {
      render(<Modal open />)
      expect(getMask()).toBeTruthy()
    })

    it('mask=false hides mask', () => {
      render(<Modal open mask={false} />)
      expect(getMask()).toBeNull()
    })

    it('clicking mask calls onClose when maskClosable=true', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      flushOpenAnimation()
      fireEvent.click(getMask()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('maskClosable=false: clicking mask does not call onClose', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} maskClosable={false} />)
      flushOpenAnimation()
      fireEvent.click(getMask()!)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('clicking scroll container background calls onClose (maskClosable=true)', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      flushOpenAnimation()
      fireEvent.click(getScrollContainer()!)
      expect(onClose).toHaveBeenCalled()
    })

    it('mask={ blur: true } adds backdropFilter', () => {
      render(<Modal open mask={{ blur: true }} />)
      expect(getMask()!.style.backdropFilter).toContain('blur')
    })

    it('mask={ blur: false } has no backdropFilter', () => {
      render(<Modal open mask={{ blur: false }} />)
      expect(getMask()!.style.backdropFilter).toBeFalsy()
    })
  })

  // ==========================================================================
  // Keyboard
  // ==========================================================================

  describe('keyboard', () => {
    it('ESC calls onClose (keyboard=true default)', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalled()
    })

    it('keyboard=false: ESC does not call onClose', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} keyboard={false} />)
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('other keys do not call onClose', () => {
      const onClose = vi.fn()
      render(<Modal open onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Enter' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Centered
  // ==========================================================================

  describe('centered', () => {
    it('centered=false (default): scroll container aligns flex-start', () => {
      render(<Modal open />)
      expect(getScrollContainer()!.style.alignItems).toBe('flex-start')
    })

    it('centered=true: scroll container aligns center', () => {
      render(<Modal open centered />)
      expect(getScrollContainer()!.style.alignItems).toBe('center')
    })

    it('centered=true: dialog has maxHeight', () => {
      render(<Modal open centered />)
      flushOpenAnimation()
      expect(getDialog()!.style.maxHeight).toBeTruthy()
    })

    it('centered=false: dialog has no maxHeight', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getDialog()!.style.maxHeight).toBeFalsy()
    })
  })

  // ==========================================================================
  // Width
  // ==========================================================================

  describe('width', () => {
    it('default width is 32rem', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getDialog()!.style.width).toBe('32rem')
    })

    it('custom string width', () => {
      render(<Modal open width="50rem" />)
      flushOpenAnimation()
      expect(getDialog()!.style.width).toBe('50rem')
    })

    it('custom numeric width (converted to px)', () => {
      render(<Modal open width={600} />)
      flushOpenAnimation()
      expect(getDialog()!.style.width).toBe('600px')
    })
  })

  // ==========================================================================
  // confirmLoading
  // ==========================================================================

  describe('confirmLoading', () => {
    it('OK button is disabled when confirmLoading=true', () => {
      render(<Modal open confirmLoading />)
      flushOpenAnimation()
      expect(getOkButton()!.disabled).toBe(true)
    })

    it('spinner SVG is shown in OK button when confirmLoading', () => {
      render(<Modal open confirmLoading />)
      flushOpenAnimation()
      expect(getFooter()!.querySelector('[style*="j-modal-spin"]')).toBeTruthy()
    })

    it('OK button opacity is 0.7 when confirmLoading', () => {
      render(<Modal open confirmLoading />)
      flushOpenAnimation()
      expect(getOkButton()!.style.opacity).toBe('0.7')
    })

    it('OK button is not disabled without confirmLoading', () => {
      render(<Modal open />)
      flushOpenAnimation()
      expect(getOkButton()!.disabled).toBe(false)
    })
  })

  // ==========================================================================
  // destroyOnClose
  // ==========================================================================

  describe('destroyOnClose', () => {
    it('destroyOnClose=false (default): portal stays hidden after close', () => {
      const { rerender } = render(<Modal open />)
      flushOpenAnimation()
      rerender(<Modal open={false} />)
      fireEvent.transitionEnd(getDialog()!)
      expect(getPortalWrapper()!.style.display).toBe('none')
    })

    it('destroyOnClose=true: dialog unmounts after close transitionEnd', () => {
      const { rerender } = render(<Modal open destroyOnClose />)
      flushOpenAnimation()
      rerender(<Modal open={false} destroyOnClose />)
      fireEvent.transitionEnd(getDialog()!)
      expect(getDialog()).toBeNull()
    })
  })

  // ==========================================================================
  // Body scroll lock
  // ==========================================================================

  describe('body scroll lock', () => {
    it('sets body overflow to hidden when mounted', () => {
      render(<Modal open />)
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body overflow after close', () => {
      const { rerender } = render(<Modal open />)
      rerender(<Modal open={false} />)
      fireEvent.transitionEnd(getDialog()!)
      expect(document.body.style.overflow).not.toBe('hidden')
    })
  })

  // ==========================================================================
  // zIndex
  // ==========================================================================

  describe('zIndex', () => {
    it('default zIndex is 1000', () => {
      render(<Modal open />)
      expect(getPortalWrapper()!.style.zIndex).toBe('1000')
    })

    it('custom zIndex applied', () => {
      render(<Modal open zIndex={9999} />)
      expect(getPortalWrapper()!.style.zIndex).toBe('9999')
    })
  })

  // ==========================================================================
  // modalRender
  // ==========================================================================

  describe('modalRender', () => {
    it('wraps dialog with custom render function', () => {
      const modalRender = (node: React.ReactNode) => (
        <div data-testid="wrapper">{node}</div>
      )
      render(<Modal open modalRender={modalRender} />)
      expect(document.body.querySelector('[data-testid="wrapper"]')).toBeTruthy()
    })
  })

  // ==========================================================================
  // Semantic classNames
  // ==========================================================================

  describe('semantic classNames', () => {
    it('classNames.root applies to dialog', () => {
      render(<Modal open classNames={{ root: 'my-root' }} />)
      expect(getDialog()!.className).toContain('my-root')
    })

    it('classNames.mask applies to mask element', () => {
      render(<Modal open classNames={{ mask: 'my-mask' }} />)
      expect(getMask()!.className).toContain('my-mask')
    })

    it('classNames.header applies to header', () => {
      render(<Modal open title="T" classNames={{ header: 'my-header' }} />)
      flushOpenAnimation()
      expect(getHeader()!.className).toContain('my-header')
    })

    it('classNames.body applies to body', () => {
      render(<Modal open classNames={{ body: 'my-body' }} />)
      flushOpenAnimation()
      expect(getBody()!.className).toContain('my-body')
    })

    it('classNames.footer applies to footer', () => {
      render(<Modal open classNames={{ footer: 'my-footer' }} />)
      flushOpenAnimation()
      expect(getFooter()!.className).toContain('my-footer')
    })

    it('classNames.closeBtn applies to X button', () => {
      render(<Modal open classNames={{ closeBtn: 'my-close' }} />)
      flushOpenAnimation()
      expect(getCloseButton()!.className).toContain('my-close')
    })
  })

  // ==========================================================================
  // Semantic styles
  // ==========================================================================

  describe('semantic styles', () => {
    it('styles.root merges into dialog', () => {
      render(<Modal open styles={{ root: { letterSpacing: '2px' } }} />)
      flushOpenAnimation()
      expect(getDialog()!.style.letterSpacing).toBe('2px')
    })

    it('styles.content merges into dialog', () => {
      render(<Modal open styles={{ content: { padding: '3rem' } }} />)
      flushOpenAnimation()
      // padding is not a default contentStyle property, so it comes from styles.content
      expect(getDialog()!.style.padding).toBe('3rem')
    })

    it('styles.mask merges into mask', () => {
      render(<Modal open styles={{ mask: { borderRadius: '8px' } }} />)
      expect(getMask()!.style.borderRadius).toBe('8px')
    })

    it('styles.header merges into header', () => {
      render(<Modal open title="T" styles={{ header: { padding: '2rem' } }} />)
      flushOpenAnimation()
      expect(getHeader()!.style.padding).toBe('2rem')
    })

    it('styles.body merges into body', () => {
      render(<Modal open styles={{ body: { padding: '3rem' } }} />)
      flushOpenAnimation()
      expect(getBody()!.style.padding).toBe('3rem')
    })

    it('styles.footer merges into footer', () => {
      render(<Modal open styles={{ footer: { gap: '2rem' } }} />)
      flushOpenAnimation()
      expect(getFooter()!.style.gap).toBe('2rem')
    })

    it('styles.closeBtn merges into X button', () => {
      render(<Modal open styles={{ closeBtn: { padding: '1rem' } }} />)
      flushOpenAnimation()
      expect(getCloseButton()!.style.padding).toBe('1rem')
    })
  })

  // ==========================================================================
  // className / style
  // ==========================================================================

  describe('className and style', () => {
    it('className merges into dialog', () => {
      render(<Modal open className="my-dialog" />)
      expect(getDialog()!.className).toContain('my-dialog')
    })

    it('style merges into dialog', () => {
      render(<Modal open style={{ maxWidth: '300px' }} />)
      flushOpenAnimation()
      expect(getDialog()!.style.maxWidth).toBe('300px')
    })
  })
})

// ============================================================================
// useModal hook
// ============================================================================

describe('useModal', () => {
  let modalApiRef: ModalHookApi

  function Wrapper() {
    const [api, contextHolder] = useModal()
    modalApiRef = api
    return <div>{contextHolder}</div>
  }

  // ==========================================================================
  // Basic
  // ==========================================================================

  describe('basic', () => {
    it('renders no dialogs initially', () => {
      render(<Wrapper />)
      expect(getDialog()).toBeNull()
    })

    it('returns an api with all methods', () => {
      render(<Wrapper />)
      expect(typeof modalApiRef.confirm).toBe('function')
      expect(typeof modalApiRef.info).toBe('function')
      expect(typeof modalApiRef.success).toBe('function')
      expect(typeof modalApiRef.warning).toBe('function')
      expect(typeof modalApiRef.error).toBe('function')
      expect(typeof modalApiRef.destroyAll).toBe('function')
    })
  })

  // ==========================================================================
  // Opening dialogs
  // ==========================================================================

  describe('opening dialogs', () => {
    it('api.confirm opens a dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'Are you sure?' }) })
      expect(getDialog()).toBeTruthy()
    })

    it('api.info opens a dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'Info' }) })
      expect(getDialog()).toBeTruthy()
    })

    it('api.success opens a dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.success({ title: 'Success' }) })
      expect(getDialog()).toBeTruthy()
    })

    it('api.warning opens a dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.warning({ title: 'Warning' }) })
      expect(getDialog()).toBeTruthy()
    })

    it('api.error opens a dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.error({ title: 'Error' }) })
      expect(getDialog()).toBeTruthy()
    })

    it('multiple dialogs can be open simultaneously', () => {
      render(<Wrapper />)
      act(() => {
        modalApiRef.info({ title: 'A' })
        modalApiRef.info({ title: 'B' })
      })
      expect(document.body.querySelectorAll('[role="dialog"]').length).toBe(2)
    })
  })

  // ==========================================================================
  // Confirm type layout
  // ==========================================================================

  describe('confirm type layout', () => {
    it('confirm type shows both Cancel and OK buttons', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T' }) })
      flushOpenAnimation()
      expect(getCancelButton()).toBeTruthy()
      expect(getOkButton()).toBeTruthy()
    })

    it('info type shows only OK (no Cancel)', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'T' }) })
      flushOpenAnimation()
      expect(getCancelButton()).toBeNull()
      expect(getOkButton()).toBeTruthy()
    })

    it('success/warning/error types show only OK', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.success({ title: 'T' }) })
      flushOpenAnimation()
      expect(getCancelButton()).toBeNull()
    })
  })

  // ==========================================================================
  // onOk (sync)
  // ==========================================================================

  describe('onOk sync', () => {
    it('clicking OK calls onOk', () => {
      const onOk = vi.fn()
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onOk }) })
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      expect(onOk).toHaveBeenCalled()
    })

    it('clicking OK closes dialog after sync onOk', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onOk: vi.fn() }) })
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      expect(getDialog()!.style.opacity).toBe('0')
    })
  })

  // ==========================================================================
  // onOk (async)
  // ==========================================================================

  describe('onOk async', () => {
    it('shows confirmLoading while async onOk is pending', async () => {
      let resolve!: () => void
      const promise = new Promise<void>((r) => { resolve = r })
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onOk: () => promise }) })
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      expect(getOkButton()!.disabled).toBe(true)
      await act(async () => { resolve(); await promise })
    })

    it('closes after async onOk resolves', async () => {
      let resolve!: () => void
      const promise = new Promise<void>((r) => { resolve = r })
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onOk: () => promise }) })
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      await act(async () => { resolve(); await promise })
      expect(getDialog()!.style.opacity).toBe('0')
    })

    it('clears confirmLoading if async onOk rejects', async () => {
      let reject!: () => void
      const promise = new Promise<void>((_, r) => { reject = r })
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onOk: () => promise }) })
      flushOpenAnimation()
      fireEvent.click(getOkButton()!)
      await act(async () => { reject(); await promise.catch(() => {}) })
      expect(getOkButton()!.disabled).toBe(false)
    })
  })

  // ==========================================================================
  // onCancel
  // ==========================================================================

  describe('onCancel', () => {
    it('clicking Cancel calls onCancel', () => {
      const onCancel = vi.fn()
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T', onCancel }) })
      flushOpenAnimation()
      fireEvent.click(getCancelButton()!)
      expect(onCancel).toHaveBeenCalled()
    })

    it('clicking Cancel closes dialog', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T' }) })
      flushOpenAnimation()
      fireEvent.click(getCancelButton()!)
      expect(getDialog()!.style.opacity).toBe('0')
    })
  })

  // ==========================================================================
  // Instance methods
  // ==========================================================================

  describe('instance destroy', () => {
    it('destroy() closes the dialog', () => {
      render(<Wrapper />)
      let instance: ReturnType<ModalHookApi['info']>
      act(() => { instance = modalApiRef.info({ title: 'T' }) })
      flushOpenAnimation()
      act(() => { instance.destroy() })
      expect(getDialog()!.style.opacity).toBe('0')
    })
  })

  describe('instance update', () => {
    it('update() changes dialog title', () => {
      render(<Wrapper />)
      let instance: ReturnType<ModalHookApi['info']>
      act(() => { instance = modalApiRef.info({ title: 'Original' }) })
      act(() => { instance.update({ title: 'Updated' }) })
      expect(getDialog()!.textContent).toContain('Updated')
    })

    it('update() changes dialog content', () => {
      render(<Wrapper />)
      let instance: ReturnType<ModalHookApi['info']>
      act(() => { instance = modalApiRef.info({ title: 'T', content: 'Old content' }) })
      act(() => { instance.update({ content: 'New content' }) })
      expect(getDialog()!.textContent).toContain('New content')
    })
  })

  // ==========================================================================
  // destroyAll
  // ==========================================================================

  describe('destroyAll', () => {
    it('destroyAll closes all open dialogs', () => {
      render(<Wrapper />)
      act(() => {
        modalApiRef.info({ title: 'A' })
        modalApiRef.info({ title: 'B' })
      })
      act(() => { modalApiRef.destroyAll() })
      document.body.querySelectorAll('[role="dialog"]').forEach((d) => {
        expect((d as HTMLElement).style.opacity).toBe('0')
      })
    })
  })

  // ==========================================================================
  // Content
  // ==========================================================================

  describe('content', () => {
    it('renders dialog title', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'Hello Dialog' }) })
      expect(getDialog()!.textContent).toContain('Hello Dialog')
    })

    it('renders dialog content text', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'T', content: 'Detailed content' }) })
      expect(getDialog()!.textContent).toContain('Detailed content')
    })

    it('custom icon renders', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'T', icon: <span data-testid="ci">!</span> }) })
      expect(document.body.querySelector('[data-testid="ci"]')).toBeTruthy()
    })
  })

  // ==========================================================================
  // Bordered
  // ==========================================================================

  describe('bordered', () => {
    it('non-confirm types have a colored border by default', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'T' }) })
      expect(getDialog()!.style.border).toContain('solid')
    })

    it('confirm type has no colored border', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.confirm({ title: 'T' }) })
      // bordered=false for confirm type → no border applied to contentStyle
      expect(getDialog()!.style.border).toBeFalsy()
    })

    it('bordered=false suppresses border for non-confirm types', () => {
      render(<Wrapper />)
      act(() => { modalApiRef.info({ title: 'T', bordered: false }) })
      expect(getDialog()!.style.border).toBeFalsy()
    })
  })
})
