import type { ReactNode, CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticStyle, mergeSemanticClassName } from '../../utils/semanticDom'
import { Tooltip } from '../Tooltip'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'
export type BadgeSize = 'default' | 'small'
export type BadgePresetColor =
  | 'pink' | 'red' | 'yellow' | 'orange' | 'cyan' | 'green'
  | 'blue' | 'purple' | 'geekblue' | 'magenta' | 'volcano' | 'gold' | 'lime'

export type BadgeSemanticSlot = 'root' | 'indicator'
export type BadgeClassNames = SemanticClassNames<BadgeSemanticSlot>
export type BadgeStyles = SemanticStyles<BadgeSemanticSlot>

export interface BadgeProps {
  children?: ReactNode
  count?: ReactNode
  overflowCount?: number
  dot?: boolean
  showZero?: boolean
  size?: BadgeSize
  status?: BadgeStatus
  text?: ReactNode
  color?: string
  offset?: [number, number]
  title?: string
  className?: string
  style?: CSSProperties
  classNames?: BadgeClassNames
  styles?: BadgeStyles
}

export type RibbonPlacement = 'start' | 'end'

export type RibbonSemanticSlot = 'wrapper' | 'ribbon' | 'content' | 'corner'
export type RibbonClassNames = SemanticClassNames<RibbonSemanticSlot>
export type RibbonStyles = SemanticStyles<RibbonSemanticSlot>

export interface BadgeRibbonProps {
  children?: ReactNode
  text?: ReactNode
  color?: string
  placement?: RibbonPlacement
  className?: string
  style?: CSSProperties
  classNames?: RibbonClassNames
  styles?: RibbonStyles
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<BadgeStatus, string> = {
  success: tokens.colorSuccess,
  processing: tokens.colorPrimary,
  default: tokens.colorBorder,
  error: tokens.colorError,
  warning: tokens.colorWarning,
}

const PRESET_COLORS: Record<string, string> = {
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

function resolveColor(color: string): string {
  return PRESET_COLORS[color] ?? color
}

// ─── Processing Animation ───────────────────────────────────────────────────────

const PROCESSING_KEYFRAMES = `
@keyframes j-badge-processing {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0; }
}`

let stylesInjected = false
function injectBadgeStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = PROCESSING_KEYFRAMES
  document.head.appendChild(style)
  stylesInjected = true
}

// ─── Badge Component ────────────────────────────────────────────────────────────

function BadgeComponent({
  children,
  count,
  overflowCount = 99,
  dot = false,
  showZero = false,
  size = 'default',
  status,
  text,
  color,
  offset,
  title,
  className,
  style,
  classNames,
  styles,
}: BadgeProps) {
  injectBadgeStyles()

  const isSmall = size === 'small'
  const hasChildren = children !== undefined && children !== null && children !== ''
  const hasStatus = status !== undefined

  // ─── Display logic ──────────────────────────────────────────────────

  const numericCount = typeof count === 'number' ? count : undefined

  const showIndicator = (() => {
    if (dot) return numericCount !== 0 || showZero
    if (count !== undefined && count !== null) {
      if (typeof count === 'number') return count > 0 || showZero
      return true
    }
    return false
  })()

  const displayCount = (() => {
    if (dot) return null
    if (typeof count === 'number') {
      return count > overflowCount ? `${overflowCount}+` : `${count}`
    }
    return count
  })()

  const resolvedTitle = title ?? (typeof count === 'number' ? `${count}` : undefined)

  // ─── Status-only mode (no children, has status) ─────────────────────

  if (!hasChildren && hasStatus) {
    const resolvedColor = color ? resolveColor(color) : STATUS_COLORS[status!]

    return (
      <span
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            lineHeight: 1,
          },
          styles?.root,
          style,
        )}
      >
        <span
          style={mergeSemanticStyle(
            {
              position: 'relative',
              display: 'inline-block',
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '50%',
              backgroundColor: resolvedColor as string,
            },
            styles?.indicator,
          )}
          className={classNames?.indicator}
        >
          {status === 'processing' && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: resolvedColor as string,
                animation: 'j-badge-processing 1.2s ease-in-out infinite',
              }}
            />
          )}
        </span>
        {text != null && (
          <span
            style={{
              color: tokens.colorText,
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            {text}
          </span>
        )}
      </span>
    )
  }

  // ─── Indicator styles ───────────────────────────────────────────────

  const resolvedColor = color ? resolveColor(color) : (hasStatus ? STATUS_COLORS[status!] : tokens.colorError)

  const offsetRight = offset ? -offset[0] : 0
  const offsetTop = offset ? offset[1] : 0

  const baseTransform = hasChildren
    ? `translate(50%, -50%) translate(${offsetRight}px, ${offsetTop}px)`
    : undefined

  const indicatorBaseStyle: CSSProperties = dot
    ? {
        ...(hasChildren
          ? { position: 'absolute', top: 0, right: 0, transform: baseTransform, zIndex: 1 }
          : {}),
        display: 'inline-block',
        width: isSmall ? '0.375rem' : '0.5rem',
        height: isSmall ? '0.375rem' : '0.5rem',
        borderRadius: '50%',
        backgroundColor: resolvedColor as string,
        ...(hasChildren
          ? { boxShadow: `0 0 0 1px ${tokens.colorBg}` }
          : {}),
      }
    : {
        ...(hasChildren
          ? { position: 'absolute', top: 0, right: 0, transform: baseTransform, zIndex: 1 }
          : {}),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: isSmall ? '1rem' : '1.25rem',
        height: isSmall ? '1rem' : '1.25rem',
        padding: '0 0.375rem',
        borderRadius: '0.625rem',
        backgroundColor: resolvedColor as string,
        color: '#fff',
        fontSize: isSmall ? '0.625rem' : '0.75rem',
        fontWeight: 600,
        fontFamily: 'tabular-nums',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...(hasChildren
          ? { boxShadow: `0 0 0 1px ${tokens.colorBg}` }
          : {}),
      }

  const indicatorStyle = mergeSemanticStyle(indicatorBaseStyle, styles?.indicator)

  // ─── Standalone count/dot (no children, no status) ──────────────────

  if (!hasChildren) {
    if (!showIndicator) return null
    return (
      <span
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          { display: 'inline-flex' },
          styles?.root,
          style,
        )}
      >
        <Tooltip content={resolvedTitle} disabled={!resolvedTitle}>
          <sup className={classNames?.indicator} style={indicatorStyle}>
            {displayCount}
          </sup>
        </Tooltip>
      </span>
    )
  }

  // ─── Wrapping mode (has children) ───────────────────────────────────

  return (
    <span
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(
        {
          position: 'relative',
          display: 'inline-flex',
          verticalAlign: 'middle',
          lineHeight: 1,
        },
        styles?.root,
        style,
      )}
    >
      {children}
      {showIndicator && (
        <Tooltip content={resolvedTitle} disabled={!resolvedTitle}>
          <sup className={classNames?.indicator} style={indicatorStyle}>
            {displayCount}
          </sup>
        </Tooltip>
      )}
    </span>
  )
}

