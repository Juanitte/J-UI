import { type ReactNode, type CSSProperties, useState, useEffect } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type SpinnerSize = 'small' | 'default' | 'large'
export type SpinnerType = 'gradient' | 'ring' | 'classic' | 'dots' | 'bars' | 'pulse' | 'dash'

export type SpinnerSemanticSlot = 'root' | 'indicator' | 'tip' | 'overlay' | 'content'
export type SpinnerClassNames = SemanticClassNames<SpinnerSemanticSlot>
export type SpinnerStyles = SemanticStyles<SpinnerSemanticSlot>

export interface SpinnerProps {
  /** Whether the spinner is active (default true) */
  spinning?: boolean
  /** Visual style of the spinner */
  type?: SpinnerType
  /** Size of the spinner */
  size?: SpinnerSize
  /** Delay in ms before showing the spinner (avoids flicker) */
  delay?: number
  /** Custom indicator element */
  indicator?: ReactNode
  /** Tip text displayed below the spinner (for pulse type, this becomes the pulsing text) */
  tip?: ReactNode
  /** Fullscreen overlay mode */
  fullscreen?: boolean
  /** Progress percentage (0-100) or 'auto' for indeterminate progress */
  percent?: number | 'auto'
  /** Content to wrap with loading overlay */
  children?: ReactNode

  className?: string
  style?: CSSProperties
  classNames?: SpinnerClassNames
  styles?: SpinnerStyles
}

// ============================================================================
// Constants
// ============================================================================

const KEYFRAMES = `
@keyframes j-spinner-rotate { to { transform: rotate(360deg); } }
@keyframes j-spinner-dash {
  0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50%  { stroke-dasharray: 90, 200; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124; }
}
@keyframes j-spinner-pulse-text {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 1; }
}
@keyframes j-spinner-bounce {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.35; }
  40%           { transform: scale(1); opacity: 1; }
}
@keyframes j-spinner-bar-fade {
  0%, 100% { opacity: 0.15; }
  50%      { opacity: 1; }
}
@keyframes j-spinner-classic-dot {
  0%   { transform: scale(0.6); opacity: 0.3; }
  50%  { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.6); opacity: 0.3; }
}`

const SIZE_CONFIG: Record<SpinnerSize, { diameter: string; diameterPx: number; strokeWidth: number; gradientStrokeWidth: number; tipFontSize: string }> = {
  small:   { diameter: '1rem',   diameterPx: 16, strokeWidth: 3, gradientStrokeWidth: 4.5, tipFontSize: '0.75rem' },
  default: { diameter: '1.5rem', diameterPx: 24, strokeWidth: 3, gradientStrokeWidth: 4.5, tipFontSize: '0.875rem' },
  large:   { diameter: '2.5rem', diameterPx: 40, strokeWidth: 3, gradientStrokeWidth: 5,   tipFontSize: '1rem' },
}

const BAR_COUNT = 8

// ============================================================================
// Indicator helpers
// ============================================================================

interface IndicatorProps { diameter: string; strokeWidth: number }

function RotatingWrapper({ diameter, children, speed = '0.8s' }: { diameter: string; children: ReactNode; speed?: string }) {
  return (
    <div style={{ width: diameter, height: diameter, animation: `j-spinner-rotate ${speed} linear infinite`, lineHeight: 0 }}>
      {children}
    </div>
  )
}

// ── Type: gradient ── track ring + smooth comet-tail via CSS conic-gradient
function GradientIndicator({ diameter, strokeWidth }: IndicatorProps) {
  const thickness = `calc(${diameter} * ${strokeWidth / 50})`
  return (
    <RotatingWrapper diameter={diameter}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Track ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `${thickness} solid ${tokens.colorBgMuted}`,
          boxSizing: 'border-box',
        }} />
        {/* Smooth gradient comet arc */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, transparent 0%, ${tokens.colorPrimary} 30%, transparent 30.5%)`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}), #000 calc(100% - ${thickness}))`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}), #000 calc(100% - ${thickness}))`,
        }} />
      </div>
    </RotatingWrapper>
  )
}

