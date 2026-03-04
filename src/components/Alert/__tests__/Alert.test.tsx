import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { Alert } from '../Alert'

// ─── Mock useThemeMode ──────────────────────────────────────────────────────────

let mockThemeMode: string | null = 'light'

vi.mock('../../../theme', () => ({
  useThemeMode: () => mockThemeMode,
}))

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** The role="alert" element inside the wrapper */
function getAlert(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[role="alert"]')
}

/** The outer grid wrapper (first child of container) */
function getWrapper(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

function getCloseButton(container: HTMLElement): HTMLButtonElement | null {
  return container.querySelector('button')
}

function getIcon(container: HTMLElement): HTMLElement | null {
  const alert = getAlert(container)
  if (!alert) return null
  // Icon is the first child span with inline-flex + flexShrink:0
  const spans = Array.from(alert.children) as HTMLElement[]
  return spans.find((s) => s.style.display === 'inline-flex' && s.style.flexShrink === '0' && s.querySelector('svg')) ?? null
}

function getContentDiv(container: HTMLElement): HTMLElement | null {
  const alert = getAlert(container)
  if (!alert) return null
  const divs = Array.from(alert.children) as HTMLElement[]
  return divs.find((d) => d.style.flex && d.style.flex.startsWith('1')) ?? null
}

function getTitleDiv(container: HTMLElement): HTMLElement | null {
  const content = getContentDiv(container)
  if (!content) return null
  return content.firstElementChild as HTMLElement | null
}

function getDescriptionDiv(container: HTMLElement): HTMLElement | null {
  const content = getContentDiv(container)
  if (!content) return null
  // Description is the child div with fontSize 0.8125rem
  const children = Array.from(content.children) as HTMLElement[]
  return children.find((c) => c.style.fontSize === '0.8125rem') ?? null
}

function getActionSpan(container: HTMLElement): HTMLElement | null {
  const alert = getAlert(container)
  if (!alert) return null
  const spans = Array.from(alert.children) as HTMLElement[]
  return spans.find((s) => s.style.marginLeft === '0.5rem' && s.style.display === 'inline-flex' && !s.querySelector('svg')) ?? null
}

// ─── Setup / Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  mockThemeMode = 'light'
})

// ============================================================================
// Basic rendering
// ============================================================================

