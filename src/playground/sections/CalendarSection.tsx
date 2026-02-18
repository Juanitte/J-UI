import { useState } from 'react'
import { Calendar, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic (Fullscreen) ──────────────────────────────────────────────────────

function BasicDemo() {
  return <Calendar />
}

// ─── 2. Card Mode ───────────────────────────────────────────────────────────────

function CardDemo() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Calendar fullscreen={false} />
      <Calendar fullscreen={false} mode="year" />
    </div>
  )
}

// ─── 3. Controlled Value ────────────────────────────────────────────────────────

function ControlledDemo() {
  const [value, setValue] = useState<Date>(new Date())

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Selected: {value.toLocaleDateString()}
      </Text>
      <Calendar
        value={value}
        onChange={(date) => setValue(date)}
        fullscreen={false}
      />
    </div>
  )
}

// ─── 4. Year Mode ───────────────────────────────────────────────────────────────

function YearModeDemo() {
  return <Calendar mode="year" />
}

// ─── 5. Mode Switching ──────────────────────────────────────────────────────────

function ModeSwitchDemo() {
  const [mode, setMode] = useState<'month' | 'year'>('month')

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Current mode: {mode}
      </Text>
      <Calendar
        mode={mode}
        onPanelChange={(_date, newMode) => setMode(newMode)}
      />
    </div>
  )
}

// ─── 6. Show Week Numbers ───────────────────────────────────────────────────────

function ShowWeekDemo() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Calendar fullscreen={false} showWeek />
    </div>
  )
}

// ─── 7. Valid Range ─────────────────────────────────────────────────────────────

function ValidRangeDemo() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0)

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Range: {start.toLocaleDateString()} – {end.toLocaleDateString()}
      </Text>
      <Calendar validRange={[start, end]} fullscreen={false} />
    </div>
  )
}

// ─── 8. Disabled Dates ──────────────────────────────────────────────────────────

function DisabledDatesDemo() {
  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Weekends disabled
      </Text>
      <Calendar
        fullscreen={false}
        disabledDate={(date: Date) => {
          const day = date.getDay()
          return day === 0 || day === 6
        }}
      />
    </div>
  )
}

// ─── 9. Custom Cell Render (Spanning Events) ────────────────────────────────────

const SPAN_EVENTS = [
  { name: 'Sprint Planning', start: 3, end: 5, color: tokens.colorPrimary },
  { name: 'Conference', start: 8, end: 12, color: tokens.colorSuccess },
  { name: 'Vacation', start: 15, end: 20, color: tokens.colorWarning },
  { name: 'Release', start: 22, end: 24, color: tokens.colorError },
]

function CustomCellRenderDemo() {
  const now = new Date()
  const viewMonth = now.getMonth()

  return (
    <Calendar
      cellRender={(date: Date, info) => {
        if (info.type !== 'date') return info.originNode
        if (date.getMonth() !== viewMonth) return null

        const day = date.getDate()
        const hits = SPAN_EVENTS.filter(ev => day >= ev.start && day <= ev.end)
        if (hits.length === 0) return null

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {hits.map((ev) => {
              const isStart = day === ev.start
              const isEnd = day === ev.end
              return (
                <div
                  key={ev.name}
                  style={{
                    height: 20,
                    backgroundColor: ev.color,
                    color: '#fff',
                    fontSize: '0.625rem',
                    lineHeight: '20px',
                    paddingLeft: isStart ? 6 : 0,
                    borderRadius: `${isStart ? 4 : 0}px ${isEnd ? 4 : 0}px ${isEnd ? 4 : 0}px ${isStart ? 4 : 0}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {isStart ? ev.name : '\u00A0'}
                </div>
              )
            })}
          </div>
        )
      }}
    />
  )
}

// ─── 10. Custom Header Render ───────────────────────────────────────────────────

function CustomHeaderDemo() {
  return (
    <Calendar
      fullscreen={false}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const year = value.getFullYear()
        const month = value.toLocaleString('default', { month: 'long' })

        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            borderBottom: `1px solid ${tokens.colorBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  const d = new Date(value)
                  d.setMonth(d.getMonth() - 1)
                  onChange(d)
                }}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: tokens.colorTextMuted, fontSize: 16,
                }}
              >
                ‹
              </button>
              <Text weight="semibold" size="sm">{month} {year}</Text>
              <button
                type="button"
                onClick={() => {
                  const d = new Date(value)
                  d.setMonth(d.getMonth() + 1)
                  onChange(d)
                }}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: tokens.colorTextMuted, fontSize: 16,
                }}
              >
                ›
              </button>
            </div>
            <button
              type="button"
              onClick={() => onTypeChange(type === 'month' ? 'year' : 'month')}
              style={{
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: 4,
                padding: '2px 8px',
                backgroundColor: tokens.colorBg,
                color: tokens.colorText,
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
            >
              {type === 'month' ? 'Year View' : 'Month View'}
            </button>
          </div>
        )
      }}
    />
  )
}

// ─── 11. Semantic Styles ────────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <Calendar
      fullscreen={false}
      styles={{
        root: { borderColor: tokens.colorPrimary },
        header: { backgroundColor: tokens.colorPrimaryBg },
      }}
    />
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export function CalendarSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Calendar</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A calendar panel for displaying and selecting dates, with fullscreen and card modes.
      </Text>

      <Section title="Basic (Fullscreen)" align="start">
        <BasicDemo />
      </Section>

      <Section title="Card Mode" align="start">
        <CardDemo />
      </Section>

      <Section title="Controlled Value" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Year Mode (Fullscreen)" align="start">
        <YearModeDemo />
      </Section>

      <Section title="Mode Switching" align="start">
        <ModeSwitchDemo />
      </Section>

      <Section title="Show Week Numbers" align="start">
        <ShowWeekDemo />
      </Section>

      <Section title="Valid Range" align="start">
        <ValidRangeDemo />
      </Section>

      <Section title="Disabled Dates" align="start">
        <DisabledDatesDemo />
      </Section>

      <Section title="Custom Cell Render (Spanning Events)" align="start">
        <CustomCellRenderDemo />
      </Section>

      <Section title="Custom Header Render" align="start">
        <CustomHeaderDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