// ── Type: ring ── simple ring with a visible gap
function RingIndicator({ diameter, strokeWidth }: IndicatorProps) {
  const r = 20
  const circumference = 2 * Math.PI * r
  return (
    <RotatingWrapper diameter={diameter}>
      <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
        <circle cx="25" cy="25" r={r} stroke={tokens.colorBgMuted} strokeWidth={strokeWidth} />
        <circle
          cx="25" cy="25" r={r}
          stroke={tokens.colorPrimary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
        />
      </svg>
    </RotatingWrapper>
  )
}

// ── Type: classic ── Ant Design-style 4 orbiting dots
function ClassicIndicator({ diameter }: IndicatorProps) {
  const dotSize = `calc(${diameter} * 0.36)`
  const inset = '10%'
  return (
    <RotatingWrapper diameter={diameter} speed="1.2s">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {[0, 1, 2, 3].map((i) => {
          const positions: CSSProperties[] = [
            { top: inset, left: inset },
            { top: inset, right: inset },
            { bottom: inset, right: inset },
            { bottom: inset, left: inset },
          ]
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: tokens.colorPrimary,
                animation: `j-spinner-classic-dot 1s ease-in-out ${i * 0.15}s infinite`,
                ...positions[i],
              }}
            />
          )
        })}
      </div>
    </RotatingWrapper>
  )
}

