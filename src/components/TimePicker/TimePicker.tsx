import {
  type ReactNode, type CSSProperties, type MouseEvent as ReactMouseEvent,
  useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type TimePickerSize = 'sm' | 'md' | 'lg'
export type TimePickerVariant = 'outlined' | 'borderless' | 'filled'
export type TimePickerStatus = 'error' | 'warning'
export type TimePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export type TimePickerSemanticSlot = 'root' | 'input' | 'popup' | 'column' | 'footer'
export type TimePickerClassNames = SemanticClassNames<TimePickerSemanticSlot>
export type TimePickerStyles = SemanticStyles<TimePickerSemanticSlot>

export interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

export interface TimePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (time: Date | null, timeString: string) => void
  onCalendarChange?: (time: Date | null, timeString: string) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  defaultOpen?: boolean
  format?: string
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabled?: boolean
  allowClear?: boolean
  placeholder?: string
  placement?: TimePickerPlacement
  size?: TimePickerSize
  variant?: TimePickerVariant
  status?: TimePickerStatus
  needConfirm?: boolean
  showNow?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  addon?: ReactNode
  changeOnScroll?: boolean
  showAnalog?: boolean
  inputReadOnly?: boolean
  disabledTime?: () => DisabledTimeConfig
  className?: string
  style?: CSSProperties
  classNames?: TimePickerClassNames
  styles?: TimePickerStyles
  id?: string
  autoFocus?: boolean
}

export interface TimeRangePickerProps {
  value?: [Date | null, Date | null]
  defaultValue?: [Date | null, Date | null]
  onChange?: (times: [Date | null, Date | null] | null, timeStrings: [string, string]) => void
  onCalendarChange?: (
    times: [Date | null, Date | null],
    timeStrings: [string, string],
    info: { range: 'start' | 'end' },
  ) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  defaultOpen?: boolean
  format?: string
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabled?: boolean | [boolean, boolean]
  allowClear?: boolean
  placeholder?: [string, string]
  separator?: ReactNode
  placement?: TimePickerPlacement
  size?: TimePickerSize
  variant?: TimePickerVariant
  status?: TimePickerStatus
  needConfirm?: boolean
  showNow?: boolean
  order?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  addon?: ReactNode
  changeOnScroll?: boolean
  inputReadOnly?: boolean
  disabledTime?: (type: 'start' | 'end') => DisabledTimeConfig
  className?: string
  style?: CSSProperties
  classNames?: TimePickerClassNames
  styles?: TimePickerStyles
  id?: string
}

// ============================================================================
// Icons
// ============================================================================

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <polyline points="8 4.5 8 8 10.5 9.5" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5.5" fill="currentColor" opacity="0.08" />
      <line x1="5" y1="5" x2="9" y2="9" />
      <line x1="9" y1="5" x2="5" y2="9" />
    </svg>
  )
}

function SeparatorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="8" x2="12" y2="8" />
      <polyline points="9 5 12 8 9 11" />
    </svg>
  )
}

// ============================================================================
// Config & Utilities
// ============================================================================

const sizeConfig: Record<TimePickerSize, {
  height: string; fontSize: string;
  radius: string; paddingH: string; inputFontSize: string
}> = {
  sm: { height: '1.75rem', fontSize: '0.75rem', radius: '0.25rem', paddingH: '0.5rem', inputFontSize: '1rem' },
  md: { height: '2.25rem', fontSize: '0.875rem', radius: '0.375rem', paddingH: '0.75rem', inputFontSize: '1rem' },
  lg: { height: '2.75rem', fontSize: '1rem', radius: '0.5rem', paddingH: '0.875rem', inputFontSize: '1rem' },
}

// ============================================================================
// Format utilities
// ============================================================================

interface FormatConfig {
  showHour: boolean
  showMinute: boolean
  showSecond: boolean
  use12Hours: boolean
}

function parseTimeFormat(format: string): FormatConfig {
  return {
    showHour: /[Hh]/.test(format),
    showMinute: /m/.test(format),
    showSecond: /s/.test(format),
    use12Hours: /h/.test(format) || /[Aa]/.test(format),
  }
}

function getDefaultFormat(use12Hours?: boolean): string {
  return use12Hours ? 'hh:mm A' : 'HH:mm'
}

function formatTime(date: Date | null, format: string): string {
  if (!date) return ''
  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ampm = hours24 >= 12 ? 'PM' : 'AM'

  return format
    .replace(/HH/g, String(hours24).padStart(2, '0'))
    .replace(/H/g, String(hours24))
    .replace(/hh/g, String(hours12).padStart(2, '0'))
    .replace(/h/g, String(hours12))
    .replace(/mm/g, String(minutes).padStart(2, '0'))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, String(seconds).padStart(2, '0'))
    .replace(/s/g, String(seconds))
    .replace(/A/g, ampm)
    .replace(/a/g, ampm.toLowerCase())
}

function parseTimeString(str: string, format: string): Date | null {
  if (!str.trim()) return null

  let hours = 0
  let minutes = 0
  let seconds = 0
  let isPM = false
  let hasAMPM = false

  // Extract AM/PM first
  const ampmMatch = str.match(/\b(AM|PM|am|pm)\b/i)
  if (ampmMatch) {
    hasAMPM = true
    isPM = ampmMatch[1].toUpperCase() === 'PM'
  }

  // Extract numbers
  const nums = str.match(/\d+/g)
  if (!nums) return null

  const config = parseTimeFormat(format)

  let idx = 0
  if (config.showHour && idx < nums.length) {
    hours = parseInt(nums[idx++], 10)
    if (hasAMPM) {
      if (hours === 12) hours = isPM ? 12 : 0
      else if (isPM) hours += 12
    }
  }
  if (config.showMinute && idx < nums.length) {
    minutes = parseInt(nums[idx++], 10)
  }
  if (config.showSecond && idx < nums.length) {
    seconds = parseInt(nums[idx++], 10)
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) return null

  const d = new Date()
  d.setHours(hours, minutes, seconds, 0)
  return d
}

// ============================================================================
// TimeColumn (internal)
// ============================================================================

const COL_WIDTH = '3.5rem'
const COL_HEIGHT = '14rem'
const ITEM_HEIGHT = 28

interface TimeColumnProps {
  type: 'hour' | 'minute' | 'second' | 'ampm'
  value: number | string
  options: { value: number | string; label: string; disabled?: boolean }[]
  onChange: (value: number | string) => void
  columnStyle?: CSSProperties
  columnClassName?: string
  isLast?: boolean
  changeOnScroll?: boolean
}

