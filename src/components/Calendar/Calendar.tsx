import {
  type ReactNode, type CSSProperties,
  useState, useEffect, useCallback, useMemo, useContext, createContext,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import type { DateAdapter } from '../DatePicker/adapters/types'
import { NativeDateAdapter } from '../DatePicker/adapters/native'

// ============================================================================
// Types
// ============================================================================

export type CalendarMode = 'month' | 'year'

export type CalendarSemanticSlot = 'root' | 'header' | 'body' | 'cell'
export type CalendarClassNames = SemanticClassNames<CalendarSemanticSlot>
export type CalendarStyles = SemanticStyles<CalendarSemanticSlot>

export interface CalendarHeaderConfig<TDate = any> {
  value: TDate
  type: CalendarMode
  onChange: (date: TDate) => void
  onTypeChange: (type: CalendarMode) => void
}

export interface CalendarCellRenderInfo {
  originNode: ReactNode
  today: boolean
  type: 'date' | 'month'
}

export interface CalendarSelectInfo {
  source: 'year' | 'month' | 'date' | 'customize'
}

export interface CalendarProps<TDate = any> {
  value?: TDate
  defaultValue?: TDate
  fullscreen?: boolean
  mode?: CalendarMode
  defaultMode?: CalendarMode
  showWeek?: boolean
  headerRender?: (config: CalendarHeaderConfig<TDate>) => ReactNode
  cellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  fullCellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  validRange?: [TDate, TDate]
  disabledDate?: (date: TDate) => boolean
  onChange?: (date: TDate) => void
  onPanelChange?: (date: TDate, mode: CalendarMode) => void
  onSelect?: (date: TDate, info: CalendarSelectInfo) => void
  adapter?: DateAdapter<TDate>
  className?: string
  style?: CSSProperties
  classNames?: CalendarClassNames
  styles?: CalendarStyles
}

// ============================================================================
// Adapter Context
// ============================================================================

const defaultAdapter = new NativeDateAdapter()
const CalendarAdapterContext = createContext<DateAdapter | null>(null)

export function CalendarAdapterProvider({ adapter, children }: {
  adapter: DateAdapter
  children: ReactNode
}) {
  return <CalendarAdapterContext.Provider value={adapter}>{children}</CalendarAdapterContext.Provider>
}

function useDateAdapter(propAdapter?: DateAdapter): DateAdapter {
  const ctx = useContext(CalendarAdapterContext)
  return propAdapter ?? ctx ?? defaultAdapter
}

// ============================================================================
// SVG Icons
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 3.5 5 6.5 8 3.5" />
    </svg>
  )
}

// ============================================================================
// Utilities
// ============================================================================

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

function isDateInValidRange<TDate>(
  adapter: DateAdapter<TDate>,
  date: TDate,
  validRange?: [TDate, TDate],
  disabledDate?: (d: TDate) => boolean,
): boolean {
  if (disabledDate?.(date)) return true
  if (validRange) {
    const [start, end] = validRange
    if (adapter.isBefore(date, start) || adapter.isAfter(date, end)) return true
  }
  return false
}

function clampToValidRange<TDate>(
  adapter: DateAdapter<TDate>,
  date: TDate,
  validRange?: [TDate, TDate],
): TDate {
  if (!validRange) return date
  const [start, end] = validRange
  if (adapter.isBefore(date, start)) return adapter.clone(start)
  if (adapter.isAfter(date, end)) return adapter.clone(end)
  return date
}

// ============================================================================
// Internal: CalendarDefaultHeader
// ============================================================================

