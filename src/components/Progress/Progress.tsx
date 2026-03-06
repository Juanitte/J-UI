import {
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import { Tooltip } from '../Tooltip'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Progress.css'

// ============================================================================
// Types
// ============================================================================

export type ProgressType = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'success' | 'exception' | 'normal' | 'active'
export type ProgressSize = 'small' | 'default' | number | [number, number]
export type ProgressLinecap = 'round' | 'butt' | 'square'
export type ProgressGapPosition = 'top' | 'bottom' | 'left' | 'right'

export type ProgressStrokeColor =
  | string
  | string[]
  | { from: string; to: string; direction?: string }
  | Record<string, string>

export interface ProgressSuccessConfig {
  percent?: number
  strokeColor?: string
}

export interface ProgressPercentPosition {
  align?: 'start' | 'center' | 'end'
  type?: 'inner' | 'outer'
}

export type ProgressSemanticSlot = 'root' | 'trail' | 'stroke' | 'text'
export type ProgressClassNames = SemanticClassNames<ProgressSemanticSlot>
export type ProgressStyles = SemanticStyles<ProgressSemanticSlot>

export interface ProgressProps {
  /** Completion percentage 0-100 */
  percent?: number
  /** Custom text formatter. Return null/false to hide. */
  format?: (percent: number, successPercent?: number) => ReactNode
  /** Show info text/icon (default true) */
  showInfo?: boolean
  /** Status of the progress */
  status?: ProgressStatus
  /** Color of the progress stroke */
  strokeColor?: ProgressStrokeColor
  /** Line cap style (default 'round') */
  strokeLinecap?: ProgressLinecap
  /** Success segment config */
  success?: ProgressSuccessConfig
  /** Color of the unfilled trail */
  trailColor?: string
  /** Variant: line, circle, or dashboard (default 'line') */
  type?: ProgressType

  /** Number of steps for segmented progress */
  steps?: number
  /** Stroke width in px (line, default 8) or % of diameter (circle/dashboard, default 6) */
  strokeWidth?: number
  /** Size: preset ('small'|'default'), number (strokeWidth for line, canvas for circle), or [width, height] for line */
  size?: ProgressSize
  /** Position of percent text (line only). type: 'inner'|'outer', align: 'start'|'center'|'end' */
  percentPosition?: ProgressPercentPosition

  /** SVG canvas width in px (circle/dashboard, default 120) */
  width?: number
  /** Gap degree for dashboard (0-295, default 75) */
  gapDegree?: number
  /** Gap position for dashboard (default 'bottom') */
  gapPosition?: ProgressGapPosition

  className?: string
  style?: CSSProperties
  classNames?: ProgressClassNames
  styles?: ProgressStyles
}

// ============================================================================
// Constants & Helpers
// ============================================================================

const STATUS_COLORS: Record<string, string> = {
  normal: tokens.colorPrimary,
  active: tokens.colorPrimary,
  success: tokens.colorSuccess,
  exception: tokens.colorError,
}

function resolveStatus(status: ProgressStatus | undefined, percent: number): ProgressStatus {
  if (status) return status
  if (percent >= 100) return 'success'
  return 'normal'
}

function resolveStrokeBackground(
  strokeColor: ProgressStrokeColor | undefined,
  fallback: string,
): string {
  if (!strokeColor) return fallback
  if (typeof strokeColor === 'string') return strokeColor
  if (Array.isArray(strokeColor)) return fallback

  // Gradient shorthand: { from, to, direction? }
  if ('from' in strokeColor && 'to' in strokeColor) {
    const dir = (strokeColor as { from: string; to: string; direction?: string }).direction || 'to right'
    return `linear-gradient(${dir}, ${(strokeColor as { from: string; to: string }).from}, ${(strokeColor as { from: string; to: string }).to})`
  }

  // Record<string, string> gradient stops: {'0%': c1, '100%': c2}
  const entries = Object.entries(strokeColor).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
  if (entries.length > 0) {
    return `linear-gradient(to right, ${entries.map(([pct, c]) => `${c} ${pct}`).join(', ')})`
  }

  return fallback
}

function resolveSize(
  size: ProgressSize,
  isCircle: boolean,
  explicitCircleWidth: number | undefined,
): { strokeHeight: number; lineWidth: number | undefined; sizePreset: 'small' | 'default'; resolvedCircleWidth: number } {
  // Preset strings
  if (size === 'small') return { strokeHeight: 6, lineWidth: undefined, sizePreset: 'small', resolvedCircleWidth: explicitCircleWidth ?? 80 }
  if (size === 'default') return { strokeHeight: 8, lineWidth: undefined, sizePreset: 'default', resolvedCircleWidth: explicitCircleWidth ?? 120 }

  // Number: for line = strokeHeight, for circle = canvas width
  if (typeof size === 'number') {
    if (isCircle) return { strokeHeight: 6, lineWidth: undefined, sizePreset: 'default', resolvedCircleWidth: explicitCircleWidth ?? size }
    return { strokeHeight: size, lineWidth: undefined, sizePreset: size <= 6 ? 'small' : 'default', resolvedCircleWidth: explicitCircleWidth ?? 120 }
  }

  // [width, height] tuple: line only
  const [w, h] = size
  const lineW = typeof w === 'number' ? w : undefined
  return { strokeHeight: h, lineWidth: lineW, sizePreset: h <= 6 ? 'small' : 'default', resolvedCircleWidth: explicitCircleWidth ?? 120 }
}

// ============================================================================
// Icons
// ============================================================================

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function CloseCircleIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ============================================================================
// SVG Gradient ID
// ============================================================================

let gradientIdCounter = 0

// ============================================================================
// Info Renderer
// ============================================================================

function renderInfo(
  resolvedStatus: ProgressStatus,
  percent: number,
  successPercent: number | undefined,
  format: ProgressProps['format'],
  isCircleType: boolean,
): ReactNode {
  if (format) {
    const content = format(percent, successPercent)
    if (content === null || content === false) return null
    return content
  }

  if (resolvedStatus === 'success') {
    return isCircleType
      ? <CheckIcon color={tokens.colorSuccess} />
      : <CheckCircleIcon color={tokens.colorSuccess} />
  }
  if (resolvedStatus === 'exception') {
    return isCircleType
      ? <CloseIcon color={tokens.colorError} />
      : <CloseCircleIcon color={tokens.colorError} />
  }

  return `${Math.round(percent)}%`
}

// ============================================================================
// Progress Component
// ============================================================================

export function Progress({
  percent = 0,
  format,
  showInfo = true,
  status,
  strokeColor,
  strokeLinecap = 'round',
  success,
  trailColor,
  type = 'line',
  steps,
  strokeWidth: rawStrokeWidth,
  size: rawSize = 'default',
  percentPosition,
  width: circleWidth,
  gapDegree: rawGapDegree,
  gapPosition = 'bottom',
  className,
  style,
  classNames,
  styles,
}: ProgressProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent))
  const resolvedStatus = resolveStatus(status, clampedPercent)
  const isCircleType = type === 'circle' || type === 'dashboard'
  const gapDegree = Math.max(0, Math.min(295, rawGapDegree ?? (type === 'dashboard' ? 75 : 0)))
  const statusColor = STATUS_COLORS[resolvedStatus] || tokens.colorPrimary

  // Resolve size
  const { strokeHeight, lineWidth, sizePreset, resolvedCircleWidth } = resolveSize(rawSize, isCircleType, circleWidth)

  const infoContent = showInfo
    ? renderInfo(resolvedStatus, clampedPercent, success?.percent, format, isCircleType)
    : null

  // ── Circle / Dashboard ──
  if (isCircleType) {
    // Circle steps
    if (steps != null && steps > 0) {
      return (
        <CircleStepsProgress
          percent={clampedPercent}
          resolvedStatus={resolvedStatus}
          statusColor={statusColor}
          strokeColor={strokeColor}
          strokeWidth={rawStrokeWidth ?? 6}
          trailColor={trailColor}
          circleWidth={resolvedCircleWidth}
          gapDegree={gapDegree}
          gapPosition={gapPosition}
          steps={steps}
          infoContent={infoContent}
          className={className}
          style={style}
          classNames={classNames}
          styles={styles}
        />
      )
    }

    return (
      <CircleProgress
        percent={clampedPercent}
        resolvedStatus={resolvedStatus}
        statusColor={statusColor}
        strokeColor={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeWidth={rawStrokeWidth ?? 6}
        trailColor={trailColor}
        success={success}
        circleWidth={resolvedCircleWidth}
        gapDegree={gapDegree}
        gapPosition={gapPosition}
        infoContent={infoContent}
        className={className}
        style={style}
        classNames={classNames}
        styles={styles}
      />
    )
  }

  // ── Steps ──
  if (steps != null && steps > 0) {
    return (
      <StepsProgress
        percent={clampedPercent}
        statusColor={statusColor}
        strokeColor={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeWidth={rawStrokeWidth ?? strokeHeight}
        trailColor={trailColor}
        steps={steps}
        sizePreset={sizePreset}
        infoContent={infoContent}
        className={className}
        style={style}
        classNames={classNames}
        styles={styles}
      />
    )
  }

  // ── Line ──
  return (
    <LineProgress
      percent={clampedPercent}
      resolvedStatus={resolvedStatus}
      statusColor={statusColor}
      strokeColor={strokeColor}
      strokeLinecap={strokeLinecap}
      strokeWidth={rawStrokeWidth ?? strokeHeight}
      trailColor={trailColor}
      success={success}
      sizePreset={sizePreset}
      lineWidth={lineWidth}
      percentPosition={percentPosition}
      infoContent={infoContent}
      className={className}
      style={style}
      classNames={classNames}
      styles={styles}
    />
  )
}

// ============================================================================
// Line Progress
// ============================================================================

function LineProgress({
  percent,
  resolvedStatus,
  statusColor,
  strokeColor,
  strokeLinecap,
  strokeWidth,
  trailColor,
  success,
  sizePreset,
  lineWidth,
  percentPosition,
  infoContent,
  className,
  style,
  classNames,
  styles,
}: {
  percent: number
  resolvedStatus: ProgressStatus
  statusColor: string
  strokeColor: ProgressStrokeColor | undefined
  strokeLinecap: ProgressLinecap
  strokeWidth: number
  trailColor: string | undefined
  success: ProgressSuccessConfig | undefined
  sizePreset: 'small' | 'default'
  lineWidth: number | undefined
  percentPosition: ProgressPercentPosition | undefined
  infoContent: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: ProgressClassNames
  styles?: ProgressStyles
}) {
  const borderRadius = strokeLinecap === 'round' ? strokeWidth / 2 : 0
  const bg = resolveStrokeBackground(strokeColor, statusColor)
  const posType = percentPosition?.type || 'outer'
  const posAlign = percentPosition?.align || 'end'
  const isInner = posType === 'inner'

  // Inner text alignment
  const innerJustify = posAlign === 'start' ? 'flex-start' : posAlign === 'center' ? 'center' : 'flex-end'

  const barElement = (
    <div style={{ flex: lineWidth ? undefined : 1, width: lineWidth, minWidth: 0 }}>
      <div
        className={cx('ino-progress__trail', classNames?.trail)}
        style={{
          height: strokeWidth,
          borderRadius,
          backgroundColor: trailColor || tokens.colorBgMuted,
          ...styles?.trail,
        }}
      >
        {/* Main stroke */}
        <div
          className={cx('ino-progress__stroke', classNames?.stroke)}
          style={{
            width: `${percent}%`,
            borderRadius,
            background: bg,
            ...styles?.stroke,
          }}
        >
          {/* Active shimmer */}
          {resolvedStatus === 'active' && (
            <div className="ino-progress__active-shimmer" style={{ borderRadius }} />
          )}

          {/* Inner text */}
          {isInner && infoContent != null && (
            <span
              className={cx('ino-progress__inner-text', classNames?.text)}
              style={{
                justifyContent: innerJustify,
                fontSize: Math.max(strokeWidth * 0.7, 10),
                ...styles?.text,
              }}
            >
              {infoContent}
            </span>
          )}
        </div>

        {/* Success segment */}
        {success?.percent != null && success.percent > 0 && (
          <div
            className="ino-progress__success-segment"
            style={{
              width: `${Math.min(100, success.percent)}%`,
              borderRadius,
              backgroundColor: success.strokeColor || tokens.colorSuccess,
            }}
          />
        )}
      </div>
    </div>
  )

  // Outer info element
  const outerInfo = !isInner && infoContent != null
    ? (
      <span
        className={cx('ino-progress__text', `ino-progress__text--${sizePreset}`, classNames?.text)}
        style={styles?.text}
      >
        {infoContent}
      </span>
    )
    : null

  return (
    <div
      className={cx('ino-progress', { 'ino-progress--full-width': !lineWidth }, className)}
      style={{ ...style, ...styles?.root }}
    >
      {posAlign === 'start' && outerInfo}
      {barElement}
      {posAlign !== 'start' && outerInfo}
    </div>
  )
}

// ============================================================================
// Steps Progress
// ============================================================================

function StepsProgress({
  percent,
  statusColor,
  strokeColor,
  strokeLinecap,
  strokeWidth,
  trailColor,
  steps,
  sizePreset,
  infoContent,
  className,
  style,
  classNames,
  styles,
}: {
  percent: number
  statusColor: string
  strokeColor: ProgressStrokeColor | undefined
  strokeLinecap: ProgressLinecap
  strokeWidth: number
  trailColor: string | undefined
  steps: number
  sizePreset: 'small' | 'default'
  infoContent: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: ProgressClassNames
  styles?: ProgressStyles
}) {
  const filledCount = Math.round((percent / 100) * steps)
  const borderRadius = strokeLinecap === 'round' ? strokeWidth / 2 : 0
  const colors = Array.isArray(strokeColor) ? strokeColor : null
  const fallbackColor = typeof strokeColor === 'string' ? strokeColor : statusColor

  return (
    <div
      className={cx('ino-progress', 'ino-progress--full-width', className)}
      style={{ ...style, ...styles?.root }}
    >
      <div
        className={cx('ino-progress__steps', classNames?.trail)}
        style={styles?.trail}
      >
        {Array.from({ length: steps }, (_, i) => {
          const isFilled = i < filledCount
          const bgColor = isFilled
            ? (colors ? colors[i % colors.length] : fallbackColor)
            : (trailColor || tokens.colorBgMuted)

          return (
            <div
              key={i}
              className={cx('ino-progress__step', isFilled ? classNames?.stroke : undefined)}
              style={{
                height: strokeWidth,
                borderRadius,
                backgroundColor: bgColor,
                ...(isFilled ? styles?.stroke : undefined),
              }}
            />
          )
        })}
      </div>

      {infoContent != null && (
        <span
          className={cx('ino-progress__text', `ino-progress__text--${sizePreset}`, classNames?.text)}
          style={styles?.text}
        >
          {infoContent}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Circle / Dashboard Progress
// ============================================================================

function CircleProgress({
  percent,
  resolvedStatus,
  statusColor,
  strokeColor,
  strokeLinecap,
  strokeWidth,
  trailColor,
  success,
  circleWidth,
  gapDegree,
  gapPosition,
  infoContent,
  className,
  style,
  classNames,
  styles,
}: {
  percent: number
  resolvedStatus: ProgressStatus
  statusColor: string
  strokeColor: ProgressStrokeColor | undefined
  strokeLinecap: ProgressLinecap
  strokeWidth: number
  trailColor: string | undefined
  success: ProgressSuccessConfig | undefined
  circleWidth: number
  gapDegree: number
  gapPosition: ProgressGapPosition
  infoContent: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: ProgressClassNames
  styles?: ProgressStyles
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gradientId = useMemo(() => `j-progress-grad-${++gradientIdCounter}`, [])

  const strokePx = (strokeWidth / 100) * circleWidth
  const center = circleWidth / 2
  const radius = center - strokePx / 2
  const circumference = 2 * Math.PI * radius
  const gapLength = (gapDegree / 360) * circumference
  const totalVisible = circumference - gapLength
  const filledLength = (percent / 100) * totalVisible

  const rotateAngle = getRotateAngle(gapPosition, gapDegree)

  // Gradient detection
  const hasGradient = strokeColor != null
    && typeof strokeColor !== 'string'
    && !Array.isArray(strokeColor)
    && !('from' in strokeColor && 'to' in strokeColor)
    && Object.keys(strokeColor).some(k => k.includes('%'))

  const gradientStops = hasGradient
    ? Object.entries(strokeColor as Record<string, string>).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    : null

  const resolvedStroke = hasGradient
    ? `url(#${gradientId})`
    : typeof strokeColor === 'string'
      ? strokeColor
      : (strokeColor && 'from' in strokeColor)
        ? (strokeColor as { from: string }).from
        : statusColor

  // Success segment
  const successLength = success?.percent != null
    ? (Math.min(100, success.percent) / 100) * totalVisible
    : 0

  const circleBase: CSSProperties = {
    fill: 'none',
    strokeLinecap,
  }

  // Font size scales with circle width
  const fontSize = circleWidth * 0.2
  const iconFontSize = circleWidth * 0.3

  // Responsive: when circle is very small, show info in Tooltip instead
  const isResponsive = circleWidth <= 20
  const showInnerInfo = !isResponsive && infoContent != null

  const circleElement = (
    <div
      className={cx('ino-progress--circle', className)}
      style={{ ...style, ...styles?.root }}
    >
      <svg
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
        width={circleWidth}
        height={circleWidth}
      >
        {/* Gradient definition */}
        {gradientStops && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops.map(([offset, color]) => (
                <stop key={offset} offset={offset} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Trail */}
        <circle
          className={classNames?.trail}
          cx={center}
          cy={center}
          r={radius}
          stroke={trailColor || tokens.colorBgMuted}
          strokeWidth={strokePx}
          strokeDasharray={gapDegree > 0 ? `${totalVisible} ${gapLength}` : undefined}
          transform={`rotate(${rotateAngle} ${center} ${center})`}
          style={{ ...circleBase, ...styles?.trail }}
        />

        {/* Main stroke */}
        <circle
          className={classNames?.stroke}
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedStroke}
          strokeWidth={strokePx}
          strokeDasharray={`${filledLength} ${circumference}`}
          transform={`rotate(${rotateAngle} ${center} ${center})`}
          style={{
            ...circleBase,
            transition: 'stroke-dasharray 0.3s ease',
            ...styles?.stroke,
          }}
        />

        {/* Success overlay */}
        {successLength > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={success!.strokeColor || tokens.colorSuccess}
            strokeWidth={strokePx}
            strokeDasharray={`${successLength} ${circumference}`}
            transform={`rotate(${rotateAngle} ${center} ${center})`}
            style={circleBase}
          />
        )}
      </svg>

      {/* Centered info */}
      {showInnerInfo && (
        <span
          className={cx('ino-progress__circle-text', classNames?.text)}
          style={{
            fontSize: resolvedStatus === 'success' || resolvedStatus === 'exception'
              ? iconFontSize
              : fontSize,
            ...styles?.text,
          }}
        >
          {infoContent}
        </span>
      )}
    </div>
  )

  // Wrap in Tooltip when too small to show text
  if (isResponsive && infoContent != null) {
    return (
      <Tooltip content={<span>{infoContent}</span>}>
        {circleElement}
      </Tooltip>
    )
  }

  return circleElement
}

// ============================================================================
// Circle Steps Progress
// ============================================================================

function CircleStepsProgress({
  percent,
  resolvedStatus,
  statusColor,
  strokeColor,
  strokeWidth,
  trailColor,
  circleWidth,
  gapDegree,
  gapPosition,
  steps,
  infoContent,
  className,
  style,
  classNames,
  styles,
}: {
  percent: number
  resolvedStatus: ProgressStatus
  statusColor: string
  strokeColor: ProgressStrokeColor | undefined
  strokeWidth: number
  trailColor: string | undefined
  circleWidth: number
  gapDegree: number
  gapPosition: ProgressGapPosition
  steps: number
  infoContent: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: ProgressClassNames
  styles?: ProgressStyles
}) {
  const strokePx = (strokeWidth / 100) * circleWidth
  const center = circleWidth / 2
  const radius = center - strokePx / 2
  const circumference = 2 * Math.PI * radius
  const gapLength = (gapDegree / 360) * circumference
  const totalVisible = circumference - gapLength

  const rotateAngle = getRotateAngle(gapPosition, gapDegree)

  const filledCount = Math.round((percent / 100) * steps)
  const stepGapDeg = 2 // gap between steps in degrees
  const stepGapLength = (stepGapDeg / 360) * circumference
  const totalGapsLength = stepGapLength * steps
  const stepArcLength = (totalVisible - totalGapsLength) / steps

  const colors = Array.isArray(strokeColor) ? strokeColor : null
  const fallbackColor = typeof strokeColor === 'string' ? strokeColor : statusColor

  const circleBase: CSSProperties = {
    fill: 'none',
    strokeLinecap: 'butt', // butt for clean step edges
  }

  const fontSize = circleWidth * 0.2
  const iconFontSize = circleWidth * 0.3
  const isResponsive = circleWidth <= 20
  const showInnerInfo = !isResponsive && infoContent != null

  const circleElement = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        position: 'relative',
        ...style,
        ...styles?.root,
      }}
    >
      <svg
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
        width={circleWidth}
        height={circleWidth}
      >
        {/* Trail segments */}
        {Array.from({ length: steps }, (_, i) => {
          const offset = i * (stepArcLength + stepGapLength)
          return (
            <circle
              key={`trail-${i}`}
              className={classNames?.trail}
              cx={center}
              cy={center}
              r={radius}
              stroke={trailColor || tokens.colorBgMuted}
              strokeWidth={strokePx}
              strokeDasharray={`${stepArcLength} ${circumference - stepArcLength}`}
              strokeDashoffset={-offset}
              transform={`rotate(${rotateAngle} ${center} ${center})`}
              style={{ ...circleBase, ...styles?.trail }}
            />
          )
        })}

        {/* Filled segments */}
        {Array.from({ length: filledCount }, (_, i) => {
          const offset = i * (stepArcLength + stepGapLength)
          const color = colors ? colors[i % colors.length] : fallbackColor
          return (
            <circle
              key={`fill-${i}`}
              className={classNames?.stroke}
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokePx}
              strokeDasharray={`${stepArcLength} ${circumference - stepArcLength}`}
              strokeDashoffset={-offset}
              transform={`rotate(${rotateAngle} ${center} ${center})`}
              style={{
                ...circleBase,
                transition: 'stroke-dasharray 0.3s ease',
                ...styles?.stroke,
              }}
            />
          )
        })}
      </svg>

      {/* Centered info */}
      {showInnerInfo && (
        <span
          className={classNames?.text}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: resolvedStatus === 'success' || resolvedStatus === 'exception'
              ? iconFontSize
              : fontSize,
            color: tokens.colorText,
            lineHeight: 1,
            ...styles?.text,
          }}
        >
          {infoContent}
        </span>
      )}
    </div>
  )

  if (isResponsive && infoContent != null) {
    return (
      <Tooltip content={<span>{infoContent}</span>}>
        {circleElement}
      </Tooltip>
    )
  }

  return circleElement
}

// ============================================================================
// Shared circle helpers
// ============================================================================

function getRotateAngle(gapPosition: ProgressGapPosition, gapDegree: number): number {
  switch (gapPosition) {
    case 'top':    return -90 + gapDegree / 2
    case 'bottom': return 90 + gapDegree / 2
    case 'left':   return 180 + gapDegree / 2
    case 'right':  return gapDegree / 2
  }
}
