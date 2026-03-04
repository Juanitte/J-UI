import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName } from '../../utils/semanticDom'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.25rem 0' }}>
      <style>{`@keyframes j-drawer-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      <div style={{ height: '1rem', width: '60%', borderRadius: '0.25rem', backgroundColor: tokens.colorBgMuted, animation: 'j-drawer-pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '1rem', width: '100%', borderRadius: '0.25rem', backgroundColor: tokens.colorBgMuted, animation: 'j-drawer-pulse 1.5s ease-in-out infinite 0.1s' }} />
      <div style={{ height: '1rem', width: '80%', borderRadius: '0.25rem', backgroundColor: tokens.colorBgMuted, animation: 'j-drawer-pulse 1.5s ease-in-out infinite 0.2s' }} />
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
  const wrapperStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex,
    pointerEvents: mounted ? 'auto' : 'none',
    display: mounted ? undefined : 'none',
  }

  const maskStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    opacity: animating ? 1 : 0,
    transition: 'opacity 0.3s ease',
    ...styles?.mask,
  }

  const panelStyle: CSSProperties = {
    position: 'absolute',
    ...getPanelPosition(placement),
    ...panelDimensions,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorBg,
    color: tokens.colorText,
    boxShadow: tokens.shadowLg,
    transform: getTransform(placement, animating),
    transition: 'transform 0.3s ease',
    ...styles?.root,
    ...style,
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${tokens.colorBorder}`,
    flexShrink: 0,
    ...styles?.header,
  }

  const bodyStyle: CSSProperties = {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    ...styles?.body,
  }

  const footerStyle: CSSProperties = {
    padding: '1rem 1.5rem',
    borderTop: `1px solid ${tokens.colorBorder}`,
    flexShrink: 0,
    ...styles?.footer,
  }

  const closeBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.25rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: tokens.colorTextSubtle,
    borderRadius: '0.25rem',
    transition: 'color 0.15s',
    marginLeft: 'auto',
    flexShrink: 0,
    ...styles?.closeBtn,
  }

  const hasHeader = title != null || extra != null || closable
  const shouldRenderContent = !destroyOnClose || mounted

  const portal = createPortal(
    <div style={wrapperStyle}>
      {/* Mask */}
      {showMask && (
        <div
          className={classNames?.mask}
          style={maskStyle}
          onClick={handleMaskClick}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={mergeSemanticClassName(className, classNames?.root)}
        style={panelStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Header */}
        {hasHeader && (
          <div className={classNames?.header} style={headerStyle}>
            {title != null && (
              <div style={{ flex: 1, fontSize: '1rem', fontWeight: 600, color: tokens.colorText, minWidth: 0 }}>
                {title}
              </div>
            )}
            {extra != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: title != null ? '1rem' : 0 }}>
                {extra}
              </div>
            )}
            {closable && (
              <button
                ref={closeBtnRef}
                type="button"
                className={classNames?.closeBtn}
                style={closeBtnStyle}
                onClick={(e) => onClose?.(e)}
                onMouseEnter={(e) => { e.currentTarget.style.color = tokens.colorText }}
                onMouseLeave={(e) => { e.currentTarget.style.color = tokens.colorTextSubtle }}
              >
                {closeIcon ?? <CloseIcon />}
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {shouldRenderContent && (
          <div className={classNames?.body} style={bodyStyle}>
            {loading ? <LoadingSkeleton /> : children}
          </div>
        )}

        {/* Footer */}
        {footer != null && (
          <div className={classNames?.footer} style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )

  return portal
}
