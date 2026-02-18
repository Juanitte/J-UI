import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Avatar } from '../Avatar'

// ============================================================================
// Helpers
// ============================================================================

/** The visible avatar span (has borderRadius, width, height) */
function getAvatar(container: HTMLElement) {
  // Structure: outer <span> (position:relative) > inner <span ref=rootRef> (the avatar)
  const outer = container.firstElementChild as HTMLElement
  return outer.querySelector('span[style*="overflow"]') as HTMLElement
}

function getImage(container: HTMLElement) {
  return container.querySelector('img') as HTMLImageElement | null
}

function getTextSpan(container: HTMLElement) {
  // Text span has display: inline-block and lineHeight: 1
  return container.querySelector('span[style*="line-height: 1"]') as HTMLElement | null
}

function getBadge(container: HTMLElement) {
  // Count badge has min-width: 1.25rem
  return container.querySelector('[style*="min-width"]') as HTMLElement | null
}

function getDot(container: HTMLElement) {
  // Dot has width: 0.5rem and height: 0.5rem
  return container.querySelector('[style*="width: 0.5rem"]') as HTMLElement | null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Avatar – Basic rendering', () => {
  it('renders a span element', () => {
    const { container } = render(<Avatar />)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('renders default user icon when no src/icon/children', () => {
    const { container } = render(<Avatar />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg!.getAttribute('fill')).toBe('currentColor')
  })

  it('renders with circle shape by default (borderRadius 50%)', () => {
    const { container } = render(<Avatar />)
    const avatar = getAvatar(container)
    expect(avatar.style.borderRadius).toBe('50%')
  })

  it('renders with default size (2rem = 32px)', () => {
    const { container } = render(<Avatar />)
    const avatar = getAvatar(container)
    expect(avatar.style.width).toBe('2rem')
    expect(avatar.style.height).toBe('2rem')
  })

  it('has inline-flex display', () => {
    const { container } = render(<Avatar />)
    const avatar = getAvatar(container)
    expect(avatar.style.display).toBe('inline-flex')
  })

  it('centers content', () => {
    const { container } = render(<Avatar />)
    const avatar = getAvatar(container)
    expect(avatar.style.alignItems).toBe('center')
    expect(avatar.style.justifyContent).toBe('center')
  })
})

// ============================================================================
// Image avatar (src)
// ============================================================================

describe('Avatar – Image', () => {
  it('renders an img when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/avatar.png" />)
    const img = getImage(container)
    expect(img).toBeTruthy()
    expect(img!.src).toBe('https://example.com/avatar.png')
  })

  it('sets alt attribute', () => {
    const { container } = render(<Avatar src="avatar.png" alt="User avatar" />)
    const img = getImage(container)
    expect(img!.alt).toBe('User avatar')
  })

  it('sets srcSet attribute', () => {
    const { container } = render(<Avatar src="avatar.png" srcSet="avatar@2x.png 2x" />)
    const img = getImage(container)
    expect(img!.getAttribute('srcset')).toBe('avatar@2x.png 2x')
  })

  it('sets crossOrigin attribute', () => {
    const { container } = render(<Avatar src="avatar.png" crossOrigin="anonymous" />)
    const img = getImage(container)
    expect(img!.crossOrigin).toBe('anonymous')
  })

  it('img covers the container (object-fit: cover)', () => {
    const { container } = render(<Avatar src="avatar.png" />)
    const img = getImage(container)
    expect(img!.style.objectFit).toBe('cover')
    expect(img!.style.width).toBe('100%')
    expect(img!.style.height).toBe('100%')
  })

  it('sets draggable attribute on image', () => {
    const { container } = render(<Avatar src="avatar.png" draggable={false} />)
    const img = getImage(container)
    expect(img!.draggable).toBe(false)
  })

  it('defaults draggable to true', () => {
    const { container } = render(<Avatar src="avatar.png" />)
    const img = getImage(container)
    expect(img!.draggable).toBe(true)
  })
})

// ============================================================================
// Image error fallback
// ============================================================================

