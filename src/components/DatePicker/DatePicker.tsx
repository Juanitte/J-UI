import {
  type ReactNode, type CSSProperties, type MouseEvent as ReactMouseEvent,
  useState, useRef, useEffect, useCallback, useMemo, useContext, createContext,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import type { DateAdapter } from './adapters/types'
import { NativeDateAdapter } from './adapters/native'

// ============================================================================
// Types
// ============================================================================

export type DatePickerSize = 'sm' | 'md' | 'lg'
export type DatePickerVariant = 'outlined' | 'borderless' | 'filled'
export type DatePickerStatus = 'error' | 'warning'
export type DatePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'

export type DatePickerSemanticSlot = 'root' | 'input' | 'popup' | 'header' | 'body' | 'cell' | 'footer'
export type DatePickerClassNames = SemanticClassNames<DatePickerSemanticSlot>
export type DatePickerStyles = SemanticStyles<DatePickerSemanticSlot>

export interface DatePickerPreset<TDate = any> {
  label: ReactNode
  value: TDate | (() => TDate)
}

export interface RangePickerPreset<TDate = any> {
  label: ReactNode
  value: [TDate, TDate] | (() => [TDate, TDate])
}

export interface TimePickerConfig {
  format?: string
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  use12Hours?: boolean
  defaultValue?: any
}

export interface DisabledTimes {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

export interface CellRenderInfo {
  type: 'date' | 'month' | 'quarter' | 'year'
  originNode: ReactNode
  today: boolean
  inView: boolean
  inRange?: boolean
  rangeStart?: boolean
  rangeEnd?: boolean
}

export interface DatePickerProps<TDate = any> {
  value?: TDate | null
  defaultValue?: TDate | null
  onChange?: (date: TDate | null, dateString: string) => void
  picker?: DatePickerMode
  format?: string | ((date: TDate) => string)
  placeholder?: string
  size?: DatePickerSize
  variant?: DatePickerVariant
  status?: DatePickerStatus
  placement?: DatePickerPlacement
  disabled?: boolean
  inputReadOnly?: boolean
  allowClear?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  needConfirm?: boolean
  multiple?: boolean
  mask?: boolean
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  showTime?: boolean | TimePickerConfig
  showNow?: boolean
  showToday?: boolean
  presets?: DatePickerPreset<TDate>[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  panelRender?: (panel: ReactNode) => ReactNode
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  onPanelChange?: (date: TDate, mode: DatePickerMode) => void
  renderExtraFooter?: () => ReactNode
  disabledTime?: (date: TDate) => DisabledTimes
  adapter?: DateAdapter<TDate>
  className?: string
  style?: CSSProperties
  classNames?: DatePickerClassNames
  styles?: DatePickerStyles
}

export interface RangePickerProps<TDate = any> {
  value?: [TDate | null, TDate | null] | null
  defaultValue?: [TDate | null, TDate | null] | null
  onChange?: (dates: [TDate, TDate] | null, dateStrings: [string, string]) => void
  onCalendarChange?: (
    dates: [TDate | null, TDate | null],
    dateStrings: [string, string],
    info: { range: 'start' | 'end' }
  ) => void
  picker?: DatePickerMode
  format?: string | ((date: TDate) => string)
  placeholder?: [string, string]
  separator?: ReactNode
  allowEmpty?: [boolean, boolean]
  disabled?: boolean | [boolean, boolean]
  size?: DatePickerSize
  variant?: DatePickerVariant
  status?: DatePickerStatus
  placement?: DatePickerPlacement
  inputReadOnly?: boolean
  allowClear?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  disabledDate?: (date: TDate, info?: { from?: TDate }) => boolean
  minDate?: TDate
  maxDate?: TDate
  showTime?: boolean | TimePickerConfig
  showNow?: boolean
  presets?: RangePickerPreset<TDate>[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  panelRender?: (panel: ReactNode) => ReactNode
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  onPanelChange?: (dates: [TDate | null, TDate | null], modes: [DatePickerMode, DatePickerMode]) => void
  renderExtraFooter?: () => ReactNode
  disabledTime?: (date: TDate, type: 'start' | 'end') => DisabledTimes
  linkedPanels?: boolean
  adapter?: DateAdapter<TDate>
  className?: string
  style?: CSSProperties
  classNames?: DatePickerClassNames
  styles?: DatePickerStyles
}

// ============================================================================
// Adapter Context
// ============================================================================

const defaultAdapter = new NativeDateAdapter()
const DateAdapterContext = createContext<DateAdapter | null>(null)

export function DatePickerAdapterProvider({ adapter, children }: {
  adapter: DateAdapter
  children: ReactNode
}) {
  return <DateAdapterContext.Provider value={adapter}>{children}</DateAdapterContext.Provider>
}

function useDateAdapter(propAdapter?: DateAdapter): DateAdapter {
  const ctx = useContext(DateAdapterContext)
  return propAdapter ?? ctx ?? defaultAdapter
}

// ============================================================================
// SVG Icons
// ============================================================================

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <line x1="5" y1="1.5" x2="5" y2="4" />
      <line x1="11" y1="1.5" x2="11" y2="4" />
      <line x1="2" y1="7" x2="14" y2="7" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <polyline points="8 4.5 8 8 10.5 9.5" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8.5 3 4.5 7 8.5 11" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5.5 3 9.5 7 5.5 11" />
    </svg>
  )
}

function DoubleLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7.5 3 3.5 7 7.5 11" />
      <polyline points="11 3 7 7 11 11" />
    </svg>
  )
}

function DoubleRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 3 7 7 3 11" />
      <polyline points="6.5 3 10.5 7 6.5 11" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5.5" fill="currentColor" opacity="0.08" />
      <line x1="5" y1="5" x2="9" y2="9" />
      <line x1="9" y1="5" x2="5" y2="9" />
    </svg>
  )
}

function SeparatorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="8" x2="12" y2="8" />
      <polyline points="9 5 12 8 9 11" />
    </svg>
  )
}

// ============================================================================
// Config & Utilities
// ============================================================================

const sizeConfig: Record<DatePickerSize, { height: string; fontSize: string; iconSize: number; radius: string; paddingH: string; inputFontSize: string; tagFontSize: string }> = {
  sm: { height: '1.75rem', fontSize: '0.75rem', iconSize: 14, radius: '0.25rem', paddingH: '0.5rem', inputFontSize: '1rem', tagFontSize: '0.625rem' },
  md: { height: '2.25rem', fontSize: '0.875rem', iconSize: 16, radius: '0.375rem', paddingH: '0.75rem', inputFontSize: '1rem', tagFontSize: '0.75rem' },
  lg: { height: '2.75rem', fontSize: '1rem', iconSize: 18, radius: '0.5rem', paddingH: '0.875rem', inputFontSize: '1rem', tagFontSize: '0.875rem' },
}

function flipPlacement(p: DatePickerPlacement): DatePickerPlacement {
  const map: Record<DatePickerPlacement, DatePickerPlacement> = {
    bottomLeft: 'topLeft', bottomRight: 'topRight',
    topLeft: 'bottomLeft', topRight: 'bottomRight',
  }
  return map[p]
}

function resolveAutoPlacement(placement: DatePickerPlacement, rootEl: HTMLElement | null, estimatedHeight = 360): DatePickerPlacement {
  if (!rootEl) return placement
  const rect = rootEl.getBoundingClientRect()
  const vh = window.innerHeight
  if (placement.startsWith('bottom')) {
    if (vh - rect.bottom < estimatedHeight && rect.top > vh - rect.bottom) return flipPlacement(placement)
  } else {
    if (rect.top < estimatedHeight && (vh - rect.bottom) > rect.top) return flipPlacement(placement)
  }
  return placement
}

function getDefaultFormat(picker: DatePickerMode, showTime?: boolean | TimePickerConfig): string {
  if (picker === 'year') return 'YYYY'
  if (picker === 'quarter') return 'YYYY-[Q]Q'
  if (picker === 'month') return 'YYYY-MM'
  if (picker === 'week') return 'YYYY-wo'
  if (showTime) {
    const timeFmt = typeof showTime === 'object' && showTime.format ? showTime.format : 'HH:mm:ss'
    return `YYYY-MM-DD ${timeFmt}`
  }
  return 'YYYY-MM-DD'
}

function getDefaultPlaceholder(picker: DatePickerMode, showTime?: boolean | TimePickerConfig): string {
  if (picker === 'year') return 'Select year'
  if (picker === 'quarter') return 'Select quarter'
  if (picker === 'month') return 'Select month'
  if (picker === 'week') return 'Select week'
  if (showTime) return 'Select date and time'
  return 'Select date'
}

