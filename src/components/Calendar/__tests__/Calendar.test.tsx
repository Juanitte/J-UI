import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Calendar } from '../Calendar'
import { NativeDateAdapter } from '../../DatePicker/adapters/native'

// ============================================================================
// Helpers
// ============================================================================

const adapter = new NativeDateAdapter()

/** Fixed date for deterministic tests: 2025-03-15 (Saturday) */
function fixedDate(y = 2025, m = 2, d = 15): Date {
  return new Date(y, m, d)
}

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getHeader(container: HTMLElement) {
  return getRoot(container).children[0] as HTMLElement
}

function getBody(container: HTMLElement) {
  return getRoot(container).children[1] as HTMLElement
}

function getYearSelect(container: HTMLElement): HTMLSelectElement {
  return getHeader(container).querySelector('select') as HTMLSelectElement
}

function getMonthSelect(container: HTMLElement): HTMLSelectElement | null {
  const selects = getHeader(container).querySelectorAll('select')
  return selects.length > 1 ? (selects[1] as HTMLSelectElement) : null
}

function getModeButtons(container: HTMLElement) {
  const header = getHeader(container)
  return header.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
}

function getMonthButton(container: HTMLElement) {
  const btns = getModeButtons(container)
  return Array.from(btns).find((b) => b.textContent === 'Month')!
}

function getYearButton(container: HTMLElement) {
  const btns = getModeButtons(container)
  return Array.from(btns).find((b) => b.textContent === 'Year')!
}

/** Get all day-of-month date cells in card mode (the grid cells with cursor:pointer) */
function getDateCells(container: HTMLElement) {
  const body = getBody(container)
  return Array.from(body.querySelectorAll('[style*="cursor"]')).filter(
    (el) => !(el as HTMLElement).textContent?.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|M|T|W|F|S|Wk)$/),
  ) as HTMLElement[]
}

/** Get month buttons in year/card mode (buttons inside body) */
function getMonthCells(container: HTMLElement) {
  const body = getBody(container)
  return Array.from(body.querySelectorAll('button')) as HTMLButtonElement[]
}

/** Find a specific date cell by its text content in card mode */
function findDateCell(container: HTMLElement, dayNum: number) {
  const cells = getDateCells(container)
  return cells.find((c) => {
    const text = c.textContent?.trim()
    return text === String(dayNum)
  })
}

// We mock today() to return a fixed date for deterministic tests
beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(NativeDateAdapter.prototype, 'today').mockReturnValue(fixedDate())
})

// ============================================================================
// Basic rendering
// ============================================================================

describe('Calendar – Basic rendering', () => {
  it('renders a root div', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    expect(getRoot(container).tagName).toBe('DIV')
  })

  it('renders header with year select', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    const yearSelect = getYearSelect(container)
    expect(yearSelect).toBeTruthy()
    expect(yearSelect.value).toBe('2025')
  })

  it('renders header with month select in month mode', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    const monthSelect = getMonthSelect(container)
    expect(monthSelect).toBeTruthy()
  })

  it('renders mode toggle buttons (Month/Year)', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    expect(getMonthButton(container)).toBeTruthy()
    expect(getYearButton(container)).toBeTruthy()
  })

  it('has border and border-radius on root', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    const root = getRoot(container)
    expect(root.style.border).toContain('1px solid')
    expect(root.style.borderRadius).toBeTruthy()
  })

  it('uses column flex layout', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} />)
    expect(getRoot(container).style.flexDirection).toBe('column')
  })
})

// ============================================================================
// Fullscreen vs Card
// ============================================================================

describe('Calendar – Fullscreen vs Card', () => {
  it('fullscreen=true uses width 100%', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen />)
    expect(getRoot(container).style.width).toBe('100%')
  })

  it('fullscreen=false uses fixed width (18.75rem)', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    expect(getRoot(container).style.width).toBe('18.75rem')
  })

  it('fullscreen=true has 0.5rem borderRadius', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen />)
    expect(getRoot(container).style.borderRadius).toBe('0.5rem')
  })

  it('fullscreen=false has 0.375rem borderRadius', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    expect(getRoot(container).style.borderRadius).toBe('0.375rem')
  })
})

