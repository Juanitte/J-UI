import {
  type ReactNode, type CSSProperties,
  useRef, Children, isValidElement,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import { Tabs } from '../Tabs/Tabs'
import type { TabsProps } from '../Tabs/Tabs'

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

const LOADING_KEYFRAMES = `
@keyframes j-card-loading {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}`

const SKELETON_WIDTHS = ['100%', '75%', '90%', '60%']

function CardLoadingSkeleton() {
  return (
    <>
      <style>{LOADING_KEYFRAMES}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {SKELETON_WIDTHS.map((width, i) => (
          <div
            key={i}
            style={{
              height: '1rem',
              width,
              backgroundColor: tokens.colorBgMuted,
              borderRadius: '0.25rem',
              animation: 'j-card-loading 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </>
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
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        ...style,
      }}
    >
      {avatar && (
        <div style={{ flexShrink: 0 }}>
          {avatar}
        </div>
      )}
      {(title || description) && (
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <div style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: tokens.colorText,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' as const,
            }}>
              {title}
            </div>
          )}
          {description && (
            <div style={{
              fontSize: '0.875rem',
              color: tokens.colorTextMuted,
              marginTop: title ? '0.25rem' : 0,
            }}>
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
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: '33.33%',
        padding: '1.5rem',
        borderRight: `1px solid ${tokens.colorBorder}`,
        borderBottom: `1px solid ${tokens.colorBorder}`,
        transition: 'box-shadow 0.2s ease',
        cursor: hoverable ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={() => {
        if (hoverable && ref.current) {
          ref.current.style.boxShadow = tokens.shadowMd
          ref.current.style.position = 'relative'
          ref.current.style.zIndex = '1'
        }
      }}
      onMouseLeave={() => {
        if (hoverable && ref.current) {
          ref.current.style.boxShadow = ''
          ref.current.style.position = ''
          ref.current.style.zIndex = ''
        }
      }}
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
  const rootRef = useRef<HTMLDivElement>(null)
  const isSmall = size === 'small'
  const isInner = type === 'inner'
  const bodyPad = isSmall ? '0.75rem' : '1.5rem'
  const headerPad = isSmall ? '0.75rem' : '1.5rem'

  // Detect if children contain Card.Grid elements
  const hasGrid = Children.toArray(children).some(
    (child) => isValidElement(child) && (child.type as any)?._isCardGrid === true,
  )

  const showHeader = title || extra || tabList

  // ── Root style ──────────────────────────────────────────────
  const rootStyle = mergeSemanticStyle(
    {
      backgroundColor: tokens.colorBg,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      ...(variant === 'outlined'
        ? { border: `1px solid ${tokens.colorBorder}` }
        : { border: 'none' }),
    },
    styles?.root,
    style,
  )

  // ── Hover handlers ──────────────────────────────────────────
  const handleMouseEnter = () => {
    if (hoverable && rootRef.current) {
      rootRef.current.style.boxShadow = tokens.shadowLg
      rootRef.current.style.transform = 'translateY(-1px)'
    }
  }

  const handleMouseLeave = () => {
    if (hoverable && rootRef.current) {
      rootRef.current.style.boxShadow = ''
      rootRef.current.style.transform = ''
    }
  }

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={rootStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Cover ──────────────────────────────────────────────── */}
      {cover && (
        <div
          className={classNames?.cover}
          style={mergeSemanticStyle(
            { overflow: 'hidden' },
            styles?.cover,
          )}
        >
          {cover}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      {showHeader && (
        <div
          className={classNames?.header}
          style={mergeSemanticStyle(
            {
              padding: `${headerPad} ${headerPad} ${tabList ? '0' : headerPad}`,
              borderBottom: `1px solid ${tokens.colorBorder}`,
              ...(isInner ? { backgroundColor: tokens.colorBgSubtle } : {}),
            },
            styles?.header,
          )}
        >
          {/* Title row */}
          {(title || extra) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: tabList ? '0.75rem' : 0,
            }}>
              {title && (
                <div
                  className={classNames?.title}
                  style={mergeSemanticStyle(
                    {
                      flex: 1,
                      minWidth: 0,
                      fontSize: isSmall ? '0.875rem' : '1rem',
                      fontWeight: 600,
                      color: tokens.colorText,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap' as const,
                    },
                    styles?.title,
                  )}
                >
                  {title}
                </div>
              )}
              {extra && (
                <div
                  className={classNames?.extra}
                  style={mergeSemanticStyle(
                    {
                      flexShrink: 0,
                      fontSize: '0.875rem',
                      color: tokens.colorPrimary,
                    },
                    styles?.extra,
                  )}
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
        className={classNames?.body}
        style={mergeSemanticStyle(
          {
            padding: hasGrid ? 0 : bodyPad,
            ...(hasGrid ? { display: 'flex', flexWrap: 'wrap' as const } : {}),
          },
          styles?.body,
        )}
      >
        {loading ? <CardLoadingSkeleton /> : children}
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      {actions && actions.length > 0 && (
        <ul
          className={classNames?.actions}
          style={mergeSemanticStyle(
            {
              display: 'flex',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              borderTop: `1px solid ${tokens.colorBorder}`,
            },
            styles?.actions,
          )}
        >
          {actions.map((action, i) => (
            <li
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 0',
                color: tokens.colorTextMuted,
                cursor: 'pointer',
                borderRight: i < actions.length - 1 ? `1px solid ${tokens.colorBorder}` : 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = tokens.colorPrimary
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted
              }}
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