// ─── Badge.Ribbon ───────────────────────────────────────────────────────────────

function BadgeRibbon({
  children,
  text,
  color = tokens.colorPrimary as string,
  placement = 'end',
  className,
  style,
  classNames,
  styles,
}: BadgeRibbonProps) {
  const isEnd = placement === 'end'
  const resolvedColor = resolveColor(color)

  const wrapperStyle = mergeSemanticStyle(
    { position: 'relative' as const },
    styles?.wrapper,
    style,
  )

  const ribbonStyle = mergeSemanticStyle(
    {
      position: 'absolute' as const,
      top: '0.5rem',
      ...(isEnd ? { right: '-0.5rem' } : { left: '-0.5rem' }),
      padding: '0 0.5rem',
      height: '1.375rem',
      lineHeight: '1.375rem',
      backgroundColor: resolvedColor,
      color: '#fff',
      fontSize: '0.875rem',
      borderRadius: isEnd
        ? '0.25rem 0.25rem 0 0.25rem'
        : '0.25rem 0.25rem 0.25rem 0',
      whiteSpace: 'nowrap' as const,
      zIndex: 1,
    },
    styles?.ribbon,
  )

  const contentStyle = mergeSemanticStyle({}, styles?.content)

  const cornerStyle = mergeSemanticStyle(
    {
      position: 'absolute' as const,
      top: '100%',
      ...(isEnd ? { right: 0 } : { left: 0 }),
      width: '0.5rem',
      height: '0.375rem',
      backgroundColor: resolvedColor,
      clipPath: isEnd
        ? 'polygon(0 0, 100% 0, 0 100%)'
        : 'polygon(0 0, 100% 0, 100% 100%)',
      filter: 'brightness(0.75)',
    },
    styles?.corner,
  )

  return (
    <div className={mergeSemanticClassName(className, classNames?.wrapper)} style={wrapperStyle}>
      {children}
      <div className={classNames?.ribbon} style={ribbonStyle}>
        <span className={classNames?.content} style={contentStyle}>{text}</span>
        <div className={classNames?.corner} style={cornerStyle} />
      </div>
    </div>
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Badge = Object.assign(BadgeComponent, {
  Ribbon: BadgeRibbon,
})
