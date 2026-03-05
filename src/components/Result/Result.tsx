import { type ReactNode, type CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 403 | 404 | 500

export type ResultSemanticSlot = 'root' | 'icon' | 'title' | 'subtitle' | 'extra' | 'content'
export type ResultClassNames = SemanticClassNames<ResultSemanticSlot>
export type ResultStyles = SemanticStyles<ResultSemanticSlot>

export interface ResultProps {
  /** Status type (default 'info') */
  status?: ResultStatus
  /** Custom icon, overrides status icon */
  icon?: ReactNode
  /** Title text */
  title?: ReactNode
  /** Subtitle / description text */
  subTitle?: ReactNode
  /** Action area (buttons etc.) */
  extra?: ReactNode
  /** Additional content below actions */
  children?: ReactNode

  className?: string
  style?: CSSProperties
  classNames?: ResultClassNames
  styles?: ResultStyles
}

// ============================================================================
// Status Colors
// ============================================================================

const STATUS_COLORS: Record<string, string> = {
  success: tokens.colorSuccess,
  error: tokens.colorError,
  warning: tokens.colorWarning,
  info: tokens.colorPrimary,
  '403': tokens.colorWarning,
  '404': tokens.colorPrimary,
  '500': tokens.colorError,
}

// ============================================================================
// Status Icons (success, error, warning, info)
// ============================================================================

function SuccessIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}

function StatusIcon({ status, color }: { status: string; color: string }) {
  switch (status) {
    case 'success': return <SuccessIcon color={color} />
    case 'error': return <ErrorIcon color={color} />
    case 'warning': return <WarningIcon color={color} />
    case 'info':
    default: return <InfoIcon color={color} />
  }
}

// ============================================================================
// HTTP Error Illustrations (403, 404, 500)
// ============================================================================

function Illustration403({ color }: { color: string }) {
  const muted = tokens.colorBgMuted
  return (
    <svg width="250" height="200" viewBox="0 0 250 215" fill="none">
      {/* Shield body */}
      <path
        d="M125 20L45 60v50c0 47.5 34 91.8 80 100 46-8.2 80-52.5 80-100V60L125 20z"
        fill={muted}
        stroke={color}
        strokeWidth="3"
      />
      {/* Lock body */}
      <rect x="99" y="100" width="52" height="40" rx="4" fill={color} opacity="0.85" />
      {/* Lock shackle */}
      <path
        d="M108 100V88a17 17 0 0 1 34 0v12"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Keyhole */}
      <circle cx="125" cy="116" r="5" fill="#fff" />
      <rect x="123" y="119" width="4" height="10" rx="2" fill="#fff" />
    </svg>
  )
}

function Illustration404({ color }: { color: string }) {
  const muted = tokens.colorBgMuted
  return (
    <svg width="250" height="200" viewBox="0 0 250 200" fill="none">
      {/* Page */}
      <rect x="65" y="20" width="120" height="160" rx="8" fill={muted} stroke={color} strokeWidth="3" />
      {/* Fold corner */}
      <path d="M155 20v30h30" stroke={color} strokeWidth="3" fill={tokens.colorBg} />
      {/* Lines (content placeholders) */}
      <rect x="85" y="70" width="80" height="6" rx="3" fill={color} opacity="0.2" />
      <rect x="85" y="86" width="60" height="6" rx="3" fill={color} opacity="0.15" />
      <rect x="85" y="102" width="70" height="6" rx="3" fill={color} opacity="0.1" />
      {/* Magnifying glass */}
      <circle cx="175" cy="140" r="22" stroke={color} strokeWidth="4" fill="none" />
      <line x1="191" y1="156" x2="210" y2="175" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Question mark */}
      <text x="175" y="148" textAnchor="middle" fontSize="24" fontWeight="bold" fill={color} fontFamily="sans-serif">?</text>
    </svg>
  )
}

function Illustration500({ color }: { color: string }) {
  const muted = tokens.colorBgMuted
  return (
    <svg width="250" height="200" viewBox="0 0 250 200" fill="none">
      {/* Server box */}
      <rect x="60" y="50" width="130" height="110" rx="10" fill={muted} stroke={color} strokeWidth="3" />
      {/* Server lines / slots */}
      <rect x="80" y="70" width="90" height="10" rx="3" fill={color} opacity="0.15" />
      <rect x="80" y="90" width="90" height="10" rx="3" fill={color} opacity="0.15" />
      <rect x="80" y="110" width="90" height="10" rx="3" fill={color} opacity="0.15" />
      {/* LEDs */}
      <circle cx="85" cy="140" r="4" fill={color} opacity="0.3" />
      <circle cx="100" cy="140" r="4" fill={color} opacity="0.3" />
      <circle cx="115" cy="140" r="4" fill={tokens.colorError} />
      {/* Warning triangle overlay */}
      <g transform="translate(155, 110)">
        <path d="M20 0L40 35H0L20 0z" fill={color} />
        <text x="20" y="28" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff" fontFamily="sans-serif">!</text>
      </g>
    </svg>
  )
}

function HttpIllustration({ status, color }: { status: number; color: string }) {
  switch (status) {
    case 403: return <Illustration403 color={color} />
    case 404: return <Illustration404 color={color} />
    case 500: return <Illustration500 color={color} />
    default: return null
  }
}

// ============================================================================
// Result Component
// ============================================================================

export function Result({
  status = 'info',
  icon,
  title,
  subTitle,
  extra,
  children,
  className,
  style,
  classNames,
  styles,
}: ResultProps) {
  const statusKey = String(status)
  const statusColor = STATUS_COLORS[statusKey] || tokens.colorPrimary
  const isHttpError = status === 403 || status === 404 || status === 500

  // Resolve icon
  const iconElement = icon != null
    ? icon
    : isHttpError
      ? <HttpIllustration status={status as number} color={statusColor} />
      : <StatusIcon status={statusKey} color={statusColor} />

  return (
    <div
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(
        {
          textAlign: 'center',
          padding: '3rem 2rem',
        },
        styles?.root,
        style,
      )}
    >
      {/* Icon */}
      <div
        className={classNames?.icon}
        style={mergeSemanticStyle(
          {
            marginBottom: '1.5rem',
            fontSize: isHttpError ? undefined : '4.5rem',
            lineHeight: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          styles?.icon,
        )}
      >
        {iconElement}
      </div>

      {/* Title */}
      {title != null && (
        <div
          className={classNames?.title}
          style={mergeSemanticStyle(
            {
              fontSize: '1.5rem',
              fontWeight: 600,
              color: tokens.colorText,
              marginBottom: '0.5rem',
              lineHeight: 1.35,
            },
            styles?.title,
          )}
        >
          {title}
        </div>
      )}

      {/* Subtitle */}
      {subTitle != null && (
        <div
          className={classNames?.subtitle}
          style={mergeSemanticStyle(
            {
              fontSize: '0.875rem',
              color: tokens.colorTextMuted,
              lineHeight: 1.6,
            },
            styles?.subtitle,
          )}
        >
          {subTitle}
        </div>
      )}

      {/* Extra (actions) */}
      {extra != null && (
        <div
          className={classNames?.extra}
          style={mergeSemanticStyle(
            {
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
            },
            styles?.extra,
          )}
        >
          {extra}
        </div>
      )}

      {/* Content (children) */}
      {children != null && (
        <div
          className={classNames?.content}
          style={mergeSemanticStyle(
            {
              marginTop: '1.5rem',
              textAlign: 'left',
              background: tokens.colorBgSubtle,
              padding: '1.5rem',
              borderRadius: '0.5rem',
            },
            styles?.content,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
