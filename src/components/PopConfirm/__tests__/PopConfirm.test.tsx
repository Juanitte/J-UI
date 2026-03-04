import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { PopConfirm } from '../PopConfirm'

// ============================================================================
// Helpers
// ============================================================================

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] })
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

/** The portaled popup container (position:fixed, zIndex:9999) */
function getPopup(): HTMLElement | null {
  return (
    (Array.from(document.body.children).find((el) => {
      const s = (el as HTMLElement).style
      return s.position === 'fixed' && s.zIndex === '9999'
    }) as HTMLElement | undefined) ?? null
  )
}

/** The card inside the popup */
function getCard(): HTMLElement | null {
  const popup = getPopup()
  if (!popup) return null
  return popup.firstElementChild as HTMLElement | null
}

/**
 * The confirmRoot div (padding:0.75rem) inside:
 * popup > card > contentArea(padding:0) > confirmRoot
 */
function getConfirmRoot(): HTMLElement | null {
  const card = getCard()
  if (!card) return null
  const contentArea = card.firstElementChild as HTMLElement | null
  if (!contentArea) return null
  return contentArea.firstElementChild as HTMLElement | null
}

/** First DIV child of confirmRoot (message row: icon + title/description) */
function getMessageRow(): HTMLElement | null {
  const root = getConfirmRoot()
  if (!root) return null
  const divChildren = Array.from(root.children).filter((c) => c.tagName === 'DIV') as HTMLElement[]
  return divChildren[0] ?? null
}

/** Second DIV child of confirmRoot (button row) */
function getButtonRow(): HTMLElement | null {
  const root = getConfirmRoot()
  if (!root) return null
  const divChildren = Array.from(root.children).filter((c) => c.tagName === 'DIV') as HTMLElement[]
  return divChildren[1] ?? null
}

/** The div container holding title + description (sibling of iconSpan) */
function getTextContainer(): HTMLElement | null {
  const msgRow = getMessageRow()
  if (!msgRow) return null
  return Array.from(msgRow.children).find((c) => c.tagName === 'DIV') as HTMLElement | null
}

/** First child of textContainer — the title div */
function getTitleDiv(): HTMLElement | null {
  const tc = getTextContainer()
  if (!tc) return null
  return tc.firstElementChild as HTMLElement | null
}

/** Second child of textContainer — the description div (if rendered) */
function getDescriptionDiv(): HTMLElement | null {
  const tc = getTextContainer()
  if (!tc) return null
  return (tc.children[1] as HTMLElement) ?? null
}

/** The icon span (first span inside messageRow) */
function getIconSpan(): HTMLElement | null {
  const msgRow = getMessageRow()
  if (!msgRow) return null
  return msgRow.querySelector('span') as HTMLElement | null
}

/** The OK button (last button in buttonRow) */
function getOkButton(): HTMLButtonElement | null {
  const row = getButtonRow()
  if (!row) return null
  const buttons = Array.from(row.querySelectorAll('button'))
  return (buttons[buttons.length - 1] as HTMLButtonElement) ?? null
}

/** The Cancel button (first button in buttonRow when two buttons exist) */
function getCancelButton(): HTMLButtonElement | null {
  const row = getButtonRow()
  if (!row) return null
  const buttons = Array.from(row.querySelectorAll('button'))
  return buttons.length >= 2 ? (buttons[0] as HTMLButtonElement) : null
}

/** The arrow element inside the popup */
function getArrow(): HTMLElement | null {
  const popup = getPopup()
  if (!popup) return null
  return (
    (Array.from(popup.children) as HTMLElement[]).find(
      (c) => c.style.position === 'absolute' && c.style.width === '0.5rem',
    ) ?? null
  )
}