function CalendarDefaultHeader<TDate>({
  adapter,
  value,
  mode,
  onValueChange,
  onModeChange,
  validRange,
  fullscreen,
  styles: semanticStyles,
  classNames: semanticClassNames,
}: {
  adapter: DateAdapter<TDate>
  value: TDate
  mode: CalendarMode
  onValueChange: (date: TDate) => void
  onModeChange: (mode: CalendarMode) => void
  validRange?: [TDate, TDate]
  fullscreen: boolean
  styles?: CalendarStyles
  classNames?: CalendarClassNames
}) {
  const currentYear = adapter.getYear(value)
  const currentMonth = adapter.getMonth(value)

  // Year range
  const minYear = validRange ? adapter.getYear(validRange[0]) : currentYear - 10
  const maxYear = validRange ? adapter.getYear(validRange[1]) : currentYear + 10
  const years: number[] = []
  for (let y = minYear; y <= maxYear; y++) years.push(y)

  // Month range (constrained by validRange if same year)
  const months: number[] = []
  const monthNames = adapter.getMonthNames('long')
  for (let m = 0; m < 12; m++) {
    if (validRange) {
      const startYear = adapter.getYear(validRange[0])
      const endYear = adapter.getYear(validRange[1])
      const startMonth = adapter.getMonth(validRange[0])
      const endMonth = adapter.getMonth(validRange[1])
      if (currentYear === startYear && m < startMonth) continue
      if (currentYear === endYear && m > endMonth) continue
    }
    months.push(m)
  }

  const selectWrapStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  }

  const selectStyle: CSSProperties = {
    appearance: 'none',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.375rem',
    backgroundColor: tokens.colorBg,
    color: tokens.colorText,
    fontSize: fullscreen ? '0.875rem' : '0.8125rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    padding: fullscreen ? '0.25rem 1.75rem 0.25rem 0.5rem' : '0.125rem 1.5rem 0.125rem 0.375rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  }

  const selectArrowStyle: CSSProperties = {
    position: 'absolute',
    right: '0.375rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: tokens.colorTextMuted,
    display: 'flex',
    alignItems: 'center',
  }

  const toggleBtnBase: CSSProperties = {
    border: `1px solid ${tokens.colorBorder}`,
    padding: fullscreen ? '0.25rem 0.75rem' : '0.125rem 0.5rem',
    fontSize: fullscreen ? '0.8125rem' : '0.75rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
  }

  return (
    <div
      className={semanticClassNames?.header}
      style={mergeSemanticStyle(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          padding: fullscreen ? '0.75rem 1rem' : '0.5rem 0.75rem',
          borderBottom: `1px solid ${tokens.colorBorder}`,
        },
        semanticStyles?.header,
      )}
    >
      {/* Year select */}
      <div style={selectWrapStyle}>
        <select
          style={selectStyle}
          value={currentYear}
          onChange={(e) => {
            const newYear = Number(e.target.value)
            let newDate = adapter.setYear(adapter.clone(value), newYear)
            newDate = clampToValidRange(adapter, newDate, validRange)
            onValueChange(newDate)
          }}
          onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorPrimary }}
          onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <span style={selectArrowStyle}><ChevronDownIcon /></span>
      </div>

      {/* Month select (only in month mode) */}
      {mode === 'month' && (
        <div style={selectWrapStyle}>
          <select
            style={selectStyle}
            value={currentMonth}
            onChange={(e) => {
              const newMonth = Number(e.target.value)
              let newDate = adapter.setMonth(adapter.clone(value), newMonth)
              newDate = clampToValidRange(adapter, newDate, validRange)
              onValueChange(newDate)
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorPrimary }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder }}
          >
            {months.map(m => (
              <option key={m} value={m}>{monthNames[m]}</option>
            ))}
          </select>
          <span style={selectArrowStyle}><ChevronDownIcon /></span>
        </div>
      )}

      {/* Mode toggle */}
      <div style={{ display: 'inline-flex' }}>
        <button
          type="button"
          onClick={() => onModeChange('month')}
          style={{
            ...toggleBtnBase,
            borderRadius: '0.375rem 0 0 0.375rem',
            borderRight: 'none',
            backgroundColor: mode === 'month' ? tokens.colorPrimary : tokens.colorBg,
            color: mode === 'month' ? '#fff' : tokens.colorText,
            borderColor: mode === 'month' ? tokens.colorPrimary : tokens.colorBorder,
          }}
          onMouseEnter={(e) => {
            if (mode !== 'month') (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
          }}
          onMouseLeave={(e) => {
            if (mode !== 'month') (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBg
          }}
        >
          Month
        </button>
        <button
          type="button"
          onClick={() => onModeChange('year')}
          style={{
            ...toggleBtnBase,
            borderRadius: '0 0.375rem 0.375rem 0',
            backgroundColor: mode === 'year' ? tokens.colorPrimary : tokens.colorBg,
            color: mode === 'year' ? '#fff' : tokens.colorText,
            borderColor: mode === 'year' ? tokens.colorPrimary : tokens.colorBorder,
          }}
          onMouseEnter={(e) => {
            if (mode !== 'year') (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
          }}
          onMouseLeave={(e) => {
            if (mode !== 'year') (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBg
          }}
        >
          Year
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Internal: CalendarDateGridCard (card month view)
// ============================================================================

function CalendarDateGridCard<TDate>({
  adapter, viewDate, value, onSelect, disabledDate, cellRender, showWeek,
  styles: semanticStyles, classNames: semanticClassNames,
}: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  cellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  showWeek?: boolean
  styles?: CalendarStyles
  classNames?: CalendarClassNames
}) {
  const year = adapter.getYear(viewDate)
  const month = adapter.getMonth(viewDate)
  const today = adapter.today()
  const grid = generateMonthGrid(adapter, year, month, 1)
  const dayNames = adapter.getDayNames('narrow')
  const orderedDays = [...dayNames.slice(1), dayNames[0]]

  const CELL_SIZE = '2rem'
  const CIRCLE_SIZE = '1.75rem'

  const gridCols = showWeek ? `1.5rem repeat(7, ${CELL_SIZE})` : `repeat(7, ${CELL_SIZE})`

  return (
    <div
      className={semanticClassNames?.body}
      style={mergeSemanticStyle({ padding: '0 0.5rem 0.5rem', display: 'flex', justifyContent: 'center', flex: 1 }, semanticStyles?.body)}
    >
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gridAutoRows: CELL_SIZE, placeItems: 'center' }}>
        {/* Week header placeholder */}
        {showWeek && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600, color: tokens.colorTextSubtle }}>
            Wk
          </div>
        )}
        {/* Day names header */}
        {orderedDays.map((name, i) => (
          <div key={`h-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: CELL_SIZE, height: CELL_SIZE, fontSize: '0.75rem', fontWeight: 600, color: tokens.colorTextMuted }}>
            {name}
          </div>
        ))}
        {/* Date cells */}
        {grid.map((week, rowIdx) => {
          const weekCells: ReactNode[] = []

          if (showWeek) {
            const weekNum = adapter.getWeekNumber(week[0])
            weekCells.push(
              <div key={`wk-${rowIdx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', color: tokens.colorTextSubtle }}>
                {weekNum}
              </div>
            )
          }

          week.forEach((date, colIdx) => {
            const inView = adapter.isSameMonth(date, viewDate)
            const isToday = adapter.isSameDay(date, today)
            const isSelected = value && adapter.isValid(value) && adapter.isSameDay(date, value)
            const disabled = disabledDate?.(date) ?? false

            const cellStyle: CSSProperties = {
              display: 'grid', placeContent: 'center',
              width: CIRCLE_SIZE, height: CIRCLE_SIZE,
              fontSize: '0.8125rem', borderRadius: '50%',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: isSelected ? '#fff'
                : disabled ? tokens.colorTextSubtle
                  : !inView ? tokens.colorTextSubtle
                    : tokens.colorText,
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              fontWeight: isToday ? 700 : 400,
              boxShadow: isToday && !isSelected ? `inset 0 0 0 1.5px ${tokens.colorPrimary}` : 'none',
              transition: 'background-color 0.1s ease, color 0.1s ease',
              opacity: disabled ? 0.4 : 1,
            }

            const originNode = <span style={{ lineHeight: 0 }}>{adapter.getDate(date)}</span>
            const content = cellRender
              ? cellRender(date, { type: 'date', originNode, today: isToday })
              : originNode

            weekCells.push(
              <div
                key={`${rowIdx}-${colIdx}`}
                style={cellStyle}
                className={semanticClassNames?.cell}
                onClick={() => { if (!disabled) onSelect(date) }}
                onMouseEnter={(e) => {
                  if (!disabled && !isSelected) {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
                  }
                }}
                onMouseLeave={(e) => {
                  if (!disabled && !isSelected) {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }
                }}
              >
                {content}
              </div>
            )
          })

          return weekCells
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Internal: CalendarMonthGridCard (card year view)
// ============================================================================

function CalendarMonthGridCard<TDate>({
  adapter, viewDate, value, onSelect, disabledDate, cellRender,
  styles: semanticStyles, classNames: semanticClassNames,
}: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  cellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  styles?: CalendarStyles
  classNames?: CalendarClassNames
}) {
  const monthNames = adapter.getMonthNames('short')
  const today = adapter.today()
  const currentYear = adapter.getYear(viewDate)

  return (
    <div
      className={semanticClassNames?.body}
      style={mergeSemanticStyle(
        { padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', flex: 1, alignContent: 'center' },
        semanticStyles?.body,
      )}
    >
      {monthNames.map((name, monthIdx) => {
        const date = adapter.setMonth(adapter.setDate(adapter.setYear(adapter.today(), currentYear), 1), monthIdx)
        const isCurrentMonth = adapter.isSameMonth(date, today)
        const isSelected = value && adapter.isValid(value) && adapter.isSameMonth(date, value) && adapter.isSameYear(date, value)
        const disabled = disabledDate?.(date) ?? false

        const originNode = <span>{name}</span>
        const content = cellRender
          ? cellRender(date, { type: 'month', originNode, today: isCurrentMonth })
          : originNode

        return (
          <button
            key={monthIdx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(date)}
            className={semanticClassNames?.cell}
            style={{
              height: '2.5rem',
              border: isCurrentMonth && !isSelected ? `1px solid ${tokens.colorPrimary}` : '1px solid transparent',
              borderRadius: '0.375rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              color: isSelected ? '#fff' : disabled ? tokens.colorTextSubtle : tokens.colorText,
              fontSize: '0.8125rem',
              fontWeight: isCurrentMonth ? 600 : 400,
              fontFamily: 'inherit',
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
// Internal: CalendarDateGrid (fullscreen month view)
// ============================================================================

function CalendarDateGrid<TDate>({
  adapter, viewDate, value, onSelect, disabledDate, cellRender, fullCellRender, showWeek,
  styles: semanticStyles, classNames: semanticClassNames,
}: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  cellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  fullCellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  showWeek?: boolean
  styles?: CalendarStyles
  classNames?: CalendarClassNames
}) {
  const year = adapter.getYear(viewDate)
  const month = adapter.getMonth(viewDate)
  const today = adapter.today()
  const grid = generateMonthGrid(adapter, year, month, 1)
  const dayNames = adapter.getDayNames('short')
  const orderedDays = [...dayNames.slice(1), dayNames[0]]


  const gridCols = showWeek ? `2.5rem repeat(7, 1fr)` : 'repeat(7, 1fr)'

  return (
    <div
      className={semanticClassNames?.body}
      style={mergeSemanticStyle({ overflow: 'hidden' }, semanticStyles?.body)}
    >
      {/* Day names header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        borderBottom: `1px solid ${tokens.colorBorder}`,
      }}>
        {showWeek && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0.5rem 0',
            fontSize: '0.75rem', fontWeight: 600, color: tokens.colorTextSubtle,
            borderRight: `1px solid ${tokens.colorBorder}`,
          }}>
            Wk
          </div>
        )}
        {orderedDays.map((name, i) => (
          <div key={`h-${i}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem', fontWeight: 600, color: tokens.colorTextMuted,
            borderRight: i < orderedDays.length - 1 ? `1px solid ${tokens.colorBorder}` : 'none',
          }}>
            {name}
          </div>
        ))}
      </div>

      {/* Date grid */}
      {grid.map((week, rowIdx) => (
        <div key={`row-${rowIdx}`} style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          borderBottom: rowIdx < grid.length - 1 ? `1px solid ${tokens.colorBorder}` : 'none',
        }}>
          {/* Week number */}
          {showWeek && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: '0.5rem 0',
              fontSize: '0.75rem', color: tokens.colorTextSubtle,
              borderRight: `1px solid ${tokens.colorBorder}`,
            }}>
              {adapter.getWeekNumber(week[0])}
            </div>
          )}
          {/* Day cells */}
          {week.map((date, colIdx) => {
            const inView = adapter.isSameMonth(date, viewDate)
            const isToday = adapter.isSameDay(date, today)
            const isSelected = value && adapter.isValid(value) && adapter.isSameDay(date, value)
            const disabled = disabledDate?.(date) ?? false

            const dateNumber = adapter.getDate(date)
            const originNode = <span>{dateNumber}</span>

            const info: CalendarCellRenderInfo = { type: 'date', originNode, today: isToday }

            // fullCellRender replaces entire cell
            if (fullCellRender) {
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={semanticClassNames?.cell}
                  style={{
                    minHeight: '5rem',
                    borderRight: colIdx < 6 ? `1px solid ${tokens.colorBorder}` : 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.4 : 1,
                  }}
                  onClick={() => { if (!disabled) onSelect(date) }}
                >
                  {fullCellRender(date, info)}
                </div>
              )
            }

            const dateNumStyle: CSSProperties = {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              fontSize: '0.875rem',
              fontWeight: isToday ? 700 : 400,
              backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
              color: isSelected ? '#fff' : !inView ? tokens.colorTextSubtle : tokens.colorText,
              boxShadow: isToday && !isSelected ? `inset 0 0 0 1.5px ${tokens.colorPrimary}` : 'none',
              transition: 'background-color 0.1s ease',
            }

            const customContent = cellRender ? cellRender(date, info) : null

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={semanticClassNames?.cell}
                style={{
                  minHeight: '5rem',
                  paddingTop: '0.25rem',
                  paddingBottom: '0.25rem',
                  borderRight: colIdx < 6 ? `1px solid ${tokens.colorBorder}` : 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s ease',
                  opacity: disabled ? 0.4 : 1,
                  backgroundColor: isSelected ? tokens.colorPrimaryBg : 'transparent',
                  overflow: 'hidden',
                }}
                onClick={() => { if (!disabled) onSelect(date) }}
                onMouseEnter={(e) => {
                  if (!disabled && !isSelected) {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgSubtle
                  }
                }}
                onMouseLeave={(e) => {
                  if (!disabled) {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = isSelected ? tokens.colorPrimaryBg : 'transparent'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0.5rem', marginBottom: '0.25rem' }}>
                  <span style={dateNumStyle}>{dateNumber}</span>
                </div>
                {customContent && (
                  <div style={{ fontSize: '0.75rem' }}>
                    {customContent}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Internal: CalendarMonthGrid (fullscreen year view)
// ============================================================================

function CalendarMonthGrid<TDate>({
  adapter, viewDate, value, onSelect, disabledDate, cellRender, fullCellRender,
  styles: semanticStyles, classNames: semanticClassNames,
}: {
  adapter: DateAdapter<TDate>
  viewDate: TDate
  value: TDate | null
  onSelect: (date: TDate) => void
  disabledDate?: (date: TDate) => boolean
  cellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  fullCellRender?: (current: TDate, info: CalendarCellRenderInfo) => ReactNode
  styles?: CalendarStyles
  classNames?: CalendarClassNames
}) {
  const monthNames = adapter.getMonthNames('long')
  const today = adapter.today()
  const currentYear = adapter.getYear(viewDate)

  return (
    <div
      className={semanticClassNames?.body}
      style={mergeSemanticStyle(
        {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          overflow: 'hidden',
        },
        semanticStyles?.body,
      )}
    >
      {monthNames.map((name, monthIdx) => {
        const date = adapter.setMonth(adapter.setDate(adapter.setYear(adapter.today(), currentYear), 1), monthIdx)
        const isCurrentMonth = adapter.isSameMonth(date, today)
        const isSelected = value && adapter.isValid(value) && adapter.isSameMonth(date, value) && adapter.isSameYear(date, value)
        const disabled = disabledDate?.(date) ?? false

        const originNode = <span>{name}</span>
        const info: CalendarCellRenderInfo = { type: 'month', originNode, today: isCurrentMonth }

        if (fullCellRender) {
          return (
            <div
              key={monthIdx}
              className={semanticClassNames?.cell}
              style={{
                minHeight: '5rem',
                borderRight: (monthIdx % 3) < 2 ? `1px solid ${tokens.colorBorder}` : 'none',
                borderBottom: monthIdx < 9 ? `1px solid ${tokens.colorBorder}` : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
              }}
              onClick={() => { if (!disabled) onSelect(date) }}
            >
              {fullCellRender(date, info)}
            </div>
          )
        }

        const nameStyle: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.125rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: isCurrentMonth ? 600 : 400,
          backgroundColor: isSelected ? tokens.colorPrimary : 'transparent',
          color: isSelected ? '#fff' : tokens.colorText,
          boxShadow: isCurrentMonth && !isSelected ? `inset 0 0 0 1.5px ${tokens.colorPrimary}` : 'none',
          transition: 'background-color 0.1s ease',
        }

        const customContent = cellRender ? cellRender(date, info) : null

        return (
          <div
            key={monthIdx}
            className={semanticClassNames?.cell}
            style={{
              minHeight: '5rem',
              padding: '0.5rem 0.75rem',
              borderRight: (monthIdx % 3) < 2 ? `1px solid ${tokens.colorBorder}` : 'none',
              borderBottom: monthIdx < 9 ? `1px solid ${tokens.colorBorder}` : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              opacity: disabled ? 0.4 : 1,
            }}
            onClick={() => { if (!disabled) onSelect(date) }}
            onMouseEnter={(e) => {
              if (!disabled) {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgSubtle
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={{ marginBottom: '0.25rem' }}>
              <span style={nameStyle}>{name}</span>
            </div>
            {customContent && (
              <div style={{ fontSize: '0.75rem' }}>
                {customContent}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

function CalendarComponent<TDate = any>({
  value: propValue,
  defaultValue,
  fullscreen = true,
  mode: propMode,
  defaultMode = 'month',
  showWeek = false,
  headerRender,
  cellRender,
  fullCellRender,
  validRange,
  disabledDate,
  onChange,
  onPanelChange,
  onSelect,
  adapter: propAdapter,
  className,
  style,
  classNames: semanticClassNames,
  styles: semanticStyles,
}: CalendarProps<TDate>) {
  const adapter = useDateAdapter(propAdapter)

  // Controlled/uncontrolled value
  const [internalValue, setInternalValue] = useState<TDate>(() => {
    const initial = propValue ?? defaultValue ?? adapter.today()
    return validRange ? clampToValidRange(adapter, initial, validRange) : initial
  })
  const currentValue = propValue !== undefined ? propValue : internalValue

  // Controlled/uncontrolled mode
  const [internalMode, setInternalMode] = useState<CalendarMode>(propMode ?? defaultMode)
  const currentMode = propMode !== undefined ? propMode : internalMode

  // View date (what year/month the calendar is showing)
  const [viewDate, setViewDate] = useState<TDate>(currentValue)

  // Sync viewDate when value changes externally
  useEffect(() => {
    if (propValue !== undefined) {
      setViewDate(propValue)
    }
  }, [propValue])

  // Compute disabled function combining disabledDate + validRange
  const computedDisabledDate = useMemo(() => {
    if (!disabledDate && !validRange) return undefined
    return (date: TDate) => isDateInValidRange(adapter, date, validRange, disabledDate)
  }, [adapter, disabledDate, validRange])

  // Handle date selection
  const handleSelect = useCallback((date: TDate, source: CalendarSelectInfo['source']) => {
    const clamped = validRange ? clampToValidRange(adapter, date, validRange) : date
    if (propValue === undefined) setInternalValue(clamped)
    setViewDate(clamped)
    onChange?.(clamped)
    onSelect?.(clamped, { source })
  }, [adapter, onChange, onSelect, propValue, validRange])

  // Handle mode change
  const handleModeChange = useCallback((newMode: CalendarMode) => {
    if (propMode === undefined) setInternalMode(newMode)
    onPanelChange?.(currentValue, newMode)
  }, [currentValue, onPanelChange, propMode])

  // Handle value change from header (year/month dropdowns)
  const handleHeaderValueChange = useCallback((date: TDate) => {
    setViewDate(date)
    if (propValue === undefined) setInternalValue(date)
    onChange?.(date)
    const source: CalendarSelectInfo['source'] =
      adapter.getMonth(date) !== adapter.getMonth(currentValue) ? 'month' : 'year'
    onSelect?.(date, { source })
  }, [adapter, currentValue, onChange, onSelect, propValue])

  // Root styles
  const rootStyle = mergeSemanticStyle(
    {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: tokens.colorBg,
      border: `1px solid ${tokens.colorBorder}`,
      borderRadius: fullscreen ? '0.5rem' : '0.375rem',
      overflow: 'hidden',
      fontFamily: 'inherit',
      ...(fullscreen ? {
        width: '100%',
      } : {
        width: '18.75rem',
      }),
    },
    semanticStyles?.root,
    style,
  )

  // Render header
  const header = headerRender
    ? headerRender({
        value: currentValue,
        type: currentMode,
        onChange: handleHeaderValueChange,
        onTypeChange: handleModeChange,
      })
    : (
        <CalendarDefaultHeader
          adapter={adapter}
          value={viewDate}
          mode={currentMode}
          onValueChange={handleHeaderValueChange}
          onModeChange={handleModeChange}
          validRange={validRange}
          fullscreen={fullscreen}
          styles={semanticStyles}
          classNames={semanticClassNames}
        />
      )

  // Render body
  let body: ReactNode
  if (currentMode === 'month') {
    body = fullscreen
      ? <CalendarDateGrid adapter={adapter} viewDate={viewDate} value={currentValue}
          onSelect={(d) => handleSelect(d, 'date')} disabledDate={computedDisabledDate}
          cellRender={cellRender} fullCellRender={fullCellRender}
          showWeek={showWeek} styles={semanticStyles} classNames={semanticClassNames} />
      : <CalendarDateGridCard adapter={adapter} viewDate={viewDate} value={currentValue}
          onSelect={(d) => handleSelect(d, 'date')} disabledDate={computedDisabledDate}
          cellRender={cellRender} showWeek={showWeek}
          styles={semanticStyles} classNames={semanticClassNames} />
  } else {
    body = fullscreen
      ? <CalendarMonthGrid adapter={adapter} viewDate={viewDate} value={currentValue}
          onSelect={(d) => handleSelect(d, 'month')} disabledDate={computedDisabledDate}
          cellRender={cellRender} fullCellRender={fullCellRender}
          styles={semanticStyles} classNames={semanticClassNames} />
      : <CalendarMonthGridCard adapter={adapter} viewDate={viewDate} value={currentValue}
          onSelect={(d) => handleSelect(d, 'month')} disabledDate={computedDisabledDate}
          cellRender={cellRender}
          styles={semanticStyles} classNames={semanticClassNames} />
  }

  return (
    <div
      className={mergeSemanticClassName(className, semanticClassNames?.root)}
      style={rootStyle}
    >
      {header}
      {body}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Calendar = CalendarComponent
