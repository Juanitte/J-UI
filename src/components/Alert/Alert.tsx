import {
  useState,
  useRef,
  useCallback,
  Component,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import { useThemeMode } from '../../theme'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Alert.css'

// ============================================================================
// Types
// ============================================================================

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export interface AlertClosable {
  closeIcon?: ReactNode
  onClose?: (e: React.MouseEvent) => void
  afterClose?: () => void
}

export type AlertSemanticSlot = 'root' | 'icon' | 'content' | 'message' | 'description' | 'action' | 'closeBtn'
export type AlertClassNames = SemanticClassNames<AlertSemanticSlot>
export type AlertStyles = SemanticStyles<AlertSemanticSlot>

export interface AlertProps {
  type?: AlertType
  title?: ReactNode
  description?: ReactNode
  showIcon?: boolean
  icon?: ReactNode
  closable?: boolean | AlertClosable
  action?: ReactNode
  banner?: boolean
  className?: string
  style?: CSSProperties
  classNames?: AlertClassNames
  styles?: AlertStyles
}

// ============================================================================
// Icons
// ============================================================================

function SuccessIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}

function WarningIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

function ErrorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ============================================================================
// Color config
// ============================================================================

type TypeColors = { bg: string; border: string; icon: string }

const BASE_COLORS: Record<AlertType, string> = {
  success: tokens.colorSuccess,
  info:    tokens.colorInfo,
  warning: tokens.colorWarning,
  error:   tokens.colorError,
}

function getTypeColors(type: AlertType, isDark: boolean): TypeColors {
  const base = BASE_COLORS[type]
  if (isDark) {
    return {
      bg:     `color-mix(in srgb, ${base} 18%, ${tokens.colorBg})`,
      border: `color-mix(in srgb, ${base} 30%, ${tokens.colorBorder})`,
      icon:   base,
    }
  }
  return {
    bg:     `color-mix(in srgb, ${base} 15%, white)`,
    border: `color-mix(in srgb, ${base} 40%, ${tokens.colorBorder})`,
    icon:   base,
  }
}

const DEFAULT_ICONS: Record<AlertType, (size: number) => ReactNode> = {
  success: (size) => <SuccessIcon size={size} />,
  info:    (size) => <InfoIcon size={size} />,
  warning: (size) => <WarningIcon size={size} />,
  error:   (size) => <ErrorIcon size={size} />,
}

// ============================================================================
// Alert Component
// ============================================================================

export function Alert({
  type: typeProp,
  title,
  description,
  showIcon: showIconProp,
  icon: customIcon,
  closable = false,
  action,
  banner = false,
  className,
  style,
  classNames,
  styles,
}: AlertProps) {
  const themeMode = useThemeMode()
  const isDark = themeMode === 'dark'

  const resolvedType: AlertType = typeProp ?? (banner ? 'warning' : 'info')
  const resolvedShowIcon = showIconProp ?? banner
  const config = getTypeColors(resolvedType, isDark)
  const hasDescription = description !== undefined && description !== null

  // ── Close state ──
  const [closing, setClosing] = useState(false)
  const [closed, setClosed] = useState(false)
  const closableConfig: AlertClosable | null =
    closable === true ? {} :
    closable === false ? null :
    closable

  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback((e: React.MouseEvent) => {
    closableConfig?.onClose?.(e)
    setClosing(true)
  }, [closableConfig])

  const handleTransitionEnd = useCallback(() => {
    if (closing) {
      setClosed(true)
      closableConfig?.afterClose?.()
    }
  }, [closing, closableConfig])

  if (closed) return null

  const iconSize = hasDescription ? 24 : 16

  const rootClass = cx(
    'ino-alert',
    hasDescription ? 'ino-alert--with-description' : 'ino-alert--compact',
    banner ? 'ino-alert--banner' : 'ino-alert--rounded',
    { 'ino-alert--closing': closing },
    className,
    classNames?.root,
  )

  const rootDynamicStyle: CSSProperties = {
    backgroundColor: config.bg,
    ...(banner
      ? { borderBottom: `1px solid ${config.border}` }
      : { border: `1px solid ${config.border}` }
    ),
    ...styles?.root,
    ...style,
  }

  return (
    <div
      ref={wrapperRef}
      className={cx('ino-alert__collapse', closing ? 'ino-alert__collapse--closing' : 'ino-alert__collapse--open')}
      onTransitionEnd={(e) => {
        if (e.target === wrapperRef.current) handleTransitionEnd()
      }}
    >
    <div className="ino-alert__collapse-inner">
    <div
      role="alert"
      className={rootClass}
      style={rootDynamicStyle}
    >
      {/* Icon */}
      {resolvedShowIcon && (
        <span
          className={cx('ino-alert__icon', classNames?.icon)}
          style={{
            color: config.icon,
            marginTop: hasDescription ? '0.125rem' : 0,
            ...styles?.icon,
          }}
        >
          {customIcon ?? DEFAULT_ICONS[resolvedType](iconSize)}
        </span>
      )}

      {/* Content */}
      <div
        className={cx('ino-alert__content', classNames?.content)}
        style={styles?.content}
      >
        {title && (
          <div
            className={cx(
              hasDescription ? 'ino-alert__message--with-description' : 'ino-alert__message--standalone',
              classNames?.message,
            )}
            style={styles?.message}
          >
            {title}
          </div>
        )}
        {hasDescription && (
          <div
            className={cx('ino-alert__description', classNames?.description)}
            style={{
              marginTop: title ? '0.25rem' : 0,
              ...styles?.description,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Action */}
      {action && (
        <span
          className={cx('ino-alert__action', classNames?.action)}
          style={styles?.action}
        >
          {action}
        </span>
      )}

      {/* Close button */}
      {closableConfig && (
        <button
          type="button"
          onClick={handleClose}
          className={cx('ino-alert__close-btn', classNames?.closeBtn)}
          style={{
            marginLeft: action ? 0 : '0.5rem',
            ...styles?.closeBtn,
          }}
        >
          {closableConfig.closeIcon ?? <CloseIcon />}
        </button>
      )}

    </div>
    </div>
    </div>
  )
}

// ============================================================================
// ErrorBoundary
// ============================================================================

interface AlertErrorBoundaryProps {
  children: ReactNode
  title?: ReactNode
  description?: ReactNode
}

interface AlertErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class AlertErrorBoundary extends Component<AlertErrorBoundaryProps, AlertErrorBoundaryState> {
  state: AlertErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): AlertErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          showIcon
          title={this.props.title ?? 'Something went wrong'}
          description={this.props.description ?? this.state.error?.message}
        />
      )
    }
    return this.props.children
  }
}

Object.assign(Alert, { ErrorBoundary: AlertErrorBoundary })
