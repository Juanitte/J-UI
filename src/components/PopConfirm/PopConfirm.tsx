import {
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { Popover } from '../Popover'
import type { PopoverPlacement, PopoverTrigger } from '../Popover'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type PopConfirmSemanticSlot = 'root' | 'icon' | 'title' | 'description' | 'buttons'
export type PopConfirmClassNames = SemanticClassNames<PopConfirmSemanticSlot>
export type PopConfirmStyles = SemanticStyles<PopConfirmSemanticSlot>

export interface PopConfirmProps {
  /** Main question text (required) */
  title: ReactNode
  /** Secondary descriptive text */
  description?: ReactNode
  /** Icon before the title. Default: warning circle. Pass null to hide. */
  icon?: ReactNode | null
  /** Called when OK is clicked. If returns Promise, OK shows loading until resolved. */
  onConfirm?: () => void | Promise<void>
  /** Called when Cancel is clicked */
  onCancel?: () => void
  /** OK button label (default: 'OK') */
  okText?: ReactNode
  /** Cancel button label (default: 'Cancel') */
  cancelText?: ReactNode
  /** Props spread onto the OK button */
  okButtonProps?: Record<string, unknown>
  /** Props spread onto the Cancel button */
  cancelButtonProps?: Record<string, unknown>
  /** Whether to show the cancel button (default: true) */
  showCancel?: boolean
  /** Disable the popconfirm from opening */
  disabled?: boolean

  /** Trigger element */
  children: ReactNode
  /** Placement relative to trigger (default: 'top') */
  placement?: PopoverPlacement
  /** Trigger mode(s) (default: 'click') */
  trigger?: PopoverTrigger | PopoverTrigger[]
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Show arrow (default: true) */
  arrow?: boolean
  /** Delay before showing on hover (ms) */
  mouseEnterDelay?: number
  /** Delay before hiding on mouse leave (ms) */
  mouseLeaveDelay?: number

  className?: string
  style?: CSSProperties
  classNames?: PopConfirmClassNames
  styles?: PopConfirmStyles
}

// ============================================================================
// Icons
// ============================================================================

function WarningCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" style={{ animation: 'j-popconfirm-spin 0.75s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ============================================================================
// PopConfirm Component
// ============================================================================

export function PopConfirm({
  title,
  description,
  icon,
  onConfirm,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  okButtonProps,
  cancelButtonProps,
  showCancel = true,
  disabled = false,
  children,
  placement = 'top',
  trigger = 'click',
  open: controlledOpen,
  onOpenChange,
  arrow = true,
  mouseEnterDelay,
  mouseLeaveDelay,
  className,
  style,
  classNames,
  styles,
}: PopConfirmProps) {
  // ── State ──
  const [internalOpen, setInternalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const isControlled = controlledOpen !== undefined
  const mergedOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }, [isControlled, onOpenChange])

  // ── Handlers ──
  const handleConfirm = useCallback(() => {
    const result = onConfirm?.()
    if (result && typeof (result as Promise<void>).then === 'function') {
      setConfirmLoading(true)
      ;(result as Promise<void>).then(
        () => { setConfirmLoading(false); setOpen(false) },
        () => { setConfirmLoading(false) },
      )
    } else {
      setOpen(false)
    }
  }, [onConfirm, setOpen])

  const handleCancel = useCallback(() => {
    onCancel?.()
    setOpen(false)
  }, [onCancel, setOpen])

  // ── Button styles ──
  const baseBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'filter 0.15s, border-color 0.15s, opacity 0.15s',
    lineHeight: 1.5,
  }

  const { style: cancelBtnExtraStyle, ...cancelBtnRest } = (cancelButtonProps ?? {}) as Record<string, unknown>
  const { style: okBtnExtraStyle, ...okBtnRest } = (okButtonProps ?? {}) as Record<string, unknown>

  // ── Confirm content ──
  const confirmContent = (
    <div style={{ padding: '0.75rem', ...styles?.root }} className={classNames?.root} onClick={(e) => e.stopPropagation()}>
      <style>{`@keyframes j-popconfirm-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Message row: icon + title/description */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {icon !== null && (
          <span
            className={classNames?.icon}
            style={{
              color: tokens.colorWarning,
              flexShrink: 0,
              marginTop: '0.125rem',
              display: 'inline-flex',
              ...styles?.icon,
            }}
          >
            {icon === undefined ? <WarningCircleIcon /> : icon}
          </span>
        )}
        <div>
          <div
            className={classNames?.title}
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: tokens.colorText,
              ...styles?.title,
            }}
          >
            {title}
          </div>
          {description != null && (
            <div
              className={classNames?.description}
              style={{
                fontSize: '0.8125rem',
                color: tokens.colorTextMuted,
                marginTop: '0.25rem',
                ...styles?.description,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Button row */}
      <div
        className={classNames?.buttons}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          ...styles?.buttons,
        }}
      >
        {showCancel && (
          <button
            type="button"
            style={{
              ...baseBtnStyle,
              backgroundColor: tokens.colorBg,
              color: tokens.colorText,
              border: `1px solid ${tokens.colorBorder}`,
              ...(cancelBtnExtraStyle as CSSProperties),
            }}
            onClick={handleCancel}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.colorBorderHover }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.colorBorder }}
            {...cancelBtnRest}
          >
            {cancelText}
          </button>
        )}
        <button
          type="button"
          style={{
            ...baseBtnStyle,
            backgroundColor: tokens.colorPrimary,
            color: tokens.colorPrimaryContrast,
            border: `1px solid ${tokens.colorPrimary}`,
            opacity: confirmLoading ? 0.7 : 1,
            pointerEvents: confirmLoading ? 'none' : 'auto',
            ...(okBtnExtraStyle as CSSProperties),
          }}
          onClick={handleConfirm}
          disabled={confirmLoading}
          onMouseEnter={(e) => { if (!confirmLoading) e.currentTarget.style.filter = 'brightness(1.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = '' }}
          {...okBtnRest}
        >
          {confirmLoading && <Spinner />}
          {okText}
        </button>
      </div>
    </div>
  )

  // ── Render ──
  return (
    <Popover
      content={confirmContent}
      placement={placement}
      trigger={trigger}
      open={mergedOpen}
      onOpenChange={setOpen}
      arrow={arrow}
      disabled={disabled}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      className={className}
      style={style}
      styles={{ content: { padding: 0 } }}
    >
      {children}
    </Popover>
  )
}