function TimeColumn({ type, value, options, onChange, columnStyle, columnClassName, isLast, changeOnScroll }: TimeColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUserScrolling = useRef(false)

  useEffect(() => {
    if (!columnRef.current) return
    const selectedIndex = options.findIndex(o => o.value === value)
    if (selectedIndex >= 0) {
      const targetTop = selectedIndex * ITEM_HEIGHT
      columnRef.current.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }, [value, options])

  // changeOnScroll: detect scroll-end and select nearest item
  useEffect(() => {
    if (!changeOnScroll || !columnRef.current) return
    const el = columnRef.current
    const handleScroll = () => {
      isUserScrolling.current = true
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => {
        if (!isUserScrolling.current) return
        isUserScrolling.current = false
        const scrollTop = el.scrollTop
        const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT)
        const clamped = Math.max(0, Math.min(nearestIndex, options.length - 1))
        const item = options[clamped]
        if (item && !item.disabled && item.value !== value) {
          onChange(item.value)
        }
        // Snap scroll position
        el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      }, 120)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [changeOnScroll, options, value, onChange])

  const colStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    height: COL_HEIGHT, overflowY: 'auto', overflowX: 'hidden',
    minWidth: COL_WIDTH, flex: 1,
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorBorderHover} transparent`,
    borderRight: isLast ? 'none' : `1px solid ${tokens.colorBorder}`,
    ...columnStyle,
  }

  return (
    <div
      ref={columnRef}
      className={`j-tp-col${columnClassName ? ` ${columnClassName}` : ''}`}
      style={colStyle}
    >
      {options.map((item) => {
        const isSel = item.value === value
        const isDis = !!item.disabled
        return (
          <button
            key={String(item.value)}
            type="button"
            disabled={isDis}
            onClick={() => { if (!isDis) onChange(item.value) }}
            style={{
              width: '3rem', height: '1.75rem', flexShrink: 0, border: 'none', borderRadius: '0.25rem',
              backgroundColor: isSel ? tokens.colorPrimaryBg : 'transparent',
              color: isSel ? tokens.colorPrimary : isDis ? tokens.colorTextSubtle : tokens.colorText,
              cursor: isDis ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem', fontWeight: isSel ? 600 : 400,
              fontFamily: type === 'ampm' ? 'inherit' : 'monospace',
              transition: 'background-color 0.1s ease',
              opacity: isDis ? 0.4 : 1,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              if (!isDis && !isSel) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }}
            onMouseLeave={(e) => {
              if (!isDis && !isSel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// AnalogClock (internal)
// ============================================================================

const CLOCK_SIZE = 220
const CLOCK_CX = CLOCK_SIZE / 2
const CLOCK_OUTER_R = 85
const CLOCK_INNER_R = 55
const CLOCK_NUM_SIZE = 32

type ClockMode = 'hour' | 'minute' | 'second'

interface AnalogClockProps {
  hours: number
  minutes: number
  seconds: number
  onChange: (type: string, value: number | string) => void
  use12Hours: boolean
  showSecond: boolean
  minuteStep: number
  secondStep: number
  disabledTimeConfig?: DisabledTimeConfig
}

function AnalogClock({
  hours, minutes, seconds, onChange,
  use12Hours, showSecond, disabledTimeConfig,
  minuteStep, secondStep,
}: AnalogClockProps) {
  const [mode, setMode] = useState<ClockMode>('hour')
  const clockRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const isPM = hours >= 12
  const displayH = use12Hours ? (hours % 12 || 12) : hours

  // Hand angle (0° = 12 o'clock, clockwise)
  const handAngle = mode === 'hour'
    ? ((hours % 12) / 12) * 360
    : mode === 'minute'
      ? (minutes / 60) * 360
      : (seconds / 60) * 360

  const handRadius = mode === 'hour' && !use12Hours && (hours === 0 || hours > 12)
    ? CLOCK_INNER_R
    : CLOCK_OUTER_R

  const handX = CLOCK_CX + Math.sin(handAngle * Math.PI / 180) * handRadius
  const handY = CLOCK_CX - Math.cos(handAngle * Math.PI / 180) * handRadius

  // Resolve pointer position to a value
  const resolveFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!clockRef.current) return
    const rect = clockRef.current.getBoundingClientRect()
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    let angle = Math.atan2(dx, -dy) * 180 / Math.PI
    if (angle < 0) angle += 360

    if (mode === 'hour') {
      const disabledH = disabledTimeConfig?.disabledHours?.() ?? []
      const idx = Math.round(angle / 30) % 12
      if (use12Hours) {
        const h12 = idx === 0 ? 12 : idx
        const h24 = isPM ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12)
        if (!disabledH.includes(h24)) onChange('hour', h12)
      } else {
        const dist = Math.sqrt(dx * dx + dy * dy)
        const scale = rect.width / CLOCK_SIZE
        const threshold = ((CLOCK_OUTER_R + CLOCK_INNER_R) / 2) * scale
        let h: number
        if (dist < threshold) {
          h = idx === 0 ? 0 : idx + 12
        } else {
          h = idx === 0 ? 12 : idx
        }
        if (!disabledH.includes(h)) onChange('hour', h)
      }
    } else {
      const step = mode === 'minute' ? minuteStep : secondStep
      let val = Math.round(angle / 6) % 60
      val = Math.round(val / step) * step
      if (val >= 60) val = 0
      const disabledVals = mode === 'minute'
        ? (disabledTimeConfig?.disabledMinutes?.(hours) ?? [])
        : (disabledTimeConfig?.disabledSeconds?.(hours, minutes) ?? [])
      if (!disabledVals.includes(val)) onChange(mode, val)
    }
  }, [mode, use12Hours, isPM, hours, minutes, onChange, minuteStep, secondStep, disabledTimeConfig])

  // Drag via document listeners (Slider pattern)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = true
    resolveFromPointer(e.clientX, e.clientY)
  }, [resolveFromPointer])

  useEffect(() => {
    if (!draggingRef.current) return
    // We register listeners once and check draggingRef in handlers
    const handleMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      resolveFromPointer(e.clientX, e.clientY)
    }
    const handleUp = (e: MouseEvent) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      resolveFromPointer(e.clientX, e.clientY)
      if (mode === 'hour') setMode('minute')
      else if (mode === 'minute' && showSecond) setMode('second')
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }) // no deps — re-registers every render while dragging is possible

  // Numbers for current mode
  const numbers = useMemo(() => {
    if (mode === 'hour') {
      const disabledH = disabledTimeConfig?.disabledHours?.() ?? []
      if (use12Hours) {
        return Array.from({ length: 12 }, (_, i) => {
          const val = i === 0 ? 12 : i
          const h24 = isPM ? (val === 12 ? 12 : val + 12) : (val === 12 ? 0 : val)
          return { value: val, label: String(val), angle: (i / 12) * 360, radius: CLOCK_OUTER_R, disabled: disabledH.includes(h24) }
        })
      }
      const outer = Array.from({ length: 12 }, (_, i) => {
        const val = i === 0 ? 12 : i
        return { value: val, label: String(val), angle: (i / 12) * 360, radius: CLOCK_OUTER_R, disabled: disabledH.includes(val) }
      })
      const inner = Array.from({ length: 12 }, (_, i) => {
        const val = i === 0 ? 0 : i + 12
        return { value: val, label: String(val).padStart(2, '0'), angle: (i / 12) * 360, radius: CLOCK_INNER_R, disabled: disabledH.includes(val) }
      })
      return [...outer, ...inner]
    }
    const disabledVals = mode === 'minute'
      ? (disabledTimeConfig?.disabledMinutes?.(hours) ?? [])
      : (disabledTimeConfig?.disabledSeconds?.(hours, minutes) ?? [])
    return Array.from({ length: 12 }, (_, i) => {
      const val = i * 5
      return { value: val, label: String(val).padStart(2, '0'), angle: (i / 12) * 360, radius: CLOCK_OUTER_R, disabled: disabledVals.includes(val) }
    })
  }, [mode, use12Hours, isPM, hours, minutes, disabledTimeConfig])

  // Header
  const fmtH = use12Hours ? String(displayH).padStart(2, '0') : String(hours).padStart(2, '0')
  const fmtM = String(minutes).padStart(2, '0')
  const fmtS = String(seconds).padStart(2, '0')

  const hdrBtn = (active: boolean): CSSProperties => ({
    border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'monospace',
    fontSize: '1.5rem', fontWeight: active ? 700 : 400,
    color: active ? tokens.colorPrimary : tokens.colorTextMuted,
    padding: '0.125rem 0.25rem', borderRadius: '0.25rem', transition: 'color 0.15s ease',
  })

  const ampmBtn = (active: boolean): CSSProperties => ({
    border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: '0.6875rem', fontWeight: active ? 700 : 400,
    color: active ? tokens.colorPrimary : tokens.colorTextMuted,
    padding: '0 0.25rem', lineHeight: 1.2,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem' }}>
      {/* Time display / mode selector */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button type="button" onClick={() => setMode('hour')} style={hdrBtn(mode === 'hour')}>{fmtH}</button>
        <span style={{ fontSize: '1.5rem', color: tokens.colorTextMuted, fontFamily: 'monospace' }}>:</span>
        <button type="button" onClick={() => setMode('minute')} style={hdrBtn(mode === 'minute')}>{fmtM}</button>
        {showSecond && (
          <>
            <span style={{ fontSize: '1.5rem', color: tokens.colorTextMuted, fontFamily: 'monospace' }}>:</span>
            <button type="button" onClick={() => setMode('second')} style={hdrBtn(mode === 'second')}>{fmtS}</button>
          </>
        )}
        {use12Hours && (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem', gap: '0.125rem' }}>
            <button type="button" onClick={() => { if (isPM) onChange('ampm', 'AM') }} style={ampmBtn(!isPM)}>AM</button>
            <button type="button" onClick={() => { if (!isPM) onChange('ampm', 'PM') }} style={ampmBtn(isPM)}>PM</button>
          </div>
        )}
      </div>

      {/* Clock face */}
      <div
        ref={clockRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative', width: CLOCK_SIZE, height: CLOCK_SIZE,
          borderRadius: '50%', backgroundColor: tokens.colorBgMuted,
          cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        }}
      >
        {/* SVG hand */}
        <svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <line x1={CLOCK_CX} y1={CLOCK_CX} x2={handX} y2={handY} stroke={tokens.colorPrimary} strokeWidth={2} />
          <circle cx={CLOCK_CX} cy={CLOCK_CX} r={3} fill={tokens.colorPrimary} />
          <circle cx={handX} cy={handY} r={CLOCK_NUM_SIZE / 2} fill={tokens.colorPrimary} opacity={0.12} />
        </svg>

        {/* Numbers */}
        {numbers.map((num) => {
          const rad = (num.angle * Math.PI) / 180
          const nx = CLOCK_CX + Math.sin(rad) * num.radius - CLOCK_NUM_SIZE / 2
          const ny = CLOCK_CX - Math.cos(rad) * num.radius - CLOCK_NUM_SIZE / 2
          const isSelected = mode === 'hour'
            ? num.value === (use12Hours ? displayH : hours)
            : mode === 'minute' ? num.value === minutes : num.value === seconds
          const isInner = num.radius === CLOCK_INNER_R

          return (
            <div
              key={`${num.value}-${num.radius}`}
              style={{
                position: 'absolute', left: nx, top: ny,
                width: CLOCK_NUM_SIZE, height: CLOCK_NUM_SIZE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                fontSize: isInner ? '0.6875rem' : '0.8125rem',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#fff' : num.disabled ? tokens.colorTextSubtle : tokens.colorText,
                backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
                opacity: num.disabled ? 0.4 : 1,
                pointerEvents: 'none', zIndex: 1,
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              {num.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// TimePickerPanel (internal)
// ============================================================================

interface TimePickerPanelProps {
  pendingValue: Date | null
  onChange: (type: string, value: number | string) => void
  onOk?: () => void
  onNow?: () => void
  formatConfig: FormatConfig
  hourStep: number
  minuteStep: number
  secondStep: number
  disabledTimeConfig?: DisabledTimeConfig
  showNow: boolean
  needConfirm: boolean
  addon?: ReactNode
  changeOnScroll?: boolean
  showAnalog?: boolean
  styles?: TimePickerStyles
  classNames?: TimePickerClassNames
}

function TimePickerPanel({
  pendingValue, onChange, onOk, onNow,
  formatConfig, hourStep, minuteStep, secondStep,
  disabledTimeConfig, showNow, needConfirm, addon, changeOnScroll, showAnalog,
  styles: slotStyles, classNames: slotClassNames,
}: TimePickerPanelProps) {
  const currentH = pendingValue ? pendingValue.getHours() : 0
  const currentM = pendingValue ? pendingValue.getMinutes() : 0
  const currentS = pendingValue ? pendingValue.getSeconds() : 0
  const is12h = formatConfig.use12Hours
  const displayH = is12h ? (currentH % 12 || 12) : currentH
  const isPM = currentH >= 12

  const disabledH = disabledTimeConfig?.disabledHours?.() ?? []
  const disabledM = disabledTimeConfig?.disabledMinutes?.(currentH) ?? []
  const disabledS = disabledTimeConfig?.disabledSeconds?.(currentH, currentM) ?? []

  const hourOptions = useMemo(() => {
    const max = is12h ? 12 : 23
    const start = is12h ? 1 : 0
    const result: { value: number; label: string; disabled?: boolean }[] = []
    for (let h = start; h <= max; h += hourStep) {
      let realH = h
      if (is12h) {
        realH = isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h)
      }
      result.push({
        value: h,
        label: String(h).padStart(2, '0'),
        disabled: disabledH.includes(realH),
      })
    }
    return result
  }, [is12h, hourStep, disabledH, isPM])

  const minuteOptions = useMemo(() => {
    const result: { value: number; label: string; disabled?: boolean }[] = []
    for (let m = 0; m <= 59; m += minuteStep) {
      result.push({
        value: m,
        label: String(m).padStart(2, '0'),
        disabled: disabledM.includes(m),
      })
    }
    return result
  }, [minuteStep, disabledM])

  const secondOptions = useMemo(() => {
    const result: { value: number; label: string; disabled?: boolean }[] = []
    for (let s = 0; s <= 59; s += secondStep) {
      result.push({
        value: s,
        label: String(s).padStart(2, '0'),
        disabled: disabledS.includes(s),
      })
    }
    return result
  }, [secondStep, disabledS])

  const ampmOptions: { value: string; label: string }[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ]

  const columnLabels: Record<string, string> = {
    hour: 'Horas', minute: 'Minutos', second: 'Segundos', ampm: 'AM/PM',
  }

  const columns: { type: 'hour' | 'minute' | 'second' | 'ampm'; show: boolean }[] = [
    { type: 'hour', show: formatConfig.showHour },
    { type: 'minute', show: formatConfig.showMinute },
    { type: 'second', show: formatConfig.showSecond },
    { type: 'ampm', show: formatConfig.use12Hours },
  ]
  const visibleColumns = columns.filter(c => c.show)

  const headerStyle: CSSProperties = {
    fontSize: '0.6875rem', fontWeight: 600, color: tokens.colorTextMuted,
    textAlign: 'center', padding: '0.375rem 0', minWidth: COL_WIDTH, flex: 1,
  }

  const linkStyle: CSSProperties = {
    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
    color: tokens.colorPrimary, fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
    padding: '0.25rem 0',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {showAnalog ? (
        <AnalogClock
          hours={currentH}
          minutes={currentM}
          seconds={currentS}
          onChange={onChange}
          use12Hours={is12h}
          showSecond={formatConfig.showSecond}
          minuteStep={minuteStep}
          secondStep={secondStep}
          disabledTimeConfig={disabledTimeConfig}
        />
      ) : (
        <>
          {/* Column headers */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${tokens.colorBorder}` }}>
            {visibleColumns.map((col, i) => (
              <div key={col.type} style={{
                ...headerStyle,
                borderRight: i < visibleColumns.length - 1 ? `1px solid ${tokens.colorBorder}` : 'none',
              }}>
                {columnLabels[col.type]}
              </div>
            ))}
          </div>
          {/* Columns */}
          <div style={{ display: 'flex', padding: '0.5rem 0' }}>
            {visibleColumns.map((col, i) => {
              const isLast = i === visibleColumns.length - 1
              if (col.type === 'hour') {
                return <TimeColumn key="hour" type="hour" value={displayH} options={hourOptions} onChange={(v) => onChange('hour', v)} columnStyle={slotStyles?.column} columnClassName={slotClassNames?.column} isLast={isLast} changeOnScroll={changeOnScroll} />
              }
              if (col.type === 'minute') {
                return <TimeColumn key="minute" type="minute" value={currentM} options={minuteOptions} onChange={(v) => onChange('minute', v)} columnStyle={slotStyles?.column} columnClassName={slotClassNames?.column} isLast={isLast} changeOnScroll={changeOnScroll} />
              }
              if (col.type === 'second') {
                return <TimeColumn key="second" type="second" value={currentS} options={secondOptions} onChange={(v) => onChange('second', v)} columnStyle={slotStyles?.column} columnClassName={slotClassNames?.column} isLast={isLast} changeOnScroll={changeOnScroll} />
              }
              if (col.type === 'ampm') {
                return <TimeColumn key="ampm" type="ampm" value={isPM ? 'PM' : 'AM'} options={ampmOptions} onChange={(v) => onChange('ampm', v)} columnStyle={slotStyles?.column} columnClassName={slotClassNames?.column} isLast={isLast} changeOnScroll={changeOnScroll} />
              }
              return null
            })}
          </div>
        </>
      )}
      {addon != null && (
        <div style={{ borderTop: `1px solid ${tokens.colorBorder}`, padding: '0.5rem 0.75rem' }}>
          {addon}
        </div>
      )}
      {(showNow || needConfirm) && (
        <div
          className={slotClassNames?.footer}
          style={mergeSemanticStyle({
            borderTop: `1px solid ${tokens.colorBorder}`,
            padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }, slotStyles?.footer)}
        >
          <div style={{ flex: 1 }}>
            {showNow && <button type="button" style={linkStyle} onClick={onNow}>Now</button>}
          </div>
          {needConfirm && (
            <button
              type="button"
              onClick={onOk}
              style={{
                padding: '0.1875rem 0.75rem', border: 'none', borderRadius: '0.25rem',
                backgroundColor: tokens.colorPrimary, color: '#fff',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
                transition: 'filter 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none' }}
            >
              OK
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// TimePicker Component
// ============================================================================

function TimePickerComponent({
  value: controlledValue,
  defaultValue,
  onChange,
  onCalendarChange,
  onOpenChange,
  open: controlledOpen,
  defaultOpen = false,
  format: formatProp,
  use12Hours,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabled = false,
  allowClear = true,
  placeholder: placeholderProp,
  placement = 'bottomLeft',
  size = 'md',
  variant = 'outlined',
  status,
  needConfirm = true,
  showNow = true,
  prefix: prefixProp,
  suffix: suffixProp,
  addon,
  changeOnScroll = false,
  showAnalog = false,
  inputReadOnly = false,
  disabledTime,
  className,
  style,
  classNames,
  styles,
  id,
  autoFocus,
}: TimePickerProps) {
  // ---- Format ----
  const resolvedFormat = formatProp ?? getDefaultFormat(use12Hours)
  const formatConfig = useMemo(() => parseTimeFormat(resolvedFormat), [resolvedFormat])

  // ---- Value (controlled/uncontrolled) ----
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null)
  const currentValue = isValueControlled ? (controlledValue ?? null) : internalValue

  // ---- Open (controlled/uncontrolled) ----
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isOpenControlled ? controlledOpen! : internalOpen

  // ---- Pending value (for needConfirm) ----
  const [pendingValue, setPendingValue] = useState<Date | null>(null)

  // ---- Animation ----
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)

  // ---- Input editing ----
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // ---- Refs ----
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)

  // ---- Status colors ----
  const statusBorderColor = status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : undefined
  const statusFocusColor = status === 'error' ? tokens.colorErrorBg : status === 'warning' ? tokens.colorWarningBg : tokens.colorPrimaryLight

  // ---- Format helper ----
  const formatTimeValue = useCallback((date: Date | null): string => {
    return formatTime(date, resolvedFormat)
  }, [resolvedFormat])

  // ---- setOpen ----
  const setOpen = useCallback((v: boolean) => {
    if (disabled) return
    if (v) {
      setResolvedPlacement(placement)
    }
    if (!isOpenControlled) setInternalOpen(v)
    onOpenChange?.(v)
    if (!v) {
      setIsEditing(false)
      if (inputWrapRef.current && variant !== 'borderless') {
        inputWrapRef.current.style.borderColor = statusBorderColor ?? tokens.colorBorder
      }
    }
  }, [disabled, isOpenControlled, onOpenChange, placement, variant, statusBorderColor])

  // ---- Sync resolvedPlacement when prop changes ----
  useEffect(() => {
    setResolvedPlacement(placement)
  }, [placement])

  // ---- Auto-flip: measure real DOM and flip if it overflows ----
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !rootRef.current) return
    const panelRect = panelRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom
    const isTop = resolvedPlacement.startsWith('top')

    if (!isTop && panelRect.bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) {
        setResolvedPlacement(p => p.replace('bottom', 'top') as TimePickerPlacement)
      }
    } else if (isTop && panelRect.top < 0) {
      if (spaceBelow > spaceAbove) {
        setResolvedPlacement(p => p.replace('top', 'bottom') as TimePickerPlacement)
      }
    }
  })

  // ---- Open animation ----
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
      setPendingValue(currentValue ? new Date(currentValue.getTime()) : null)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Click outside ----
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      if (panelRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- autoFocus ----
  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- commitValue ----
  const commitValue = useCallback((date: Date | null) => {
    if (!isValueControlled) setInternalValue(date)
    const timeString = formatTimeValue(date)
    onChange?.(date, timeString)
  }, [isValueControlled, formatTimeValue, onChange])

  // ---- Column change ----
  const handleColumnChange = useCallback((type: string, val: number | string) => {
    const base = pendingValue ?? currentValue ?? (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()
    const next = new Date(base.getTime())

    if (type === 'hour') {
      let h = val as number
      if (formatConfig.use12Hours) {
        const wasPM = next.getHours() >= 12
        h = wasPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h)
      }
      next.setHours(h)
    } else if (type === 'minute') {
      next.setMinutes(val as number)
    } else if (type === 'second') {
      next.setSeconds(val as number)
    } else if (type === 'ampm') {
      const currentH = next.getHours()
      if (val === 'AM' && currentH >= 12) next.setHours(currentH - 12)
      if (val === 'PM' && currentH < 12) next.setHours(currentH + 12)
    }

    if (needConfirm) {
      setPendingValue(next)
      onCalendarChange?.(next, formatTimeValue(next))
    } else {
      setPendingValue(next)
      commitValue(next)
    }
  }, [pendingValue, currentValue, formatConfig.use12Hours, needConfirm, commitValue, formatTimeValue, onCalendarChange])

  // ---- Now ----
  const handleNow = useCallback(() => {
    const now = new Date()
    if (needConfirm) {
      setPendingValue(now)
      onCalendarChange?.(now, formatTimeValue(now))
    } else {
      commitValue(now)
    }
  }, [needConfirm, commitValue, formatTimeValue, onCalendarChange])

  // ---- OK ----
  const handleOk = useCallback(() => {
    if (pendingValue) {
      if (!isValueControlled) setInternalValue(pendingValue)
      onChange?.(pendingValue, formatTimeValue(pendingValue))
    }
    setOpen(false)
  }, [pendingValue, isValueControlled, onChange, formatTimeValue, setOpen])

  // ---- Clear ----
  const handleClear = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation()
    if (!isValueControlled) setInternalValue(null)
    onChange?.(null, '')
  }, [isValueControlled, onChange])

  // ---- Input handlers ----
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputReadOnly) return
    setIsEditing(true)
    setInputValue(e.target.value)
  }, [inputReadOnly])

  const handleInputBlur = useCallback(() => {
    if (isEditing && inputValue) {
      const parsed = parseTimeString(inputValue, resolvedFormat)
      if (parsed) commitValue(parsed)
    }
    setIsEditing(false)
  }, [isEditing, inputValue, resolvedFormat, commitValue])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditing && inputValue) {
        const parsed = parseTimeString(inputValue, resolvedFormat)
        if (parsed) commitValue(parsed)
      }
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [isEditing, inputValue, resolvedFormat, commitValue, setOpen])

  // ---- Computed ----
  const sc = sizeConfig[size]
  const displayValue = isEditing ? inputValue : formatTimeValue(currentValue)

  const isTop = resolvedPlacement.startsWith('top')
  const isRight = resolvedPlacement.endsWith('Right')
  const panelPositionStyle: CSSProperties = {
    position: 'absolute', zIndex: 1050,
    ...(isTop ? { bottom: '100%', marginBottom: '0.25rem' } : { top: '100%', marginTop: '0.25rem' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  }

  const inputBorder = variant === 'borderless' ? 'none'
    : `1px solid ${statusBorderColor ?? tokens.colorBorder}`
  const inputBg = variant === 'filled' ? tokens.colorBgMuted : 'transparent'

  const suffix = suffixProp !== undefined ? suffixProp : (
    <span style={{ color: tokens.colorTextMuted, display: 'flex' }}>
      <ClockIcon />
    </span>
  )

  const disabledTimeConfig = disabledTime?.()

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block' }, styles?.root, style)}
      id={id}
    >
      {/* Input */}
      <div
        ref={inputWrapRef}
        className={classNames?.input}
        onClick={() => { if (!disabled) { if (!isOpen) setOpen(true); inputRef.current?.focus() } }}
        style={mergeSemanticStyle({
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          height: sc.height, padding: `0 ${sc.paddingH}`,
          border: inputBorder, borderRadius: sc.radius,
          backgroundColor: inputBg, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: isOpen && variant !== 'borderless' ? `0 0 0 2px ${statusFocusColor}` : undefined,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }, styles?.input)}
        onMouseEnter={(e) => {
          if (!disabled && variant !== 'borderless') {
            (e.currentTarget as HTMLElement).style.borderColor = statusBorderColor ?? tokens.colorPrimary
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && variant !== 'borderless' && !isOpen) {
            (e.currentTarget as HTMLElement).style.borderColor = statusBorderColor ?? tokens.colorBorder
          }
        }}
      >
        {prefixProp != null && (
          <span style={{ display: 'flex', flexShrink: 0, color: tokens.colorTextMuted }}>
            {prefixProp}
          </span>
        )}
        <input
          ref={inputRef}
          value={displayValue}
          placeholder={placeholderProp ?? 'Select time'}
          readOnly={inputReadOnly}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => { if (!isOpen) setOpen(true) }}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus={autoFocus}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent',
            fontSize: sc.inputFontSize, fontFamily: 'inherit', color: statusBorderColor ?? tokens.colorText,
            cursor: disabled ? 'not-allowed' : undefined,
            padding: 0,
          }}
        />
        {allowClear && currentValue && !disabled && (
          <span
            onClick={handleClear}
            style={{ display: 'flex', cursor: 'pointer', color: tokens.colorTextMuted, flexShrink: 0, transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorText }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted }}
          >
            <ClearIcon />
          </span>
        )}
        {suffix}
      </div>

      {/* Popup */}
      {isOpen && (
        <div
          ref={panelRef}
          className={classNames?.popup}
          style={mergeSemanticStyle({
            ...panelPositionStyle,
            borderRadius: '0.5rem',
            border: `1px solid ${tokens.colorBorder}`,
            boxShadow: tokens.shadowMd,
            backgroundColor: tokens.colorBg,
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? 'translateY(0)' : `translateY(${isTop ? 4 : -4}px)`,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            overflow: 'hidden',
          }, styles?.popup)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <style>{`
            .j-tp-col::-webkit-scrollbar { width: 4px; }
            .j-tp-col::-webkit-scrollbar-track { background: transparent; }
            .j-tp-col::-webkit-scrollbar-thumb { background: ${tokens.colorBorderHover}; border-radius: 4px; }
            .j-tp-col::-webkit-scrollbar-thumb:hover { background: ${tokens.colorTextSubtle}; }
          `}</style>
          <TimePickerPanel
            pendingValue={needConfirm ? pendingValue : (pendingValue ?? currentValue)}
            onChange={handleColumnChange}
            onOk={handleOk}
            onNow={handleNow}
            formatConfig={formatConfig}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            disabledTimeConfig={disabledTimeConfig}
            showNow={showNow}
            needConfirm={needConfirm}
            addon={addon}
            changeOnScroll={changeOnScroll}
            showAnalog={showAnalog}
            styles={styles}
            classNames={classNames}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// RangePicker Component
// ============================================================================

function TimeRangePickerComponent({
  value: controlledValue,
  defaultValue,
  onChange,
  onCalendarChange,
  onOpenChange,
  open: controlledOpen,
  defaultOpen = false,
  format: formatProp,
  use12Hours,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabled: disabledProp = false,
  allowClear = true,
  placeholder: placeholderProp,
  separator,
  placement = 'bottomLeft',
  size = 'md',
  variant = 'outlined',
  status,
  needConfirm = true,
  showNow = true,
  order = true,
  prefix: prefixProp,
  suffix: suffixProp,
  addon,
  changeOnScroll = false,
  inputReadOnly = false,
  disabledTime,
  className,
  style,
  classNames,
  styles,
  id,
}: TimeRangePickerProps) {
  // ---- Format ----
  const resolvedFormat = formatProp ?? getDefaultFormat(use12Hours)
  const formatConfig = useMemo(() => parseTimeFormat(resolvedFormat), [resolvedFormat])

  // ---- Disabled ----
  const disabledStart = typeof disabledProp === 'boolean' ? disabledProp : disabledProp[0]
  const disabledEnd = typeof disabledProp === 'boolean' ? disabledProp : disabledProp[1]
  const anyDisabled = disabledStart && disabledEnd

  // ---- Value ----
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<[Date | null, Date | null]>(
    defaultValue ?? [null, null],
  )
  const currentValue: [Date | null, Date | null] = isValueControlled
    ? (controlledValue ?? [null, null])
    : internalValue

  // ---- Open ----
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isOpenControlled ? controlledOpen! : internalOpen

  // ---- Active input ----
  const [activeInput, setActiveInput] = useState<'start' | 'end'>('start')

  // ---- Pending ----
  const [pendingStart, setPendingStart] = useState<Date | null>(null)
  const [pendingEnd, setPendingEnd] = useState<Date | null>(null)

  // ---- Animation ----
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)

  // ---- Refs ----
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)

  // ---- Status colors ----
  const statusBorderColor = status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : undefined
  const statusFocusColor = status === 'error' ? tokens.colorErrorBg : status === 'warning' ? tokens.colorWarningBg : tokens.colorPrimaryLight

  const formatTimeValue = useCallback((date: Date | null): string => {
    return formatTime(date, resolvedFormat)
  }, [resolvedFormat])

  // ---- setOpen ----
  const setOpen = useCallback((v: boolean) => {
    if (anyDisabled) return
    if (v) {
      setResolvedPlacement(placement)
    }
    if (!isOpenControlled) setInternalOpen(v)
    onOpenChange?.(v)
    if (!v) {
      if (inputWrapRef.current && variant !== 'borderless') {
        inputWrapRef.current.style.borderColor = statusBorderColor ?? tokens.colorBorder
      }
    }
  }, [anyDisabled, isOpenControlled, onOpenChange, placement, variant, statusBorderColor])

  // ---- Sync resolvedPlacement when prop changes ----
  useEffect(() => {
    setResolvedPlacement(placement)
  }, [placement])

  // ---- Auto-flip: measure real DOM and flip if it overflows ----
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !rootRef.current) return
    const panelRect = panelRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom
    const isTop = resolvedPlacement.startsWith('top')

    if (!isTop && panelRect.bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) {
        setResolvedPlacement(p => p.replace('bottom', 'top') as TimePickerPlacement)
      }
    } else if (isTop && panelRect.top < 0) {
      if (spaceBelow > spaceAbove) {
        setResolvedPlacement(p => p.replace('top', 'bottom') as TimePickerPlacement)
      }
    }
  })

  // ---- Open animation ----
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
      setPendingStart(currentValue[0] ? new Date(currentValue[0].getTime()) : null)
      setPendingEnd(currentValue[1] ? new Date(currentValue[1].getTime()) : null)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Click outside ----
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      if (panelRef.current?.contains(e.target as Node)) return
      handleClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Time to ms ----
  const timeToMs = (d: Date | null): number => {
    if (!d) return 0
    return d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000
  }

  // ---- Commit range ----
  const commitRange = useCallback((start: Date | null, end: Date | null) => {
    let s = start
    let e = end
    if (order && s && e && timeToMs(s) > timeToMs(e)) {
      const tmp = s; s = e; e = tmp
    }
    const result: [Date | null, Date | null] = [s, e]
    if (!isValueControlled) setInternalValue(result)
    onChange?.(result, [formatTimeValue(s), formatTimeValue(e)])
  }, [order, isValueControlled, onChange, formatTimeValue])

  // ---- Close (commit pending if needed) ----
  const handleClose = useCallback(() => {
    if (!needConfirm) {
      // Values already committed on column change
    } else {
      // Commit pending on close
      commitRange(pendingStart, pendingEnd)
    }
    setOpen(false)
  }, [needConfirm, pendingStart, pendingEnd, commitRange, setOpen])

  // ---- Column change ----
  const handleColumnChange = useCallback((side: 'start' | 'end', type: string, val: number | string) => {
    const setPending = side === 'start' ? setPendingStart : setPendingEnd
    const midnight = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
    const base = side === 'start'
      ? (pendingStart ?? currentValue[0] ?? midnight())
      : (pendingEnd ?? currentValue[1] ?? midnight())
    const next = new Date(base.getTime())

    if (type === 'hour') {
      let h = val as number
      if (formatConfig.use12Hours) {
        const wasPM = next.getHours() >= 12
        h = wasPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h)
      }
      next.setHours(h)
    } else if (type === 'minute') {
      next.setMinutes(val as number)
    } else if (type === 'second') {
      next.setSeconds(val as number)
    } else if (type === 'ampm') {
      const currentH = next.getHours()
      if (val === 'AM' && currentH >= 12) next.setHours(currentH - 12)
      if (val === 'PM' && currentH < 12) next.setHours(currentH + 12)
    }

    setPending(next)

    const newStart = side === 'start' ? next : pendingStart
    const newEnd = side === 'end' ? next : pendingEnd

    if (needConfirm) {
      onCalendarChange?.(
        [newStart, newEnd],
        [formatTimeValue(newStart), formatTimeValue(newEnd)],
        { range: side },
      )
    } else {
      commitRange(newStart, newEnd)
    }
  }, [pendingStart, pendingEnd, currentValue, formatConfig.use12Hours, needConfirm, commitRange, formatTimeValue, onCalendarChange])

  // ---- Now ----
  const handleNow = useCallback(() => {
    const now = new Date()
    if (activeInput === 'start') {
      setPendingStart(now)
      if (!needConfirm) commitRange(now, pendingEnd)
    } else {
      setPendingEnd(now)
      if (!needConfirm) commitRange(pendingStart, now)
    }
  }, [activeInput, needConfirm, pendingStart, pendingEnd, commitRange])

  // ---- OK ----
  const handleOk = useCallback(() => {
    commitRange(pendingStart, pendingEnd)
    setOpen(false)
  }, [pendingStart, pendingEnd, commitRange, setOpen])

  // ---- Clear ----
  const handleClear = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation()
    if (!isValueControlled) setInternalValue([null, null])
    onChange?.(null, ['', ''])
  }, [isValueControlled, onChange])

  // ---- Computed ----
  const sc = sizeConfig[size]

  const isTop = resolvedPlacement.startsWith('top')
  const isRight = resolvedPlacement.endsWith('Right')
  const panelPositionStyle: CSSProperties = {
    position: 'absolute', zIndex: 1050,
    ...(isTop ? { bottom: '100%', marginBottom: '0.25rem' } : { top: '100%', marginTop: '0.25rem' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  }

  const inputBorder = variant === 'borderless' ? 'none'
    : `1px solid ${statusBorderColor ?? tokens.colorBorder}`
  const inputBg = variant === 'filled' ? tokens.colorBgMuted : 'transparent'

  const suffix = suffixProp !== undefined ? suffixProp : (
    <span style={{ color: tokens.colorTextMuted, display: 'flex' }}>
      <ClockIcon />
    </span>
  )

  const hasValue = currentValue[0] || currentValue[1]

  const inputFieldStyle: CSSProperties = {
    flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent',
    fontSize: sc.inputFontSize, fontFamily: 'inherit', color: statusBorderColor ?? tokens.colorText,
    cursor: anyDisabled ? 'not-allowed' : undefined,
    padding: 0, textAlign: 'center',
  }

  const disabledStartConfig = disabledTime?.('start')
  const disabledEndConfig = disabledTime?.('end')

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block' }, styles?.root, style)}
      id={id}
    >
      {/* Input */}
      <div
        ref={inputWrapRef}
        className={classNames?.input}
        onClick={() => {
          if (!anyDisabled) {
            if (!isOpen) setOpen(true)
            if (activeInput === 'start') startInputRef.current?.focus()
            else endInputRef.current?.focus()
          }
        }}
        style={mergeSemanticStyle({
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          height: sc.height, padding: `0 ${sc.paddingH}`,
          border: inputBorder, borderRadius: sc.radius,
          backgroundColor: inputBg, cursor: anyDisabled ? 'not-allowed' : 'pointer',
          opacity: anyDisabled ? 0.5 : 1,
          boxShadow: isOpen && variant !== 'borderless' ? `0 0 0 2px ${statusFocusColor}` : undefined,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }, styles?.input)}
        onMouseEnter={(e) => {
          if (!anyDisabled && variant !== 'borderless') {
            (e.currentTarget as HTMLElement).style.borderColor = statusBorderColor ?? tokens.colorPrimary
          }
        }}
        onMouseLeave={(e) => {
          if (!anyDisabled && variant !== 'borderless' && !isOpen) {
            (e.currentTarget as HTMLElement).style.borderColor = statusBorderColor ?? tokens.colorBorder
          }
        }}
      >
        {prefixProp != null && (
          <span style={{ display: 'flex', flexShrink: 0, color: tokens.colorTextMuted }}>
            {prefixProp}
          </span>
        )}
        <input
          ref={startInputRef}
          value={formatTimeValue(currentValue[0])}
          placeholder={placeholderProp?.[0] ?? 'Start time'}
          readOnly={inputReadOnly}
          disabled={disabledStart}
          onFocus={() => { setActiveInput('start'); if (!isOpen) setOpen(true) }}
          onChange={() => {}}
          style={{
            ...inputFieldStyle,
            fontWeight: isOpen && activeInput === 'start' ? 600 : 400,
            opacity: disabledStart ? 0.5 : 1,
          }}
        />
        <span style={{ display: 'flex', color: tokens.colorTextMuted, flexShrink: 0 }}>
          {separator ?? <SeparatorIcon />}
        </span>
        <input
          ref={endInputRef}
          value={formatTimeValue(currentValue[1])}
          placeholder={placeholderProp?.[1] ?? 'End time'}
          readOnly={inputReadOnly}
          disabled={disabledEnd}
          onFocus={() => { setActiveInput('end'); if (!isOpen) setOpen(true) }}
          onChange={() => {}}
          style={{
            ...inputFieldStyle,
            fontWeight: isOpen && activeInput === 'end' ? 600 : 400,
            opacity: disabledEnd ? 0.5 : 1,
          }}
        />
        {allowClear && hasValue && !anyDisabled && (
          <span
            onClick={handleClear}
            style={{ display: 'flex', cursor: 'pointer', color: tokens.colorTextMuted, flexShrink: 0, transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorText }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted }}
          >
            <ClearIcon />
          </span>
        )}
        {suffix}
      </div>

      {/* Popup */}
      {isOpen && (
        <div
          ref={panelRef}
          className={classNames?.popup}
          style={mergeSemanticStyle({
            ...panelPositionStyle,
            borderRadius: '0.5rem',
            border: `1px solid ${tokens.colorBorder}`,
            boxShadow: tokens.shadowMd,
            backgroundColor: tokens.colorBg,
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? 'translateY(0)' : `translateY(${isTop ? 4 : -4}px)`,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            overflow: 'hidden',
          }, styles?.popup)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <style>{`
            .j-tp-col::-webkit-scrollbar { width: 4px; }
            .j-tp-col::-webkit-scrollbar-track { background: transparent; }
            .j-tp-col::-webkit-scrollbar-thumb { background: ${tokens.colorBorderHover}; border-radius: 4px; }
            .j-tp-col::-webkit-scrollbar-thumb:hover { background: ${tokens.colorTextSubtle}; }
          `}</style>
          <div style={{ display: 'flex' }}>
            {/* Start panel */}
            <div style={{ borderRight: `1px solid ${tokens.colorBorder}` }}>
              <div style={{
                padding: '0.375rem 0.5rem', fontSize: '0.75rem', fontWeight: 600,
                color: activeInput === 'start' ? tokens.colorPrimary : tokens.colorTextMuted,
                textAlign: 'center', borderBottom: `1px solid ${tokens.colorBorder}`,
              }}>
                Start
              </div>
              <TimePickerPanel
                pendingValue={needConfirm ? pendingStart : (pendingStart ?? currentValue[0])}
                onChange={(type, val) => handleColumnChange('start', type, val)}
                formatConfig={formatConfig}
                hourStep={hourStep}
                minuteStep={minuteStep}
                secondStep={secondStep}
                disabledTimeConfig={disabledStartConfig}
                showNow={false}
                needConfirm={false}
                changeOnScroll={changeOnScroll}
                styles={styles}
                classNames={classNames}
              />
            </div>
            {/* End panel */}
            <div>
              <div style={{
                padding: '0.375rem 0.5rem', fontSize: '0.75rem', fontWeight: 600,
                color: activeInput === 'end' ? tokens.colorPrimary : tokens.colorTextMuted,
                textAlign: 'center', borderBottom: `1px solid ${tokens.colorBorder}`,
              }}>
                End
              </div>
              <TimePickerPanel
                pendingValue={needConfirm ? pendingEnd : (pendingEnd ?? currentValue[1])}
                onChange={(type, val) => handleColumnChange('end', type, val)}
                formatConfig={formatConfig}
                hourStep={hourStep}
                minuteStep={minuteStep}
                secondStep={secondStep}
                disabledTimeConfig={disabledEndConfig}
                showNow={false}
                needConfirm={false}
                changeOnScroll={changeOnScroll}
                styles={styles}
                classNames={classNames}
              />
            </div>
          </div>
          {addon != null && (
            <div style={{ borderTop: `1px solid ${tokens.colorBorder}`, padding: '0.5rem 0.75rem' }}>
              {addon}
            </div>
          )}
          {/* Shared footer */}
          {(showNow || needConfirm) && (
            <div
              className={classNames?.footer}
              style={mergeSemanticStyle({
                borderTop: `1px solid ${tokens.colorBorder}`,
                padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }, styles?.footer)}
            >
              <div>
                {showNow && (
                  <button
                    type="button"
                    style={{
                      border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                      color: tokens.colorPrimary, fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
                      padding: '0.25rem 0',
                    }}
                    onClick={handleNow}
                  >
                    Now
                  </button>
                )}
              </div>
              {needConfirm && (
                <button
                  type="button"
                  onClick={handleOk}
                  style={{
                    padding: '0.1875rem 0.75rem', border: 'none', borderRadius: '0.25rem',
                    backgroundColor: tokens.colorPrimary, color: '#fff',
                    cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
                    transition: 'filter 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none' }}
                >
                  OK
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const TimePicker = Object.assign(TimePickerComponent, {
  RangePicker: TimeRangePickerComponent,
})
