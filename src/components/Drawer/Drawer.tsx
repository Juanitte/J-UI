import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Drawer.css'

// ============================================================================
// Types
// ============================================================================

export type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom'
export type DrawerSize = 'default' | 'large'

export type DrawerSemanticSlot = 'root' | 'mask' | 'header' | 'body' | 'footer' | 'closeBtn'
export type DrawerClassNames = SemanticClassNames<DrawerSemanticSlot>
export type DrawerStyles = SemanticStyles<DrawerSemanticSlot>

export interface DrawerProps {
  open?: boolean
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void
  afterOpenChange?: (open: boolean) => void
  placement?: DrawerPlacement
  size?: DrawerSize
  width?: number | string
  height?: number | string
  title?: ReactNode
  extra?: ReactNode
  footer?: ReactNode
  closable?: boolean
  closeIcon?: ReactNode
  mask?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  zIndex?: number
  destroyOnClose?: boolean
  loading?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: DrawerClassNames
  styles?: DrawerStyles
}

// ============================================================================
// Icons
// ============================================================================

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ============================================================================
// Helpers
// ============================================================================

const SIZE_MAP: Record<DrawerSize, string> = {
  default: '23.625rem',
  large: '46rem',
}

function isHorizontal(placement: DrawerPlacement): boolean {
  return placement === 'left' || placement === 'right'
}

function getTransform(placement: DrawerPlacement, visible: boolean): string {
  if (visible) return 'translate(0, 0)'
  switch (placement) {
    case 'right':  return 'translateX(100%)'
    case 'left':   return 'translateX(-100%)'
    case 'top':    return 'translateY(-100%)'
    case 'bottom': return 'translateY(100%)'
  }
}

function getPanelPosition(placement: DrawerPlacement): CSSProperties {
  switch (placement) {
    case 'right':  return { top: 0, right: 0, bottom: 0 }
    case 'left':   return { top: 0, left: 0, bottom: 0 }
    case 'top':    return { top: 0, left: 0, right: 0 }
    case 'bottom': return { bottom: 0, left: 0, right: 0 }
  }
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="ino-drawer__skeleton">
      <div className="ino-drawer__skeleton-bar" style={{ width: '60%' }} />
      <div className="ino-drawer__skeleton-bar" style={{ width: '100%', animationDelay: '0.1s' }} />
      <div className="ino-drawer__skeleton-bar" style={{ width: '80%', animationDelay: '0.2s' }} />
    </div>
  )
}

// ============================================================================
// Drawer Component
// ============================================================================

export function Drawer({
  open = false,
  onClose,
  afterOpenChange,
  placement = 'right',
  size = 'default',
  width,
  height,
  title,
  extra,
  footer,
  closable = true,
  closeIcon,
  mask: showMask = true,
  maskClosable = true,
  keyboard = true,
  zIndex = 1000,
  destroyOnClose = false,
  loading = false,
  children,
  className,
  style,
  classNames,
  styles,
}: DrawerProps) {
  // ── State ──
  const [mounted, setMounted] = useState(false)
  const [animating, setAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevBodyOverflowRef = useRef<string>('')
  const hasEverOpenedRef = useRef(false)

  // Track whether content should render
  if (open) hasEverOpenedRef.current = true

  // ── Mount / open animation ──
  useEffect(() => {
    if (open) {
      setMounted(true)
      // Double rAF for enter animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true)
        })
      })
    } else {
      setAnimating(false)
    }
  }, [open])

  // ── Handle transition end ──
  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.target !== panelRef.current) return
    if (!open) {
      setMounted(false)
      afterOpenChange?.(false)
    } else {
      afterOpenChange?.(true)
    }
  }, [open, afterOpenChange])

  // ── Body scroll lock ──
  useEffect(() => {
    if (mounted) {
      prevBodyOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevBodyOverflowRef.current
    }
    return () => {
      document.body.style.overflow = prevBodyOverflowRef.current
    }
  }, [mounted])

  // ── Keyboard (Esc) ──
  useEffect(() => {
    if (!mounted || !keyboard) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.(e as unknown as React.KeyboardEvent)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mounted, keyboard, onClose])

  // ── Mask click ──
  const handleMaskClick = useCallback((e: React.MouseEvent) => {
    if (maskClosable) onClose?.(e)
  }, [maskClosable, onClose])

  // ── Close button hover ──
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // ── Don't render if never opened or unmounted ──
  if (!mounted && !hasEverOpenedRef.current) return null
  if (!mounted && destroyOnClose) return null

  // ── Sizing ──
  const horizontal = isHorizontal(placement)
  const resolvedWidth = width ?? SIZE_MAP[size]
  const resolvedHeight = height ?? SIZE_MAP[size]

  const panelDimensions: CSSProperties = horizontal
    ? { width: resolvedWidth, height: '100%' }
    : { height: resolvedHeight, width: '100%' }

  // ── Styles ──
  const wrapperClass = cx(
    'ino-drawer__wrapper',
    { 'ino-drawer__wrapper--hidden': !mounted },
  )

  const panelDynamicStyle: CSSProperties = {
    ...getPanelPosition(placement),
    ...panelDimensions,
    transform: getTransform(placement, animating),
    ...styles?.root,
    ...style,
  }

  const hasHeader = title != null || extra != null || closable
  const shouldRenderContent = !destroyOnClose || mounted

  const portal = createPortal(
    <div className={wrapperClass} style={{ zIndex, pointerEvents: mounted ? 'auto' : 'none' }}>
      {/* Mask */}
      {showMask && (
        <div
          className={cx('ino-drawer__mask', classNames?.mask)}
          style={{ opacity: animating ? 1 : 0, ...styles?.mask }}
          onClick={handleMaskClick}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={cx('ino-drawer__panel', className, classNames?.root)}
        style={panelDynamicStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Header */}
        {hasHeader && (
          <div className={cx('ino-drawer__header', classNames?.header)} style={styles?.header}>
            {title != null && (
              <div className="ino-drawer__title">
                {title}
              </div>
            )}
            {extra != null && (
              <div className="ino-drawer__extra" style={{ marginLeft: title != null ? '1rem' : 0 }}>
                {extra}
              </div>
            )}
            {closable && (
              <button
                ref={closeBtnRef}
                type="button"
                className={cx('ino-drawer__close-btn', classNames?.closeBtn)}
                style={styles?.closeBtn}
                onClick={(e) => onClose?.(e)}
              >
                {closeIcon ?? <CloseIcon />}
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {shouldRenderContent && (
          <div className={cx('ino-drawer__body', classNames?.body)} style={styles?.body}>
            {loading ? <LoadingSkeleton /> : children}
          </div>
        )}

        {/* Footer */}
        {footer != null && (
          <div className={cx('ino-drawer__footer', classNames?.footer)} style={styles?.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )

  return portal
}
