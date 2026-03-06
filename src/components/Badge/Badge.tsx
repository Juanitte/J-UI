import type { ReactNode, CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { Tooltip } from '../Tooltip'
import './Badge.css'

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
  classNames: classNamesProp,
  styles,
}: BadgeProps) {
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
        className={cx('ino-badge--status', className, classNamesProp?.root)}
        style={{ ...styles?.root, ...style }}
      >
        <span
          className={cx('ino-badge__status-dot', classNamesProp?.indicator)}
          style={{ backgroundColor: resolvedColor as string, ...styles?.indicator }}
        >
          {status === 'processing' && (
            <span
              className="ino-badge__status-dot-pulse"
              style={{ backgroundColor: resolvedColor as string }}
            />
          )}
        </span>
        {text != null && (
          <span className="ino-badge__status-text">
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

  const supClass = cx(
    {
      'ino-badge__sup': hasChildren,
      'ino-badge__sup--with-children': hasChildren,
    },
    classNamesProp?.indicator,
  )

  const indicatorClass = dot
    ? cx('ino-badge__dot', isSmall ? 'ino-badge__dot--small' : 'ino-badge__dot--default')
    : cx('ino-badge__indicator', isSmall ? 'ino-badge__indicator--small' : 'ino-badge__indicator--default')

  const indicatorDynamic: CSSProperties = {
    backgroundColor: resolvedColor as string,
    ...(hasChildren ? { transform: baseTransform } : {}),
    ...styles?.indicator,
  }

  // ─── Standalone count/dot (no children, no status) ──────────────────

  if (!hasChildren) {
    if (!showIndicator) return null
    return (
      <span
        className={cx('ino-badge--standalone', className, classNamesProp?.root)}
        style={{ ...styles?.root, ...style }}
      >
        <Tooltip content={resolvedTitle} disabled={!resolvedTitle}>
          <sup className={cx(indicatorClass, supClass)} style={indicatorDynamic}>
            {displayCount}
          </sup>
        </Tooltip>
      </span>
    )
  }

  // ─── Wrapping mode (has children) ───────────────────────────────────

  return (
    <span
      className={cx('ino-badge', className, classNamesProp?.root)}
      style={{ ...styles?.root, ...style }}
    >
      {children}
      {showIndicator && (
        <Tooltip content={resolvedTitle} disabled={!resolvedTitle}>
          <sup className={cx(indicatorClass, supClass)} style={indicatorDynamic}>
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
  classNames: classNamesProp,
  styles,
}: BadgeRibbonProps) {
  const isEnd = placement === 'end'
  const resolvedColor = resolveColor(color)

  return (
    <div
      className={cx('ino-badge-ribbon-wrapper', className, classNamesProp?.wrapper)}
      style={{ ...styles?.wrapper, ...style }}
    >
      {children}
      <div
        className={cx(
          'ino-badge-ribbon',
          isEnd ? 'ino-badge-ribbon--end' : 'ino-badge-ribbon--start',
          classNamesProp?.ribbon,
        )}
        style={{ backgroundColor: resolvedColor, ...styles?.ribbon }}
      >
        <span className={classNamesProp?.content} style={styles?.content}>{text}</span>
        <div
          className={cx(
            'ino-badge-ribbon__corner',
            isEnd ? 'ino-badge-ribbon__corner--end' : 'ino-badge-ribbon__corner--start',
            classNamesProp?.corner,
          )}
          style={{ backgroundColor: resolvedColor, ...styles?.corner }}
        />
      </div>
    </div>
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Badge = Object.assign(BadgeComponent, {
  Ribbon: BadgeRibbon,
})
