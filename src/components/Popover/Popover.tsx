import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type PopoverPlacement =
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom'

export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'contextMenu'

export type PopoverSemanticSlot = 'root' | 'popup' | 'title' | 'content' | 'arrow'
export type PopoverClassNames = SemanticClassNames<PopoverSemanticSlot>
export type PopoverStyles = SemanticStyles<PopoverSemanticSlot>

export interface PopoverProps {
  /** Title of the popover card */
  title?: ReactNode | (() => ReactNode)
  /** Content of the popover card */
  content?: ReactNode | (() => ReactNode)
  /** Trigger element */
  children: ReactNode
  /** Placement relative to trigger */
  placement?: PopoverPlacement
  /** Trigger mode(s) */
  trigger?: PopoverTrigger | PopoverTrigger[]
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Show arrow */
  arrow?: boolean
  /** Delay before showing on hover (ms) */
  mouseEnterDelay?: number
  /** Delay before hiding on mouse leave (ms) */
  mouseLeaveDelay?: number
  /** Disable popover */
  disabled?: boolean
  /** Root CSS class */
  className?: string
  /** Root inline style */
  style?: CSSProperties
  /** Semantic class names */
  classNames?: PopoverClassNames
  /** Semantic styles */
  styles?: PopoverStyles
}

// ─── Positioning ────────────────────────────────────────────────────────────────

const GAP = 8

function getCoords(rect: DOMRect, placement: PopoverPlacement): { top: number; left: number } {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  switch (placement) {
    // Top
    case 'top':        return { top: rect.top - GAP, left: cx }
    case 'topLeft':    return { top: rect.top - GAP, left: rect.left }
    case 'topRight':   return { top: rect.top - GAP, left: rect.right }
    // Bottom
    case 'bottom':     return { top: rect.bottom + GAP, left: cx }
    case 'bottomLeft': return { top: rect.bottom + GAP, left: rect.left }
    case 'bottomRight':return { top: rect.bottom + GAP, left: rect.right }
    // Left
    case 'left':       return { top: cy, left: rect.left - GAP }
    case 'leftTop':    return { top: rect.top, left: rect.left - GAP }
    case 'leftBottom': return { top: rect.bottom, left: rect.left - GAP }
    // Right
    case 'right':      return { top: cy, left: rect.right + GAP }
    case 'rightTop':   return { top: rect.top, left: rect.right + GAP }
    case 'rightBottom':return { top: rect.bottom, left: rect.right + GAP }
  }
}

function getTransform(placement: PopoverPlacement, animating: boolean): string {
  const offset = animating ? 0 : 6

  switch (placement) {
    case 'top':         return `translateX(-50%) translateY(-100%) translateY(${offset}px)`
    case 'topLeft':     return `translateY(-100%) translateY(${offset}px)`
    case 'topRight':    return `translateX(-100%) translateY(-100%) translateY(${offset}px)`
    case 'bottom':      return `translateX(-50%) translateY(${-offset}px)`
    case 'bottomLeft':  return `translateY(${-offset}px)`
    case 'bottomRight': return `translateX(-100%) translateY(${-offset}px)`
    case 'left':        return `translateX(-100%) translateY(-50%) translateX(${offset}px)`
    case 'leftTop':     return `translateX(-100%) translateX(${offset}px)`
    case 'leftBottom':  return `translateX(-100%) translateY(-100%) translateX(${offset}px)`
    case 'right':       return `translateY(-50%) translateX(${-offset}px)`
    case 'rightTop':    return `translateX(${-offset}px)`
    case 'rightBottom': return `translateY(-100%) translateX(${-offset}px)`
  }
}

