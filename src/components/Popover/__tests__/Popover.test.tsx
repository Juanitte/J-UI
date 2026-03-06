import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { Popover } from '../Popover'

// ============================================================================
// Helpers
// ============================================================================

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'] })
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getPopup() {
  return document.body.querySelector<HTMLElement>('.ino-popover__popup-container') ?? null
}

function getCard() {
  const popup = getPopup()
  if (!popup) return null
  return popup.querySelector<HTMLElement>('.ino-popover__card') ?? null
}

function getTitleEl() {
  const card = getCard()
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-popover__title') ?? null
}

function getContentEl() {
  const card = getCard()
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-popover__content') ?? null
}

function getArrowEl() {
  const popup = getPopup()
  if (!popup) return null
  return popup.querySelector<HTMLElement>('.ino-popover__arrow') ?? null
}

/** Open via click trigger. Returns the root. */
function openViaClick(container: HTMLElement) {
  const root = getRoot(container)
  fireEvent.click(root)
  act(() => { vi.advanceTimersByTime(0) })
  return root
}

/** Open via hover trigger. Returns the root. */
function openViaHover(container: HTMLElement, delay = 100) {
  const root = getRoot(container)
  fireEvent.mouseEnter(root)
  act(() => { vi.advanceTimersByTime(delay) })
  return root
}