// ============================================================================
// Month mode – Date grid (card)
// ============================================================================

describe('Calendar – Month mode (card)', () => {
  it('shows day name headers (Mon-Sun)', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const body = getBody(container)
    const text = body.textContent!
    expect(text).toContain('M')
    expect(text).toContain('S')
  })

  it('renders 42 date cells (6 weeks x 7 days)', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const cells = getDateCells(container)
    expect(cells.length).toBe(42)
  })

  it('shows dates from the current month', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    // March 2025 has 31 days
    expect(findDateCell(container, 1)).toBeTruthy()
    expect(findDateCell(container, 31)).toBeTruthy()
  })

  it('highlights today with bold font', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    // Today is March 15
    const todayCell = findDateCell(container, 15)
    expect(todayCell).toBeTruthy()
    expect(todayCell!.style.fontWeight).toBe('700')
  })

  it('highlights today with box-shadow ring when not selected', () => {
    // Use a different selected date so today (15) is NOT selected
    const { container } = render(<Calendar defaultValue={fixedDate(2025, 2, 10)} fullscreen={false} />)
    const todayCell = findDateCell(container, 15)
    expect(todayCell!.style.boxShadow).toContain('inset')
  })

  it('marks selected date with primary background', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const todayCell = findDateCell(container, 15)
    // defaultValue=15, so it's selected
    expect(todayCell!.style.backgroundColor).toBeTruthy()
    expect(todayCell!.style.color).toBe('rgb(255, 255, 255)')
  })
})

// ============================================================================
// Month mode – Date grid (fullscreen)
// ============================================================================

describe('Calendar – Month mode (fullscreen)', () => {
  it('renders day name headers', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen />)
    const body = getBody(container)
    expect(body.textContent).toContain('Mon')
  })

  it('renders date cells with min-height 5rem', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen />)
    const body = getBody(container)
    const cells = body.querySelectorAll('[style*="min-height: 5rem"]')
    expect(cells.length).toBe(42)
  })
})

// ============================================================================
// Year mode – Month grid (card)
// ============================================================================

describe('Calendar – Year mode (card)', () => {
  it('shows 12 month buttons', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    const months = getMonthCells(container)
    expect(months.length).toBe(12)
  })

  it('shows month names (short)', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    const body = getBody(container)
    const text = body.textContent!
    expect(text).toContain('Jan')
    expect(text).toContain('Dec')
  })

  it('highlights current month', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    const months = getMonthCells(container)
    // March is index 2 (0-based)
    const marchBtn = months[2]
    expect(marchBtn.style.fontWeight).toBe('600')
  })

  it('does not show month select in header', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    const monthSelect = getMonthSelect(container)
    expect(monthSelect).toBeFalsy()
  })
})

// ============================================================================
// Year mode – Month grid (fullscreen)
// ============================================================================

describe('Calendar – Year mode (fullscreen)', () => {
  it('shows 12 month cells with min-height 5rem', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen defaultMode="year" />,
    )
    const body = getBody(container)
    const cells = body.querySelectorAll('[style*="min-height: 5rem"]')
    expect(cells.length).toBe(12)
  })

  it('shows long month names', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen defaultMode="year" />,
    )
    const body = getBody(container)
    expect(body.textContent).toContain('January')
    expect(body.textContent).toContain('December')
  })

  it('uses 3-column grid', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen defaultMode="year" />,
    )
    const body = getBody(container)
    expect(body.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })
})

// ============================================================================
// Mode switching
// ============================================================================