function generateMonthGrid<TDate>(adapter: DateAdapter<TDate>, year: number, month: number, weekStartsOn = 1): TDate[][] {
  const firstOfMonth = adapter.setDate(adapter.setMonth(adapter.setYear(adapter.today(), year), month), 1)
  const startOfGrid = adapter.startOfWeek(firstOfMonth, weekStartsOn)
  const rows: TDate[][] = []
  let current = startOfGrid
  for (let row = 0; row < 6; row++) {
    const week: TDate[] = []
    for (let col = 0; col < 7; col++) {
      week.push(adapter.clone(current))
      current = adapter.addDays(current, 1)
    }
    rows.push(week)
  }
  return rows
}

function isDateDisabled<TDate>(adapter: DateAdapter<TDate>, date: TDate, disabledDate?: (d: TDate) => boolean, minDate?: TDate, maxDate?: TDate): boolean {
  if (disabledDate?.(date)) return true
  if (minDate && adapter.isValid(minDate) && adapter.isBefore(date, adapter.setHour(adapter.setMinute(adapter.setSecond(adapter.clone(minDate), 0), 0), 0))) return true
  if (maxDate && adapter.isValid(maxDate) && adapter.isAfter(date, adapter.setHour(adapter.setMinute(adapter.setSecond(adapter.clone(maxDate), 23), 59), 59))) return true
  return false
}

// ============================================================================
// Internal: MaskInput
// ============================================================================

interface MaskSegment {
  type: 'token' | 'separator'
  token?: string      // e.g. 'YYYY', 'MM', 'DD', 'HH', 'mm', 'ss'
  separator?: string   // e.g. '/', '-', ' ', ':'
  length: number       // expected char length for tokens
}

function parseMaskFormat(fmt: string): MaskSegment[] {
  const segments: MaskSegment[] = []
  const tokenRegex = /YYYY|MM|DD|HH|hh|mm|ss|A/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = tokenRegex.exec(fmt)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'separator', separator: fmt.slice(lastIndex, match.index), length: 0 })
    }
    segments.push({ type: 'token', token: match[0], length: match[0].length })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < fmt.length) {
    segments.push({ type: 'separator', separator: fmt.slice(lastIndex), length: 0 })
  }
  return segments
}

function MaskInput({ format, value, onComplete, placeholder, fontSize, color, disabled, readOnly, onFocus }: {
  format: string
  value: string
  onComplete: (value: string) => void
  placeholder?: string
  fontSize: string
  color: string
  disabled?: boolean
  readOnly?: boolean
  onFocus?: () => void
}) {
  const segments = useMemo(() => parseMaskFormat(format), [format])
  const tokens = useMemo(() => segments.filter((s): s is MaskSegment & { type: 'token'; token: string } => s.type === 'token'), [segments])

  // Per-token typed values
  const [tokenValues, setTokenValues] = useState<string[]>(() => {
    if (value) {
      // Parse existing value into token slots
      const vals: string[] = []
      let pos = 0
      for (const seg of segments) {
        if (seg.type === 'separator') {
          pos += (seg.separator?.length ?? 0)
        } else {
          vals.push(value.slice(pos, pos + seg.length))
          pos += seg.length
        }
      }
      return vals
    }
    return tokens.map(() => '')
  })
  const [activeToken, setActiveToken] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync from external value
  useEffect(() => {
    if (value && activeToken === -1) {
      const vals: string[] = []
      let pos = 0
      for (const seg of segments) {
        if (seg.type === 'separator') {
          pos += (seg.separator?.length ?? 0)
        } else {
          vals.push(value.slice(pos, pos + seg.length))
          pos += seg.length
        }
      }
      setTokenValues(vals)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build display string
  const display = useMemo(() => {
    let tokenIdx = 0
    return segments.map((seg: MaskSegment) => {
      if (seg.type === 'separator') return seg.separator
      const val = tokenValues[tokenIdx] ?? ''
      const pad = (seg.token ?? '').replace(/./g, '_')
      tokenIdx++
      return val + pad.slice(val.length)
    }).join('')
  }, [segments, tokenValues])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly) return
    const idx = activeToken >= 0 ? activeToken : 0

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveToken(Math.max(0, idx - 1))
    } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
      if (e.key === 'Tab' && idx >= tokens.length - 1) return // Let tab leave
      e.preventDefault()
      setActiveToken(Math.min(tokens.length - 1, idx + 1))
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const delta = e.key === 'ArrowUp' ? 1 : -1
      setTokenValues(prev => {
        const next = [...prev]
        const tok = tokens[idx]
        const current = parseInt(next[idx]) || 0
        const max = tok.token === 'YYYY' ? 9999 : tok.token === 'MM' ? 12 : tok.token === 'DD' ? 31 : tok.token === 'HH' ? 23 : tok.token === 'hh' ? 12 : tok.token === 'mm' || tok.token === 'ss' ? 59 : 99
        const min = tok.token === 'MM' || tok.token === 'DD' || tok.token === 'hh' ? 1 : 0
        const newVal = Math.min(max, Math.max(min, current + delta))
        next[idx] = String(newVal).padStart(tok.length, '0')
        return next
      })
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      setTokenValues(prev => {
        const next = [...prev]
        if (next[idx].length > 0) {
          next[idx] = next[idx].slice(0, -1)
        } else if (idx > 0) {
          setActiveToken(idx - 1)
        }
        return next
      })
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      setTokenValues(prev => {
        const next = [...prev]
        const tok = tokens[idx]
        if (next[idx].length >= tok.length) next[idx] = '' // Start over
        next[idx] += e.key
        // Auto advance when token is full
        if (next[idx].length >= tok.length && idx < tokens.length - 1) {
          setActiveToken(idx + 1)
        }
        return next
      })
    } else if (e.key === 'Enter') {
      // Check if all tokens are filled
      const allFilled = tokenValues.every((v, i) => v.length === tokens[i].length)
      if (allFilled) {
        let tokenIdx = 0
        const result = segments.map((seg: MaskSegment) => {
          if (seg.type === 'separator') return seg.separator
          return tokenValues[tokenIdx++]
        }).join('')
        onComplete(result)
        setActiveToken(-1)
      }
    } else if (e.key === 'Escape') {
      setActiveToken(-1)
      inputRef.current?.blur()
    }
  }

  // Submit on blur if all filled
  const handleBlur = () => {
    const allFilled = tokenValues.every((v, i) => v.length === tokens[i].length)
    if (allFilled) {
      let tokenIdx = 0
      const result = segments.map(seg => {
        if (seg.type === 'separator') return seg.separator
        return tokenValues[tokenIdx++]
      }).join('')
      onComplete(result)
    }
    setActiveToken(-1)
  }

  // Compute cursor position for highlight
  const getTokenPosition = (tokenIndex: number): { start: number; length: number } => {
    let pos = 0
    let tIdx = 0
    for (const seg of segments) {
      if (seg.type === 'separator') {
        pos += (seg.separator?.length ?? 0)
      } else {
        if (tIdx === tokenIndex) return { start: pos, length: seg.length }
        pos += seg.length
        tIdx++
      }
    }
    return { start: 0, length: 0 }
  }

  // Set selection on active token
  useEffect(() => {
    if (activeToken >= 0 && inputRef.current) {
      const { start, length } = getTokenPosition(activeToken)
      inputRef.current.setSelectionRange(start, start + length)
    }
  }, [activeToken, display]) // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = tokenValues.every(v => v === '')

  return (
    <input
      ref={inputRef}
      value={isEmpty && activeToken === -1 ? '' : display}
      placeholder={placeholder ?? format.replace(/[YMDHhms]/g, '_')}
      readOnly
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onFocus={() => { setActiveToken(0); onFocus?.() }}
      onBlur={handleBlur}
      style={{
        flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent',
        fontSize, fontFamily: 'inherit', color, caretColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'text',
        padding: 0,
      }}
    />
  )
}

// ============================================================================
// Internal: PanelHeader
// ============================================================================

