import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Statistic.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type StatisticSemanticSlot = 'root' | 'title' | 'content' | 'prefix' | 'suffix'
export type StatisticClassNames = SemanticClassNames<StatisticSemanticSlot>
export type StatisticStyles = SemanticStyles<StatisticSemanticSlot>

export interface StatisticProps {
  title?: ReactNode
  value?: string | number
  precision?: number
  decimalSeparator?: string
  groupSeparator?: string
  prefix?: ReactNode
  suffix?: ReactNode
  formatter?: (value: string | number) => ReactNode
  loading?: boolean
  loadingWidth?: string
  className?: string
  style?: CSSProperties
  classNames?: StatisticClassNames
  styles?: StatisticStyles
}

export type CountdownSemanticSlot = StatisticSemanticSlot
export type CountdownClassNames = SemanticClassNames<CountdownSemanticSlot>
export type CountdownStyles = SemanticStyles<CountdownSemanticSlot>

export interface StatisticCountdownProps {
  title?: ReactNode
  value: number
  format?: string
  prefix?: ReactNode
  suffix?: ReactNode
  onFinish?: () => void
  onChange?: (value: number) => void
  className?: string
  style?: CSSProperties
  classNames?: CountdownClassNames
  styles?: CountdownStyles
}

// ─── Number Formatting ──────────────────────────────────────────────────────────

function formatNumber(
  value: string | number,
  precision?: number,
  decimalSeparator = '.',
  groupSeparator = ',',
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return String(value)

  const fixed = precision !== undefined ? num.toFixed(precision) : String(num)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)

  return decPart !== undefined
    ? `${grouped}${decimalSeparator}${decPart}`
    : grouped
}

// ─── Countdown Formatting ───────────────────────────────────────────────────────

function formatCountdown(ms: number, format: string): string {
  const remaining = Math.max(0, ms)

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
  const milliseconds = Math.floor(remaining % 1000)

  const literals: string[] = []
  let safe = format.replace(/\[([^\]]*)\]/g, (_, text: string) => {
    literals.push(text)
    return `\x00${literals.length - 1}\x00`
  })

  safe = safe.replace(/SSS|DD|D|HH|H|mm|m|ss|s/g, (token) => {
    switch (token) {
      case 'SSS': return String(milliseconds).padStart(3, '0')
      case 'DD':  return String(days).padStart(2, '0')
      case 'D':   return String(days)
      case 'HH':  return String(hours).padStart(2, '0')
      case 'H':   return String(hours)
      case 'mm':  return String(minutes).padStart(2, '0')
      case 'm':   return String(minutes)
      case 'ss':  return String(seconds).padStart(2, '0')
      case 's':   return String(seconds)
      default:    return token
    }
  })

  return safe.replace(/\x00(\d+)\x00/g, (_, idx, offset) => {
    const literal = literals[Number(idx)]
    const pipe = literal.indexOf('|')
    if (pipe === -1) return literal

    const before = safe.slice(0, offset)
    const numMatch = before.match(/(\d+)\s*$/)
    const n = numMatch ? parseInt(numMatch[1], 10) : 0
    return n === 1 ? literal.slice(0, pipe) : literal.slice(pipe + 1)
  })
}

// ─── Loading Placeholder ────────────────────────────────────────────────────────

function LoadingPlaceholder({ width = '7rem' }: { width?: string }) {
  return (
    <span
      className="ino-statistic__loading"
      style={{ width }}
    />
  )
}

// ─── Statistic Component ────────────────────────────────────────────────────────

function StatisticComponent({
  title,
  value = 0,
  precision,
  decimalSeparator = '.',
  groupSeparator = ',',
  prefix,
  suffix,
  formatter,
  loading = false,
  loadingWidth,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: StatisticProps) {
  const displayValue = loading
    ? <LoadingPlaceholder width={loadingWidth} />
    : formatter
      ? formatter(value)
      : formatNumber(value, precision, decimalSeparator, groupSeparator)

  return (
    <div
      className={cx(className, classNamesProp?.root)}
      style={{ ...styles?.root, ...style }}
    >
      {title != null && (
        <div className={cx('ino-statistic__title', classNamesProp?.title)} style={styles?.title}>
          {title}
        </div>
      )}
      <div className={cx('ino-statistic__content', classNamesProp?.content)} style={styles?.content}>
        {prefix != null && (
          <span className={cx('ino-statistic__prefix', classNamesProp?.prefix)} style={styles?.prefix}>
            {prefix}
          </span>
        )}
        <span>{displayValue}</span>
        {suffix != null && (
          <span className={cx('ino-statistic__suffix', classNamesProp?.suffix)} style={styles?.suffix}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Statistic.Countdown ────────────────────────────────────────────────────────

function StatisticCountdown({
  title,
  value,
  format = 'HH:mm:ss',
  prefix,
  suffix,
  onFinish,
  onChange,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: StatisticCountdownProps) {
  const [remaining, setRemaining] = useState(() => Math.max(0, value - Date.now()))
  const onFinishRef = useRef(onFinish)
  const onChangeRef = useRef(onChange)
  const finishedRef = useRef(false)

  onFinishRef.current = onFinish
  onChangeRef.current = onChange

  useEffect(() => {
    finishedRef.current = false

    const tick = () => {
      const diff = Math.max(0, value - Date.now())
      setRemaining(diff)
      onChangeRef.current?.(diff)

      if (diff <= 0 && !finishedRef.current) {
        finishedRef.current = true
        onFinishRef.current?.()
      }
    }

    tick()

    const intervalMs = format.includes('SSS') ? 33 : 1000
    const id = setInterval(tick, intervalMs)

    return () => clearInterval(id)
  }, [value, format])

  const displayValue = formatCountdown(remaining, format)

  return (
    <div
      className={cx(className, classNamesProp?.root)}
      style={{ ...styles?.root, ...style }}
    >
      {title != null && (
        <div className={cx('ino-statistic__title', classNamesProp?.title)} style={styles?.title}>
          {title}
        </div>
      )}
      <div className={cx('ino-statistic__content', classNamesProp?.content)} style={styles?.content}>
        {prefix != null && (
          <span className={cx('ino-statistic__prefix', classNamesProp?.prefix)} style={styles?.prefix}>
            {prefix}
          </span>
        )}
        <span>{displayValue}</span>
        {suffix != null && (
          <span className={cx('ino-statistic__suffix', classNamesProp?.suffix)} style={styles?.suffix}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Statistic = Object.assign(StatisticComponent, {
  Countdown: StatisticCountdown,
})
