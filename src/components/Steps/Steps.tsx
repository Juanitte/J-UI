import {
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsSize = 'default' | 'small'
export type StepsType = 'default' | 'navigation'
export type StepsDirection = 'horizontal' | 'vertical'
export type StepsLabelPlacement = 'horizontal' | 'vertical'

export type ProgressDotRender = (
  dot: ReactNode,
  info: { index: number; status: StepStatus; title: ReactNode; description: ReactNode },
) => ReactNode

export interface StepItem {
  title?: ReactNode
  description?: ReactNode
  subTitle?: ReactNode
  icon?: ReactNode
  status?: StepStatus
  disabled?: boolean
}

export type StepsSemanticSlot = 'root' | 'step' | 'icon' | 'content' | 'tail'
export type StepsClassNames = SemanticClassNames<StepsSemanticSlot>
export type StepsStyles = SemanticStyles<StepsSemanticSlot>

export interface StepsProps {
  items?: StepItem[]
  current?: number
  direction?: StepsDirection
  size?: StepsSize
  status?: StepStatus
  type?: StepsType
  labelPlacement?: StepsLabelPlacement
  progressDot?: boolean | ProgressDotRender
  percent?: number
  initial?: number
  onChange?: (current: number) => void
  className?: string
  style?: CSSProperties
  classNames?: StepsClassNames
  styles?: StepsStyles
}

// ============================================================================
// Icons
// ============================================================================

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CloseIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ============================================================================
// Progress ring SVG for percent
// ============================================================================

function ProgressRing({ percent, ringSize, iconSize }: { percent: number; ringSize: number; iconSize: number }) {
  const stroke = 3
  const radius = (ringSize - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  // With border-box, absolute children position from the padding box (inside the 2px border).
  // Visual center in padding-box coords: iconSize/2 - borderWidth
  // Ring center: ringSize/2
  const iconBorder = 2
  const pos = iconSize / 2 - iconBorder - ringSize / 2

  return (
    <svg
      width={ringSize}
      height={ringSize}
      style={{ position: 'absolute', top: pos, left: pos, transform: 'rotate(-90deg)' }}
    >
      {/* Background track */}
      <circle
        cx={ringSize / 2}
        cy={ringSize / 2}
        r={radius}
        fill="none"
        stroke={tokens.colorBorder}
        strokeWidth={stroke}
      />
      {/* Progress arc */}
      <circle
        cx={ringSize / 2}
        cy={ringSize / 2}
        r={radius}
        fill="none"
        stroke={tokens.colorPrimary}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s' }}
      />
    </svg>
  )
}

// ============================================================================
// Tail color helper
// ============================================================================

function getTailColor(status: StepStatus): string {
  switch (status) {
    case 'finish': return tokens.colorPrimary
    case 'error': return tokens.colorError
    default: return tokens.colorBorder
  }
}

// ============================================================================
// StepComponent (single step)
// ============================================================================

function StepComponent({
  item,
  index,
  stepStatus,
  isFirst,
  isLast,
  isClickable,
  isVertical,
  isNavigation,
  isDot,
  progressDotRender,
  showPercent,
  percent,
  size,
  labelVertical,
  prevTailColor,
  classNames,
  styles,
  onClick,
}: {
  item: StepItem
  index: number
  stepStatus: StepStatus
  isFirst: boolean
  isLast: boolean
  isClickable: boolean
  isVertical: boolean
  isNavigation: boolean
  isDot: boolean
  progressDotRender?: ProgressDotRender
  showPercent: boolean
  percent: number
  size: StepsSize
  labelVertical: boolean
  prevTailColor?: string
  classNames?: StepsClassNames
  styles?: StepsStyles
  onClick?: () => void
}) {
  const isSmall = size === 'small'
  const iconDim = isSmall ? '1.5rem' : '2rem'
  const iconDimPx = isSmall ? 24 : 32
  const iconFontSize = isSmall ? '0.75rem' : '0.875rem'
  const iconSizePx = isSmall ? 12 : 14
  const titleFontSize = isSmall ? '0.875rem' : '1rem'
  const descFontSize = isSmall ? '0.75rem' : '0.875rem'
  const dotSize = '0.5rem'
  const dotSizePx = 8

  // ── Status colors ──────────────────────────────────────────────────

  const statusColors = {
    wait: {
      iconBg: tokens.colorBg,
      iconBorder: tokens.colorBorder,
      iconColor: tokens.colorTextMuted,
      titleColor: tokens.colorTextMuted,
      descColor: tokens.colorTextMuted,
      tailColor: tokens.colorBorder,
    },
    process: {
      iconBg: tokens.colorPrimary,
      iconBorder: tokens.colorPrimary,
      iconColor: tokens.colorPrimaryContrast,
      titleColor: tokens.colorText,
      descColor: tokens.colorTextMuted,
      tailColor: tokens.colorBorder,
    },
    finish: {
      iconBg: tokens.colorBg,
      iconBorder: tokens.colorPrimary,
      iconColor: tokens.colorPrimary,
      titleColor: tokens.colorText,
      descColor: tokens.colorTextMuted,
      tailColor: tokens.colorPrimary,
    },
    error: {
      iconBg: tokens.colorBg,
      iconBorder: tokens.colorError,
      iconColor: tokens.colorError,
      titleColor: tokens.colorError,
      descColor: tokens.colorError,
      tailColor: tokens.colorError,
    },
  }

  const colors = statusColors[stepStatus]
  const clickHandler = isClickable && !item.disabled ? onClick : undefined
  const cursorStyle = isClickable && !item.disabled ? 'pointer' : item.disabled ? 'not-allowed' : 'default'

  // ── Icon ───────────────────────────────────────────────────────────

  let iconContent: ReactNode

  if (isDot) {
    const dotStyle: CSSProperties = {
      width: dotSize,
      height: dotSize,
      borderRadius: '50%',
      backgroundColor: stepStatus === 'wait' ? tokens.colorBorder : colors.iconBorder,
      transition: 'all 0.3s',
    }
    const dotElement = <span style={dotStyle} />

    if (typeof progressDotRender === 'function') {
      iconContent = progressDotRender(dotElement, {
        index,
        status: stepStatus,
        title: item.title,
        description: item.description,
      })
    } else {
      iconContent = dotElement
    }
  } else if (item.icon) {
    iconContent = item.icon
  } else if (stepStatus === 'finish') {
    iconContent = <CheckIcon size={iconSizePx} />
  } else if (stepStatus === 'error') {
    iconContent = <CloseIcon size={iconSizePx} />
  } else {
    iconContent = index + 1
  }

  const iconWrapperStyle: CSSProperties = isDot
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dotSize,
        height: dotSize,
        position: 'relative',
        flexShrink: 0,
        ...styles?.icon,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: iconDim,
        height: iconDim,
        borderRadius: '50%',
        border: `2px solid ${colors.iconBorder}`,
        backgroundColor: colors.iconBg,
        color: colors.iconColor,
        fontSize: iconFontSize,
        fontWeight: 600,
        flexShrink: 0,
        transition: 'all 0.3s',
        position: 'relative',
        ...styles?.icon,
      }

  const iconElement = (
    <div style={iconWrapperStyle} className={classNames?.icon}>
      {iconContent}
      {showPercent && !isDot && (
        <ProgressRing percent={percent} ringSize={iconDimPx + 10} iconSize={iconDimPx} />
      )}
    </div>
  )

  // ── Content builder ────────────────────────────────────────────────

  const titleStyle: CSSProperties = {
    fontSize: titleFontSize,
    fontWeight: stepStatus === 'process' ? 600 : 400,
    color: colors.titleColor,
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
  }

  const buildContent = (extraStyle: CSSProperties) => (
    <div style={{ ...extraStyle, ...styles?.content }} className={classNames?.content}>
      <div style={titleStyle}>
        {item.title}
        {item.subTitle && (
          <span style={{
            fontSize: descFontSize,
            color: tokens.colorTextMuted,
            marginLeft: '0.5rem',
            fontWeight: 400,
          }}>
            {item.subTitle}
          </span>
        )}
      </div>
      {item.description && (
        <div style={{
          fontSize: descFontSize,
          color: colors.descColor,
          marginTop: '0.125rem',
          lineHeight: 1.5,
        }}>
          {item.description}
        </div>
      )}
    </div>
  )

  // ── Tail line helper ───────────────────────────────────────────────

  const tailLine = (color: string) => (
    <div
      style={{
        flex: 1,
        height: 1,
        backgroundColor: color,
        transition: 'background-color 0.3s',
        ...styles?.tail,
      }}
      className={classNames?.tail}
    />
  )

  // ── Navigation type ────────────────────────────────────────────────

  if (isNavigation) {
    const arrowSize = isSmall ? 16 : 20

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: isSmall ? '0.5rem 1rem' : '0.75rem 1.5rem',
          backgroundColor: stepStatus === 'process' ? tokens.colorBgMuted : 'transparent',
          cursor: cursorStyle,
          opacity: item.disabled ? 0.5 : 1,
          transition: 'background-color 0.2s',
          ...styles?.step,
        }}
        className={classNames?.step}
        onClick={clickHandler}
        onMouseEnter={(e) => {
          if (!isClickable || item.disabled || stepStatus === 'process') return
          ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
        }}
        onMouseLeave={(e) => {
          if (!isClickable || item.disabled || stepStatus === 'process') return
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{
            fontSize: titleFontSize,
            fontWeight: stepStatus === 'process' ? 600 : 400,
            color: colors.titleColor,
          }}>
            {item.title}
          </span>
          {item.description && (
            <span style={{ fontSize: descFontSize, color: colors.descColor, marginTop: '0.125rem' }}>
              {item.description}
            </span>
          )}
        </div>
        {stepStatus === 'process' && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: tokens.colorPrimary,
          }} />
        )}
        {!isLast && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(50%)',
            zIndex: 1,
            width: 0,
            height: 0,
            borderTop: `${arrowSize / 2}px solid transparent`,
            borderBottom: `${arrowSize / 2}px solid transparent`,
            borderLeft: `${arrowSize / 2}px solid ${tokens.colorBorder}`,
          }} />
        )}
      </div>
    )
  }

  // ── Horizontal, label vertical / dot ─────────────────────────────
  //
  // Icon row: [left-tail | icon | right-tail]  (all flex, no absolute)
  // Content below, centered.
  //
  // Left-tail uses prevTailColor (the previous step "owns" that segment).
  // Right-tail uses this step's tailColor.
  // Both tails are flex: 1, so the icon is naturally centered.
  // Nothing overflows because everything is contained within the step.

  if (!isVertical && labelVertical) {
    const tailGap = isDot ? '0.25rem' : '0.5rem'

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: cursorStyle,
          opacity: item.disabled ? 0.5 : 1,
          ...styles?.step,
        }}
        className={classNames?.step}
        onClick={clickHandler}
      >
        {/* Icon row */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {/* Left spacer — tail from previous step */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingRight: tailGap }}>
            {!isFirst && prevTailColor && tailLine(prevTailColor)}
          </div>
          {iconElement}
          {/* Right spacer — tail to next step */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: tailGap }}>
            {!isLast && tailLine(colors.tailColor)}
          </div>
        </div>
        {/* Content */}
        {buildContent({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: isDot ? '0.25rem' : '0.5rem',
        })}
      </div>
    )
  }

  // ── Horizontal, label horizontal ─────────────────────────────────
  //
  // Row: [icon] [content] [tail]
  // Tail is a flex item that fills remaining space — no absolute.

  if (!isVertical) {
    return (
      <div
        style={{
          flex: isLast ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          cursor: cursorStyle,
          opacity: item.disabled ? 0.5 : 1,
          ...styles?.step,
        }}
        className={classNames?.step}
        onClick={clickHandler}
      >
        {/* Title row: icon + title + tail */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {iconElement}
          <div
            style={{ marginLeft: '0.5rem', ...styles?.content }}
            className={classNames?.content}
          >
            <div style={titleStyle}>
              {item.title}
              {item.subTitle && (
                <span style={{
                  fontSize: descFontSize,
                  color: tokens.colorTextMuted,
                  marginLeft: '0.5rem',
                  fontWeight: 400,
                }}>
                  {item.subTitle}
                </span>
              )}
            </div>
          </div>
          {!isLast && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              minWidth: '1.5rem',
              padding: '0 0.5rem',
            }}>
              {tailLine(colors.tailColor)}
            </div>
          )}
        </div>
        {/* Description below, aligned with title */}
        {item.description && (
          <div style={{
            fontSize: descFontSize,
            color: colors.descColor,
            marginTop: '0.125rem',
            lineHeight: 1.5,
            marginLeft: `calc(${iconDim} + 0.5rem)`,
          }}>
            {item.description}
          </div>
        )}
      </div>
    )
  }

  // ── Vertical ─────────────────────────────────────────────────────
  //
  // Row: [icon] [content]
  // Tail is absolute vertical line from below icon to bottom of step.

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        paddingBottom: isLast ? 0 : '1.5rem',
        cursor: cursorStyle,
        opacity: item.disabled ? 0.5 : 1,
        ...styles?.step,
      }}
      className={classNames?.step}
      onClick={clickHandler}
    >
      {iconElement}
      {buildContent({
        display: 'flex',
        flexDirection: 'column',
        marginLeft: isDot ? '0.75rem' : '0.5rem',
      })}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: isDot ? dotSizePx / 2 : iconDimPx / 2,
            top: isDot ? dotSizePx + 4 : iconDimPx + 4,
            bottom: 0,
            width: 1,
            backgroundColor: colors.tailColor,
            transition: 'background-color 0.3s',
            ...styles?.tail,
          }}
          className={classNames?.tail}
        />
      )}
    </div>
  )
}