function PanelHeader({ title, onPrevYear, onNextYear, onPrevMonth, onNextMonth, onTitleClick, showMonthNav = true, styles: panelStyles, classNames: panelClassNames }: {
  title: ReactNode
  onPrevYear: () => void
  onNextYear: () => void
  onPrevMonth?: () => void
  onNextMonth?: () => void
  onTitleClick?: () => void
  showMonthNav?: boolean
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const navBtnStyle: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '1.75rem', height: '1.75rem', padding: 0, border: 'none', borderRadius: '0.25rem',
    backgroundColor: 'transparent', cursor: 'pointer', color: tokens.colorTextMuted,
    transition: 'background-color 0.15s ease, color 0.15s ease',
  }

  const handleHoverIn = (e: ReactMouseEvent) => {
    ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
    ;(e.currentTarget as HTMLElement).style.color = tokens.colorText
  }
  const handleHoverOut = (e: ReactMouseEvent) => {
    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
    ;(e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted
  }

  return (
    <div
      className={panelClassNames?.header}
      style={mergeSemanticStyle({
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 0.5rem 0.25rem', userSelect: 'none',
      }, panelStyles?.header)}
    >
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        <button type="button" style={navBtnStyle} onClick={onPrevYear} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}><DoubleLeftIcon /></button>
        {showMonthNav && onPrevMonth && (
          <button type="button" style={navBtnStyle} onClick={onPrevMonth} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}><ChevronLeftIcon /></button>
        )}
      </div>
      <button
        type="button"
        onClick={onTitleClick}
        style={{
          border: 'none', backgroundColor: 'transparent', cursor: onTitleClick ? 'pointer' : 'default',
          fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', color: tokens.colorText,
          padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => { if (onTitleClick) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        {title}
      </button>
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {showMonthNav && onNextMonth && (
          <button type="button" style={navBtnStyle} onClick={onNextMonth} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}><ChevronRightIcon /></button>
        )}
        <button type="button" style={navBtnStyle} onClick={onNextYear} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}><DoubleRightIcon /></button>
      </div>
    </div>
  )
}

// ============================================================================
// Internal: DatePanel
// ============================================================================

interface RangeHighlight<TDate> {
  start: TDate | null
  end: TDate | null
  hoverDate: TDate | null
}

function DatePanel<TDate>({ adapter, viewDate, value, selectedDates, onSelect, onHover, disabledDate, minDate, maxDate, cellRender, rangeInfo, hideOutOfMonth, styles: panelStyles, classNames: panelClassNames }: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  selectedDates?: TDate[]
  onSelect: (date: TDate) => void
  onHover?: (date: TDate | null) => void
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  rangeInfo?: RangeHighlight<TDate>
  hideOutOfMonth?: boolean
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const year = adapter.getYear(viewDate)
  const month = adapter.getMonth(viewDate)
  const today = adapter.today()
  const grid = generateMonthGrid(adapter, year, month, 1) // weekStartsOn=1 (Monday)
  const dayNames = adapter.getDayNames('narrow')
  // Reorder from Sunday-first to Monday-first
  const orderedDays = [...dayNames.slice(1), dayNames[0]]

  const CELL_SIZE = '2rem'
  const CIRCLE_SIZE = '1.75rem'

  return (
    <div className={panelClassNames?.body} style={mergeSemanticStyle({ padding: '0 0.5rem 0.5rem' }, panelStyles?.body)}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${CELL_SIZE})`, gridAutoRows: CELL_SIZE, placeItems: 'center' }}>
        {/* Day names header */}
        {orderedDays.map((name, i) => (
          <div key={`h-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: CELL_SIZE, height: CELL_SIZE, fontSize: '0.75rem', fontWeight: 600, color: tokens.colorTextMuted }}>
            {name}
          </div>
        ))}
        {/* Date cells */}
        {grid.map((week, rowIdx) =>
          week.map((date, colIdx) => {
            const inView = adapter.isSameMonth(date, viewDate)

            // When hideOutOfMonth is active, render an empty placeholder for out-of-month days
            if (hideOutOfMonth && !inView) {
              return <div key={`${rowIdx}-${colIdx}`} />
            }

            const isToday = adapter.isSameDay(date, today)
            const isSelected = (value && adapter.isValid(value) && adapter.isSameDay(date, value))
              || (selectedDates?.some(d => adapter.isSameDay(d, date)) ?? false)
            const disabled = isDateDisabled(adapter, date, disabledDate, minDate, maxDate)

            // Range info
            let inRange = false, rangeStart = false, rangeEnd = false
            if (rangeInfo) {
              const { start, end, hoverDate } = rangeInfo
              const effectiveEnd = end ?? hoverDate
              if (start && effectiveEnd) {
                const [rStart, rEnd] = adapter.isBefore(start, effectiveEnd) ? [start, effectiveEnd] : [effectiveEnd, start]
                rangeStart = adapter.isSameDay(date, rStart)
                rangeEnd = adapter.isSameDay(date, rEnd)
                inRange = (adapter.isAfter(date, rStart) || adapter.isSameDay(date, rStart)) &&
                  (adapter.isBefore(date, rEnd) || adapter.isSameDay(date, rEnd))
              }
            }

            const cellStyle: CSSProperties = {
              display: 'grid', placeContent: 'center',
              width: CIRCLE_SIZE, height: CIRCLE_SIZE,
              fontSize: '0.8125rem', borderRadius: '50%',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: isSelected ? '#fff'
                : disabled ? tokens.colorTextSubtle
                  : !inView ? tokens.colorTextSubtle
                    : tokens.colorText,
              backgroundColor: isSelected ? tokens.colorPrimary
                : (inRange && !rangeStart && !rangeEnd) ? tokens.colorPrimaryBg
                  : 'transparent',
              fontWeight: isToday ? 700 : 400,
              boxShadow: isToday && !isSelected ? `inset 0 0 0 1.5px ${tokens.colorPrimary}` : 'none',
              transition: 'background-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease',
              opacity: disabled ? 0.4 : 1,
            }

            if (rangeStart || rangeEnd) {
              cellStyle.backgroundColor = tokens.colorPrimary
              cellStyle.color = '#fff'
            }

            const originNode = (
              <span style={{ lineHeight: 0 }}>{adapter.getDate(date)}</span>
            )

            const content = cellRender ? cellRender(date, {
              type: 'date', originNode, today: isToday, inView, inRange, rangeStart, rangeEnd,
            }) : originNode

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={cellStyle}
                className={panelClassNames?.cell}
                onClick={() => { if (!disabled) onSelect(date) }}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    onHover?.(date)
                    if (!isSelected && !rangeStart && !rangeEnd) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = inRange ? tokens.colorPrimaryBg : tokens.colorBgMuted
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!disabled && !isSelected && !rangeStart && !rangeEnd) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = inRange ? tokens.colorPrimaryBg : 'transparent'
                  }
                  onHover?.(null)
                }}
              >
                {content}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Internal: WeekPanel
// ============================================================================

