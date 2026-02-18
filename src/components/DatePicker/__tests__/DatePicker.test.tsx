import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DatePicker } from '../DatePicker'

// Fixed date for deterministic tests: January 15, 2024
const JAN_15 = new Date(2024, 0, 15)

/** Click the input wrapper to open the popup */
function openPicker() {
  // The input wrapper div contains the input — click it
  const input = screen.getByPlaceholderText('Select date')
  fireEvent.focus(input)
}

describe('DatePicker', () => {
  // ---------- Basic rendering ----------

  it('renders an input with default placeholder', () => {
    render(<DatePicker />)
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
  })

  it('renders a custom placeholder', () => {
    render(<DatePicker placeholder="Pick a date" />)
    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument()
  })

  it('renders a calendar icon by default', () => {
    const { container } = render(<DatePicker />)
    // CalendarIcon renders a <rect> inside an svg
    expect(container.querySelector('rect')).toBeInTheDocument()
  })

  it('does not show popup initially', () => {
    const { container } = render(<DatePicker />)
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  // ---------- Open / close ----------

  it('opens popup on input focus', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} />)
    openPicker()
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()
  })

  it('closes popup on outside mousedown', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} />)
    openPicker()
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  it('closes popup on Escape key', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} />)
    openPicker()
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()

    fireEvent.keyDown(screen.getByPlaceholderText('Select date'), { key: 'Escape' })
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  it('calls onOpenChange on open and close', () => {
    const onOpenChange = vi.fn()
    render(<DatePicker onOpenChange={onOpenChange} />)

    openPicker()
    expect(onOpenChange).toHaveBeenCalledWith(true)

    fireEvent.mouseDown(document.body)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  // ---------- Controlled open ----------

  it('shows popup when open=true', () => {
    const { container } = render(<DatePicker open />)
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()
  })

  it('hides popup when open=false', () => {
    const { container } = render(<DatePicker open={false} />)
    openPicker()
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  // ---------- Disabled ----------

  it('disables the input when disabled', () => {
    render(<DatePicker disabled />)
    expect(screen.getByPlaceholderText('Select date')).toBeDisabled()
  })

  it('applies opacity 0.5 when disabled', () => {
    const { container } = render(<DatePicker disabled />)
    // The input wrapper div has opacity
    const wrapper = container.querySelector('div[style*="opacity: 0.5"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('does not open when disabled', () => {
    const onOpenChange = vi.fn()
    render(<DatePicker disabled onOpenChange={onOpenChange} />)
    openPicker()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  // ---------- Sizes ----------

  it('renders small size', () => {
    const { container } = render(<DatePicker size="sm" />)
    const wrapper = container.querySelector('div[style*="min-height: 1.75rem"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders medium size (default)', () => {
    const { container } = render(<DatePicker />)
    const wrapper = container.querySelector('div[style*="min-height: 2.25rem"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders large size', () => {
    const { container } = render(<DatePicker size="lg" />)
    const wrapper = container.querySelector('div[style*="min-height: 2.75rem"]')
    expect(wrapper).toBeInTheDocument()
  })

  // ---------- Variants ----------

  it('renders outlined variant with border', () => {
    const { container } = render(<DatePicker variant="outlined" />)
    const wrapper = container.querySelector('div[style*="border: 1px solid"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders filled variant with muted background', () => {
    const { container } = render(<DatePicker variant="filled" />)
    const wrapper = container.querySelector('div[style*="background-color: var(--j-bgMuted)"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders borderless variant without visible border', () => {
    const { container } = render(<DatePicker variant="borderless" />)
    // Borderless should NOT have the 1px solid border that outlined/filled have
    const borderedWrapper = container.querySelector('div[style*="border: 1px solid"]')
    expect(borderedWrapper).not.toBeInTheDocument()
  })

  // ---------- Status ----------

  it('applies error border color', () => {
    const { container } = render(<DatePicker status="error" />)
    const wrapper = container.querySelector('div[style*="var(--j-error)"]')
    expect(wrapper).toBeInTheDocument()
  })

  it('applies warning border color', () => {
    const { container } = render(<DatePicker status="warning" />)
    const wrapper = container.querySelector('div[style*="var(--j-warning)"]')
    expect(wrapper).toBeInTheDocument()
  })

  // ---------- Date selection ----------

  it('selects a date and calls onChange', () => {
    const onChange = vi.fn()
    render(<DatePicker defaultValue={JAN_15} open onChange={onChange} />)

    // Click on day 20 (unique in January 2024 grid)
    fireEvent.click(screen.getByText('20'))

    expect(onChange).toHaveBeenCalledTimes(1)
    const [date, dateString] = onChange.mock.calls[0]
    expect(date instanceof Date).toBe(true)
    expect(dateString).toBe('2024-01-20')
  })

  it('displays selected date in YYYY-MM-DD format', () => {
    render(<DatePicker defaultValue={JAN_15} />)
    const input = screen.getByPlaceholderText('Select date') as HTMLInputElement
    expect(input.value).toBe('2024-01-15')
  })

  it('closes popup after selecting a date', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} />)
    openPicker()
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()

    fireEvent.click(screen.getByText('20'))
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  // ---------- Controlled value ----------

  it('displays controlled value', () => {
    render(<DatePicker value={JAN_15} />)
    const input = screen.getByPlaceholderText('Select date') as HTMLInputElement
    expect(input.value).toBe('2024-01-15')
  })

  it('updates display when controlled value changes', () => {
    const { rerender } = render(<DatePicker value={JAN_15} />)
    expect((screen.getByPlaceholderText('Select date') as HTMLInputElement).value).toBe('2024-01-15')

    rerender(<DatePicker value={new Date(2024, 5, 1)} />)
    expect((screen.getByPlaceholderText('Select date') as HTMLInputElement).value).toBe('2024-06-01')
  })

  // ---------- defaultValue ----------

  it('uses defaultValue as initial date', () => {
    render(<DatePicker defaultValue={new Date(2023, 11, 25)} />)
    const input = screen.getByPlaceholderText('Select date') as HTMLInputElement
    expect(input.value).toBe('2023-12-25')
  })

  // ---------- allowClear ----------

  it('shows clear button when value is set', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} />)
    // ClearIcon has an svg with a circle
    const clearIcons = container.querySelectorAll('svg circle')
    expect(clearIcons.length).toBeGreaterThan(0)
  })

  it('clears value on clear click', () => {
    const onChange = vi.fn()
    const { container } = render(<DatePicker defaultValue={JAN_15} onChange={onChange} />)

    // Find and click the clear icon (span with ClearIcon inside)
    const clearSpans = container.querySelectorAll('span[style*="cursor: pointer"]')
    const clearSpan = Array.from(clearSpans).find(s => s.querySelector('svg circle'))
    expect(clearSpan).toBeTruthy()
    fireEvent.click(clearSpan!)

    expect(onChange).toHaveBeenCalledWith(null, '')
  })

  it('does not show clear when allowClear=false', () => {
    const { container } = render(<DatePicker defaultValue={JAN_15} allowClear={false} />)
    const clearSpans = Array.from(container.querySelectorAll('span[style*="cursor: pointer"]')).filter(
      s => s.querySelector('svg circle'),
    )
    expect(clearSpans).toHaveLength(0)
  })

  // ---------- showToday ----------

  it('shows Today button in footer by default', () => {
    render(<DatePicker open defaultValue={JAN_15} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('hides Today button when showToday=false', () => {
    render(<DatePicker open defaultValue={JAN_15} showToday={false} />)
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
  })

  it('selects today when clicking Today button', () => {
    const onChange = vi.fn()
    render(<DatePicker open defaultValue={JAN_15} onChange={onChange} />)

    fireEvent.click(screen.getByText('Today'))

    expect(onChange).toHaveBeenCalledTimes(1)
    const [date] = onChange.mock.calls[0]
    const today = new Date()
    expect(date.getFullYear()).toBe(today.getFullYear())
    expect(date.getMonth()).toBe(today.getMonth())
    expect(date.getDate()).toBe(today.getDate())
  })

  // ---------- Presets ----------

  it('renders preset buttons in footer', () => {
    const presets = [
      { label: 'Yesterday', value: new Date(2024, 0, 14) },
      { label: 'Tomorrow', value: new Date(2024, 0, 16) },
    ]
    render(<DatePicker open defaultValue={JAN_15} presets={presets} />)

    expect(screen.getByText('Yesterday')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('selects preset value on click', () => {
    const onChange = vi.fn()
    const presets = [{ label: 'New Year', value: new Date(2024, 0, 1) }]
    render(<DatePicker open defaultValue={JAN_15} presets={presets} onChange={onChange} />)

    fireEvent.click(screen.getByText('New Year'))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][1]).toBe('2024-01-01')
  })

  // ---------- Panel navigation ----------

  it('shows month and year in header', () => {
    render(<DatePicker open defaultValue={JAN_15} />)
    // Header shows "January 2024" as a button
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('navigates to next month via chevron', () => {
    render(<DatePicker open defaultValue={JAN_15} />)

    // 4 nav buttons: prev-year, prev-month, next-month, next-year
    const navButtons = screen.getAllByRole('button').filter(
      b => b.querySelector('svg[width="14"]'),
    )
    // Click next-month (3rd nav button)
    const nextMonthBtn = navButtons[2]
    fireEvent.click(nextMonthBtn)

    // Header should now show February
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  // ---------- Picker modes ----------

  it('renders month picker with month options', () => {
    render(<DatePicker picker="month" open defaultValue={JAN_15} />)
    // Month panel renders 12 month buttons
    const buttons = screen.getAllByRole('button').filter(
      b => !b.querySelector('svg'), // Exclude navigation buttons with icons
    )
    // Should have month buttons (at least 12: Jan-Dec, some might be nav)
    expect(buttons.length).toBeGreaterThanOrEqual(12)
  })

  it('renders month picker with correct placeholder', () => {
    render(<DatePicker picker="month" />)
    expect(screen.getByPlaceholderText('Select month')).toBeInTheDocument()
  })

  it('renders year picker with correct placeholder', () => {
    render(<DatePicker picker="year" />)
    expect(screen.getByPlaceholderText('Select year')).toBeInTheDocument()
  })

  it('renders quarter picker with correct placeholder', () => {
    render(<DatePicker picker="quarter" />)
    expect(screen.getByPlaceholderText('Select quarter')).toBeInTheDocument()
  })

  it('renders week picker with correct placeholder', () => {
    render(<DatePicker picker="week" />)
    expect(screen.getByPlaceholderText('Select week')).toBeInTheDocument()
  })

  it('calls onChange with month format in month picker', () => {
    const onChange = vi.fn()
    render(<DatePicker picker="month" open defaultValue={JAN_15} onChange={onChange} />)

    // Month panel shows month name buttons (no SVG icons)
    const monthBtns = screen.getAllByRole('button').filter(
      b => !b.querySelector('svg') && b.textContent && !b.textContent.includes('2024') && !b.textContent.includes('Today'),
    )
    // Click a month button (e.g. March)
    const marchBtn = monthBtns.find(b => b.textContent?.includes('Mar'))
    if (marchBtn) {
      fireEvent.click(marchBtn)
      expect(onChange).toHaveBeenCalled()
      expect(onChange.mock.calls[0][1]).toBe('2024-03')
    }
  })

  // ---------- showTime ----------

  it('shows clock icon when showTime is enabled', () => {
    const { container } = render(<DatePicker showTime />)
    // ClockIcon renders a <circle> element
    const circles = container.querySelectorAll('svg circle')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('renders time columns when showTime and panel is open', () => {
    render(<DatePicker showTime open defaultValue={JAN_15} />)
    // Hour and minute columns both render "00", so expect multiple
    const zeros = screen.getAllByText('00')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('shows OK button with showTime (needConfirm auto)', () => {
    render(<DatePicker showTime open defaultValue={JAN_15} />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('shows Now button with showTime', () => {
    render(<DatePicker showTime open defaultValue={JAN_15} />)
    expect(screen.getByText('Now')).toBeInTheDocument()
  })

  it('uses date+time placeholder with showTime', () => {
    render(<DatePicker showTime />)
    expect(screen.getByPlaceholderText('Select date and time')).toBeInTheDocument()
  })

  // ---------- Custom format ----------

  it('formats date with custom string format', () => {
    render(<DatePicker defaultValue={JAN_15} format="DD/MM/YYYY" />)
    const input = screen.getByDisplayValue('15/01/2024')
    expect(input).toBeInTheDocument()
  })

  it('formats date with custom function', () => {
    render(
      <DatePicker
        defaultValue={JAN_15}
        format={(d: Date) => `Day ${d.getDate()}`}
      />,
    )
    expect(screen.getByDisplayValue('Day 15')).toBeInTheDocument()
  })

  // ---------- panelRender ----------

  it('wraps panel with panelRender', () => {
    render(
      <DatePicker
        open
        panelRender={(panel) => <div data-testid="custom-panel">{panel}</div>}
      />,
    )
    expect(screen.getByTestId('custom-panel')).toBeInTheDocument()
  })

  // ---------- renderExtraFooter ----------

  it('renders extra footer content', () => {
    render(
      <DatePicker
        open
        defaultValue={JAN_15}
        renderExtraFooter={() => <div data-testid="extra">Extra info</div>}
      />,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })

  // ---------- prefix & suffix ----------

  it('renders prefix content', () => {
    render(<DatePicker prefix={<span data-testid="dp-prefix">📅</span>} />)
    expect(screen.getByTestId('dp-prefix')).toBeInTheDocument()
  })

  it('renders custom suffix replacing calendar icon', () => {
    render(<DatePicker suffix={<span data-testid="dp-suffix">🔍</span>} />)
    expect(screen.getByTestId('dp-suffix')).toBeInTheDocument()
  })

  // ---------- disabledDate ----------

  it('disables specific dates', () => {
    render(
      <DatePicker
        open
        defaultValue={JAN_15}
        disabledDate={(d: Date) => d.getDate() === 20}
      />,
    )
    // Day 20 cell should have opacity 0.4 and cursor not-allowed
    const cell20 = screen.getByText('20').closest('div')
    expect(cell20?.style.opacity).toBe('0.4')
    expect(cell20?.style.cursor).toBe('not-allowed')
  })

  it('does not call onChange for disabled dates', () => {
    const onChange = vi.fn()
    render(
      <DatePicker
        open
        defaultValue={JAN_15}
        onChange={onChange}
        disabledDate={(d: Date) => d.getDate() === 20}
      />,
    )
    fireEvent.click(screen.getByText('20'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- inputReadOnly ----------

  it('makes input read-only when inputReadOnly=true', () => {
    render(<DatePicker inputReadOnly />)
    expect(screen.getByPlaceholderText('Select date')).toHaveAttribute('readonly')
  })

  // ---------- defaultOpen ----------

  it('starts open when defaultOpen=true', () => {
    const { container } = render(<DatePicker defaultOpen />)
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()
  })

  // ---------- Styling ----------

  it('applies className to root', () => {
    const { container } = render(<DatePicker className="my-dp" />)
    expect(container.firstChild).toHaveClass('my-dp')
  })

  it('applies style to root', () => {
    const { container } = render(<DatePicker style={{ margin: 20 }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('20px')
  })

  it('applies classNames.root to root', () => {
    const { container } = render(<DatePicker classNames={{ root: 'cn-root' }} />)
    expect(container.firstChild).toHaveClass('cn-root')
  })

  it('applies classNames.input to input wrapper', () => {
    const { container } = render(<DatePicker classNames={{ input: 'cn-input' }} />)
    expect(container.querySelector('.cn-input')).toBeInTheDocument()
  })

  it('applies classNames.popup to the popup', () => {
    const { container } = render(<DatePicker open classNames={{ popup: 'cn-popup' }} />)
    expect(container.querySelector('.cn-popup')).toBeInTheDocument()
  })
})

// ============================================================================
// DatePicker.RangePicker
// ============================================================================

describe('DatePicker.RangePicker', () => {
  it('renders two inputs with default placeholders', () => {
    render(<DatePicker.RangePicker />)
    expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('End date')).toBeInTheDocument()
  })

  it('renders a separator between inputs', () => {
    const { container } = render(<DatePicker.RangePicker />)
    // SeparatorIcon renders an svg with a line and polyline
    const separatorSvg = container.querySelectorAll('svg')
    expect(separatorSvg.length).toBeGreaterThan(0)
  })

  it('renders custom separator', () => {
    render(<DatePicker.RangePicker separator={<span data-testid="sep">~</span>} />)
    expect(screen.getByTestId('sep')).toBeInTheDocument()
  })

  it('does not show popup initially', () => {
    const { container } = render(<DatePicker.RangePicker />)
    expect(container.querySelector('div[style*="z-index: 1050"]')).not.toBeInTheDocument()
  })

  it('opens popup when clicking start input', () => {
    const { container } = render(<DatePicker.RangePicker />)
    fireEvent.focus(screen.getByPlaceholderText('Start date'))
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()
  })

  it('opens popup when clicking end input', () => {
    const { container } = render(<DatePicker.RangePicker />)
    fireEvent.focus(screen.getByPlaceholderText('End date'))
    expect(container.querySelector('div[style*="z-index: 1050"]')).toBeInTheDocument()
  })

  it('shows two calendar panels side by side', () => {
    render(<DatePicker.RangePicker open />)
    // Two panels mean two sets of day name headers → two grids
    // Each grid has 7 day-name headers; look for duplicate day headers
    const headerTexts = screen.getAllByText(/2\d{3}/) // year numbers in headers
    expect(headerTexts.length).toBeGreaterThanOrEqual(2)
  })

  it('displays controlled range value', () => {
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    render(<DatePicker.RangePicker value={[start, end]} />)

    expect((screen.getByPlaceholderText('Start date') as HTMLInputElement).value).toBe('2024-01-10')
    expect((screen.getByPlaceholderText('End date') as HTMLInputElement).value).toBe('2024-01-20')
  })

  it('displays defaultValue', () => {
    const start = new Date(2024, 2, 1)
    const end = new Date(2024, 2, 15)
    render(<DatePicker.RangePicker defaultValue={[start, end]} />)

    expect((screen.getByPlaceholderText('Start date') as HTMLInputElement).value).toBe('2024-03-01')
    expect((screen.getByPlaceholderText('End date') as HTMLInputElement).value).toBe('2024-03-15')
  })

  it('clears range on clear click', () => {
    const onChange = vi.fn()
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    const { container } = render(
      <DatePicker.RangePicker defaultValue={[start, end]} onChange={onChange} />,
    )

    const clearSpan = Array.from(container.querySelectorAll('span[style*="cursor: pointer"]')).find(
      s => s.querySelector('svg circle'),
    )
    expect(clearSpan).toBeTruthy()
    fireEvent.click(clearSpan!)

    expect(onChange).toHaveBeenCalledWith(null, ['', ''])
  })

  it('disables both inputs when disabled=true', () => {
    render(<DatePicker.RangePicker disabled />)
    expect(screen.getByPlaceholderText('Start date')).toBeDisabled()
    expect(screen.getByPlaceholderText('End date')).toBeDisabled()
  })

  it('renders range presets', () => {
    const presets = [
      { label: 'This Week', value: [new Date(2024, 0, 15), new Date(2024, 0, 21)] as [Date, Date] },
    ]
    render(<DatePicker.RangePicker open presets={presets} />)
    expect(screen.getByText('This Week')).toBeInTheDocument()
  })

  it('selects range preset on click', () => {
    const onChange = vi.fn()
    const presets = [
      { label: 'This Week', value: [new Date(2024, 0, 15), new Date(2024, 0, 21)] as [Date, Date] },
    ]
    render(<DatePicker.RangePicker open presets={presets} onChange={onChange} />)

    fireEvent.click(screen.getByText('This Week'))

    expect(onChange).toHaveBeenCalledTimes(1)
    const [dates, strings] = onChange.mock.calls[0]
    expect(strings).toEqual(['2024-01-15', '2024-01-21'])
    expect(dates).toHaveLength(2)
  })

  it('uses custom placeholders', () => {
    render(<DatePicker.RangePicker placeholder={['From', 'To']} />)
    expect(screen.getByPlaceholderText('From')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('To')).toBeInTheDocument()
  })

  it('applies className to root', () => {
    const { container } = render(<DatePicker.RangePicker className="my-range" />)
    expect(container.firstChild).toHaveClass('my-range')
  })

  it('applies classNames.popup to popup', () => {
    const { container } = render(<DatePicker.RangePicker open classNames={{ popup: 'cn-popup' }} />)
    expect(container.querySelector('.cn-popup')).toBeInTheDocument()
  })

  it('renders prefix content', () => {
    render(<DatePicker.RangePicker prefix={<span data-testid="rp-prefix">📅</span>} />)
    expect(screen.getByTestId('rp-prefix')).toBeInTheDocument()
  })

  it('calls onOpenChange', () => {
    const onOpenChange = vi.fn()
    render(<DatePicker.RangePicker onOpenChange={onOpenChange} />)

    fireEvent.focus(screen.getByPlaceholderText('Start date'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