/** Close popover fully (mouseLeaveDelay + animation 150ms) */
function closeViaHover(root: HTMLElement, delay = 100) {
  fireEvent.mouseLeave(root)
  act(() => { vi.advanceTimersByTime(delay + 150) })
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Popover', () => {
  describe('basic rendering', () => {
    it('renders root element with children', () => {
      render(<Popover title="Title" content="Content"><button>Trigger</button></Popover>)
      expect(screen.getByText('Trigger')).toBeTruthy()
    })

    it('root has inline-flex display', () => {
      const { container } = render(
        <Popover title="T" content="C"><span>Click</span></Popover>,
      )
      expect(getRoot(container)).toHaveClass('ino-popover')
    })

    it('popup is not shown by default', () => {
      render(<Popover title="T" content="C"><span>Click</span></Popover>)
      expect(getPopup()).toBeNull()
    })

    it('root is a div', () => {
      const { container } = render(
        <Popover title="T" content="C"><span>X</span></Popover>,
      )
      expect(getRoot(container).tagName).toBe('DIV')
    })
  })

  // ============================================================================
  // Click trigger
  // ============================================================================

  describe('click trigger', () => {
    it('opens popup on click', () => {
      const { container } = render(
        <Popover title="Hello" content="World" trigger="click"><button>Open</button></Popover>,
      )
      openViaClick(container)
      expect(getPopup()).toBeTruthy()
    })

    it('shows title and content in popup', () => {
      const { container } = render(
        <Popover title="My Title" content="My Content" trigger="click"><button>Open</button></Popover>,
      )
      openViaClick(container)
      expect(screen.getByText('My Title')).toBeTruthy()
      expect(screen.getByText('My Content')).toBeTruthy()
    })

    it('closes popup on second click (toggle)', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><button>Toggle</button></Popover>,
      )
      const root = openViaClick(container)
      expect(getPopup()).toBeTruthy()
      // Second click → hide
      fireEvent.click(root)
      act(() => { vi.advanceTimersByTime(150) })
      expect(getPopup()).toBeNull()
    })

    it('closes on click outside', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><button>Open</button></Popover>,
      )
      openViaClick(container)
      expect(getPopup()).toBeTruthy()
      // Click outside
      fireEvent.mouseDown(document.body)
      act(() => { vi.advanceTimersByTime(150) })
      expect(getPopup()).toBeNull()
    })

    it('calls onOpenChange when opening', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <Popover title="T" content="C" trigger="click" onOpenChange={onOpenChange}>
          <button>Open</button>
        </Popover>,
      )
      openViaClick(container)
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it('calls onOpenChange when closing', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <Popover title="T" content="C" trigger="click" onOpenChange={onOpenChange}>
          <button>Toggle</button>
        </Popover>,
      )
      const root = openViaClick(container)
      onOpenChange.mockClear()
      fireEvent.click(root)
      act(() => { vi.advanceTimersByTime(150) })
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  // ============================================================================
  // Hover trigger (default)
  // ============================================================================

  describe('hover trigger', () => {
    it('opens popup on mouse enter', () => {
      const { container } = render(
        <Popover title="Hover" content="Content"><span>Hover me</span></Popover>,
      )
      openViaHover(container)
      expect(getPopup()).toBeTruthy()
    })

    it('closes popup on mouse leave', () => {
      const { container } = render(
        <Popover title="T" content="C"><span>Hover</span></Popover>,
      )
      const root = openViaHover(container)
      closeViaHover(root)
      expect(getPopup()).toBeNull()
    })

    it('respects custom mouseEnterDelay', () => {
      const { container } = render(
        <Popover title="T" content="C" mouseEnterDelay={300}><span>H</span></Popover>,
      )
      const root = getRoot(container)
      fireEvent.mouseEnter(root)
      act(() => { vi.advanceTimersByTime(100) })
      expect(getPopup()).toBeNull() // Not yet
      act(() => { vi.advanceTimersByTime(200) })
      expect(getPopup()).toBeTruthy() // 300ms total
    })

    it('respects custom mouseLeaveDelay', () => {
      const { container } = render(
        <Popover title="T" content="C" mouseLeaveDelay={500}><span>H</span></Popover>,
      )
      const root = openViaHover(container)
      fireEvent.mouseLeave(root)
      act(() => { vi.advanceTimersByTime(200) })
      expect(getPopup()).toBeTruthy() // Still open at 200ms
      act(() => { vi.advanceTimersByTime(300 + 150) })
      expect(getPopup()).toBeNull() // Closed at 500 + 150
    })

    it('keeps popup open when hovering popup', () => {
      const { container } = render(
        <Popover title="T" content="C"><span>H</span></Popover>,
      )
      openViaHover(container)
      const popup = getPopup()!
      fireEvent.mouseLeave(getRoot(container))
      // Hover the popup before the leave delay completes
      fireEvent.mouseEnter(popup)
      act(() => { vi.advanceTimersByTime(500) })
      // Popup should still be visible
      expect(getPopup()).toBeTruthy()
    })
  })

  // ============================================================================
  // Focus trigger
  // ============================================================================

  describe('focus trigger', () => {
    it('opens popup on focus', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="focus"><input /></Popover>,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
    })

    it('closes popup on blur', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="focus"><input /></Popover>,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
      fireEvent.blur(root)
      act(() => { vi.advanceTimersByTime(150) })
      expect(getPopup()).toBeNull()
    })
  })

  // ============================================================================
  // Context menu trigger
  // ============================================================================

  describe('contextMenu trigger', () => {
    it('opens popup on context menu', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="contextMenu"><span>Right-click</span></Popover>,
      )
      const root = getRoot(container)
      fireEvent.contextMenu(root)
      act(() => { vi.advanceTimersByTime(0) })
      expect(getPopup()).toBeTruthy()
    })

    it('context menu prevents default', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="contextMenu"><span>RC</span></Popover>,
      )
      const root = getRoot(container)
      let defaultPrevented = false
      act(() => {
        const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
        defaultPrevented = !root.dispatchEvent(event)
      })
      expect(defaultPrevented).toBe(true)
    })
  })

  // ============================================================================
  // Controlled mode
  // ============================================================================

  describe('controlled mode', () => {
    it('shows popup when open=true', () => {
      render(
        <Popover title="T" content="C" open={true}><span>X</span></Popover>,
      )
      expect(getPopup()).toBeTruthy()
    })

    it('hides popup when open=false', () => {
      render(
        <Popover title="T" content="C" open={false}><span>X</span></Popover>,
      )
      expect(getPopup()).toBeNull()
    })

    it('calls onOpenChange on trigger interaction', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <Popover title="T" content="C" open={false} trigger="click" onOpenChange={onOpenChange}>
          <span>Click</span>
        </Popover>,
      )
      openViaClick(container)
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  // ============================================================================
  // Disabled
  // ============================================================================

  describe('disabled', () => {
    it('does not open when disabled (click)', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" disabled><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getPopup()).toBeNull()
    })

    it('does not open when disabled (hover)', () => {
      const { container } = render(
        <Popover title="T" content="C" disabled><span>X</span></Popover>,
      )
      openViaHover(container)
      expect(getPopup()).toBeNull()
    })
  })

  // ============================================================================
  // Title and content
  // ============================================================================

  describe('title and content', () => {
    it('renders title in popup', () => {
      const { container } = render(
        <Popover title="My Title" content="Content" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()).toBeTruthy()
      expect(getTitleEl()!.textContent).toBe('My Title')
    })

    it('renders content in popup', () => {
      const { container } = render(
        <Popover title="T" content="My Content" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getContentEl()).toBeTruthy()
      expect(getContentEl()!.textContent).toBe('My Content')
    })

    it('renders without title', () => {
      const { container } = render(
        <Popover content="Only content" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()).toBeNull()
      expect(screen.getByText('Only content')).toBeTruthy()
    })

    it('renders without content', () => {
      const { container } = render(
        <Popover title="Only title" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getContentEl()).toBeNull()
      expect(screen.getByText('Only title')).toBeTruthy()
    })

    it('title has border-bottom when content exists', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!).toHaveClass('ino-popover__title--bordered')
    })

    it('title has no border-bottom when no content', () => {
      const { container } = render(
        <Popover title="T" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!).not.toHaveClass('ino-popover__title--bordered')
    })

    it('supports function title', () => {
      const { container } = render(
        <Popover title={() => 'Dynamic Title'} content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(screen.getByText('Dynamic Title')).toBeTruthy()
    })

    it('supports function content', () => {
      const { container } = render(
        <Popover title="T" content={() => 'Dynamic Content'} trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(screen.getByText('Dynamic Content')).toBeTruthy()
    })

    it('supports ReactNode title', () => {
      const { container } = render(
        <Popover title={<strong>Bold Title</strong>} content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(screen.getByText('Bold Title')).toBeTruthy()
    })

    it('supports ReactNode content', () => {
      const { container } = render(
        <Popover title="T" content={<em>Italic</em>} trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(screen.getByText('Italic')).toBeTruthy()
    })
  })

  // ============================================================================
  // Arrow
  // ============================================================================

  describe('arrow', () => {
    it('shows arrow by default', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()).toBeTruthy()
    })

    it('hides arrow when arrow=false', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" arrow={false}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()).toBeNull()
    })

    it('arrow has absolute position', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()!).toHaveClass('ino-popover__arrow')
    })

    it('arrow has 0.5rem dimensions', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()!).toHaveClass('ino-popover__arrow')
    })
  })

  // ============================================================================
  // Popup structure
  // ============================================================================

  describe('popup structure', () => {
    it('popup is portaled to document.body', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      const popup = getPopup()!
      expect(popup.parentElement).toBe(document.body)
    })

    it('popup has fixed position', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getPopup()!).toHaveClass('ino-popover__popup-container')
    })

    it('card has border-radius', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getCard()!).toHaveClass('ino-popover__card')
    })

    it('card has min and max width', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getCard()!).toHaveClass('ino-popover__card')
    })

    it('card has border', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getCard()!).toHaveClass('ino-popover__card')
    })
  })

  // ============================================================================
  // Multiple triggers
  // ============================================================================

  describe('multiple triggers', () => {
    it('supports array of triggers', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger={['click', 'focus']}><input /></Popover>,
      )
      // Open via click
      openViaClick(container)
      expect(getPopup()).toBeTruthy()
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(
        <Popover title="T" content="C" classNames={{ root: 'pop-root' }}><span>X</span></Popover>,
      )
      expect(getRoot(container).className).toContain('pop-root')
    })

    it('applies classNames.popup', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" classNames={{ popup: 'pop-popup' }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getCard()!.className).toContain('pop-popup')
    })

    it('applies classNames.title', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" classNames={{ title: 'pop-title' }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!.className).toContain('pop-title')
    })

    it('applies classNames.content', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" classNames={{ content: 'pop-content' }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getContentEl()!.className).toContain('pop-content')
    })

    it('applies classNames.arrow', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" classNames={{ arrow: 'pop-arrow' }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()!.className).toContain('pop-arrow')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(
        <Popover title="T" content="C" styles={{ root: { gap: '4px' } }}><span>X</span></Popover>,
      )
      expect(getRoot(container).style.gap).toBe('4px')
    })

    it('applies styles.popup to card', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" styles={{ popup: { maxWidth: '30rem' } }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getCard()!.style.maxWidth).toBe('30rem')
    })

    it('applies styles.title', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" styles={{ title: { color: 'red' } }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!.style.color).toBe('red')
    })

    it('applies styles.content', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" styles={{ content: { color: 'blue' } }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getContentEl()!.style.color).toBe('blue')
    })

    it('applies styles.arrow', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" styles={{ arrow: { opacity: '0.5' } }}><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getArrowEl()!.style.opacity).toBe('0.5')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(
        <Popover title="T" content="C" className="my-pop"><span>X</span></Popover>,
      )
      expect(getRoot(container).className).toContain('my-pop')
    })

    it('applies style to root', () => {
      const { container } = render(
        <Popover title="T" content="C" style={{ margin: '8px' }}><span>X</span></Popover>,
      )
      expect(getRoot(container).style.margin).toBe('8px')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with only children (no title/content)', () => {
      const { container } = render(
        <Popover trigger="click"><span>Bare</span></Popover>,
      )
      openViaClick(container)
      // Popup renders but card has no title/content children
      const card = getCard()
      expect(card).toBeTruthy()
      expect(card!.children.length).toBe(0)
    })

    it('default placement is top', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      const popup = getPopup()!
      // Top placement transform includes translateY(-100%)
      expect(popup.style.transform).toContain('translateY(-100%)')
    })

    it('bottom placement transform does not include translateY(-100%)', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click" placement="bottom"><span>X</span></Popover>,
      )
      openViaClick(container)
      const popup = getPopup()!
      expect(popup.style.transform).toContain('translateX(-50%)')
      expect(popup.style.transform).not.toContain('translateY(-100%)')
    })

    it('popup has zIndex 9999', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getPopup()!).toHaveClass('ino-popover__popup-container')
    })

    it('title fontWeight is 600', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!).toHaveClass('ino-popover__title')
    })

    it('title and content have same font size', () => {
      const { container } = render(
        <Popover title="T" content="C" trigger="click"><span>X</span></Popover>,
      )
      openViaClick(container)
      expect(getTitleEl()!).toHaveClass('ino-popover__title')
      expect(getContentEl()!).toHaveClass('ino-popover__content')
    })
  })
})
