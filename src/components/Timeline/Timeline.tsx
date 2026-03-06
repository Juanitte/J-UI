import { type ReactNode, type CSSProperties, useMemo } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Timeline.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TimelineMode = 'left' | 'right' | 'alternate'
export type TimelineVariant = 'outlined' | 'solid'

export interface TimelineItemType {
  children?: ReactNode
  color?: string
  dot?: ReactNode
  label?: ReactNode
  position?: 'left' | 'right'
}

export type TimelineSemanticSlot = 'root' | 'item' | 'dot' | 'tail' | 'content' | 'label'
export type TimelineClassNames = SemanticClassNames<TimelineSemanticSlot>
export type TimelineStyles = SemanticStyles<TimelineSemanticSlot>

export interface TimelineProps {
  items?: TimelineItemType[]
  mode?: TimelineMode
  variant?: TimelineVariant
  horizontal?: boolean
  titleSpan?: number
  pending?: boolean | ReactNode
  pendingDot?: ReactNode
  reverse?: boolean
  className?: string
  style?: CSSProperties
  classNames?: TimelineClassNames
  styles?: TimelineStyles
}

// ─── Color Resolution ───────────────────────────────────────────────────────────

const DOT_COLORS: Record<string, string> = {
  blue:      tokens.colorPrimary,
  red:       tokens.colorError,
  green:     tokens.colorSuccess,
  gray:      tokens.colorTextMuted,
  primary:   tokens.colorPrimary,
  secondary: tokens.colorSecondary,
  success:   tokens.colorSuccess,
  warning:   tokens.colorWarning,
  error:     tokens.colorError,
  info:      tokens.colorInfo,
}

function resolveDotColor(color?: string): string {
  if (!color) return tokens.colorPrimary
  return DOT_COLORS[color] ?? color
}

// ─── Spinner ────────────────────────────────────────────────────────────────────

function SpinnerDot() {
  return (
    <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" aria-hidden="true"
      style={{ animation: 'j-timeline-spin 1s linear infinite', color: tokens.colorPrimary }}
    >
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.3 199.3 0 19.9-16.1 36-36 36z" />
    </svg>
  )
}

// ─── Internal Types ─────────────────────────────────────────────────────────────

interface InternalItem extends TimelineItemType {
  _pending?: boolean
}

// ─── Dot Rendering Helper ───────────────────────────────────────────────────────

function renderDot(
  item: InternalItem,
  variant: TimelineVariant,
  dotColor: string,
  horizontal: boolean,
  classNamesProp?: TimelineClassNames,
  stylesProp?: TimelineStyles,
) {
  if (item.dot) {
    return (
      <div
        className={cx('ino-timeline__dot', 'ino-timeline__dot--custom', classNamesProp?.dot)}
        style={{
          color: dotColor,
          marginTop: horizontal ? 0 : '0.1875rem',
          ...stylesProp?.dot,
        }}
      >
        {item.dot}
      </div>
    )
  }

  const isSolid = variant === 'solid'
  return (
    <div
      className={cx(
        'ino-timeline__dot',
        'ino-timeline__dot--circle',
        isSolid ? 'ino-timeline__dot--solid' : 'ino-timeline__dot--outlined',
        classNamesProp?.dot,
      )}
      style={{
        ...(isSolid
          ? { backgroundColor: dotColor }
          : { border: `2px solid ${dotColor}` }),
        marginTop: horizontal ? 0 : '0.3125rem',
        ...stylesProp?.dot,
      }}
    />
  )
}

// ─── Timeline Component ─────────────────────────────────────────────────────────