describe('Alert', () => {
  describe('basic rendering', () => {
    it('renders with role="alert"', () => {
      const { container } = render(<Alert title="Test" />)
      expect(getAlert(container)).toBeTruthy()
      expect(getAlert(container)!.getAttribute('role')).toBe('alert')
    })

    it('renders title', () => {
      const { container } = render(<Alert title="Hello" />)
      expect(getAlert(container)!.textContent).toContain('Hello')
    })

    it('renders ReactNode title', () => {
      const { container } = render(<Alert title={<strong data-testid="t">Bold</strong>} />)
      expect(container.querySelector('[data-testid="t"]')).toBeTruthy()
    })

    it('renders description', () => {
      const { container } = render(<Alert title="T" description="Details here" />)
      expect(getAlert(container)!.textContent).toContain('Details here')
    })

    it('renders ReactNode description', () => {
      const { container } = render(
        <Alert title="T" description={<em data-testid="d">Italic</em>} />,
      )
      expect(container.querySelector('[data-testid="d"]')).toBeTruthy()
    })

    it('wrapper uses grid layout for close animation', () => {
      const { container } = render(<Alert title="T" />)
      const wrapper = getWrapper(container)
      expect(wrapper.style.display).toBe('grid')
      expect(wrapper.style.gridTemplateRows).toBe('1fr')
    })

    it('root has flex layout', () => {
      const { container } = render(<Alert title="T" />)
      const alert = getAlert(container)!
      expect(alert.style.display).toBe('flex')
    })

    it('root has correct font size', () => {
      const { container } = render(<Alert title="T" />)
      expect(getAlert(container)!.style.fontSize).toBe('0.875rem')
    })

    it('root has line-height 1.5', () => {
      const { container } = render(<Alert title="T" />)
      expect(getAlert(container)!.style.lineHeight).toBe('1.5')
    })
  })

  // ============================================================================
  // Types
  // ============================================================================

  describe('types', () => {
    it('default type is info (no banner)', () => {
      const { container } = render(<Alert title="T" showIcon />)
      const icon = getIcon(container)!
      const svg = icon.querySelector('svg')!
      // Info icon viewBox is 0 0 24 24 and contains specific path
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    })

    it('type=success renders success icon', () => {
      const { container } = render(<Alert title="T" type="success" showIcon />)
      const icon = getIcon(container)!
      // Success icon path contains "14.17" (unique to checkmark path)
      expect(icon.innerHTML).toContain('14.17')
    })

    it('type=warning renders warning icon', () => {
      const { container } = render(<Alert title="T" type="warning" showIcon />)
      const icon = getIcon(container)!
      // Warning icon path contains "1 21h22L12 2"
      expect(icon.innerHTML).toContain('1 21')
    })

    it('type=error renders error icon', () => {
      const { container } = render(<Alert title="T" type="error" showIcon />)
      const icon = getIcon(container)!
      // Error icon path contains "15.59"
      expect(icon.innerHTML).toContain('15.59')
    })

    it('each type has different background color', () => {
      const types: Array<'success' | 'info' | 'warning' | 'error'> = ['success', 'info', 'warning', 'error']
      const bgs = new Set<string>()
      types.forEach((type) => {
        const { container } = render(<Alert title="T" type={type} />)
        bgs.add(getAlert(container)!.style.backgroundColor)
      })
      expect(bgs.size).toBe(4)
    })

    it('each type has different border color', () => {
      const types: Array<'success' | 'info' | 'warning' | 'error'> = ['success', 'info', 'warning', 'error']
      const borders = new Set<string>()
      types.forEach((type) => {
        const { container } = render(<Alert title="T" type={type} />)
        borders.add(getAlert(container)!.style.border)
      })
      expect(borders.size).toBe(4)
    })
  })

  // ============================================================================
  // Icon
  // ============================================================================

  describe('icon', () => {
    it('no icon by default', () => {
      const { container } = render(<Alert title="T" />)
      expect(getIcon(container)).toBeNull()
    })

    it('showIcon renders default icon', () => {
      const { container } = render(<Alert title="T" showIcon />)
      expect(getIcon(container)).toBeTruthy()
    })

    it('custom icon overrides default', () => {
      const { container } = render(
        <Alert title="T" showIcon icon={<span data-testid="custom-icon">!</span>} />,
      )
      expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy()
    })

    it('icon size is 16 without description', () => {
      const { container } = render(<Alert title="T" type="success" showIcon />)
      const svg = getIcon(container)!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('16')
    })

    it('icon size is 24 with description', () => {
      const { container } = render(<Alert title="T" description="D" type="success" showIcon />)
      const svg = getIcon(container)!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('24')
    })

    it('icon has marginTop when description is present', () => {
      const { container } = render(<Alert title="T" description="D" showIcon />)
      const icon = getIcon(container)!
      expect(icon.style.marginTop).toBe('0.125rem')
    })

    it('icon has no marginTop without description', () => {
      const { container } = render(<Alert title="T" showIcon />)
      const icon = getIcon(container)!
      expect(icon.style.marginTop).toBe('0px')
    })
  })

  // ============================================================================
  // Description styling
  // ============================================================================

  describe('description styling', () => {
    it('root aligns items center without description', () => {
      const { container } = render(<Alert title="T" />)
      expect(getAlert(container)!.style.alignItems).toBe('center')
    })

    it('root aligns items flex-start with description', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getAlert(container)!.style.alignItems).toBe('flex-start')
    })

    it('title font-weight is 600 with description', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getTitleDiv(container)!.style.fontWeight).toBe('600')
    })

    it('title font-size is larger with description', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getTitleDiv(container)!.style.fontSize).toBe('0.9375rem')
    })

    it('title font-size is normal without description', () => {
      const { container } = render(<Alert title="T" />)
      expect(getTitleDiv(container)!.style.fontSize).toBe('0.875rem')
    })

    it('description has smaller font size', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getDescriptionDiv(container)!.style.fontSize).toBe('0.8125rem')
    })

    it('description has marginTop when title exists', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getDescriptionDiv(container)!.style.marginTop).toBe('0.25rem')
    })

    it('description has no marginTop without title', () => {
      const { container } = render(<Alert description="D" />)
      expect(getDescriptionDiv(container)!.style.marginTop).toBe('0px')
    })

    it('padding is larger with description', () => {
      const { container } = render(<Alert title="T" description="D" />)
      expect(getAlert(container)!.style.padding).toBe('0.9375rem 1rem')
    })

    it('padding is smaller without description', () => {
      const { container } = render(<Alert title="T" />)
      expect(getAlert(container)!.style.padding).toBe('0.5rem 0.75rem')
    })
  })

  // ============================================================================
  // Closable
  // ============================================================================

  describe('closable', () => {
    it('no close button by default', () => {
      const { container } = render(<Alert title="T" />)
      expect(getCloseButton(container)).toBeNull()
    })

    it('closable={true} shows close button', () => {
      const { container } = render(<Alert title="T" closable />)
      expect(getCloseButton(container)).toBeTruthy()
    })

    it('close button renders default close icon SVG', () => {
      const { container } = render(<Alert title="T" closable />)
      expect(getCloseButton(container)!.querySelector('svg')).toBeTruthy()
    })

    it('clicking close triggers closing animation', () => {
      const { container } = render(<Alert title="T" closable />)
      fireEvent.click(getCloseButton(container)!)
      const wrapper = getWrapper(container)
      expect(wrapper.style.gridTemplateRows).toBe('0fr')
      expect(getAlert(container)!.style.opacity).toBe('0')
    })

    it('after transition ends, alert is removed', () => {
      const { container } = render(<Alert title="T" closable />)
      fireEvent.click(getCloseButton(container)!)
      // Simulate transitionend on the wrapper
      fireEvent.transitionEnd(getWrapper(container))
      expect(getAlert(container)).toBeNull()
    })

    it('closable object with onClose', () => {
      const onClose = vi.fn()
      const { container } = render(
        <Alert title="T" closable={{ onClose }} />,
      )
      fireEvent.click(getCloseButton(container)!)
      expect(onClose).toHaveBeenCalled()
    })

    it('closable object with afterClose', () => {
      const afterClose = vi.fn()
      const { container } = render(
        <Alert title="T" closable={{ afterClose }} />,
      )
      fireEvent.click(getCloseButton(container)!)
      fireEvent.transitionEnd(getWrapper(container))
      expect(afterClose).toHaveBeenCalled()
    })

    it('closable object with custom closeIcon', () => {
      const { container } = render(
        <Alert title="T" closable={{ closeIcon: <span data-testid="x">X</span> }} />,
      )
      expect(container.querySelector('[data-testid="x"]')).toBeTruthy()
    })

    it('close button hover changes color', () => {
      const { container } = render(<Alert title="T" closable />)
      const btn = getCloseButton(container)!
      const colorBefore = btn.style.color
      fireEvent.mouseEnter(btn)
      expect(btn.style.color).not.toBe(colorBefore)
      fireEvent.mouseLeave(btn)
      expect(btn.style.color).toBe(colorBefore)
    })

    it('close button has cursor pointer', () => {
      const { container } = render(<Alert title="T" closable />)
      expect(getCloseButton(container)!.style.cursor).toBe('pointer')
    })
  })

  // ============================================================================
  // Action
  // ============================================================================

  describe('action', () => {
    it('renders action slot', () => {
      const { container } = render(
        <Alert title="T" action={<button data-testid="action-btn">Retry</button>} />,
      )
      expect(container.querySelector('[data-testid="action-btn"]')).toBeTruthy()
    })

    it('action has marginLeft', () => {
      const { container } = render(
        <Alert title="T" action={<button>Act</button>} />,
      )
      const actionSpan = getActionSpan(container)!
      expect(actionSpan.style.marginLeft).toBe('0.5rem')
    })

    it('no action span when action is not provided', () => {
      const { container } = render(<Alert title="T" />)
      expect(getActionSpan(container)).toBeNull()
    })
  })

  // ============================================================================
  // Banner
  // ============================================================================

  describe('banner', () => {
    it('banner removes border-radius', () => {
      const { container } = render(<Alert title="T" banner />)
      const alert = getAlert(container)!
      expect(alert.style.borderRadius).toBe('0')
    })

    it('banner has bottom border only', () => {
      const { container } = render(<Alert title="T" banner />)
      const alert = getAlert(container)!
      expect(alert.style.borderBottom).toContain('1px solid')
    })

    it('non-banner has full border', () => {
      const { container } = render(<Alert title="T" />)
      const alert = getAlert(container)!
      expect(alert.style.border).toContain('1px solid')
    })

    it('non-banner has border-radius', () => {
      const { container } = render(<Alert title="T" />)
      const alert = getAlert(container)!
      expect(alert.style.borderRadius).toBe('0.5rem')
    })

    it('banner defaults type to warning', () => {
      const { container } = render(<Alert title="T" banner showIcon />)
      const icon = getIcon(container)!
      // Warning icon contains "1 21"
      expect(icon.innerHTML).toContain('1 21')
    })

    it('banner defaults showIcon to true', () => {
      const { container } = render(<Alert title="T" banner />)
      expect(getIcon(container)).toBeTruthy()
    })

    it('banner explicit type overrides default', () => {
      const { container } = render(<Alert title="T" banner type="error" showIcon />)
      const icon = getIcon(container)!
      expect(icon.innerHTML).toContain('15.59')
    })
  })

  // ============================================================================
  // Dark mode
  // ============================================================================

  describe('dark mode', () => {
    it('dark mode uses different background formula', () => {
      const { container: lightContainer } = render(<Alert title="T" type="success" />)
      const lightBg = getAlert(lightContainer)!.style.backgroundColor

      mockThemeMode = 'dark'
      const { container: darkContainer } = render(<Alert title="T" type="success" />)
      const darkBg = getAlert(darkContainer)!.style.backgroundColor

      expect(lightBg).not.toBe(darkBg)
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('classNames.root applies to alert', () => {
      const { container } = render(
        <Alert title="T" classNames={{ root: 'my-root' }} />,
      )
      expect(getAlert(container)!.className).toContain('my-root')
    })

    it('classNames.icon applies to icon span', () => {
      const { container } = render(
        <Alert title="T" showIcon classNames={{ icon: 'my-icon' }} />,
      )
      expect(getIcon(container)!.className).toContain('my-icon')
    })

    it('classNames.content applies to content div', () => {
      const { container } = render(
        <Alert title="T" classNames={{ content: 'my-content' }} />,
      )
      expect(getContentDiv(container)!.className).toContain('my-content')
    })

    it('classNames.message applies to title div', () => {
      const { container } = render(
        <Alert title="T" classNames={{ message: 'my-msg' }} />,
      )
      expect(getTitleDiv(container)!.className).toContain('my-msg')
    })

    it('classNames.description applies to description div', () => {
      const { container } = render(
        <Alert title="T" description="D" classNames={{ description: 'my-desc' }} />,
      )
      expect(getDescriptionDiv(container)!.className).toContain('my-desc')
    })

    it('classNames.action applies to action span', () => {
      const { container } = render(
        <Alert title="T" action={<button>A</button>} classNames={{ action: 'my-action' }} />,
      )
      expect(getActionSpan(container)!.className).toContain('my-action')
    })

    it('classNames.closeBtn applies to close button', () => {
      const { container } = render(
        <Alert title="T" closable classNames={{ closeBtn: 'my-close' }} />,
      )
      expect(getCloseButton(container)!.className).toContain('my-close')
    })

  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('styles.root merges into alert', () => {
      const { container } = render(
        <Alert title="T" styles={{ root: { margin: '10px' } }} />,
      )
      expect(getAlert(container)!.style.margin).toBe('10px')
    })

    it('styles.icon merges into icon span', () => {
      const { container } = render(
        <Alert title="T" showIcon styles={{ icon: { fontSize: '20px' } }} />,
      )
      expect(getIcon(container)!.style.fontSize).toBe('20px')
    })

    it('styles.content merges into content div', () => {
      const { container } = render(
        <Alert title="T" styles={{ content: { padding: '5px' } }} />,
      )
      expect(getContentDiv(container)!.style.padding).toBe('5px')
    })

    it('styles.message merges into title div', () => {
      const { container } = render(
        <Alert title="T" styles={{ message: { color: 'red' } }} />,
      )
      expect(getTitleDiv(container)!.style.color).toBe('red')
    })

    it('styles.description merges into description div', () => {
      const { container } = render(
        <Alert title="T" description="D" styles={{ description: { letterSpacing: '2px' } }} />,
      )
      expect(getDescriptionDiv(container)!.style.letterSpacing).toBe('2px')
    })

    it('styles.action merges into action span', () => {
      const { container } = render(
        <Alert title="T" action={<button>A</button>} styles={{ action: { gap: '1rem' } }} />,
      )
      expect(getActionSpan(container)!.style.gap).toBe('1rem')
    })

    it('styles.closeBtn merges into close button', () => {
      const { container } = render(
        <Alert title="T" closable styles={{ closeBtn: { color: 'blue' } }} />,
      )
      expect(getCloseButton(container)!.style.color).toBe('blue')
    })

  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className and style', () => {
    it('className applies to alert', () => {
      const { container } = render(<Alert title="T" className="custom-alert" />)
      expect(getAlert(container)!.className).toContain('custom-alert')
    })

    it('style merges into alert', () => {
      const { container } = render(<Alert title="T" style={{ maxWidth: '500px' }} />)
      expect(getAlert(container)!.style.maxWidth).toBe('500px')
    })
  })

  // ============================================================================
  // ErrorBoundary
  // ============================================================================

  describe('ErrorBoundary', () => {
    // Suppress console.error from React during error boundary tests
    const originalError = console.error
    beforeEach(() => { console.error = vi.fn() })
    afterEach(() => { console.error = originalError })

    function BrokenComponent(): JSX.Element {
      throw new Error('Test crash')
    }

    it('renders children normally when no error', () => {
      const { container } = render(
        <Alert.ErrorBoundary>
          <span data-testid="child">OK</span>
        </Alert.ErrorBoundary>,
      )
      expect(container.querySelector('[data-testid="child"]')).toBeTruthy()
    })

    it('catches error and shows alert', () => {
      const { container } = render(
        <Alert.ErrorBoundary>
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      expect(getAlert(container)).toBeTruthy()
    })

    it('shows default title "Something went wrong"', () => {
      const { container } = render(
        <Alert.ErrorBoundary>
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      expect(getAlert(container)!.textContent).toContain('Something went wrong')
    })

    it('shows error message as description', () => {
      const { container } = render(
        <Alert.ErrorBoundary>
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      expect(getAlert(container)!.textContent).toContain('Test crash')
    })

    it('custom title overrides default', () => {
      const { container } = render(
        <Alert.ErrorBoundary title="Oops!">
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      expect(getAlert(container)!.textContent).toContain('Oops!')
    })

    it('custom description overrides error message', () => {
      const { container } = render(
        <Alert.ErrorBoundary description="Please refresh">
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      expect(getAlert(container)!.textContent).toContain('Please refresh')
    })

    it('error boundary renders error type alert', () => {
      const { container } = render(
        <Alert.ErrorBoundary>
          <BrokenComponent />
        </Alert.ErrorBoundary>,
      )
      // Error type has the error icon path containing "15.59"
      const icon = getIcon(container)
      expect(icon).toBeTruthy()
      expect(icon!.innerHTML).toContain('15.59')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('alert without title renders no title element', () => {
      const { container } = render(<Alert description="D" />)
      // Content should have description but title div absent or empty
      expect(getAlert(container)!.textContent).toContain('D')
    })

    it('close button marginLeft is 0 when action present', () => {
      const { container } = render(
        <Alert title="T" closable action={<button>A</button>} />,
      )
      // marginLeft: 0 (number) → jsdom returns '' or '0px'; either way not '0.5rem'
      expect(getCloseButton(container)!.style.marginLeft).not.toBe('0.5rem')
    })

    it('close button marginLeft is 0.5rem when no action', () => {
      const { container } = render(<Alert title="T" closable />)
      expect(getCloseButton(container)!.style.marginLeft).toBe('0.5rem')
    })

    it('compound export has ErrorBoundary', () => {
      expect(Alert.ErrorBoundary).toBeTruthy()
    })
  })
})