describe('Avatar – Image error fallback', () => {
  it('falls back to default icon on image error', () => {
    const { container } = render(<Avatar src="bad.png" />)
    const img = getImage(container)!
    fireEvent.error(img)
    // Image should be gone, default icon shown
    expect(getImage(container)).toBeFalsy()
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('falls back to icon on image error when icon is provided', () => {
    const { container } = render(
      <Avatar src="bad.png" icon={<span data-testid="custom-icon">IC</span>} />,
    )
    fireEvent.error(getImage(container)!)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('falls back to children text on image error', () => {
    const { container } = render(<Avatar src="bad.png">AB</Avatar>)
    fireEvent.error(getImage(container)!)
    expect(container.textContent).toContain('AB')
  })

  it('calls onError callback', () => {
    const onError = vi.fn()
    const { container } = render(<Avatar src="bad.png" onError={onError} />)
    fireEvent.error(getImage(container)!)
    expect(onError).toHaveBeenCalled()
  })

  it('does not fallback when onError returns false', () => {
    const onError = vi.fn(() => false)
    const { container } = render(<Avatar src="bad.png" onError={onError} />)
    fireEvent.error(getImage(container)!)
    // Image should still be rendered (no fallback)
    expect(getImage(container)).toBeTruthy()
  })

  it('resets error when src changes', () => {
    const { container, rerender } = render(<Avatar src="bad.png" />)
    fireEvent.error(getImage(container)!)
    expect(getImage(container)).toBeFalsy()

    rerender(<Avatar src="good.png" />)
    expect(getImage(container)).toBeTruthy()
    expect(getImage(container)!.src).toContain('good.png')
  })
})

// ============================================================================
// Icon avatar
// ============================================================================

describe('Avatar – Icon', () => {
  it('renders icon when provided and no src', () => {
    render(<Avatar icon={<span data-testid="my-icon">★</span>} />)
    expect(screen.getByTestId('my-icon')).toBeInTheDocument()
  })

  it('wraps icon in a centered span', () => {
    const { container } = render(<Avatar icon={<span>★</span>} />)
    const iconWrapper = container.querySelector('span[style*="inline-flex"]')
    expect(iconWrapper).toBeTruthy()
  })

  it('prefers src over icon', () => {
    const { container } = render(
      <Avatar src="avatar.png" icon={<span data-testid="icon">IC</span>} />,
    )
    expect(getImage(container)).toBeTruthy()
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })
})

// ============================================================================
// Text avatar (children)
// ============================================================================

describe('Avatar – Text (children)', () => {
  it('renders children text', () => {
    const { container } = render(<Avatar>AB</Avatar>)
    expect(container.textContent).toContain('AB')
  })

  it('wraps text in a span with lineHeight 1', () => {
    const { container } = render(<Avatar>AB</Avatar>)
    const textSpan = getTextSpan(container)
    expect(textSpan).toBeTruthy()
    expect(textSpan!.textContent).toBe('AB')
  })

  it('text span has userSelect none', () => {
    const { container } = render(<Avatar>AB</Avatar>)
    const textSpan = getTextSpan(container)
    expect(textSpan!.style.userSelect).toBe('none')
  })

  it('prefers icon over children', () => {
    const { container } = render(
      <Avatar icon={<span data-testid="icon">IC</span>}>AB</Avatar>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(getTextSpan(container)).toBeFalsy()
  })

  it('prefers src over children', () => {
    const { container } = render(<Avatar src="avatar.png">AB</Avatar>)
    expect(getImage(container)).toBeTruthy()
    expect(getTextSpan(container)).toBeFalsy()
  })
})

// ============================================================================
// Shape
// ============================================================================

describe('Avatar – Shape', () => {
  it('circle shape has borderRadius 50%', () => {
    const { container } = render(<Avatar shape="circle" />)
    const avatar = getAvatar(container)
    expect(avatar.style.borderRadius).toBe('50%')
  })

  it('square shape has borderRadius 0.5rem', () => {
    const { container } = render(<Avatar shape="square" />)
    const avatar = getAvatar(container)
    expect(avatar.style.borderRadius).toBe('0.5rem')
  })
})

// ============================================================================
// Size
// ============================================================================

describe('Avatar – Size', () => {
  it('small size renders 1.5rem (24px)', () => {
    const { container } = render(<Avatar size="small" />)
    const avatar = getAvatar(container)
    expect(avatar.style.width).toBe('1.5rem')
    expect(avatar.style.height).toBe('1.5rem')
  })

  it('default size renders 2rem (32px)', () => {
    const { container } = render(<Avatar size="default" />)
    const avatar = getAvatar(container)
    expect(avatar.style.width).toBe('2rem')
    expect(avatar.style.height).toBe('2rem')
  })

  it('large size renders 2.5rem (40px)', () => {
    const { container } = render(<Avatar size="large" />)
    const avatar = getAvatar(container)
    expect(avatar.style.width).toBe('2.5rem')
    expect(avatar.style.height).toBe('2.5rem')
  })

  it('custom number size renders correctly (e.g. 64 → 4rem)', () => {
    const { container } = render(<Avatar size={64} />)
    const avatar = getAvatar(container)
    expect(avatar.style.width).toBe('4rem')
    expect(avatar.style.height).toBe('4rem')
  })

  it('scales font size based on avatar size (50%)', () => {
    const { container } = render(<Avatar size={64}>AB</Avatar>)
    const avatar = getAvatar(container)
    // fontSize = sizePx * 0.5 / 16 = 64 * 0.5 / 16 = 2rem
    expect(avatar.style.fontSize).toBe('2rem')
  })

  it('scales default icon size based on avatar size', () => {
    const { container } = render(<Avatar size={64} />)
    const svg = container.querySelector('svg')
    // iconSize = Math.round(64 * 0.55) = 35
    expect(svg!.getAttribute('width')).toBe('35')
  })
})

// ============================================================================
// Count badge
// ============================================================================

describe('Avatar – Count badge', () => {
  it('shows count badge when count > 0', () => {
    const { container } = render(<Avatar count={5} />)
    const badge = getBadge(container)
    expect(badge).toBeTruthy()
    expect(badge!.textContent).toBe('5')
  })

  it('does not show badge when count is 0', () => {
    const { container } = render(<Avatar count={0} />)
    expect(getBadge(container)).toBeFalsy()
  })

  it('does not show badge when count is undefined', () => {
    const { container } = render(<Avatar />)
    expect(getBadge(container)).toBeFalsy()
  })

  it('caps count at 99+', () => {
    const { container } = render(<Avatar count={150} />)
    const badge = getBadge(container)
    expect(badge!.textContent).toBe('99+')
  })

  it('shows exact count when <= 99', () => {
    const { container } = render(<Avatar count={99} />)
    const badge = getBadge(container)
    expect(badge!.textContent).toBe('99')
  })

  it('badge is positioned at top-right', () => {
    const { container } = render(<Avatar count={5} />)
    const badge = getBadge(container)!
    expect(badge.style.position).toBe('absolute')
    expect(badge.style.top).toBe('0px')
    expect(badge.style.right).toBe('0px')
  })

  it('badge has error background color', () => {
    const { container } = render(<Avatar count={5} />)
    const badge = getBadge(container)!
    expect(badge.style.backgroundColor).toBeTruthy()
  })

  it('badge has white text', () => {
    const { container } = render(<Avatar count={5} />)
    const badge = getBadge(container)!
    expect(badge.style.color).toBe('rgb(255, 255, 255)')
  })
})

// ============================================================================
// Dot indicator
// ============================================================================

describe('Avatar – Dot indicator', () => {
  it('shows dot when dot=true', () => {
    const { container } = render(<Avatar dot />)
    const dot = getDot(container)
    expect(dot).toBeTruthy()
  })

  it('dot is positioned at top-right', () => {
    const { container } = render(<Avatar dot />)
    const dot = getDot(container)!
    expect(dot.style.position).toBe('absolute')
    expect(dot.style.top).toBe('0px')
    expect(dot.style.right).toBe('0px')
  })

  it('dot has circle shape (50% borderRadius)', () => {
    const { container } = render(<Avatar dot />)
    const dot = getDot(container)!
    expect(dot.style.borderRadius).toBe('50%')
  })

  it('dot not shown when dot=false', () => {
    const { container } = render(<Avatar dot={false} />)
    expect(getDot(container)).toBeFalsy()
  })

  it('count badge takes priority over dot', () => {
    const { container } = render(<Avatar dot count={5} />)
    expect(getBadge(container)).toBeTruthy()
    expect(getDot(container)).toBeFalsy()
  })
})

// ============================================================================
// className & style
// ============================================================================

describe('Avatar – className & style', () => {
  it('applies className to avatar', () => {
    const { container } = render(<Avatar className="custom-avatar" />)
    const avatar = getAvatar(container)
    expect(avatar.className).toContain('custom-avatar')
  })

  it('applies custom style', () => {
    const { container } = render(<Avatar style={{ border: '2px solid red' }} />)
    const avatar = getAvatar(container)
    expect(avatar.style.border).toBe('2px solid red')
  })
})

// ============================================================================
// Semantic classNames
// ============================================================================

describe('Avatar – Semantic classNames', () => {
  it('applies classNames.root', () => {
    const { container } = render(<Avatar classNames={{ root: 'my-root' }} />)
    const avatar = getAvatar(container)
    expect(avatar.className).toContain('my-root')
  })

  it('applies classNames.image', () => {
    const { container } = render(
      <Avatar src="avatar.png" classNames={{ image: 'my-img' }} />,
    )
    const img = getImage(container)
    expect(img!.className).toContain('my-img')
  })

  it('applies classNames.icon', () => {
    const { container } = render(
      <Avatar icon={<span>★</span>} classNames={{ icon: 'my-icon' }} />,
    )
    const iconWrapper = container.querySelector('.my-icon')
    expect(iconWrapper).toBeTruthy()
  })

  it('applies classNames.text', () => {
    const { container } = render(
      <Avatar classNames={{ text: 'my-text' }}>AB</Avatar>,
    )
    const textEl = container.querySelector('.my-text')
    expect(textEl).toBeTruthy()
    expect(textEl!.textContent).toBe('AB')
  })
})

// ============================================================================
// Semantic styles
// ============================================================================

describe('Avatar – Semantic styles', () => {
  it('applies styles.root', () => {
    const { container } = render(
      <Avatar styles={{ root: { boxShadow: '0 0 5px red' } }} />,
    )
    const avatar = getAvatar(container)
    expect(avatar.style.boxShadow).toBe('0 0 5px red')
  })

  it('applies styles.image', () => {
    const { container } = render(
      <Avatar src="avatar.png" styles={{ image: { opacity: '0.8' } }} />,
    )
    const img = getImage(container)
    expect(img!.style.opacity).toBe('0.8')
  })

  it('applies styles.icon', () => {
    const { container } = render(
      <Avatar icon={<span>★</span>} styles={{ icon: { color: 'blue' } }} />,
    )
    const iconWrappers = container.querySelectorAll('span[style*="inline-flex"]')
    const iconWrapper = Array.from(iconWrappers).find((el) => (el as HTMLElement).style.color === 'blue')
    expect(iconWrapper).toBeTruthy()
  })

  it('applies styles.text', () => {
    const { container } = render(
      <Avatar styles={{ text: { fontWeight: '700' } }}>AB</Avatar>,
    )
    const textSpan = getTextSpan(container)
    expect(textSpan!.style.fontWeight).toBe('700')
  })
})

// ============================================================================
// Avatar.Group – Basic
// ============================================================================

describe('Avatar.Group – Basic', () => {
  it('renders group as a div', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    expect(group.tagName).toBe('DIV')
  })

  it('renders all children', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
      </Avatar.Group>,
    )
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain('B')
    expect(container.textContent).toContain('C')
  })

  it('has inline-flex display', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    expect(group.style.display).toBe('inline-flex')
  })

  it('applies className', () => {
    const { container } = render(
      <Avatar.Group className="my-group">
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    expect(container.firstElementChild!.className).toContain('my-group')
  })

  it('applies style', () => {
    const { container } = render(
      <Avatar.Group style={{ gap: '4px' }}>
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    expect((container.firstElementChild as HTMLElement).style.gap).toBe('4px')
  })
})

// ============================================================================
// Avatar.Group – max
// ============================================================================

describe('Avatar.Group – max count', () => {
  it('limits visible avatars to max.count', () => {
    const { container } = render(
      <Avatar.Group max={{ count: 2 }}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
        <Avatar>D</Avatar>
      </Avatar.Group>,
    )
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain('B')
    expect(container.textContent).not.toContain('C')
    expect(container.textContent).not.toContain('D')
  })

  it('shows overflow count indicator (+N)', () => {
    const { container } = render(
      <Avatar.Group max={{ count: 2 }}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
        <Avatar>D</Avatar>
      </Avatar.Group>,
    )
    expect(container.textContent).toContain('+2')
  })

  it('does not show overflow when all fit', () => {
    const { container } = render(
      <Avatar.Group max={{ count: 5 }}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )
    expect(container.textContent).not.toContain('+')
  })

  it('does not show overflow when no max is set', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
      </Avatar.Group>,
    )
    expect(container.textContent).not.toContain('+')
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain('B')
    expect(container.textContent).toContain('C')
  })

  it('applies max.style to overflow avatar', () => {
    const { container } = render(
      <Avatar.Group max={{ count: 1, style: { backgroundColor: 'pink' } }}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )
    // The overflow avatar should have the custom style
    const allAvatars = container.querySelectorAll('span[style*="overflow: hidden"]')
    const overflowAvatar = Array.from(allAvatars).find(
      (el) => (el as HTMLElement).style.backgroundColor === 'pink',
    )
    expect(overflowAvatar).toBeTruthy()
  })
})

// ============================================================================
// Avatar.Group – overlap / z-index
// ============================================================================

describe('Avatar.Group – Overlap', () => {
  it('first child has no negative margin', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const first = group.children[0] as HTMLElement
    expect(first.style.marginInlineStart).toBe('')
  })

  it('subsequent children have negative margin for overlap', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const second = group.children[1] as HTMLElement
    // Overlap margin is sizeToRem(Math.round(sizePx * -0.3)) = default 32 * -0.3 = -9.6 → -10 → -0.625rem
    expect(second.style.marginInlineStart).toBeTruthy()
    expect(second.style.marginInlineStart).toContain('-')
  })

  it('first child has highest z-index', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const first = group.children[0] as HTMLElement
    const third = group.children[2] as HTMLElement
    expect(Number(first.style.zIndex)).toBeGreaterThan(Number(third.style.zIndex))
  })
})

