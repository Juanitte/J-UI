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
import { classNames as cx } from '../../utils/classNames'
import './Tooltip.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TooltipPlacement =
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom'

/** @deprecated Use TooltipPlacement instead */
export type TooltipPosition = TooltipPlacement

export type TooltipSemanticSlot = 'root' | 'popup' | 'arrow'
export type TooltipClassNames = SemanticClassNames<TooltipSemanticSlot>
export type TooltipStyles = SemanticStyles<TooltipSemanticSlot>

export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode
  /** Trigger element */
  children: ReactNode
  /** Placement — 12 positions */
  placement?: TooltipPlacement
  /** @deprecated Use placement instead */
  position?: TooltipPlacement
  /** Arrow configuration: true (show), false (hide), or { pointAtCenter } */
  arrow?: boolean | { pointAtCenter: boolean }
  /** Colorful tooltip — preset name or custom CSS color */
  color?: string
  /** Auto-flip when overflowing viewport (default true) */
  autoAdjustOverflow?: boolean
  /** Delay before showing (ms) */
  delay?: number
  /** Disable tooltip */
  disabled?: boolean
  /** CSS class */
  className?: string
  /** Inline style */
  style?: CSSProperties
  /** Semantic class names */
  classNames?: TooltipClassNames
  /** Semantic styles */
  styles?: TooltipStyles
}

// ─── Preset Colors ──────────────────────────────────────────────────────────────

const TOOLTIP_PRESET_COLORS: Record<string, string> = {
  pink:     '#eb2f96',
  magenta:  '#eb2f96',
  red:      '#f5222d',
  volcano:  '#fa541c',
  orange:   '#fa8c16',
  gold:     '#faad14',
  yellow:   '#fadb14',
  lime:     '#a0d911',
  green:    '#52c41a',
  cyan:     '#13c2c2',
  blue:     '#1677ff',
  geekblue: '#2f54eb',
  purple:   '#722ed1',
}

function resolveColor(color?: string): string | undefined {
  if (!color) return undefined
  return TOOLTIP_PRESET_COLORS[color] ?? color
}

// ─── Positioning ────────────────────────────────────────────────────────────────

const GAP = 8

function getCoords(rect: DOMRect, placement: TooltipPlacement): { top: number; left: number } {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  switch (placement) {
    case 'top':         return { top: rect.top - GAP, left: cx }
    case 'topLeft':     return { top: rect.top - GAP, left: rect.left }
    case 'topRight':    return { top: rect.top - GAP, left: rect.right }
    case 'bottom':      return { top: rect.bottom + GAP, left: cx }
    case 'bottomLeft':  return { top: rect.bottom + GAP, left: rect.left }
    case 'bottomRight': return { top: rect.bottom + GAP, left: rect.right }
    case 'left':        return { top: cy, left: rect.left - GAP }
    case 'leftTop':     return { top: rect.top, left: rect.left - GAP }
    case 'leftBottom':  return { top: rect.bottom, left: rect.left - GAP }
    case 'right':       return { top: cy, left: rect.right + GAP }
    case 'rightTop':    return { top: rect.top, left: rect.right + GAP }
    case 'rightBottom': return { top: rect.bottom, left: rect.right + GAP }
  }
}