// ============================================================================
// Main component
// ============================================================================

export function Steps({
  items = [],
  current = 0,
  direction = 'horizontal',
  size = 'default',
  status = 'process',
  type = 'default',
  labelPlacement = 'horizontal',
  progressDot = false,
  percent,
  initial = 0,
  onChange,
  className,
  style,
  classNames,
  styles,
}: StepsProps) {
  const isVertical = direction === 'vertical'
  const isNavigation = type === 'navigation'
  const isDot = !!progressDot && !isNavigation
  const isClickable = !!onChange

  const labelVertical = isDot || labelPlacement === 'vertical'

  const progressDotRender = typeof progressDot === 'function' ? progressDot : undefined

  const getStepStatus = (index: number, item: StepItem): StepStatus => {
    if (item.status) return item.status
    if (index < current) return 'finish'
    if (index === current) return status
    return 'wait'
  }

  const rootBaseStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    width: '100%',
  }

  if (isNavigation) {
    rootBaseStyle.borderBottom = `1px solid ${tokens.colorBorder}`
  }

  const rootStyle = mergeSemanticStyle(rootBaseStyle, styles?.root, style)

  return (
    <div
      role="navigation"
      aria-label="Steps"
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {items.map((item, idx) => {
        const stepStatus = getStepStatus(idx, item)
        const isLast = idx === items.length - 1
        const showPercent = percent !== undefined && idx === current && stepStatus === 'process'

        let prevTailColor: string | undefined
        if (idx > 0) {
          const prevStatus = getStepStatus(idx - 1, items[idx - 1])
          prevTailColor = getTailColor(prevStatus)
        }

        return (
          <StepComponent
            key={idx}
            item={item}
            index={idx + initial}
            stepStatus={stepStatus}
            isFirst={idx === 0}
            isLast={isLast}
            isClickable={isClickable}
            isVertical={isVertical}
            isNavigation={isNavigation}
            isDot={isDot}
            progressDotRender={progressDotRender}
            showPercent={showPercent}
            percent={percent ?? 0}
            size={size}
            labelVertical={labelVertical}
            prevTailColor={prevTailColor}
            classNames={classNames}
            styles={styles}
            onClick={() => onChange?.(idx)}
          />
        )
      })}
    </div>
  )
}