// ── Type: dots ── three bouncing dots
function DotsIndicator({ diameter }: IndicatorProps) {
  const dotSize = `calc(${diameter} * 0.28)`
  return (
    <div style={{ width: diameter, height: diameter, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${diameter} * 0.08)` }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: tokens.colorPrimary,
            animation: `j-spinner-bounce 1s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ── Type: bars ── classic iOS-style rotating bars
function BarsIndicator({ diameter }: IndicatorProps) {
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => i)
  return (
    <div style={{ width: diameter, height: diameter, position: 'relative' }}>
      {bars.map((i) => {
        const angle = (360 / BAR_COUNT) * i
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '8%',
              height: '28%',
              borderRadius: '999px',
              backgroundColor: tokens.colorPrimary,
              transformOrigin: 'center 0',
              transform: `translate(-50%, 0) rotate(${angle}deg) translateY(-170%)`,
              animation: `j-spinner-bar-fade 0.8s linear ${(i / BAR_COUNT).toFixed(2)}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}

// ── Type: pulse ── pulsing text (uses tip as content, defaults to "Loading...")
// This is a special type: the indicator IS the text, so tip is not shown separately
function PulseIndicator(_props: IndicatorProps) {
  // Rendered via special handling in the Spinner component
  return null
}

// ── Type: dash ── Material-style animated dash
function DashIndicator({ diameter, strokeWidth }: IndicatorProps) {
  const r = 20
  return (
    <RotatingWrapper diameter={diameter} speed="2s">
      <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
        <circle cx="25" cy="25" r={r} stroke={tokens.colorBgMuted} strokeWidth={strokeWidth} />
        <circle
          cx="25" cy="25" r={r}
          stroke={tokens.colorPrimary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ animation: 'j-spinner-dash 1.4s ease-in-out infinite' }}
        />
      </svg>
    </RotatingWrapper>
  )
}

const INDICATOR_MAP: Record<SpinnerType, (props: IndicatorProps) => ReactNode> = {
  gradient: GradientIndicator,
  ring: RingIndicator,
  classic: ClassicIndicator,
  dots: DotsIndicator,
  bars: BarsIndicator,
  pulse: PulseIndicator,
  dash: DashIndicator,
}

// ============================================================================
// Percent circle
// ============================================================================

function PercentCircle({ diameter, strokeWidth, percent }: { diameter: string; strokeWidth: number; percent: number | 'auto' }) {
  const r = 20
  const circumference = 2 * Math.PI * r

  if (percent === 'auto') {
    return (
      <RotatingWrapper diameter={diameter}>
        <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
          <circle
            cx="25"
            cy="25"
            r={r}
            stroke={tokens.colorPrimary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={circumference * 0.125}
          />
        </svg>
      </RotatingWrapper>
    )
  }

  const clamped = Math.max(0, Math.min(100, percent))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox="0 0 50 50"
      fill="none"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx="25"
        cy="25"
        r={r}
        stroke={tokens.colorBgMuted}
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx="25"
        cy="25"
        r={r}
        stroke={clamped >= 100 ? tokens.colorSuccess : tokens.colorPrimary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
      />
    </svg>
  )
}

// ============================================================================
// Spinner Component
// ============================================================================

export function Spinner({
  spinning = true,
  type = 'gradient',
  size = 'default',
  delay,
  indicator,
  tip,
  fullscreen = false,
  percent,
  children,
  className,
  style,
  classNames,
  styles,
}: SpinnerProps) {
  // ── Delay logic ──
  const [visible, setVisible] = useState(() => spinning && !delay)

  useEffect(() => {
    if (!spinning) {
      setVisible(false)
      return
    }
    if (!delay) {
      setVisible(true)
      return
    }
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [spinning, delay])

  const config = SIZE_CONFIG[size]
  const isPulse = type === 'pulse' && indicator == null && percent == null

  // ── Resolve indicator ──
  let indicatorElement: ReactNode
  if (indicator != null) {
    indicatorElement = indicator
  } else if (percent != null) {
    indicatorElement = <PercentCircle diameter={config.diameter} strokeWidth={config.strokeWidth} percent={percent} />
  } else if (isPulse) {
    // Pulse type: the pulsing text IS the indicator
    indicatorElement = (
      <div
        style={{
          fontSize: config.tipFontSize,
          fontWeight: 600,
          color: tokens.colorPrimary,
          animation: 'j-spinner-pulse-text 1.5s ease-in-out infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {tip ?? 'Loading...'}
      </div>
    )
  } else {
    const Ind = INDICATOR_MAP[type]
    const sw = type === 'gradient' ? config.gradientStrokeWidth : config.strokeWidth
    indicatorElement = <Ind diameter={config.diameter} strokeWidth={sw} />
  }

  // ── Spinner content (indicator + tip) ──
  const spinnerContent = (
    <div
      className={classNames?.indicator}
      style={mergeSemanticStyle(
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        },
        styles?.indicator,
      )}
    >
      {indicatorElement}
      {tip != null && !isPulse && (
        <div
          className={classNames?.tip}
          style={mergeSemanticStyle(
            {
              fontSize: config.tipFontSize,
              color: tokens.colorPrimary,
              whiteSpace: 'nowrap',
            },
            styles?.tip,
          )}
        >
          {tip}
        </div>
      )}
    </div>
  )

  // ── Fullscreen mode ──
  if (fullscreen) {
    if (!visible) return null
    return (
      <>
        <style>{KEYFRAMES}</style>
        <div
          className={mergeSemanticClassName(className, classNames?.root)}
          style={mergeSemanticStyle(
            {
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            },
            styles?.root,
            style,
          )}
        >
          {spinnerContent}
        </div>
      </>
    )
  }

  // ── Container mode (has children) ──
  if (children != null) {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <div
          className={mergeSemanticClassName(className, classNames?.root)}
          style={mergeSemanticStyle(
            { position: 'relative' },
            styles?.root,
            style,
          )}
        >
          {/* Content */}
          <div
            className={classNames?.content}
            style={mergeSemanticStyle(
              {
                transition: 'opacity 0.3s ease, filter 0.3s ease',
                ...(visible && {
                  opacity: 0.5,
                  filter: 'blur(1px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }),
              },
              styles?.content,
            )}
          >
            {children}
          </div>

          {/* Overlay */}
          {visible && (
            <div
              className={classNames?.overlay}
              style={mergeSemanticStyle(
                {
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                },
                styles?.overlay,
              )}
            >
              {spinnerContent}
            </div>
          )}
        </div>
      </>
    )
  }

  // ── Standalone mode ──
  if (!visible) return null
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          styles?.root,
          style,
        )}
      >
        {spinnerContent}
      </div>
    </>
  )
}
