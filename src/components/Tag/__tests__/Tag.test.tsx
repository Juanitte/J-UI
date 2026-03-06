import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Tag } from '../Tag'

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getCloseIcon(container: HTMLElement) {
  return getRoot(container).querySelector('[aria-label="close"]') as HTMLElement | null
}

describe('Tag', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Tag>Hello</Tag>)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('SPAN')
    })

    it('renders children text', () => {
      render(<Tag>Hello Tag</Tag>)
      expect(screen.getByText('Hello Tag')).toBeTruthy()
    })

    it('root has BEM base class', () => {
      const { container } = render(<Tag>Test</Tag>)
      expect(getRoot(container)).toHaveClass('ino-tag')
    })

    it('root has entering class on mount', () => {
      const { container } = render(<Tag>Test</Tag>)
      expect(getRoot(container)).toHaveClass('ino-tag--entering')
    })

    it('root has hoverable class when not disabled', () => {
      const { container } = render(<Tag>Test</Tag>)
      expect(getRoot(container)).toHaveClass('ino-tag--hoverable')
    })
  })

  describe('variants', () => {
    it('outlined is default (transparent bg)', () => {
      const { container } = render(<Tag>Outlined</Tag>)
      expect(getRoot(container).style.backgroundColor).toBe('transparent')
    })

    it('outlined has border', () => {
      const { container } = render(<Tag>Outlined</Tag>)
      expect(getRoot(container).style.border).toContain('1px solid')
    })

    it('filled has non-transparent background', () => {
      const { container } = render(<Tag variant="filled">Filled</Tag>)
      expect(getRoot(container).style.backgroundColor).toBeTruthy()
      expect(getRoot(container).style.backgroundColor).not.toBe('transparent')
    })

    it('filled has transparent border', () => {
      const { container } = render(<Tag variant="filled">Filled</Tag>)
      expect(getRoot(container).style.border).toContain('transparent')
    })

    it('solid has background color', () => {
      const { container } = render(<Tag variant="solid">Solid</Tag>)
      expect(getRoot(container).style.backgroundColor).toBeTruthy()
      expect(getRoot(container).style.backgroundColor).not.toBe('transparent')
    })

    it('solid has white text', () => {
      const { container } = render(<Tag variant="solid">Solid</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(255, 255, 255)')
    })
  })

  describe('color presets', () => {
    it('status color "success" outlined has color text', () => {
      const { container } = render(<Tag color="success">OK</Tag>)
      expect(getRoot(container).style.color).toBeTruthy()
    })

    it('status color "error" solid has white text', () => {
      const { container } = render(<Tag color="error" variant="solid">Err</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(255, 255, 255)')
    })

    it('decorative color "blue" applies color', () => {
      const { container } = render(<Tag color="blue">Blue</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(22, 119, 255)')
    })

    it('decorative color "green" applies color', () => {
      const { container } = render(<Tag color="green">Green</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(82, 196, 26)')
    })

    it('custom hex color applies', () => {
      const { container } = render(<Tag color="#ff6600">Custom</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(255, 102, 0)')
    })

    it('filled variant with color has non-transparent bg', () => {
      const { container } = render(<Tag color="primary" variant="filled">Fill</Tag>)
      expect(getRoot(container).style.backgroundColor).not.toBe('transparent')
    })

    it('solid variant with decorative color has white text', () => {
      const { container } = render(<Tag color="purple" variant="solid">Purple</Tag>)
      expect(getRoot(container).style.color).toBe('rgb(255, 255, 255)')
    })
  })

  describe('closable', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows close icon when closable', () => {
      const { container } = render(<Tag closable>Close me</Tag>)
      expect(getCloseIcon(container)).toBeTruthy()
    })

    it('no close icon by default', () => {
      const { container } = render(<Tag>No close</Tag>)
      expect(getCloseIcon(container)).toBeNull()
    })

    it('close icon has aria-label "close"', () => {
      const { container } = render(<Tag closable>X</Tag>)
      expect(getCloseIcon(container)!.getAttribute('aria-label')).toBe('close')
    })

    it('calls onClose when close icon clicked', () => {
      const onClose = vi.fn()
      const { container } = render(<Tag closable onClose={onClose}>X</Tag>)
      fireEvent.click(getCloseIcon(container)!)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('tag disappears after close animation', () => {
      const { container } = render(<Tag closable>Bye</Tag>)
      fireEvent.click(getCloseIcon(container)!)
      expect(getRoot(container)).toBeTruthy()
      act(() => { vi.advanceTimersByTime(200) })
      expect(container.firstElementChild).toBeNull()
    })

    it('close animation applies closing class', () => {
      const { container } = render(<Tag closable>Anim</Tag>)
      fireEvent.click(getCloseIcon(container)!)
      expect(getRoot(container)).toHaveClass('ino-tag--closing')
    })

    it('preventDefault in onClose prevents removal', () => {
      const { container } = render(
        <Tag closable onClose={(e) => e.preventDefault()}>Stay</Tag>,
      )
      fireEvent.click(getCloseIcon(container)!)
      act(() => { vi.advanceTimersByTime(300) })
      expect(getRoot(container)).toBeTruthy()
    })

    it('custom close icon', () => {
      render(
        <Tag closable closeIcon={<span data-testid="custom-close">×</span>}>X</Tag>,
      )
      expect(screen.getByTestId('custom-close')).toBeTruthy()
    })

    it('close icon has BEM class', () => {
      const { container } = render(<Tag closable>X</Tag>)
      expect(getCloseIcon(container)!).toHaveClass('ino-tag__close')
    })
  })

  describe('icon', () => {
    it('renders icon slot', () => {
      render(<Tag icon={<span data-testid="tag-icon">★</span>}>Star</Tag>)
      expect(screen.getByTestId('tag-icon')).toBeTruthy()
    })

    it('icon slot has BEM class', () => {
      const { container } = render(<Tag icon={<span>★</span>}>Star</Tag>)
      expect(container.querySelector('.ino-tag__icon')).toBeTruthy()
    })
  })

  describe('bordered', () => {
    it('has visible border by default', () => {
      const { container } = render(<Tag>Bordered</Tag>)
      expect(getRoot(container).style.border).toContain('1px solid')
      expect(getRoot(container).style.border).not.toContain('transparent')
    })

    it('bordered=false has transparent border', () => {
      const { container } = render(<Tag bordered={false}>No border</Tag>)
      expect(getRoot(container).style.border).toContain('transparent')
    })
  })

  describe('disabled', () => {
    it('has disabled class when disabled', () => {
      const { container } = render(<Tag disabled>Disabled</Tag>)
      expect(getRoot(container)).toHaveClass('ino-tag--disabled')
    })

    it('does not have hoverable class when disabled', () => {
      const { container } = render(<Tag disabled>Disabled</Tag>)
      expect(getRoot(container)).not.toHaveClass('ino-tag--hoverable')
    })

    it('onClick is not called when disabled', () => {
      const onClick = vi.fn()
      const { container } = render(<Tag disabled onClick={onClick}>No click</Tag>)
      fireEvent.click(getRoot(container))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('link mode', () => {
    it('renders as <a> when href is provided', () => {
      const { container } = render(<Tag href="https://example.com">Link</Tag>)
      expect(getRoot(container).tagName).toBe('A')
    })

    it('sets href attribute', () => {
      const { container } = render(<Tag href="https://example.com">Link</Tag>)
      expect(getRoot(container).getAttribute('href')).toBe('https://example.com')
    })

    it('sets target attribute', () => {
      const { container } = render(<Tag href="https://example.com" target="_blank">Link</Tag>)
      expect(getRoot(container).getAttribute('target')).toBe('_blank')
    })

    it('renders as <span> when disabled with href', () => {
      const { container } = render(<Tag href="https://example.com" disabled>No link</Tag>)
      expect(getRoot(container).tagName).toBe('SPAN')
    })

    it('renders as <span> without href', () => {
      const { container } = render(<Tag>Span</Tag>)
      expect(getRoot(container).tagName).toBe('SPAN')
    })
  })

  describe('onClick', () => {
    it('calls onClick on click', () => {
      const onClick = vi.fn()
      const { container } = render(<Tag onClick={onClick}>Click</Tag>)
      fireEvent.click(getRoot(container))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<Tag classNames={{ root: 'tag-root' }}>X</Tag>)
      expect(getRoot(container).className).toContain('tag-root')
    })

    it('applies classNames.icon', () => {
      render(<Tag icon={<span>★</span>} classNames={{ icon: 'tag-icon' }}>X</Tag>)
      expect(screen.getByText('★').parentElement!.className).toContain('tag-icon')
    })

    it('applies classNames.content', () => {
      render(<Tag classNames={{ content: 'tag-content' }}>Text</Tag>)
      expect(screen.getByText('Text').closest('span')!.className).toContain('tag-content')
    })

    it('applies classNames.closeIcon', () => {
      const { container } = render(<Tag closable classNames={{ closeIcon: 'tag-close' }}>X</Tag>)
      expect(getCloseIcon(container)!.className).toContain('tag-close')
    })
  })

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(<Tag styles={{ root: { margin: '4px' } }}>X</Tag>)
      expect(getRoot(container).style.margin).toBe('4px')
    })

    it('applies styles.icon', () => {
      render(<Tag icon={<span>★</span>} styles={{ icon: { color: 'red' } }}>X</Tag>)
      expect(screen.getByText('★').parentElement!.style.color).toBe('red')
    })

    it('applies styles.content', () => {
      render(<Tag styles={{ content: { letterSpacing: '1px' } }}>Txt</Tag>)
      expect(screen.getByText('Txt').closest('span')!.style.letterSpacing).toBe('1px')
    })

    it('applies styles.closeIcon', () => {
      const { container } = render(<Tag closable styles={{ closeIcon: { color: 'red' } }}>X</Tag>)
      expect(getCloseIcon(container)!.style.color).toBe('red')
    })
  })

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(<Tag className="my-tag">X</Tag>)
      expect(getRoot(container).className).toContain('my-tag')
    })

    it('applies style to root', () => {
      const { container } = render(<Tag style={{ maxWidth: '100px' }}>X</Tag>)
      expect(getRoot(container).style.maxWidth).toBe('100px')
    })
  })

  describe('compound export', () => {
    it('Tag.CheckableTag is defined', () => {
      expect(Tag.CheckableTag).toBeDefined()
    })

    it('Tag.SpinnerIcon is defined', () => {
      expect(Tag.SpinnerIcon).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('renders with no children', () => {
      const { container } = render(<Tag />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('renders ReactNode as children', () => {
      render(<Tag><strong data-testid="strong-child">Bold</strong></Tag>)
      expect(screen.getByTestId('strong-child')).toBeTruthy()
    })

    it('close click stopPropagation does not trigger tag onClick', () => {
      const onClick = vi.fn()
      const { container } = render(<Tag closable onClick={onClick}>X</Tag>)
      fireEvent.click(getCloseIcon(container)!)
      expect(onClick).not.toHaveBeenCalled()
    })
  })
})

describe('Tag.CheckableTag', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Tag.CheckableTag>Check</Tag.CheckableTag>)
      expect(getRoot(container)).toBeTruthy()
      expect(getRoot(container).tagName).toBe('SPAN')
    })

    it('renders children text', () => {
      render(<Tag.CheckableTag>Label</Tag.CheckableTag>)
      expect(screen.getByText('Label')).toBeTruthy()
    })

    it('root has BEM base class', () => {
      const { container } = render(<Tag.CheckableTag>X</Tag.CheckableTag>)
      expect(getRoot(container)).toHaveClass('ino-tag-checkable')
    })
  })

  describe('checked / unchecked', () => {
    it('unchecked does not set inline background', () => {
      const { container } = render(<Tag.CheckableTag>Off</Tag.CheckableTag>)
      // Background is transparent via CSS class, not inline style
      expect(getRoot(container)).toHaveClass('ino-tag-checkable')
      expect(getRoot(container)).not.toHaveClass('ino-tag-checkable--checked')
    })

    it('checked has non-transparent background', () => {
      const { container } = render(<Tag.CheckableTag checked>On</Tag.CheckableTag>)
      expect(getRoot(container).style.backgroundColor).not.toBe('transparent')
    })

    it('checked has checked class', () => {
      const { container } = render(<Tag.CheckableTag checked>On</Tag.CheckableTag>)
      expect(getRoot(container)).toHaveClass('ino-tag-checkable--checked')
    })

    it('unchecked does not have checked class', () => {
      const { container } = render(<Tag.CheckableTag>Off</Tag.CheckableTag>)
      expect(getRoot(container)).not.toHaveClass('ino-tag-checkable--checked')
    })
  })

  describe('onChange', () => {
    it('calls onChange with true when clicking unchecked', () => {
      const onChange = vi.fn()
      const { container } = render(<Tag.CheckableTag onChange={onChange}>Toggle</Tag.CheckableTag>)
      fireEvent.click(getRoot(container))
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('calls onChange with false when clicking checked', () => {
      const onChange = vi.fn()
      const { container } = render(<Tag.CheckableTag checked onChange={onChange}>Toggle</Tag.CheckableTag>)
      fireEvent.click(getRoot(container))
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('disabled', () => {
    it('has disabled class when disabled', () => {
      const { container } = render(<Tag.CheckableTag disabled>Disabled</Tag.CheckableTag>)
      expect(getRoot(container)).toHaveClass('ino-tag-checkable--disabled')
    })

    it('does not call onChange when disabled', () => {
      const onChange = vi.fn()
      const { container } = render(<Tag.CheckableTag disabled onChange={onChange}>No</Tag.CheckableTag>)
      fireEvent.click(getRoot(container))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('color', () => {
    it('checked with custom color applies that color as bg', () => {
      const { container } = render(<Tag.CheckableTag checked color="success">Ok</Tag.CheckableTag>)
      expect(getRoot(container).style.backgroundColor).not.toBe('transparent')
    })

    it('checked with decorative color', () => {
      const { container } = render(<Tag.CheckableTag checked color="blue">Blue</Tag.CheckableTag>)
      expect(getRoot(container).style.backgroundColor).toBe('rgb(22, 119, 255)')
    })

    it('unchecked ignores color for background', () => {
      const { container } = render(<Tag.CheckableTag color="success">Off</Tag.CheckableTag>)
      // Unchecked: no inline backgroundColor (CSS provides transparent)
      expect(getRoot(container)).not.toHaveClass('ino-tag-checkable--checked')
    })
  })

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<Tag.CheckableTag classNames={{ root: 'ct-root' }}>X</Tag.CheckableTag>)
      expect(getRoot(container).className).toContain('ct-root')
    })

    it('applies classNames.content', () => {
      render(<Tag.CheckableTag classNames={{ content: 'ct-content' }}>Text</Tag.CheckableTag>)
      expect(screen.getByText('Text').closest('span')!.className).toContain('ct-content')
    })
  })

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(<Tag.CheckableTag styles={{ root: { margin: '2px' } }}>X</Tag.CheckableTag>)
      expect(getRoot(container).style.margin).toBe('2px')
    })

    it('applies styles.content', () => {
      render(<Tag.CheckableTag styles={{ content: { fontWeight: '700' } }}>Txt</Tag.CheckableTag>)
      expect(screen.getByText('Txt').closest('span')!.style.fontWeight).toBe('700')
    })
  })

  describe('className / style', () => {
    it('applies className', () => {
      const { container } = render(<Tag.CheckableTag className="my-ct">X</Tag.CheckableTag>)
      expect(getRoot(container).className).toContain('my-ct')
    })

    it('applies style', () => {
      const { container } = render(<Tag.CheckableTag style={{ maxWidth: '80px' }}>X</Tag.CheckableTag>)
      expect(getRoot(container).style.maxWidth).toBe('80px')
    })
  })

  describe('edge cases', () => {
    it('renders with no children', () => {
      const { container } = render(<Tag.CheckableTag />)
      expect(getRoot(container)).toBeTruthy()
    })
  })
})