function getTransform(placement: TooltipPlacement, animating: boolean): string {
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

// ─── Arrow Positioning ──────────────────────────────────────────────────────────

/** Map offset placements to their centered counterpart (for pointAtCenter) */
function toCenteredPlacement(p: TooltipPlacement): TooltipPlacement {
  switch (p) {
    case 'topLeft':     case 'topRight':     return 'top'
    case 'bottomLeft':  case 'bottomRight':  return 'bottom'
    case 'leftTop':     case 'leftBottom':   return 'left'
    case 'rightTop':    case 'rightBottom':  return 'right'
    default: return p
  }
}

function getArrowStyle(
  placement: TooltipPlacement,
  bgColor: string,
  borderColor: string,
  pointAtCenter?: boolean,
): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: bgColor,
  }

  const border = borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none'
  const p = pointAtCenter ? toCenteredPlacement(placement) : placement

  switch (p) {
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

function flipPlacement(p: TooltipPlacement): TooltipPlacement {
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

// ─── Tooltip Component ──────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  placement: placementProp,
  position,
  arrow = true,
  color,
  autoAdjustOverflow = true,
  delay = 200,
  disabled = false,
  className,
  style,
  classNames,
  styles,
}: TooltipProps) {
  const placement = placementProp ?? position ?? 'top'

  const [visible, setVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)
  const showTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const flipCheckedRef = useRef(false)
  const noTransitionRef = useRef(true)
  const visibleRef = useRef(visible)
  visibleRef.current = visible

  // Sync resolvedPlacement when placement prop changes
  useEffect(() => {
    setResolvedPlacement(placement)
  }, [placement])

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords(getCoords(rect, resolvedPlacement))
  }, [resolvedPlacement])

  const showTooltip = useCallback(() => {
    if (disabled) return
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
    }

    // Already visible — just re-animate
    if (visibleRef.current) {
      setIsAnimating(true)
      return
    }

    flipCheckedRef.current = false
    noTransitionRef.current = true
    showTimeoutRef.current = window.setTimeout(() => {
      setResolvedPlacement(placement)
      if (triggerRef.current) {
        setCoords(getCoords(triggerRef.current.getBoundingClientRect(), placement))
      }
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransitionRef.current = false
          setIsAnimating(true)
        })
      })
    }, delay)
  }, [disabled, delay, placement])

  const hideTooltip = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    setIsAnimating(false)
    closeTimeoutRef.current = window.setTimeout(() => setVisible(false), 150)
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Reposition on scroll/resize while visible
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

  // Auto-flip: measure popup and flip if it overflows viewport (once per show)
  useLayoutEffect(() => {
    if (!autoAdjustOverflow || !visible || flipCheckedRef.current || !popupRef.current || !triggerRef.current) return
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

  // ─── Color resolution ─────────────────────────────────────

  const resolvedColor = resolveColor(color)
  const isColorful = !!resolvedColor

  const tooltipBg = isColorful ? resolvedColor : tokens.colorBgMuted
  const tooltipText = isColorful ? '#fff' : tokens.colorText
  const tooltipBorder = isColorful ? 'transparent' : tokens.colorBorder

  // ─── Arrow config ─────────────────────────────────────────

  const showArrow = arrow !== false
  const pointAtCenter = typeof arrow === 'object' && arrow.pointAtCenter

  // ─── Styles ───────────────────────────────────────────────

  const popupClass = cx(
    'ino-tooltip__popup',
    isColorful ? 'ino-tooltip__popup--colorful' : 'ino-tooltip__popup--default',
    { 'ino-tooltip__popup--no-transition': noTransitionRef.current },
    classNames?.popup,
  )

  const tooltipDynamicStyle: CSSProperties = {
    top: coords.top,
    left: coords.left,
    ...(isColorful ? { backgroundColor: tooltipBg, color: tooltipText } : {}),
    opacity: isAnimating ? 1 : 0,
    transform: getTransform(resolvedPlacement, isAnimating),
    ...styles?.popup,
  }

  const arrowComputedStyle: CSSProperties = {
    ...getArrowStyle(resolvedPlacement, tooltipBg, tooltipBorder, pointAtCenter),
    ...styles?.arrow,
  }

  const rootClass = cx('ino-tooltip', className, classNames?.root)
  const rootStyle: CSSProperties = {
    ...styles?.root,
    ...style,
  }

  // ─── Render ───────────────────────────────────────────────

  const popup = visible && typeof document !== 'undefined'
    ? createPortal(
        <div ref={popupRef} style={tooltipDynamicStyle} className={popupClass} role="tooltip">
          {content}
          {showArrow && <div style={arrowComputedStyle} className={cx('ino-tooltip__arrow', classNames?.arrow)} />}
        </div>,
        document.body,
      )
    : null

  return (
    <div
      ref={triggerRef}
      style={rootStyle}
      className={rootClass}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {popup}
    </div>
  )
}