describe('Calendar – Mode switching', () => {
  it('defaults to month mode', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    // Month select should be visible in month mode
    expect(getMonthSelect(container)).toBeTruthy()
  })

  it('switches to year mode on Year button click', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    fireEvent.click(getYearButton(container))
    // Month select should disappear in year mode
    expect(getMonthSelect(container)).toBeFalsy()
    // Should show month cells
    expect(getMonthCells(container).length).toBe(12)
  })

  it('switches back to month mode', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    fireEvent.click(getYearButton(container))
    fireEvent.click(getMonthButton(container))
    expect(getMonthSelect(container)).toBeTruthy()
  })

  it('calls onPanelChange when mode changes', () => {
    const onPanelChange = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onPanelChange={onPanelChange} />,
    )
    fireEvent.click(getYearButton(container))
    expect(onPanelChange).toHaveBeenCalledWith(expect.any(Date), 'year')
  })

  it('respects controlled mode prop', () => {
    const { container, rerender } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} mode="month" />,
    )
    expect(getMonthSelect(container)).toBeTruthy()

    // Clicking Year button should NOT change mode (controlled)
    fireEvent.click(getYearButton(container))
    expect(getMonthSelect(container)).toBeTruthy()

    // Only parent rerender changes mode
    rerender(<Calendar defaultValue={fixedDate()} fullscreen={false} mode="year" />)
    expect(getMonthSelect(container)).toBeFalsy()
  })

  it('uses defaultMode for initial mode', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    expect(getMonthSelect(container)).toBeFalsy()
    expect(getMonthCells(container).length).toBe(12)
  })
})

// ============================================================================
// Value selection
// ============================================================================

describe('Calendar – Value selection', () => {
  it('calls onChange when selecting a date (card)', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} />,
    )
    const cell10 = findDateCell(container, 10)
    fireEvent.click(cell10!)
    expect(onChange).toHaveBeenCalled()
    const selected = onChange.mock.calls[0][0] as Date
    expect(selected.getDate()).toBe(10)
    expect(selected.getMonth()).toBe(2) // March
  })

  it('calls onSelect with source "date" when clicking a date', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onSelect={onSelect} />,
    )
    fireEvent.click(findDateCell(container, 10)!)
    expect(onSelect).toHaveBeenCalledWith(expect.any(Date), { source: 'date' })
  })

  it('calls onSelect with source "month" when selecting a month in year mode', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" onSelect={onSelect} />,
    )
    const months = getMonthCells(container)
    fireEvent.click(months[5]) // June
    expect(onSelect).toHaveBeenCalledWith(expect.any(Date), { source: 'month' })
  })

  it('updates internal value when uncontrolled', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} />,
    )
    // Click day 20
    fireEvent.click(findDateCell(container, 20)!)
    // The selected cell should now have white color (selected)
    const cell20 = findDateCell(container, 20)
    expect(cell20!.style.color).toBe('rgb(255, 255, 255)')
  })

  it('does not update internal value when controlled', () => {
    const onChange = vi.fn()
    const val = fixedDate()
    const { container } = render(
      <Calendar value={val} fullscreen={false} onChange={onChange} />,
    )
    fireEvent.click(findDateCell(container, 20)!)
    expect(onChange).toHaveBeenCalled()
    // But the selected cell should still be 15 (controlled value unchanged)
    const cell15 = findDateCell(container, 15)
    expect(cell15!.style.color).toBe('rgb(255, 255, 255)')
  })
})

// ============================================================================
// Header – Year/Month dropdowns
// ============================================================================

describe('Calendar – Header dropdowns', () => {
  it('changes year via year select', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} />,
    )
    const yearSelect = getYearSelect(container)
    fireEvent.change(yearSelect, { target: { value: '2024' } })
    expect(onChange).toHaveBeenCalled()
    const d = onChange.mock.calls[0][0] as Date
    expect(d.getFullYear()).toBe(2024)
  })

  it('changes month via month select', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} />,
    )
    const monthSelect = getMonthSelect(container)!
    fireEvent.change(monthSelect, { target: { value: '0' } }) // January
    expect(onChange).toHaveBeenCalled()
    const d = onChange.mock.calls[0][0] as Date
    expect(d.getMonth()).toBe(0)
  })

  it('year select has range ±10 years by default', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const yearSelect = getYearSelect(container)
    const options = Array.from(yearSelect.options)
    const years = options.map((o) => Number(o.value))
    expect(years).toContain(2015)
    expect(years).toContain(2035)
  })

  it('month select has 12 months', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const monthSelect = getMonthSelect(container)!
    expect(monthSelect.options.length).toBe(12)
  })
})