/** Popover trigger root (container.firstElementChild) */
function getTrigger(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

/** Click trigger and flush Popover's setTimeout(0) to open popup */
function openPopup(container: HTMLElement) {
  fireEvent.click(getTrigger(container))
  act(() => { vi.advanceTimersByTime(0) })
}

// ============================================================================
// Tests
// ============================================================================

describe('PopConfirm', () => {
  // ── Basic rendering ──────────────────────────────────────────────────────

  describe('basic rendering', () => {
    it('renders trigger children', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(container.querySelector('button')?.textContent).toBe('Delete')
    })

    it('popup is not visible initially', () => {
      render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(getPopup()).toBeNull()
    })

    it('popup appears after click', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getPopup()).not.toBeNull()
    })

    it('popup disappears after cancel click', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getCancelButton()!)
      expect(getPopup()).toBeNull()
    })

    it('popup disappears after ok click', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => {}}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getPopup()).toBeNull()
    })
  })

  // ── Title ────────────────────────────────────────────────────────────────

  describe('title', () => {
    it('renders title text', () => {
      const { container } = render(
        <PopConfirm title="Delete this item?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getTitleDiv()?.textContent).toBe('Delete this item?')
    })

    it('title has fontWeight 600', () => {
      const { container } = render(
        <PopConfirm title="Delete this item?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getTitleDiv()?.style.fontWeight).toBe('600')
    })

    it('title has fontSize 0.875rem', () => {
      const { container } = render(
        <PopConfirm title="Delete this item?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getTitleDiv()?.style.fontSize).toBe('0.875rem')
    })
  })

  // ── Description ──────────────────────────────────────────────────────────

  describe('description', () => {
    it('description not rendered when not provided', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      const tc = getTextContainer()
      expect(tc?.children.length).toBe(1)
    })

    it('renders description text', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" description="This cannot be undone.">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getDescriptionDiv()?.textContent).toBe('This cannot be undone.')
    })

    it('description has fontSize 0.8125rem', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" description="Details here.">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getDescriptionDiv()?.style.fontSize).toBe('0.8125rem')
    })

    it('description has marginTop 0.25rem', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" description="Details here.">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getDescriptionDiv()?.style.marginTop).toBe('0.25rem')
    })
  })

  // ── Icon ─────────────────────────────────────────────────────────────────

  describe('icon', () => {
    it('renders default warning icon (SVG) by default', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getIconSpan()?.querySelector('svg')).not.toBeNull()
    })

    it('renders custom icon', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" icon={<span data-testid="custom-icon">!</span>}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getMessageRow()?.querySelector('[data-testid="custom-icon"]')).not.toBeNull()
    })

    it('icon=null hides icon span', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" icon={null}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getIconSpan()).toBeNull()
    })

    it('icon span has warning color', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getIconSpan()?.style.color).toBeTruthy()
    })
  })

  // ── Cancel button ────────────────────────────────────────────────────────

  describe('cancel button', () => {
    it('shows cancel button by default', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()).not.toBeNull()
    })

    it('showCancel=false hides cancel button', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" showCancel={false}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()).toBeNull()
    })

    it('default cancelText is "Cancel"', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()?.textContent).toBe('Cancel')
    })

    it('custom cancelText', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" cancelText="No">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()?.textContent).toBe('No')
    })

    it('calls onCancel when cancel clicked', () => {
      const onCancel = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" onCancel={onCancel}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getCancelButton()!)
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  // ── OK button ────────────────────────────────────────────────────────────

  describe('ok button', () => {
    it('default okText is "OK"', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getOkButton()?.textContent).toBe('OK')
    })

    it('custom okText', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" okText="Yes">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getOkButton()?.textContent).toBe('Yes')
    })

    it('ok button closes popup (sync onConfirm)', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getPopup()).toBeNull()
    })

    it('calls onConfirm when ok clicked', () => {
      const onConfirm = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={onConfirm}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('onConfirm is optional — ok click still closes popup', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(() => fireEvent.click(getOkButton()!)).not.toThrow()
      expect(getPopup()).toBeNull()
    })
  })

  // ── Confirm async ────────────────────────────────────────────────────────

  describe('confirm async', () => {
    it('shows spinner while promise is pending', async () => {
      let resolveConfirm!: () => void
      const confirmPromise = new Promise<void>((res) => { resolveConfirm = res })
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => confirmPromise}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getOkButton()?.querySelector('svg')).not.toBeNull()
      await act(async () => { resolveConfirm(); await confirmPromise })
    })

    it('ok button is disabled while loading', async () => {
      let resolveConfirm!: () => void
      const confirmPromise = new Promise<void>((res) => { resolveConfirm = res })
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => confirmPromise}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getOkButton()?.disabled).toBe(true)
      await act(async () => { resolveConfirm(); await confirmPromise })
    })

    it('ok button has opacity 0.7 while loading', async () => {
      let resolveConfirm!: () => void
      const confirmPromise = new Promise<void>((res) => { resolveConfirm = res })
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => confirmPromise}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getOkButton()?.style.opacity).toBe('0.7')
      await act(async () => { resolveConfirm(); await confirmPromise })
    })

    it('popup closes when promise resolves', async () => {
      let resolveConfirm!: () => void
      const confirmPromise = new Promise<void>((res) => { resolveConfirm = res })
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => confirmPromise}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      expect(getPopup()).not.toBeNull()
      await act(async () => { resolveConfirm(); await confirmPromise })
      expect(getPopup()).toBeNull()
    })

    it('popup stays open when promise rejects', async () => {
      let rejectConfirm!: () => void
      const confirmPromise = new Promise<void>((_, rej) => { rejectConfirm = rej })
      const { container } = render(
        <PopConfirm title="Are you sure?" onConfirm={() => confirmPromise}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getOkButton()!)
      await act(async () => {
        rejectConfirm()
        await confirmPromise.catch(() => {})
      })
      expect(getPopup()).not.toBeNull()
    })
  })

  // ── Disabled ─────────────────────────────────────────────────────────────

  describe('disabled', () => {
    it('disabled=true prevents popup from opening', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" disabled>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getPopup()).toBeNull()
    })

    it('disabled=false (default) allows opening', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getPopup()).not.toBeNull()
    })
  })

  // ── Controlled open ──────────────────────────────────────────────────────

  describe('controlled open', () => {
    it('open=true shows popup without click', () => {
      render(
        <PopConfirm title="Are you sure?" open={true}>
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(getPopup()).not.toBeNull()
    })

    it('open=false keeps popup hidden', () => {
      render(
        <PopConfirm title="Are you sure?" open={false}>
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(getPopup()).toBeNull()
    })

    it('click calls onOpenChange but does not change state when controlled', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" open={false} onOpenChange={onOpenChange}>
          <button>Delete</button>
        </PopConfirm>,
      )
      fireEvent.click(getTrigger(container))
      act(() => { vi.advanceTimersByTime(0) })
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(getPopup()).toBeNull()
    })
  })

  // ── onOpenChange ─────────────────────────────────────────────────────────

  describe('onOpenChange', () => {
    it('called with true when popup opens', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" onOpenChange={onOpenChange}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it('called with false when cancel clicked', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" onOpenChange={onOpenChange}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      onOpenChange.mockClear()
      fireEvent.click(getCancelButton()!)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('called with false when ok clicked', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <PopConfirm title="Are you sure?" onOpenChange={onOpenChange}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      onOpenChange.mockClear()
      fireEvent.click(getOkButton()!)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  // ── Arrow ─────────────────────────────────────────────────────────────────

  describe('arrow', () => {
    it('arrow=true (default) renders arrow', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getArrow()).not.toBeNull()
    })

    it('arrow=false hides arrow', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" arrow={false}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getArrow()).toBeNull()
    })
  })

  // ── okButtonProps ─────────────────────────────────────────────────────────

  describe('okButtonProps', () => {
    it('spreads extra attributes onto ok button', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" okButtonProps={{ 'data-testid': 'ok-btn' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getOkButton()?.getAttribute('data-testid')).toBe('ok-btn')
    })

    it('merges style into ok button', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" okButtonProps={{ style: { color: 'red' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getOkButton()?.style.color).toBe('red')
    })
  })

  // ── cancelButtonProps ─────────────────────────────────────────────────────

  describe('cancelButtonProps', () => {
    it('spreads extra attributes onto cancel button', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" cancelButtonProps={{ 'data-testid': 'cancel-btn' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()?.getAttribute('data-testid')).toBe('cancel-btn')
    })

    it('merges style into cancel button', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" cancelButtonProps={{ style: { color: 'blue' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getCancelButton()?.style.color).toBe('blue')
    })
  })

  // ── Click isolation ───────────────────────────────────────────────────────

  describe('click isolation', () => {
    it('clicking confirm content area does not close popup', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.click(getConfirmRoot()!)
      expect(getPopup()).not.toBeNull()
    })

    it('clicking outside closes popup', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?">
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      fireEvent.mouseDown(document.body)
      act(() => { vi.advanceTimersByTime(200) })
      expect(getPopup()).toBeNull()
    })
  })

  // ── classNames ────────────────────────────────────────────────────────────

  describe('classNames', () => {
    it('classNames.root applied to confirm root', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" classNames={{ root: 'test-root' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getConfirmRoot()?.classList.contains('test-root')).toBe(true)
    })

    it('classNames.icon applied to icon span', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" classNames={{ icon: 'test-icon' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getIconSpan()?.classList.contains('test-icon')).toBe(true)
    })

    it('classNames.title applied to title div', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" classNames={{ title: 'test-title' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getTitleDiv()?.classList.contains('test-title')).toBe(true)
    })

    it('classNames.description applied to description div', () => {
      const { container } = render(
        <PopConfirm
          title="Are you sure?"
          description="Details."
          classNames={{ description: 'test-desc' }}
        >
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getDescriptionDiv()?.classList.contains('test-desc')).toBe(true)
    })

    it('classNames.buttons applied to button row', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" classNames={{ buttons: 'test-buttons' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getButtonRow()?.classList.contains('test-buttons')).toBe(true)
    })
  })

  // ── styles ────────────────────────────────────────────────────────────────

  describe('styles', () => {
    it('styles.root applied to confirm root', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" styles={{ root: { background: 'red' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getConfirmRoot()?.style.background).toBe('red')
    })

    it('styles.icon applied to icon span', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" styles={{ icon: { color: 'green' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getIconSpan()?.style.color).toBe('green')
    })

    it('styles.title applied to title div', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" styles={{ title: { fontSize: '1rem' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getTitleDiv()?.style.fontSize).toBe('1rem')
    })

    it('styles.description applied to description div', () => {
      const { container } = render(
        <PopConfirm
          title="Are you sure?"
          description="Details."
          styles={{ description: { color: 'blue' } }}
        >
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getDescriptionDiv()?.style.color).toBe('blue')
    })

    it('styles.buttons applied to button row', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" styles={{ buttons: { gap: '1rem' } }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      openPopup(container)
      expect(getButtonRow()?.style.gap).toBe('1rem')
    })
  })

  // ── className / style ─────────────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to trigger root', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" className="my-trigger">
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(getTrigger(container).classList.contains('my-trigger')).toBe(true)
    })

    it('style applied to trigger root', () => {
      const { container } = render(
        <PopConfirm title="Are you sure?" style={{ border: '1px solid red' }}>
          <button>Delete</button>
        </PopConfirm>,
      )
      expect(getTrigger(container).style.border).toBe('1px solid red')
    })
  })
})