// ============================================================================
// Avatar.Group – Context inheritance
// ============================================================================

describe('Avatar.Group – Context', () => {
  it('children inherit size from group', () => {
    const { container } = render(
      <Avatar.Group size="large">
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const avatar = container.querySelector('span[style*="overflow: hidden"]') as HTMLElement
    // large = 40px = 2.5rem
    expect(avatar.style.width).toBe('2.5rem')
  })

  it('children inherit shape from group', () => {
    const { container } = render(
      <Avatar.Group shape="square">
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const avatar = container.querySelector('span[style*="overflow: hidden"]') as HTMLElement
    expect(avatar.style.borderRadius).toBe('0.5rem')
  })

  it('child props override group context', () => {
    const { container } = render(
      <Avatar.Group size="large" shape="circle">
        <Avatar size="small" shape="square">A</Avatar>
      </Avatar.Group>,
    )
    const avatar = container.querySelector('span[style*="overflow: hidden"]') as HTMLElement
    expect(avatar.style.width).toBe('1.5rem')
    expect(avatar.style.borderRadius).toBe('0.5rem')
  })

  it('group wraps children with background for ring effect', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const wrapper = group.children[0] as HTMLElement
    // Wrapper has padding and backgroundColor for ring effect
    expect(wrapper.style.padding).toBe('0.125rem')
    expect(wrapper.style.backgroundColor).toBeTruthy()
  })

  it('group uses circle borderRadius for wrappers when shape=circle', () => {
    const { container } = render(
      <Avatar.Group shape="circle">
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const wrapper = group.children[0] as HTMLElement
    expect(wrapper.style.borderRadius).toBe('50%')
  })

  it('group uses rounded borderRadius for wrappers when shape=square', () => {
    const { container } = render(
      <Avatar.Group shape="square">
        <Avatar>A</Avatar>
      </Avatar.Group>,
    )
    const group = container.firstElementChild as HTMLElement
    const wrapper = group.children[0] as HTMLElement
    expect(wrapper.style.borderRadius).toBe('0.625rem')
  })
})

// ============================================================================
// Compound export
// ============================================================================

describe('Avatar – Compound export', () => {
  it('has Group sub-component', () => {
    expect(Avatar.Group).toBeDefined()
    expect(typeof Avatar.Group).toBe('function')
  })
})