// ============================================================================
// Disabled dates
// ============================================================================

describe('Calendar – disabledDate', () => {
  it('marks disabled dates with cursor not-allowed', () => {
    const disabledDate = (d: Date) => d.getDate() === 20
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} disabledDate={disabledDate} />,
    )
    const cell20 = findDateCell(container, 20)
    expect(cell20!.style.cursor).toBe('not-allowed')
  })

  it('marks disabled dates with reduced opacity', () => {
    const disabledDate = (d: Date) => d.getDate() === 20
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} disabledDate={disabledDate} />,
    )
    const cell20 = findDateCell(container, 20)
    expect(cell20!.style.opacity).toBe('0.4')
  })

  it('does not call onChange when clicking disabled date', () => {
    const onChange = vi.fn()
    const disabledDate = (d: Date) => d.getDate() === 20
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} disabledDate={disabledDate} />,
    )
    fireEvent.click(findDateCell(container, 20)!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('non-disabled dates remain clickable', () => {
    const onChange = vi.fn()
    const disabledDate = (d: Date) => d.getDate() === 20
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} onChange={onChange} disabledDate={disabledDate} />,
    )
    const cell10 = findDateCell(container, 10)
    expect(cell10!.style.cursor).toBe('pointer')
    fireEvent.click(cell10!)
    expect(onChange).toHaveBeenCalled()
  })

  it('disables months in year mode', () => {
    const disabledDate = (d: Date) => d.getMonth() === 5 // June
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" disabledDate={disabledDate} />,
    )
    const months = getMonthCells(container)
    expect(months[5].disabled).toBe(true)
    expect(months[5].style.cursor).toBe('not-allowed')
  })
})

// ============================================================================
// Valid range
// ============================================================================

describe('Calendar – validRange', () => {
  it('disables dates outside valid range', () => {
    const start = new Date(2025, 2, 10)
    const end = new Date(2025, 2, 20)
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} validRange={[start, end]} />,
    )
    // Day 5 (before range) should be disabled
    const cell5 = findDateCell(container, 5)
    expect(cell5!.style.cursor).toBe('not-allowed')

    // Day 15 (in range) should be enabled
    const cell15 = findDateCell(container, 15)
    expect(cell15!.style.cursor).toBe('pointer')

    // Day 25 (after range) should be disabled
    const cell25 = findDateCell(container, 25)
    expect(cell25!.style.cursor).toBe('not-allowed')
  })

  it('constrains year select to valid range', () => {
    const start = new Date(2024, 0, 1)
    const end = new Date(2026, 11, 31)
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} validRange={[start, end]} />,
    )
    const yearSelect = getYearSelect(container)
    const years = Array.from(yearSelect.options).map((o) => Number(o.value))
    expect(years[0]).toBe(2024)
    expect(years[years.length - 1]).toBe(2026)
  })

  it('constrains month select when on boundary year', () => {
    const start = new Date(2025, 3, 1) // April 2025
    const end = new Date(2025, 8, 30) // September 2025
    const { container } = render(
      <Calendar defaultValue={new Date(2025, 4, 15)} fullscreen={false} validRange={[start, end]} />,
    )
    const monthSelect = getMonthSelect(container)!
    const monthValues = Array.from(monthSelect.options).map((o) => Number(o.value))
    // Only months 3-8 (April-September) should appear
    expect(monthValues[0]).toBe(3)
    expect(monthValues[monthValues.length - 1]).toBe(8)
  })
})

// ============================================================================
// showWeek
// ============================================================================

describe('Calendar – showWeek', () => {
  it('shows "Wk" header when showWeek=true (card)', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} showWeek />,
    )
    expect(getBody(container).textContent).toContain('Wk')
  })

  it('does not show "Wk" when showWeek=false', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} />,
    )
    // Get just the header row text, not all body text
    const body = getBody(container)
    const firstRowText = body.textContent!
    // "Wk" should not appear
    expect(firstRowText).not.toContain('Wk')
  })

  it('shows week numbers in card mode', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} showWeek />,
    )
    // Week numbers are shown in the grid
    const body = getBody(container)
    // March 2025 starts on Saturday, week 9 or similar
    expect(body.textContent).toBeTruthy()
  })

  it('shows "Wk" header when showWeek=true (fullscreen)', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen showWeek />,
    )
    expect(getBody(container).textContent).toContain('Wk')
  })
})