function WeekPanel<TDate>({ adapter, viewDate, value, onSelect, disabledDate: _disabledDate, minDate: _minDate, maxDate: _maxDate, styles: panelStyles, classNames: panelClassNames }: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const year = adapter.getYear(viewDate)
  const month = adapter.getMonth(viewDate)
  const today = adapter.today()
  const grid = generateMonthGrid(adapter, year, month, 1)
  const dayNames = adapter.getDayNames('narrow')
  const orderedDays = [...dayNames.slice(1), dayNames[0]]

  const CELL_SIZE = '2rem'
  const CIRCLE_SIZE = '1.75rem'

  // The selected week is identified by its start-of-week
  const selectedWeekStart = value && adapter.isValid(value) ? adapter.startOfWeek(value, 1) : null

  return (
    <div className={panelClassNames?.body} style={mergeSemanticStyle({ padding: '0 0.5rem 0.5rem' }, panelStyles?.body)}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${CELL_SIZE})`, gridAutoRows: CELL_SIZE, placeItems: 'center' }}>
        {orderedDays.map((name, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: CELL_SIZE, height: CELL_SIZE, fontSize: '0.75rem', fontWeight: 600, color: tokens.colorTextMuted }}>
            {name}
          </div>
        ))}
      </div>
      {/* Rows */}
      {grid.map((week, rowIdx) => {
        const weekStart = adapter.startOfWeek(week[0], 1)
        const isSelectedWeek = selectedWeekStart && adapter.isSameDay(weekStart, selectedWeekStart)

        return (
          <div
            key={rowIdx}
            style={{
              display: 'grid', gridTemplateColumns: `repeat(7, ${CELL_SIZE})`, gridAutoRows: CELL_SIZE,
              placeItems: 'center',
              borderRadius: '0.25rem', cursor: 'pointer',
              backgroundColor: isSelectedWeek ? tokens.colorPrimaryBg : 'transparent',
              transition: 'background-color 0.1s ease',
            }}
            onClick={() => onSelect(weekStart)}
            onMouseEnter={(e) => { if (!isSelectedWeek) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
            onMouseLeave={(e) => { if (!isSelectedWeek) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {week.map((date, colIdx) => {
              const inView = adapter.isSameMonth(date, viewDate)
              const isToday = adapter.isSameDay(date, today)
              return (
                <div key={colIdx} style={{
                  display: 'grid', placeContent: 'center',
                  width: CIRCLE_SIZE, height: CIRCLE_SIZE,
                  fontSize: '0.8125rem',
                  color: !inView ? tokens.colorTextSubtle : isSelectedWeek ? tokens.colorPrimary : tokens.colorText,
                  fontWeight: isToday ? 700 : 400,
                  boxShadow: isToday ? `inset 0 0 0 1.5px ${tokens.colorPrimary}` : 'none',
                  borderRadius: '50%',
                }}>
                  {adapter.getDate(date)}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Internal: MonthPanel
// ============================================================================

function MonthPanel<TDate>({ adapter, viewDate, value, onSelect, disabledDate, minDate, maxDate, cellRender, styles: panelStyles, classNames: panelClassNames }: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const monthNames = adapter.getMonthNames('short')
  const today = adapter.today()
  const currentYear = adapter.getYear(viewDate)

  return (
    <div className={panelClassNames?.body} style={mergeSemanticStyle({ padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }, panelStyles?.body)}>
      {monthNames.map((name, monthIdx) => {
        const date = adapter.setMonth(adapter.setDate(adapter.setYear(adapter.today(), currentYear), 1), monthIdx)
        const isCurrentMonth = adapter.isSameMonth(date, today)
        const isSelected = value && adapter.isValid(value) && adapter.isSameMonth(date, value) && adapter.isSameYear(date, value)
        const disabled = isDateDisabled(adapter, date, disabledDate, minDate, maxDate)

        const originNode = <span>{name}</span>
        const content = cellRender ? cellRender(date, { type: 'month', originNode, today: isCurrentMonth, inView: true }) : originNode

        return (
          <button
            key={monthIdx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(date)}
            className={panelClassNames?.cell}
            style={{
              height: '2.5rem', border: isCurrentMonth && !isSelected ? `1px solid ${tokens.colorPrimary}` : '1px solid transparent',
              borderRadius: '0.375rem', cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              color: isSelected ? '#fff' : disabled ? tokens.colorTextSubtle : tokens.colorText,
              fontSize: '0.8125rem', fontWeight: isCurrentMonth ? 600 : 400, fontFamily: 'inherit',
              transition: 'background-color 0.1s ease',
              opacity: disabled ? 0.4 : 1,
            }}
            onMouseEnter={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
            onMouseLeave={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// Internal: YearPanel
// ============================================================================

function YearPanel<TDate>({ adapter, viewDate, value, onSelect, disabledDate, minDate, maxDate, cellRender, styles: panelStyles, classNames: panelClassNames }: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const currentYear = adapter.getYear(viewDate)
  const decadeStart = Math.floor(currentYear / 10) * 10
  const today = adapter.today()
  const thisYear = adapter.getYear(today)

  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i)

  return (
    <div className={panelClassNames?.body} style={mergeSemanticStyle({ padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }, panelStyles?.body)}>
      {years.map((yr) => {
        const date = adapter.setYear(adapter.today(), yr)
        const inDecade = yr >= decadeStart && yr < decadeStart + 10
        const isThisYear = yr === thisYear
        const isSelected = value && adapter.isValid(value) && adapter.getYear(value) === yr
        const disabled = isDateDisabled(adapter, date, disabledDate, minDate, maxDate)

        const originNode = <span>{yr}</span>
        const content = cellRender ? cellRender(date, { type: 'year', originNode, today: isThisYear, inView: inDecade }) : originNode

        return (
          <button
            key={yr}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(date)}
            className={panelClassNames?.cell}
            style={{
              height: '2.5rem', border: isThisYear && !isSelected ? `1px solid ${tokens.colorPrimary}` : '1px solid transparent',
              borderRadius: '0.375rem', cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              color: isSelected ? '#fff' : !inDecade ? tokens.colorTextSubtle : disabled ? tokens.colorTextSubtle : tokens.colorText,
              fontSize: '0.8125rem', fontWeight: isThisYear ? 600 : 400, fontFamily: 'inherit',
              transition: 'background-color 0.1s ease',
              opacity: disabled ? 0.4 : 1,
            }}
            onMouseEnter={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
            onMouseLeave={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// Internal: QuarterPanel
// ============================================================================

function QuarterPanel<TDate>({ adapter, viewDate, value, onSelect, disabledDate, minDate, maxDate, cellRender, styles: panelStyles, classNames: panelClassNames }: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  minDate?: TDate
  maxDate?: TDate
  cellRender?: (current: TDate, info: CellRenderInfo) => ReactNode
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const today = adapter.today()
  const currentYear = adapter.getYear(viewDate)
  const thisQuarter = Math.floor(adapter.getMonth(today) / 3) + 1
  const thisYear = adapter.getYear(today)

  return (
    <div className={panelClassNames?.body} style={mergeSemanticStyle({ padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }, panelStyles?.body)}>
      {[1, 2, 3, 4].map((q) => {
        const monthIdx = (q - 1) * 3
        const date = adapter.setMonth(adapter.setDate(adapter.setYear(adapter.today(), currentYear), 1), monthIdx)
        const isCurrentQ = q === thisQuarter && currentYear === thisYear
        const isSelected = value && adapter.isValid(value) && Math.floor(adapter.getMonth(value) / 3) + 1 === q && adapter.getYear(value) === currentYear
        const disabled = isDateDisabled(adapter, date, disabledDate, minDate, maxDate)

        const label = adapter.getQuarterLabel(q)
        const originNode = <span>{label}</span>
        const content = cellRender ? cellRender(date, { type: 'quarter', originNode, today: isCurrentQ, inView: true }) : originNode

        return (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(date)}
            className={panelClassNames?.cell}
            style={{
              height: '3rem', border: isCurrentQ && !isSelected ? `1px solid ${tokens.colorPrimary}` : '1px solid transparent',
              borderRadius: '0.375rem', cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              color: isSelected ? '#fff' : disabled ? tokens.colorTextSubtle : tokens.colorText,
              fontSize: '0.875rem', fontWeight: isCurrentQ ? 600 : 400, fontFamily: 'inherit',
              transition: 'background-color 0.1s ease',
              opacity: disabled ? 0.4 : 1,
            }}
            onMouseEnter={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
            onMouseLeave={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// Internal: TimePanel
// ============================================================================

function TimePanel<TDate>({ adapter, value, onChange, config, disabledTime }: {
  adapter: DateAdapter<TDate>
  value: TDate
  onChange: (date: TDate) => void
  config?: TimePickerConfig
  disabledTime?: DisabledTimes
}) {
  const hourStep = config?.hourStep ?? 1
  const minuteStep = config?.minuteStep ?? 1
  const secondStep = config?.secondStep ?? 1
  const showHour = config?.showHour !== false
  const showMinute = config?.showMinute !== false
  const showSecond = config?.showSecond === true
  const use12Hours = config?.use12Hours ?? false

  const currentH = adapter.getHour(value)
  const currentM = adapter.getMinute(value)
  const currentS = adapter.getSecond(value)

  const disabledH = disabledTime?.disabledHours?.() ?? []
  const disabledM = disabledTime?.disabledMinutes?.(currentH) ?? []
  const disabledS = disabledTime?.disabledSeconds?.(currentH, currentM) ?? []

  const hours = Array.from({ length: Math.ceil((use12Hours ? 12 : 24) / hourStep) }, (_, i) => {
    const h = use12Hours ? (i * hourStep) + 1 : i * hourStep
    return use12Hours ? h : h
  }).filter(h => use12Hours ? h <= 12 : h < 24)

  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).filter(m => m < 60)
  const seconds = Array.from({ length: Math.ceil(60 / secondStep) }, (_, i) => i * secondStep).filter(s => s < 60)

  // Calendar grid: 7 rows × 2rem = 14rem + 0.5rem body padding = 14.5rem
  // TimePanel padding: 0.5rem top + 0.5rem bottom = 1rem → columns = 13.5rem
  const TIME_COL_HEIGHT = '13.5rem'

  const scrollbarClass = 'j-dp-time-col'
  const colStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    height: TIME_COL_HEIGHT, overflowY: 'auto', width: '3.25rem',
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorBorderHover} transparent`,
    borderRight: `1px solid ${tokens.colorBorder}`,
  }

  const renderColumn = (items: number[], selected: number, disabled: number[], onItemSelect: (v: number) => void) => (
    <div className={scrollbarClass} style={colStyle}>
      {items.map((item) => {
        const isSel = item === selected
        const isDis = disabled.includes(item)
        return (
          <button
            key={item}
            type="button"
            disabled={isDis}
            onClick={() => { if (!isDis) onItemSelect(item) }}
            style={{
              width: '2.75rem', height: '1.75rem', flexShrink: 0, border: 'none', borderRadius: '0.25rem',
              backgroundColor: isSel ? tokens.colorPrimaryBg : 'transparent',
              color: isSel ? tokens.colorPrimary : isDis ? tokens.colorTextSubtle : tokens.colorText,
              cursor: isDis ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem', fontWeight: isSel ? 600 : 400, fontFamily: 'monospace',
              transition: 'background-color 0.1s ease',
              opacity: isDis ? 0.4 : 1,
            }}
            onMouseEnter={(e) => { if (!isDis && !isSel) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
            onMouseLeave={(e) => { if (!isDis && !isSel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {String(item).padStart(2, '0')}
          </button>
        )
      })}
    </div>
  )

  const displayH = use12Hours ? (currentH % 12 || 12) : currentH
  const isPM = currentH >= 12

  return (
    <div style={{ display: 'flex', borderLeft: `1px solid ${tokens.colorBorder}`, padding: '0.5rem 0' }}>
      <style>{`
        .${scrollbarClass}::-webkit-scrollbar { width: 4px; }
        .${scrollbarClass}::-webkit-scrollbar-track { background: transparent; }
        .${scrollbarClass}::-webkit-scrollbar-thumb { background: ${tokens.colorBorderHover}; border-radius: 4px; }
        .${scrollbarClass}::-webkit-scrollbar-thumb:hover { background: ${tokens.colorTextSubtle}; }
      `}</style>
      {showHour && renderColumn(hours, displayH, disabledH, (h) => {
        let newH = h
        if (use12Hours) {
          newH = isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h)
        }
        onChange(adapter.setHour(value, newH))
      })}
      {showMinute && renderColumn(minutes, currentM, disabledM, (m) => onChange(adapter.setMinute(value, m)))}
      {showSecond && renderColumn(seconds, currentS, disabledS, (s) => onChange(adapter.setSecond(value, s)))}
      {use12Hours && (
        <div style={{ ...colStyle, borderRight: 'none' }}>
          {['AM', 'PM'].map((label) => {
            const isSel = label === 'AM' ? !isPM : isPM
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const newH = label === 'AM'
                    ? (currentH >= 12 ? currentH - 12 : currentH)
                    : (currentH < 12 ? currentH + 12 : currentH)
                  onChange(adapter.setHour(value, newH))
                }}
                style={{
                  width: '2.75rem', height: '1.75rem', flexShrink: 0, border: 'none', borderRadius: '0.25rem',
                  backgroundColor: isSel ? tokens.colorPrimaryBg : 'transparent',
                  color: isSel ? tokens.colorPrimary : tokens.colorText,
                  cursor: 'pointer', fontSize: '0.75rem', fontWeight: isSel ? 600 : 400, fontFamily: 'inherit',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => { if (!isSel) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
                onMouseLeave={(e) => { if (!isSel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Internal: PanelFooter
// ============================================================================

function PanelFooter<TDate>({ showToday, showNow, showOk, presets, renderExtraFooter, onToday, onNow, onOk, onPresetSelect, styles: panelStyles, classNames: panelClassNames }: {
  showToday?: boolean
  showNow?: boolean
  showOk?: boolean
  presets?: DatePickerPreset<TDate>[]
  renderExtraFooter?: () => ReactNode
  onToday?: () => void
  onNow?: () => void
  onOk?: () => void
  onPresetSelect?: (value: TDate) => void
  styles?: DatePickerStyles
  classNames?: DatePickerClassNames
}) {
  const hasPresets = presets && presets.length > 0
  const hasActions = showToday || showNow || showOk
  const hasExtra = renderExtraFooter
  if (!hasPresets && !hasActions && !hasExtra) return null

  const linkStyle: CSSProperties = {
    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
    color: tokens.colorPrimary, fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
    padding: '0.25rem 0',
  }

  return (
    <div
      className={panelClassNames?.footer}
      style={mergeSemanticStyle({
        borderTop: `1px solid ${tokens.colorBorder}`,
        padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem',
      }, panelStyles?.footer)}
    >
      {hasExtra && <div>{renderExtraFooter!()}</div>}
      {hasPresets && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {presets!.map((preset, i) => {
            const resolveValue = () => typeof preset.value === 'function' ? (preset.value as () => TDate)() : preset.value
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPresetSelect?.(resolveValue())}
                style={{
                  padding: '0.125rem 0.625rem', border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.25rem',
                  backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.75rem',
                  fontFamily: 'inherit', color: tokens.colorText,
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = tokens.colorPrimary
                  ;(e.currentTarget as HTMLElement).style.color = tokens.colorPrimary
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder
                  ;(e.currentTarget as HTMLElement).style.color = tokens.colorText
                }}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      )}
      {hasActions && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {showToday && <button type="button" style={linkStyle} onClick={onToday}>Today</button>}
            {showNow && <button type="button" style={linkStyle} onClick={onNow}>Now</button>}
          </div>
          {showOk && (
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
// DatePicker Component
// ============================================================================

function DatePickerComponent<TDate = any>({
  value: controlledValue,
  defaultValue,
  onChange,
  picker: pickerProp = 'date',
  format: formatProp,
  placeholder: placeholderProp,
  size = 'md',
  variant = 'outlined',
  status,
  placement = 'bottomLeft',
  disabled = false,
  inputReadOnly = false,
  allowClear = true,
  prefix,
  suffix: suffixProp,
  needConfirm: needConfirmProp,
  multiple = false,
  mask = false,
  disabledDate,
  minDate,
  maxDate,
  showTime,
  showNow,
  showToday = true,
  presets,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  panelRender,
  cellRender,
  onPanelChange,
  renderExtraFooter,
  disabledTime,
  adapter: adapterProp,
  className,
  style,
  classNames,
  styles,
}: DatePickerProps<TDate>) {
  const adapter = useDateAdapter(adapterProp)
  const resolvedNeedConfirm = needConfirmProp ?? !!showTime

  // ---- Value ----
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<TDate | null>(defaultValue ?? null)
  const currentValue = isValueControlled ? (controlledValue ?? null) : internalValue

  // ---- Multiple mode ----
  const [multipleValues, setMultipleValues] = useState<TDate[]>(() => {
    if (multiple && defaultValue && adapter.isValid(defaultValue)) return [defaultValue]
    return []
  })

  // ---- Open ----
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isOpenControlled ? controlledOpen! : internalOpen

  // ---- View date (what's displayed in the panel) ----
  const [viewDate, setViewDate] = useState<TDate>(() =>
    currentValue && adapter.isValid(currentValue) ? adapter.clone(currentValue) : adapter.today()
  )

  // ---- Panel mode (drill-down) ----
  const [panelMode, setPanelMode] = useState<DatePickerMode>(pickerProp)

  // ---- Input editing ----
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // ---- Pending value for showTime ----
  const [pendingValue, setPendingValue] = useState<TDate | null>(null)

  // ---- Animation ----
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)

  // ---- Refs ----
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)

  // ---- Format resolution ----
  const resolvedFormat = typeof formatProp === 'string' ? formatProp : getDefaultFormat(pickerProp, showTime)
  const formatDate = useCallback((date: TDate | null): string => {
    if (!date || !adapter.isValid(date)) return ''
    if (typeof formatProp === 'function') return formatProp(date)
    return adapter.format(date, resolvedFormat)
  }, [adapter, formatProp, resolvedFormat])

  const resolvedPlaceholder = placeholderProp ?? getDefaultPlaceholder(pickerProp, showTime)

  // ---- Sync viewDate when value changes ----
  useEffect(() => {
    if (currentValue && adapter.isValid(currentValue)) {
      setViewDate(adapter.clone(currentValue))
    }
  }, [currentValue, adapter])

  // ---- Reset panelMode when picker changes ----
  useEffect(() => { setPanelMode(pickerProp) }, [pickerProp])

  // ---- Open animation ----
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
      // Reset pending value
      setPendingValue(currentValue && adapter.isValid(currentValue) ? adapter.clone(currentValue) : null)
      setPanelMode(pickerProp)
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

  // ---- Status colors (needed early for setOpen reset) ----
  const statusBorderColor = status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : undefined

  // ---- Helpers ----
  const setOpen = useCallback((v: boolean) => {
    if (disabled) return
    if (v) {
      setResolvedPlacement(resolveAutoPlacement(placement, rootRef.current))
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

  const commitValue = useCallback((date: TDate | null) => {
    if (multiple && date) {
      // Toggle date in multiple list
      setMultipleValues(prev => {
        const exists = prev.findIndex(d => adapter.isSameDay(d, date))
        const next = exists >= 0 ? prev.filter((_, i) => i !== exists) : [...prev, date]
        const dateString = next.map(d => formatDate(d)).join(', ')
        onChange?.(date, dateString)
        return next
      })
      return // Don't close in multiple mode
    }
    if (!isValueControlled) setInternalValue(date)
    const dateString = formatDate(date)
    onChange?.(date, dateString)
    if (!resolvedNeedConfirm) {
      setOpen(false)
    }
  }, [multiple, isValueControlled, formatDate, onChange, resolvedNeedConfirm, setOpen, adapter])

  const handlePanelSelect = useCallback((date: TDate) => {
    const targetMode = pickerProp

    // Drill-down navigation
    if (panelMode !== targetMode) {
      setViewDate(date)
      if (panelMode === 'year') {
        setPanelMode(targetMode === 'year' ? 'year' : targetMode === 'quarter' ? 'quarter' : 'month')
        if (targetMode === 'year') {
          commitValue(date)
        }
      } else if (panelMode === 'month') {
        setPanelMode(targetMode === 'month' ? 'month' : targetMode === 'week' ? 'date' : 'date')
        if (targetMode === 'month') {
          commitValue(date)
        }
      }
      onPanelChange?.(date, panelMode)
      return
    }

    // Target mode reached — commit
    if (resolvedNeedConfirm && targetMode === 'date') {
      // needConfirm: update pending, don't close
      const existing = pendingValue && adapter.isValid(pendingValue) ? pendingValue : adapter.today()
      const merged = showTime ? adapter.setSecond(
        adapter.setMinute(
          adapter.setHour(
            adapter.setDate(adapter.setMonth(adapter.setYear(adapter.clone(existing), adapter.getYear(date)), adapter.getMonth(date)), adapter.getDate(date)),
            adapter.getHour(existing)
          ),
          adapter.getMinute(existing)
        ),
        adapter.getSecond(existing)
      ) : date
      setPendingValue(merged)
      setViewDate(date)
    } else {
      commitValue(date)
    }
  }, [pickerProp, panelMode, resolvedNeedConfirm, showTime, pendingValue, adapter, commitValue, onPanelChange])

  const handleTimeChange = useCallback((date: TDate) => {
    setPendingValue(date)
  }, [])

  const handleOk = useCallback(() => {
    commitValue(pendingValue)
    setOpen(false)
  }, [pendingValue, commitValue, setOpen])

  const handleToday = useCallback(() => {
    const today = adapter.today()
    if (resolvedNeedConfirm) {
      setPendingValue(today)
      setViewDate(today)
    } else {
      commitValue(today)
    }
  }, [adapter, resolvedNeedConfirm, commitValue])

  const handleNow = useCallback(() => {
    const now = adapter.create(new Date() as any)
    if (resolvedNeedConfirm) {
      setPendingValue(now)
      setViewDate(now)
    } else {
      commitValue(now)
    }
  }, [adapter, resolvedNeedConfirm, commitValue])

  const handlePresetSelect = useCallback((val: TDate) => {
    commitValue(val)
    if (resolvedNeedConfirm) setOpen(false)
  }, [commitValue, resolvedNeedConfirm, setOpen])

  const handleClear = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      setMultipleValues([])
      onChange?.(null, '')
    } else {
      commitValue(null)
    }
  }, [multiple, commitValue, onChange])

  const handleHeaderTitleClick = useCallback(() => {
    if (panelMode === 'date' || panelMode === 'week') setPanelMode('month')
    else if (panelMode === 'month' || panelMode === 'quarter') setPanelMode('year')
  }, [panelMode])

  // ---- Input handlers ----
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsEditing(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    if (isEditing && inputValue) {
      const parsed = adapter.parse(inputValue, resolvedFormat)
      if (parsed && adapter.isValid(parsed)) {
        commitValue(parsed)
      }
    }
    setIsEditing(false)
  }, [isEditing, inputValue, adapter, resolvedFormat, commitValue])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditing && inputValue) {
        const parsed = adapter.parse(inputValue, resolvedFormat)
        if (parsed && adapter.isValid(parsed)) {
          commitValue(parsed)
        }
      }
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [isEditing, inputValue, adapter, resolvedFormat, commitValue, setOpen])

  const handleInputFocus = useCallback(() => {
    if (!isOpen) setOpen(true)
  }, [isOpen, setOpen])

  // ---- View navigation ----
  const goMonth = useCallback((delta: number) => {
    setViewDate(prev => adapter.addMonths(prev, delta))
  }, [adapter])

  const goYear = useCallback((delta: number) => {
    setViewDate(prev => adapter.addYears(prev, delta))
  }, [adapter])

  const goDecade = useCallback((delta: number) => {
    setViewDate(prev => adapter.addYears(prev, delta * 10))
  }, [adapter])

  // ---- Computed ----
  const sc = sizeConfig[size]
  const displayValue = isEditing ? inputValue : formatDate(currentValue)

  const isTop = resolvedPlacement.startsWith('top')
  const isRight = resolvedPlacement.endsWith('Right')
  const panelPositionStyle: CSSProperties = {
    position: 'absolute', zIndex: 1050,
    ...(isTop ? { bottom: '100%', marginBottom: '0.25rem' } : { top: '100%', marginTop: '0.25rem' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  }

  // ---- Variant styles ----
  const statusFocusColor = status === 'error' ? tokens.colorErrorBg : status === 'warning' ? tokens.colorWarningBg : tokens.colorPrimaryLight

  const inputBorder = variant === 'borderless' ? 'none'
    : `1px solid ${statusBorderColor ?? tokens.colorBorder}`
  const inputBg = variant === 'filled' ? tokens.colorBgMuted : 'transparent'

  // ---- Render header title ----
  const monthNames = adapter.getMonthNames('long')
  const headerTitle = (() => {
    const y = adapter.getYear(viewDate)
    if (panelMode === 'year') {
      const ds = Math.floor(y / 10) * 10
      return `${ds} - ${ds + 9}`
    }
    if (panelMode === 'month' || panelMode === 'quarter') return String(y)
    return `${monthNames[adapter.getMonth(viewDate)]} ${y}`
  })()

  // ---- Panel rendering ----
  const renderPanelBody = () => {
    const sharedPanelProps = {
      adapter, disabledDate, minDate, maxDate, cellRender,
      styles, classNames,
    }

    const activeValue = resolvedNeedConfirm ? pendingValue : currentValue

    switch (panelMode) {
      case 'year':
        return <YearPanel {...sharedPanelProps} viewDate={viewDate} value={activeValue} onSelect={handlePanelSelect} />
      case 'month':
        return <MonthPanel {...sharedPanelProps} viewDate={viewDate} value={activeValue} onSelect={handlePanelSelect} />
      case 'quarter':
        return <QuarterPanel {...sharedPanelProps} viewDate={viewDate} value={activeValue} onSelect={handlePanelSelect} />
      case 'week':
        return <WeekPanel adapter={adapter} viewDate={viewDate} value={activeValue} onSelect={handlePanelSelect} disabledDate={disabledDate} minDate={minDate} maxDate={maxDate} styles={styles} classNames={classNames} />
      case 'date':
      default:
        return <DatePanel {...sharedPanelProps} viewDate={viewDate} value={activeValue} selectedDates={multiple ? multipleValues : undefined} onSelect={handlePanelSelect} />
    }
  }

  const hasTime = !!showTime && panelMode === 'date'
  const timeConfig = typeof showTime === 'object' ? showTime : undefined
  const effectivePending = pendingValue && adapter.isValid(pendingValue) ? pendingValue : adapter.today()

  const disabledTimeConfig = disabledTime && pendingValue && adapter.isValid(pendingValue)
    ? disabledTime(pendingValue)
    : undefined

  const panelContent = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PanelHeader
        title={headerTitle}
        onPrevYear={() => panelMode === 'year' ? goDecade(-1) : goYear(-1)}
        onNextYear={() => panelMode === 'year' ? goDecade(1) : goYear(1)}
        onPrevMonth={panelMode === 'date' || panelMode === 'week' ? () => goMonth(-1) : undefined}
        onNextMonth={panelMode === 'date' || panelMode === 'week' ? () => goMonth(1) : undefined}
        showMonthNav={panelMode === 'date' || panelMode === 'week'}
        onTitleClick={panelMode !== 'year' ? handleHeaderTitleClick : undefined}
        styles={styles}
        classNames={classNames}
      />
      <div style={{ display: 'flex' }}>
        {renderPanelBody()}
        {hasTime && (
          <TimePanel
            adapter={adapter}
            value={effectivePending}
            onChange={handleTimeChange}
            config={timeConfig}
            disabledTime={disabledTimeConfig}
          />
        )}
      </div>
      <PanelFooter
        showToday={showToday && !resolvedNeedConfirm && panelMode === pickerProp}
        showNow={!!(showNow ?? showTime) && panelMode === pickerProp}
        showOk={resolvedNeedConfirm && panelMode === pickerProp}
        presets={panelMode === pickerProp ? presets : undefined}
        renderExtraFooter={panelMode === pickerProp ? renderExtraFooter : undefined}
        onToday={handleToday}
        onNow={handleNow}
        onOk={handleOk}
        onPresetSelect={handlePresetSelect}
        styles={styles}
        classNames={classNames}
      />
    </div>
  )

  const finalPanel = panelRender ? panelRender(panelContent) : panelContent

  // ---- Suffix ----
  const suffix = suffixProp !== undefined ? suffixProp : (
    <span style={{ color: tokens.colorTextMuted, display: 'flex' }}>
      {hasTime ? <ClockIcon /> : <CalendarIcon />}
    </span>
  )

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block' }, styles?.root, style)}
    >
      {/* Input */}
      <div
        ref={inputWrapRef}
        className={classNames?.input}
        onClick={() => { if (!disabled) { if (!isOpen) setOpen(true); inputRef.current?.focus() } }}
        style={mergeSemanticStyle({
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          minHeight: sc.height, height: multiple ? 'auto' : sc.height, padding: multiple ? `0.25rem ${sc.paddingH}` : `0 ${sc.paddingH}`,
          border: inputBorder, borderRadius: sc.radius,
          backgroundColor: inputBg, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: isOpen && variant !== 'borderless' ? `0 0 0 2px ${statusFocusColor}` : undefined,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          flexWrap: multiple ? 'wrap' : undefined,
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
        {prefix && <span style={{ display: 'flex', color: tokens.colorTextMuted, flexShrink: 0 }}>{prefix}</span>}
        {multiple ? (
          <>
            {multipleValues.map((d, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                  backgroundColor: tokens.colorBgMuted,
                  fontSize: sc.tagFontSize, color: tokens.colorText,
                  lineHeight: 1.4, whiteSpace: 'nowrap',
                }}
              >
                {formatDate(d)}
                {!disabled && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      setMultipleValues(prev => {
                        const next = prev.filter((_, idx) => idx !== i)
                        onChange?.(null, next.map(dd => formatDate(dd)).join(', '))
                        return next
                      })
                    }}
                    style={{
                      display: 'inline-flex', cursor: 'pointer', color: tokens.colorTextMuted,
                      borderRadius: '50%', transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorText }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted }}
                  >
                    <ClearIcon />
                  </span>
                )}
              </span>
            ))}
            {multipleValues.length === 0 && (
              <span style={{ fontSize: sc.fontSize, color: tokens.colorTextSubtle }}>{resolvedPlaceholder}</span>
            )}
          </>
        ) : mask ? (
          <MaskInput
            format={resolvedFormat}
            value={formatDate(currentValue)}
            onComplete={(val) => {
              const parsed = adapter.parse(val, resolvedFormat)
              if (parsed && adapter.isValid(parsed)) commitValue(parsed)
            }}
            placeholder={resolvedPlaceholder}
            fontSize={sc.inputFontSize}
            color={statusBorderColor ?? tokens.colorText}
            disabled={disabled}
            readOnly={inputReadOnly}
            onFocus={() => { if (!isOpen) setOpen(true) }}
          />
        ) : (
          <input
            ref={inputRef}
            value={displayValue}
            placeholder={resolvedPlaceholder}
            readOnly={inputReadOnly}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            style={{
              flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent',
              fontSize: sc.inputFontSize, fontFamily: 'inherit', color: statusBorderColor ?? tokens.colorText,
              cursor: disabled ? 'not-allowed' : undefined,
              padding: 0,
            }}
          />
        )}
        {allowClear && ((multiple && multipleValues.length > 0) || (!multiple && currentValue && adapter.isValid(currentValue))) && !disabled && (
          <span
            onClick={handleClear}
            style={{ display: 'flex', cursor: 'pointer', color: tokens.colorTextMuted, flexShrink: 0, transition: 'color 0.15s ease', marginLeft: 'auto' }}
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
          {finalPanel}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// RangePicker Component
// ============================================================================

function RangePickerComponent<TDate = any>({
  value: controlledValue,
  defaultValue,
  onChange,
  onCalendarChange,
  picker: pickerProp = 'date',
  format: formatProp,
  placeholder: placeholderProp,
  separator,
  allowEmpty,
  disabled: disabledProp = false,
  size = 'md',
  variant = 'outlined',
  status,
  placement = 'bottomLeft',
  inputReadOnly = false,
  allowClear = true,
  prefix,
  suffix: suffixProp,
  disabledDate,
  minDate,
  maxDate,
  showTime,
  showNow: _showNow,
  presets,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  panelRender,
  cellRender,
  onPanelChange: _onPanelChange,
  renderExtraFooter,
  disabledTime: _disabledTime,
  linkedPanels: linkedPanelsProp = true,
  adapter: adapterProp,
  className,
  style,
  classNames,
  styles,
}: RangePickerProps<TDate>) {
  const adapter = useDateAdapter(adapterProp)

  // ---- Disabled ----
  const disabledStart = typeof disabledProp === 'boolean' ? disabledProp : disabledProp[0]
  const disabledEnd = typeof disabledProp === 'boolean' ? disabledProp : disabledProp[1]
  const anyDisabled = disabledStart && disabledEnd

  // ---- Value ----
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<[TDate | null, TDate | null]>(defaultValue ?? [null, null])
  const currentValue: [TDate | null, TDate | null] = isValueControlled ? (controlledValue ?? [null, null]) : internalValue

  // ---- Open ----
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isOpenControlled ? controlledOpen! : internalOpen

  // ---- Active input ----
  const [activeInput, setActiveInput] = useState<'start' | 'end'>('start')
  const [hoverDate, setHoverDate] = useState<TDate | null>(null)
  const [tempStart, setTempStart] = useState<TDate | null>(null)

  // ---- View dates ----
  const [leftViewDate, setLeftViewDate] = useState<TDate>(() => {
    const base = currentValue[0] && adapter.isValid(currentValue[0]) ? adapter.clone(currentValue[0]) : adapter.today()
    return base
  })
  const [rightViewDate, setRightViewDate] = useState<TDate>(() => adapter.addMonths(leftViewDate, 1))

  // Navigation helpers
  const linked = linkedPanelsProp
  const navigateLeft = useCallback((fn: (d: TDate) => TDate) => {
    setLeftViewDate(prev => {
      const next = fn(prev)
      if (linked) setRightViewDate(adapter.addMonths(next, 1))
      return next
    })
  }, [adapter, linked])
  const navigateRight = useCallback((fn: (d: TDate) => TDate) => {
    setRightViewDate(prev => {
      const next = fn(prev)
      if (linked) setLeftViewDate(adapter.addMonths(next, -1))
      return next
    })
  }, [adapter, linked])

  // ---- Panel mode ----
  const [panelMode, setPanelMode] = useState<DatePickerMode>(pickerProp)

  // ---- Animation ----
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)

  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const resolvedFormat = typeof formatProp === 'string' ? formatProp : getDefaultFormat(pickerProp, showTime)
  const formatDate = useCallback((date: TDate | null): string => {
    if (!date || !adapter.isValid(date)) return ''
    if (typeof formatProp === 'function') return formatProp(date)
    return adapter.format(date, resolvedFormat)
  }, [adapter, formatProp, resolvedFormat])

  const defaultPlaceholders = placeholderProp ?? [
    showTime ? 'Start date time' : 'Start date',
    showTime ? 'End date time' : 'End date',
  ]

  // ---- Open animation ----
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
      setTempStart(null)
      setPanelMode(pickerProp)
      // Reset view to start date if available
      if (currentValue[0] && adapter.isValid(currentValue[0])) {
        const base = adapter.clone(currentValue[0])
        setLeftViewDate(base)
        setRightViewDate(adapter.addMonths(base, 1))
      }
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Click outside ----
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      if (panelRef.current?.contains(e.target as Node)) return
      // If user selected only start and allowEmpty permits, submit partial
      if (tempStart && allowEmpty?.[1]) {
        const newVal: [TDate | null, TDate | null] = [tempStart, null]
        if (!isValueControlled) setInternalValue(newVal as any)
        onChange?.(newVal as any, [formatDate(tempStart), ''])
        setTempStart(null)
        setActiveInput('start')
      } else {
        setTempStart(null)
        setActiveInput('start')
      }
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, tempStart, allowEmpty]) // eslint-disable-line react-hooks/exhaustive-deps

  const statusBorderColor = status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : undefined

  const setOpen = useCallback((v: boolean) => {
    if (anyDisabled) return
    if (v) setResolvedPlacement(resolveAutoPlacement(placement, rootRef.current))
    if (!isOpenControlled) setInternalOpen(v)
    onOpenChange?.(v)
    if (!v && inputWrapRef.current && variant !== 'borderless') {
      inputWrapRef.current.style.borderColor = statusBorderColor ?? tokens.colorBorder
    }
  }, [anyDisabled, isOpenControlled, onOpenChange, placement, variant, statusBorderColor])

  const handleRangeSelect = useCallback((date: TDate) => {
    // Drill-down
    if (panelMode !== pickerProp) {
      setLeftViewDate(date)
      setRightViewDate(adapter.addMonths(date, 1))
      if (panelMode === 'year') {
        setPanelMode(pickerProp === 'year' ? 'year' : pickerProp === 'quarter' ? 'quarter' : 'month')
      } else if (panelMode === 'month') {
        setPanelMode(pickerProp === 'month' ? 'month' : 'date')
      }
      return
    }

    if (activeInput === 'start' || !tempStart) {
      setTempStart(date)
      setActiveInput('end')
      const dateStr = formatDate(date)
      onCalendarChange?.([date, currentValue[1]], [dateStr, formatDate(currentValue[1])], { range: 'start' })
    } else {
      // Determine order
      let start: TDate = tempStart
      let end: TDate = date
      if (adapter.isAfter(start, end)) {
        const tmp = start
        start = end
        end = tmp
      }
      const newVal: [TDate, TDate] = [start, end]
      if (!isValueControlled) setInternalValue(newVal)
      const dateStrings: [string, string] = [formatDate(start), formatDate(end)]
      onCalendarChange?.(newVal, dateStrings, { range: 'end' })
      onChange?.(newVal, dateStrings)
      setTempStart(null)
      setActiveInput('start')
      if (!showTime) setOpen(false)
    }
  }, [activeInput, tempStart, adapter, pickerProp, panelMode, currentValue, isValueControlled, formatDate, onChange, onCalendarChange, showTime, setOpen])

  const handlePresetSelect = useCallback((val: [TDate, TDate]) => {
    if (!isValueControlled) setInternalValue(val)
    onChange?.(val, [formatDate(val[0]), formatDate(val[1])])
    setOpen(false)
  }, [isValueControlled, formatDate, onChange, setOpen])

  const handleClear = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation()
    if (!isValueControlled) setInternalValue([null, null])
    onChange?.(null, ['', ''])
  }, [isValueControlled, onChange])

  const handleTitleClick = useCallback(() => {
    if (panelMode === 'date' || panelMode === 'week') setPanelMode('month')
    else if (panelMode === 'month' || panelMode === 'quarter') setPanelMode('year')
  }, [panelMode])

  // ---- Computed ----
  const sc = sizeConfig[size]
  const isTop = resolvedPlacement.startsWith('top')
  const isRight = resolvedPlacement.endsWith('Right')
  const panelPositionStyle: CSSProperties = {
    position: 'absolute', zIndex: 1050,
    ...(isTop ? { bottom: '100%', marginBottom: '0.25rem' } : { top: '100%', marginTop: '0.25rem' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  }

  const statusFocusColor = status === 'error' ? tokens.colorErrorBg : status === 'warning' ? tokens.colorWarningBg : tokens.colorPrimaryLight
  const inputBorder = variant === 'borderless' ? 'none' : `1px solid ${statusBorderColor ?? tokens.colorBorder}`
  const inputBg = variant === 'filled' ? tokens.colorBgMuted : 'transparent'

  const hasValue = (currentValue[0] && adapter.isValid(currentValue[0])) || (currentValue[1] && adapter.isValid(currentValue[1]))

  // Range highlight
  const rangeInfo: RangeHighlight<TDate> = {
    start: tempStart ?? currentValue[0],
    end: tempStart ? null : currentValue[1],
    hoverDate: tempStart ? hoverDate : null,
  }

  // ---- Header title ----
  const monthNames = adapter.getMonthNames('long')
  const makeTitle = (vd: TDate) => {
    const y = adapter.getYear(vd)
    if (panelMode === 'year') {
      const ds = Math.floor(y / 10) * 10
      return `${ds} - ${ds + 9}`
    }
    if (panelMode === 'month' || panelMode === 'quarter') return String(y)
    return `${monthNames[adapter.getMonth(vd)]} ${y}`
  }

  const renderPanel = (vd: TDate, _side: 'left' | 'right') => {
    const sharedProps = { adapter, disabledDate, minDate, maxDate, cellRender, styles, classNames }

    switch (panelMode) {
      case 'year':
        return <YearPanel {...sharedProps} viewDate={vd} value={null} onSelect={handleRangeSelect} />
      case 'month':
        return <MonthPanel {...sharedProps} viewDate={vd} value={null} onSelect={handleRangeSelect} />
      case 'quarter':
        return <QuarterPanel {...sharedProps} viewDate={vd} value={null} onSelect={handleRangeSelect} />
      case 'date':
      default:
        return (
          <DatePanel
            {...sharedProps}
            viewDate={vd}
            value={null}
            onSelect={handleRangeSelect}
            onHover={setHoverDate}
            rangeInfo={rangeInfo}
            hideOutOfMonth
          />
        )
    }
  }

  const panelContent = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {/* Left panel */}
        <div>
          <PanelHeader
            title={makeTitle(leftViewDate)}
            onPrevYear={() => navigateLeft(d => panelMode === 'year' ? adapter.addYears(d, -10) : adapter.addYears(d, -1))}
            onNextYear={() => navigateLeft(d => panelMode === 'year' ? adapter.addYears(d, 10) : adapter.addYears(d, 1))}
            onPrevMonth={panelMode === 'date' ? () => navigateLeft(d => adapter.addMonths(d, -1)) : undefined}
            onNextMonth={panelMode === 'date' ? () => navigateLeft(d => adapter.addMonths(d, 1)) : undefined}
            showMonthNav={panelMode === 'date'}
            onTitleClick={panelMode !== 'year' ? handleTitleClick : undefined}
            styles={styles} classNames={classNames}
          />
          {renderPanel(leftViewDate, 'left')}
        </div>
        {/* Right panel */}
        <div>
          <PanelHeader
            title={makeTitle(rightViewDate)}
            onPrevYear={() => navigateRight(d => panelMode === 'year' ? adapter.addYears(d, -10) : adapter.addYears(d, -1))}
            onNextYear={() => navigateRight(d => panelMode === 'year' ? adapter.addYears(d, 10) : adapter.addYears(d, 1))}
            onPrevMonth={panelMode === 'date' ? () => navigateRight(d => adapter.addMonths(d, -1)) : undefined}
            onNextMonth={panelMode === 'date' ? () => navigateRight(d => adapter.addMonths(d, 1)) : undefined}
            showMonthNav={panelMode === 'date'}
            onTitleClick={panelMode !== 'year' ? handleTitleClick : undefined}
            styles={styles} classNames={classNames}
          />
          {renderPanel(rightViewDate, 'right')}
        </div>
      </div>
      <PanelFooter
        showToday={false}
        showNow={false}
        showOk={false}
        presets={panelMode === pickerProp ? presets as any : undefined}
        renderExtraFooter={panelMode === pickerProp ? renderExtraFooter : undefined}
        onPresetSelect={(val: any) => handlePresetSelect(val)}
        styles={styles} classNames={classNames}
      />
    </div>
  )

  const finalPanel = panelRender ? panelRender(panelContent) : panelContent

  const suffix = suffixProp !== undefined ? suffixProp : (
    <span style={{ color: tokens.colorTextMuted, display: 'flex' }}>
      <CalendarIcon />
    </span>
  )

  const inputStyle: CSSProperties = {
    flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent',
    fontSize: sc.inputFontSize, fontFamily: 'inherit', color: statusBorderColor ?? tokens.colorText,
    cursor: anyDisabled ? 'not-allowed' : undefined,
    padding: 0, textAlign: 'center',
  }

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block' }, styles?.root, style)}
    >
      {/* Input row */}
      <div
        ref={inputWrapRef}
        className={classNames?.input}
        onClick={() => { if (!anyDisabled && !isOpen) { setOpen(true); setActiveInput('start') } }}
        style={mergeSemanticStyle({
          display: 'flex', alignItems: 'center', gap: '0.25rem',
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
        {prefix && <span style={{ display: 'flex', color: tokens.colorTextMuted, flexShrink: 0 }}>{prefix}</span>}
        <input
          ref={startInputRef}
          value={formatDate(currentValue[0])}
          placeholder={defaultPlaceholders[0]}
          readOnly={inputReadOnly}
          disabled={disabledStart}
          onFocus={() => { setActiveInput('start'); if (!isOpen) setOpen(true) }}
          style={{
            ...inputStyle,
            fontWeight: isOpen && activeInput === 'start' ? 600 : 400,
          }}
          onChange={() => {}}
        />
        <span style={{ display: 'flex', color: tokens.colorTextMuted, flexShrink: 0 }}>
          {separator ?? <SeparatorIcon />}
        </span>
        <input
          ref={endInputRef}
          value={formatDate(currentValue[1])}
          placeholder={defaultPlaceholders[1]}
          readOnly={inputReadOnly}
          disabled={disabledEnd}
          onFocus={() => { setActiveInput('end'); if (!isOpen) setOpen(true) }}
          style={{
            ...inputStyle,
            fontWeight: isOpen && activeInput === 'end' ? 600 : 400,
          }}
          onChange={() => {}}
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
          {finalPanel}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const DatePicker = Object.assign(DatePickerComponent, {
  RangePicker: RangePickerComponent,
})
