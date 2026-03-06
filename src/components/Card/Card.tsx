import {
  type ReactNode, type CSSProperties,
  Children, isValidElement,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { Tabs } from '../Tabs/Tabs'
import type { TabsProps } from '../Tabs/Tabs'
import './Card.css'

// ============================================================================
// Types
// ============================================================================

export type CardSize = 'default' | 'small'
export type CardVariant = 'outlined' | 'borderless'

export interface CardTabItem {
  key: string
  label: ReactNode
  disabled?: boolean
}

export type CardSemanticSlot = 'root' | 'header' | 'body' | 'extra' | 'title' | 'actions' | 'cover'
export type CardClassNames = SemanticClassNames<CardSemanticSlot>
export type CardStyles = SemanticStyles<CardSemanticSlot>

export interface CardProps {
  title?: ReactNode
  extra?: ReactNode
  cover?: ReactNode
  actions?: ReactNode[]
  loading?: boolean
  hoverable?: boolean
  size?: CardSize
  variant?: CardVariant
  type?: 'inner'
  tabList?: CardTabItem[]
  activeTabKey?: string
  defaultActiveTabKey?: string
  tabProps?: Partial<TabsProps>
  onTabChange?: (key: string) => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: CardClassNames
  styles?: CardStyles
}

export interface CardMetaProps {
  avatar?: ReactNode
  title?: ReactNode
  description?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface CardGridProps {
  hoverable?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// ============================================================================
// Loading skeleton
// ============================================================================

const SKELETON_WIDTHS = ['100%', '75%', '90%', '60%']

function CardLoadingSkeleton() {
  return (
    <div className="ino-card__skeleton">
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={i}
          className="ino-card__skeleton-line"
          style={{
            width,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Card.Meta
// ============================================================================

function CardMeta({
  avatar,
  title,
  description,
  className,
  style,
}: CardMetaProps) {
  return (
    <div
      className={cx('ino-card-meta', className)}
      style={style}
    >
      {avatar && (
        <div className="ino-card-meta__avatar">
          {avatar}
        </div>
      )}
      {(title || description) && (
        <div className="ino-card-meta__detail">
          {title && (
            <div className="ino-card-meta__title">
              {title}
            </div>
          )}
          {description && (
            <div
              className="ino-card-meta__description"
              style={{ marginTop: title ? '0.25rem' : 0 }}
            >
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Card.Grid
// ============================================================================

// Marker for detection by parent Card
CardGrid._isCardGrid = true as const

function CardGrid({
  hoverable = true,
  children,
  className,
  style,
}: CardGridProps) {
  return (
    <div
      className={cx(
        'ino-card-grid',
        { 'ino-card-grid--hoverable': hoverable },
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

// ============================================================================
// CardComponent
// ============================================================================

function CardComponent({
  title,
  extra,
  cover,
  actions,
  loading = false,
  hoverable = false,
  size = 'default',
  variant = 'outlined',
  type,
  tabList,
  activeTabKey,
  defaultActiveTabKey,
  tabProps,
  onTabChange,
  children,
  className,
  style,
  classNames,
  styles,
}: CardProps) {
  const isSmall = size === 'small'
  const isInner = type === 'inner'
  const bodyPad = isSmall ? '0.75rem' : '1.5rem'
  const headerPad = isSmall ? '0.75rem' : '1.5rem'

  // Detect if children contain Card.Grid elements
  const hasGrid = Children.toArray(children).some(
    (child) => isValidElement(child) && (child.type as any)?._isCardGrid === true,
  )

  const showHeader = title || extra || tabList

  const rootClass = cx(
    'ino-card',
    `ino-card--${variant}`,
    { 'ino-card--hoverable': hoverable },
    className,
    classNames?.root,
  )

  return (
    <div
      className={rootClass}
      style={{ ...styles?.root, ...style }}
    >
      {/* ── Cover ──────────────────────────────────────────────── */}
      {cover && (
        <div
          className={cx('ino-card__cover', classNames?.cover)}
          style={styles?.cover}
        >
          {cover}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      {showHeader && (
        <div
          className={cx(
            'ino-card__header',
            { 'ino-card__header--inner': isInner },
            classNames?.header,
          )}
          style={{
            padding: `${headerPad} ${headerPad} ${tabList ? '0' : headerPad}`,
            ...styles?.header,
          }}
        >
          {/* Title row */}
          {(title || extra) && (
            <div
              className="ino-card__title-row"
              style={{ marginBottom: tabList ? '0.75rem' : 0 }}
            >
              {title && (
                <div
                  className={cx(
                    'ino-card__title',
                    isSmall ? 'ino-card__title--sm' : 'ino-card__title--default',
                    classNames?.title,
                  )}
                  style={styles?.title}
                >
                  {title}
                </div>
              )}
              {extra && (
                <div
                  className={cx('ino-card__extra', classNames?.extra)}
                  style={styles?.extra}
                >
                  {extra}
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          {tabList && (
            <Tabs
              items={tabList.map(t => ({ key: t.key, label: t.label, disabled: t.disabled }))}
              activeKey={activeTabKey}
              defaultActiveKey={defaultActiveTabKey}
              size={isSmall ? 'small' : 'large'}
              type="line"
              onChange={onTabChange}
              {...tabProps}
              styles={{
                root: { marginBottom: '-1px' },
                ...tabProps?.styles,
              }}
            />
          )}
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────── */}
      <div
        className={cx(
          { 'ino-card__body--grid': hasGrid },
          classNames?.body,
        )}
        style={{
          padding: hasGrid ? 0 : bodyPad,
          ...styles?.body,
        }}
      >
        {loading ? <CardLoadingSkeleton /> : children}
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      {actions && actions.length > 0 && (
        <ul
          className={cx('ino-card__actions', classNames?.actions)}
          style={styles?.actions}
        >
          {actions.map((action, i) => (
            <li
              key={i}
              className={cx(
                'ino-card__action',
                { 'ino-card__action--bordered': i < actions.length - 1 },
              )}
            >
              <span>{action}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================================================
// Compound export
// ============================================================================

export const Card = Object.assign(CardComponent, {
  Meta: CardMeta,
  Grid: CardGrid,
})