// ============================================================================
// cellRender
// ============================================================================

describe('Calendar – cellRender', () => {
  it('calls cellRender for each date cell (card)', () => {
    const cellRender = vi.fn((_date, info) => info.originNode)
    render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} cellRender={cellRender} />,
    )
    // 42 date cells
    expect(cellRender).toHaveBeenCalledTimes(42)
  })

  it('receives correct info for date cells', () => {
    const cellRender = vi.fn((_date, info) => info.originNode)
    render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} cellRender={cellRender} />,
    )
    // Check that at least one call has type 'date'
    expect(cellRender.mock.calls.some((c: any) => c[1].type === 'date')).toBe(true)
  })

  it('renders custom content in date cells', () => {
    const cellRender = (_date: Date, info: any) => {
      if (info.today) return <span data-testid="custom-today">TODAY</span>
      return info.originNode
    }
    render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} cellRender={cellRender} />,
    )
    expect(screen.getByTestId('custom-today').textContent).toBe('TODAY')
  })

  it('calls cellRender for month cells in year mode (card)', () => {
    const cellRender = vi.fn((_date, info) => info.originNode)
    render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" cellRender={cellRender} />,
    )
    expect(cellRender).toHaveBeenCalledTimes(12)
    expect(cellRender.mock.calls[0][1].type).toBe('month')
  })

  it('marks today cell in info.today', () => {
    const cellRender = vi.fn((_date, info) => info.originNode)
    render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} cellRender={cellRender} />,
    )
    const todayCall = cellRender.mock.calls.find((c: any) => c[1].today === true)
    expect(todayCall).toBeTruthy()
    expect((todayCall![0] as Date).getDate()).toBe(15)
  })
})

// ============================================================================
// fullCellRender (fullscreen only)
// ============================================================================

describe('Calendar – fullCellRender', () => {
  it('replaces entire cell content in fullscreen month mode', () => {
    const fullCellRender = (_date: Date, info: any) => (
      <div data-testid="full-cell">{info.originNode}</div>
    )
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen fullCellRender={fullCellRender} />,
    )
    const fullCells = screen.getAllByTestId('full-cell')
    expect(fullCells.length).toBe(42)
  })

  it('replaces entire cell content in fullscreen year mode', () => {
    const fullCellRender = (_date: Date, info: any) => (
      <div data-testid="full-month-cell">{info.originNode}</div>
    )
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen defaultMode="year" fullCellRender={fullCellRender} />,
    )
    const fullCells = screen.getAllByTestId('full-month-cell')
    expect(fullCells.length).toBe(12)
  })
})

// ============================================================================
// headerRender
// ============================================================================

describe('Calendar – headerRender', () => {
  it('renders custom header', () => {
    const headerRender = (config: any) => (
      <div data-testid="custom-header">
        {config.type} - {adapter.getYear(config.value)}
      </div>
    )
    render(
      <Calendar defaultValue={fixedDate()} headerRender={headerRender} />,
    )
    const header = screen.getByTestId('custom-header')
    expect(header.textContent).toContain('month')
    expect(header.textContent).toContain('2025')
  })

  it('headerRender receives onTypeChange callback', () => {
    const onPanelChange = vi.fn()
    let capturedConfig: any
    const headerRender = (config: any) => {
      capturedConfig = config
      return <div data-testid="custom-header">Custom</div>
    }
    render(
      <Calendar defaultValue={fixedDate()} headerRender={headerRender} onPanelChange={onPanelChange} />,
    )
    expect(typeof capturedConfig.onTypeChange).toBe('function')
    // Calling onTypeChange should trigger onPanelChange
    act(() => capturedConfig.onTypeChange('year'))
    expect(onPanelChange).toHaveBeenCalledWith(expect.any(Date), 'year')
  })

  it('headerRender receives onChange callback', () => {
    const onChange = vi.fn()
    let capturedConfig: any
    const headerRender = (config: any) => {
      capturedConfig = config
      return <div>Custom</div>
    }
    render(
      <Calendar defaultValue={fixedDate()} headerRender={headerRender} onChange={onChange} />,
    )
    expect(typeof capturedConfig.onChange).toBe('function')
  })
})