export function Timeline({
  items = [],
  mode = 'left',
  variant = 'outlined',
  horizontal = false,
  titleSpan,
  pending,
  pendingDot,
  reverse = false,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: TimelineProps) {
  const finalItems = useMemo(() => {
    const list: InternalItem[] = [...items]
    if (pending) {
      list.push({
        children: typeof pending === 'boolean' ? undefined : pending,
        dot: pendingDot ?? <SpinnerDot />,
        _pending: true,
      })
    }
    if (reverse) list.reverse()
    return list
  }, [items, pending, pendingDot, reverse])

  const hasLabels = useMemo(
    () => finalItems.some(item => item.label != null),
    [finalItems],
  )

  const useThreeColumns = !horizontal && (mode === 'alternate' || hasLabels)

  return (
    <div
      className={cx(
        'ino-timeline',
        horizontal ? 'ino-timeline--horizontal' : 'ino-timeline--vertical',
        className,
        classNamesProp?.root,
      )}
      style={{ ...styles?.root, ...style }}
    >
      {finalItems.map((item, index) => {
        const isLast = index === finalItems.length - 1
        const isFirst = index === 0

        let contentSide: 'left' | 'right' = mode === 'right' ? 'left' : 'right'
        if (mode === 'alternate') {
          contentSide = index % 2 === 0 ? 'right' : 'left'
        }
        if (item.position) contentSide = item.position

        const commonProps = {
          item,
          isLast,
          isFirst,
          contentSide,
          variant,
          dotColor: resolveDotColor(item.color),
          classNames: classNamesProp,
          styles,
        }

        if (horizontal) {
          return <HorizontalItem key={index} {...commonProps} />
        }

        return (
          <VerticalItem
            key={index}
            {...commonProps}
            useThreeColumns={useThreeColumns}
            titleSpan={titleSpan}
          />
        )
      })}
    </div>
  )
}

// ─── Vertical Item ──────────────────────────────────────────────────────────────

interface VerticalItemProps {
  item: InternalItem
  isLast: boolean
  isFirst: boolean
  contentSide: 'left' | 'right'
  useThreeColumns: boolean
  variant: TimelineVariant
  titleSpan?: number
  dotColor: string
  classNames?: TimelineClassNames
  styles?: TimelineStyles
}

function VerticalItem({
  item,
  isLast,
  contentSide,
  useThreeColumns,
  variant,
  titleSpan,
  dotColor,
  classNames: classNamesProp,
  styles,
}: VerticalItemProps) {
  const spacingPb = isLast ? 0 : '1.25rem'

  let gridColumns: string
  if (useThreeColumns) {
    if (titleSpan) {
      const labelW = `${(titleSpan / 24) * 100}%`
      gridColumns = contentSide === 'right' ? `${labelW} 1.5rem 1fr` : `1fr 1.5rem ${labelW}`
    } else {
      gridColumns = '1fr 1.5rem 1fr'
    }
  } else {
    gridColumns = contentSide === 'right' ? '0px 1.5rem 1fr' : '1fr 1.5rem 0px'
  }

  const contentPad: CSSProperties = contentSide === 'right'
    ? { paddingLeft: '0.75rem' }
    : { paddingRight: '0.75rem', textAlign: 'right' }

  const contentNode = (
    <div
      className={cx('ino-timeline__content', classNamesProp?.content)}
      style={{ paddingBottom: spacingPb, ...contentPad, ...styles?.content }}
    >
      {item.children}
    </div>
  )

  const labelPad: CSSProperties = contentSide === 'right'
    ? { paddingRight: '0.75rem', textAlign: 'right' }
    : { paddingLeft: '0.75rem' }

  const labelNode = item.label != null ? (
    <div
      className={cx('ino-timeline__label', classNamesProp?.label)}
      style={{ paddingBottom: spacingPb, ...labelPad, ...styles?.label }}
    >
      {item.label}
    </div>
  ) : (
    <div style={{ paddingBottom: spacingPb }} />
  )

  let leftChild: ReactNode
  let rightChild: ReactNode

  if (contentSide === 'right') {
    leftChild = useThreeColumns ? labelNode : <div />
    rightChild = contentNode
  } else {
    leftChild = contentNode
    rightChild = useThreeColumns ? labelNode : <div />
  }

  return (
    <div
      className={cx('ino-timeline__item--vertical', classNamesProp?.item)}
      style={{ gridTemplateColumns: gridColumns, ...styles?.item }}
    >
      {leftChild}

      <div className="ino-timeline__dot-col">
        {renderDot(item, variant, dotColor, false, classNamesProp, styles)}
        {!isLast && (
          <div className="ino-timeline__tail-wrapper">
            <div
              className={cx('ino-timeline__tail', classNamesProp?.tail)}
              style={styles?.tail}
            />
          </div>
        )}
      </div>

      {rightChild}
    </div>
  )
}

// ─── Horizontal Item ────────────────────────────────────────────────────────────

interface HorizontalItemProps {
  item: InternalItem
  isLast: boolean
  isFirst: boolean
  contentSide: 'left' | 'right'
  variant: TimelineVariant
  dotColor: string
  classNames?: TimelineClassNames
  styles?: TimelineStyles
}

function HorizontalItem({
  item,
  isLast,
  isFirst,
  contentSide,
  variant,
  dotColor,
  classNames: classNamesProp,
  styles,
}: HorizontalItemProps) {
  const contentOnTop = contentSide === 'right'

  const contentArea = (
    <div
      className={cx('ino-timeline__h-area', 'ino-timeline__content', classNamesProp?.content)}
      style={styles?.content}
    >
      {item.children}
    </div>
  )

  const labelArea = item.label != null ? (
    <div
      className={cx('ino-timeline__h-area', 'ino-timeline__h-area--label', classNamesProp?.label)}
      style={styles?.label}
    >
      {item.label}
    </div>
  ) : (
    <div style={{ minHeight: '1.5rem' }} />
  )

  return (
    <div
      className={cx('ino-timeline__item--horizontal', classNamesProp?.item)}
      style={styles?.item}
    >
      {contentOnTop ? contentArea : labelArea}

      <div className="ino-timeline__dot-row">
        <div
          className={!isFirst ? cx('ino-timeline__tail--h', classNamesProp?.tail) : undefined}
          style={!isFirst ? styles?.tail : { flex: 1 }}
        />
        {renderDot(item, variant, dotColor, true, classNamesProp, styles)}
        <div
          className={!isLast ? cx('ino-timeline__tail--h', classNamesProp?.tail) : undefined}
          style={!isLast ? styles?.tail : { flex: 1 }}
        />
      </div>

      {contentOnTop ? labelArea : contentArea}
    </div>
  )
}