// Arrow: rotated square positioned per placement
function getArrowStyle(placement: PopoverPlacement): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: tokens.colorBg,
  }

  const border = `1px solid ${tokens.colorBorder}`

  switch (placement) {
    case 'top':
      return { ...base, bottom: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: border, borderBottom: border }
    case 'topLeft':
      return { ...base, bottom: '-0.25rem', left: '1rem', transform: 'rotate(45deg)', borderRight: border, borderBottom: border }
    case 'topRight':
      return { ...base, bottom: '-0.25rem', right: '1rem', transform: 'rotate(45deg)', borderRight: border, borderBottom: border }
    case 'bottom':
      return { ...base, top: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'bottomLeft':
      return { ...base, top: '-0.25rem', left: '1rem', transform: 'rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'bottomRight':
      return { ...base, top: '-0.25rem', right: '1rem', transform: 'rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'left':
      return { ...base, right: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'leftTop':
      return { ...base, right: '-0.25rem', top: '0.75rem', transform: 'rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'leftBottom':
      return { ...base, right: '-0.25rem', bottom: '0.75rem', transform: 'rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'right':
      return { ...base, left: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(135deg)', borderRight: border, borderBottom: border }
    case 'rightTop':
      return { ...base, left: '-0.25rem', top: '0.75rem', transform: 'rotate(135deg)', borderRight: border, borderBottom: border }
    case 'rightBottom':
      return { ...base, left: '-0.25rem', bottom: '0.75rem', transform: 'rotate(135deg)', borderRight: border, borderBottom: border }
  }
}

// ─── Auto-flip ──────────────────────────────────────────────────────────────────

function flipPlacement(p: PopoverPlacement): PopoverPlacement {
  if (p === 'top') return 'bottom'
  if (p === 'topLeft') return 'bottomLeft'
  if (p === 'topRight') return 'bottomRight'
  if (p === 'bottom') return 'top'
  if (p === 'bottomLeft') return 'topLeft'
  if (p === 'bottomRight') return 'topRight'
  if (p === 'left') return 'right'
  if (p === 'leftTop') return 'rightTop'
  if (p === 'leftBottom') return 'rightBottom'
  if (p === 'right') return 'left'
  if (p === 'rightTop') return 'leftTop'
  if (p === 'rightBottom') return 'leftBottom'
  return p
}

// ─── Popover Component ──────────────────────────────────────────────────────────

export function Popover({
  title,
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  open: controlledOpen,
  onOpenChange,
  arrow = true,
  mouseEnterDelay = 100,
  mouseLeaveDelay = 100,
  disabled = false,
  className,
  style,
  classNames,
  styles,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)
  const showTimeoutRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const flipCheckedRef = useRef(false)
  const noTransitionRef = useRef(true)

  const isControlled = controlledOpen !== undefined
  const visible = isControlled ? controlledOpen : internalOpen

  // Ref to read current visibility inside stable callbacks
  const visibleRef = useRef(visible)
  visibleRef.current = visible

  // Detect external close (controlled open goes false without hide()) during render
  const prevVisibleRef = useRef(visible)
  if (prevVisibleRef.current !== visible) {
    prevVisibleRef.current = visible
    if (!visible && isAnimating && !isExiting) {
      setIsExiting(true)
    }
    if (visible && isExiting) {
      setIsExiting(false)
    }
  }

  const triggers = Array.isArray(trigger) ? trigger : [trigger]

  // Sync resolvedPlacement when placement prop changes
  useEffect(() => {
    setResolvedPlacement(placement)
  }, [placement])

  const setOpen = useCallback((next: boolean) => {
    if (disabled || next === visibleRef.current) return
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }, [disabled, isControlled, onOpenChange])

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords(getCoords(rect, resolvedPlacement))
  }, [resolvedPlacement])

  // Show with animation
  const show = useCallback(() => {
    // Cancel any pending hide / close
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
    }

    // Already visible — keep current (possibly flipped) placement, just re-animate in
    if (visibleRef.current) {
      setIsAnimating(true)
      return
    }

    // Opening fresh — reset to original placement, useLayoutEffect will auto-flip
    flipCheckedRef.current = false
    noTransitionRef.current = true
    const delay = triggers.includes('hover') ? mouseEnterDelay : 0
    showTimeoutRef.current = window.setTimeout(() => {
      setResolvedPlacement(placement)
      if (triggerRef.current) {
        setCoords(getCoords(triggerRef.current.getBoundingClientRect(), placement))
      }
      setOpen(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransitionRef.current = false
          setIsAnimating(true)
        })
      })
    }, delay)
  }, [mouseEnterDelay, triggers, placement, setOpen])

  // Hide with animation
  const hide = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    const delay = triggers.includes('hover') ? mouseLeaveDelay : 0
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 150)
    }, delay)
  }, [mouseLeaveDelay, triggers, setOpen])

  const toggle = useCallback(() => {
    if (visible) hide()
    else show()
  }, [visible, show, hide])

  // Exit animation for external (programmatic) close
  useEffect(() => {
    if (isExiting) {
      setIsAnimating(false)
      exitTimerRef.current = window.setTimeout(() => {
        setIsExiting(false)
        exitTimerRef.current = null
      }, 150)
      return () => {
        if (exitTimerRef.current) {
          clearTimeout(exitTimerRef.current)
          exitTimerRef.current = null
        }
      }
    }
  }, [isExiting])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  // Reposition on scroll/resize
  useEffect(() => {
    if (!visible) return
    const handle = () => updateCoords()
    window.addEventListener('scroll', handle, true)
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle, true)
      window.removeEventListener('resize', handle)
    }
  }, [visible, updateCoords])

  // Auto-flip: measure popup and flip if it overflows viewport (once per show cycle)
  useLayoutEffect(() => {
    if (!visible || flipCheckedRef.current || !popupRef.current || !triggerRef.current) return
    flipCheckedRef.current = true

    const popupRect = popupRef.current.getBoundingClientRect()
    const triggerRect = triggerRef.current.getBoundingClientRect()

    const isTop = resolvedPlacement.startsWith('top')
    const isBottom = resolvedPlacement.startsWith('bottom')
    const isLeft = resolvedPlacement.startsWith('left')
    const isRight = resolvedPlacement.startsWith('right')

    let shouldFlip = false

    if (isTop && popupRect.top < 0) {
      const spaceBelow = window.innerHeight - triggerRect.bottom
      if (spaceBelow > triggerRect.top) shouldFlip = true
    } else if (isBottom && popupRect.bottom > window.innerHeight) {
      const spaceAbove = triggerRect.top
      if (spaceAbove > window.innerHeight - triggerRect.bottom) shouldFlip = true
    } else if (isLeft && popupRect.left < 0) {
      const spaceRight = window.innerWidth - triggerRect.right
      if (spaceRight > triggerRect.left) shouldFlip = true
    } else if (isRight && popupRect.right > window.innerWidth) {
      const spaceLeft = triggerRect.left
      if (spaceLeft > window.innerWidth - triggerRect.right) shouldFlip = true
    }

    if (shouldFlip) {
      const flipped = flipPlacement(resolvedPlacement)
      setResolvedPlacement(flipped)
      setCoords(getCoords(triggerRect, flipped))
    }
  })

  // Click outside (for click trigger)
  useEffect(() => {
    if (!visible || !triggers.includes('click')) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        hide()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [visible, triggers, hide])

  // ─── Event handlers ─────────────────────────────────────

  const handleMouseEnter = useCallback(() => {
    if (triggers.includes('hover')) show()
  }, [triggers, show])

  const handleMouseLeave = useCallback(() => {
    if (triggers.includes('hover')) hide()
  }, [triggers, hide])

  const handleClick = useCallback(() => {
    if (triggers.includes('click')) toggle()
  }, [triggers, toggle])

  const handleFocus = useCallback(() => {
    if (triggers.includes('focus')) show()
  }, [triggers, show])

  const handleBlur = useCallback(() => {
    if (triggers.includes('focus')) hide()
  }, [triggers, hide])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!triggers.includes('contextMenu')) return
    e.preventDefault()
    toggle()
  }, [triggers, toggle])

  // ─── Popup hover (keep open when hovering popup) ────────

  const handlePopupMouseEnter = useCallback((e: React.MouseEvent) => {
    // Prevent React portal event bubbling to parent Popover triggers
    e.stopPropagation()
    if (triggers.includes('hover')) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }
  }, [triggers])

  const handlePopupMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (triggers.includes('hover')) hide()
  }, [triggers, hide])

  // ─── Resolve content ───────────────────────────────────

  const resolvedTitle = typeof title === 'function' ? title() : title
  const resolvedContent = typeof content === 'function' ? content() : content

  // ─── Styles ────────────────────────────────────────────

  const rootStyle = mergeSemanticStyle(
    { display: 'inline-flex' },
    styles?.root,
    style,
  )

  const popupContainerStyle: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    top: coords.top,
    left: coords.left,
    opacity: isAnimating ? 1 : 0,
    transform: getTransform(resolvedPlacement, isAnimating),
    transition: noTransitionRef.current ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
    pointerEvents: isAnimating ? 'auto' : 'none',
  }

  const cardStyle: CSSProperties = {
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowLg,
    minWidth: '12rem',
    maxWidth: '20rem',
    ...styles?.popup,
  }

  const titleStyle: CSSProperties = {
    padding: '0.5rem 0.75rem',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: tokens.colorText,
    borderBottom: resolvedContent ? `1px solid ${tokens.colorBorder}` : undefined,
    ...styles?.title,
  }

  const contentStyle: CSSProperties = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: tokens.colorText,
    ...styles?.content,
  }

  const arrowComputedStyle: CSSProperties = {
    ...getArrowStyle(resolvedPlacement),
    ...styles?.arrow,
  }

  // ─── Render ────────────────────────────────────────────

  const popup = (visible || isExiting) && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={popupRef}
          style={popupContainerStyle}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div style={cardStyle} className={classNames?.popup}>
            {resolvedTitle != null && (
              <div style={titleStyle} className={classNames?.title}>
                {resolvedTitle}
              </div>
            )}
            {resolvedContent != null && (
              <div style={contentStyle} className={classNames?.content}>
                {resolvedContent}
              </div>
            )}
          </div>
          {arrow && <div style={arrowComputedStyle} className={classNames?.arrow} />}
        </div>,
        document.body,
      )
    : null

  return (
    <div
      ref={triggerRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onContextMenu={handleContextMenu}
    >
      {children}
      {popup}
    </div>
  )
}