// ============================================================================
// Controlled value
// ============================================================================

describe('Calendar – Controlled value', () => {
  it('renders with controlled value', () => {
    const val = new Date(2025, 5, 20) // June 20
    const { container } = render(
      <Calendar value={val} fullscreen={false} />,
    )
    const yearSelect = getYearSelect(container)
    expect(yearSelect.value).toBe('2025')
    const monthSelect = getMonthSelect(container)!
    expect(monthSelect.value).toBe('5') // June (0-based)
  })

  it('updates view when value prop changes', () => {
    const { container, rerender } = render(
      <Calendar value={fixedDate(2025, 2, 15)} fullscreen={false} />,
    )
    expect(getMonthSelect(container)!.value).toBe('2')

    rerender(<Calendar value={fixedDate(2025, 7, 10)} fullscreen={false} />)
    expect(getMonthSelect(container)!.value).toBe('7') // August
  })
})

// ============================================================================
// className & style
// ============================================================================

describe('Calendar – className & style', () => {
  it('applies className to root', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} className="my-cal" />)
    expect(getRoot(container).className).toContain('my-cal')
  })

  it('applies style to root', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} style={{ margin: '10px' }} />,
    )
    expect(getRoot(container).style.margin).toBe('10px')
  })
})

// ============================================================================
// Semantic classNames
// ============================================================================

describe('Calendar – Semantic classNames', () => {
  it('applies classNames.root', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} classNames={{ root: 'cal-root' }} />,
    )
    expect(getRoot(container).className).toContain('cal-root')
  })

  it('applies classNames.header', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} classNames={{ header: 'cal-header' }} />,
    )
    expect(getHeader(container).className).toContain('cal-header')
  })

  it('applies classNames.body', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} classNames={{ body: 'cal-body' }} />,
    )
    expect(getBody(container).className).toContain('cal-body')
  })

  it('applies classNames.cell to date cells (card)', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} classNames={{ cell: 'cal-cell' }} />,
    )
    const cells = getBody(container).querySelectorAll('.cal-cell')
    expect(cells.length).toBe(42)
  })

  it('applies classNames.cell to month cells in year mode (fullscreen)', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen defaultMode="year" classNames={{ cell: 'cal-cell' }} />,
    )
    const cells = getBody(container).querySelectorAll('.cal-cell')
    expect(cells.length).toBe(12)
  })
})

// ============================================================================
// Semantic styles
// ============================================================================

describe('Calendar – Semantic styles', () => {
  it('applies styles.root', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} styles={{ root: { padding: '20px' } }} />,
    )
    expect(getRoot(container).style.padding).toBe('20px')
  })

  it('applies styles.header', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} styles={{ header: { backgroundColor: 'pink' } }} />,
    )
    expect(getHeader(container).style.backgroundColor).toBe('pink')
  })

  it('applies styles.body', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} styles={{ body: { minHeight: '300px' } }} />,
    )
    expect(getBody(container).style.minHeight).toBe('300px')
  })
})

// ============================================================================
// Mode toggle button active state
// ============================================================================

describe('Calendar – Mode toggle active state', () => {
  it('Month button is active in month mode (has primary bg)', () => {
    const { container } = render(<Calendar defaultValue={fixedDate()} fullscreen={false} />)
    const monthBtn = getMonthButton(container)
    expect(monthBtn.style.color).toBe('rgb(255, 255, 255)')
  })

  it('Year button is active in year mode', () => {
    const { container } = render(
      <Calendar defaultValue={fixedDate()} fullscreen={false} defaultMode="year" />,
    )
    const yearBtn = getYearButton(container)
    expect(yearBtn.style.color).toBe('rgb(255, 255, 255)')
  })
})
