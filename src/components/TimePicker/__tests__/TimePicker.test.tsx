import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimePicker } from '../TimePicker'

// ============================================================================
// Helpers
// ============================================================================

/** Mock scrollTo which jsdom doesn't support */
beforeEach(() => {
  Element.prototype.scrollTo = vi.fn()
})

/** Build a Date at a specific time (today) */
function makeTime(h: number, m: number, s = 0): Date {
  const d = new Date()
  d.setHours(h, m, s, 0)
  return d
}

/** Open the popup by clicking the input area */
function openPopup() {
  const input = screen.getByPlaceholderText('Select time')
  fireEvent.focus(input)
}

/** Get all column containers inside the popup */
function getColumns(container: HTMLElement) {
  return container.querySelectorAll('.j-tp-col')
}

/** Get all buttons inside a specific column */
function getColumnButtons(col: Element) {
  return col.querySelectorAll('button')
}

/** Get the popup panel — it's the absolutely positioned div below root */
function getPopup(container: HTMLElement) {
  // Root > input-wrap + popup. Popup has position: absolute
  const root = container.firstElementChild as HTMLElement
  return root.querySelector('[style*="z-index"]') as HTMLElement | null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('TimePicker – Basic rendering', () => {
  it('renders an input with default placeholder', () => {
    render(<TimePicker />)
    expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<TimePicker placeholder="Pick a time" />)
    expect(screen.getByPlaceholderText('Pick a time')).toBeInTheDocument()
  })

  it('renders clock suffix icon by default', () => {
    const { container } = render(<TimePicker />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('sets id on root', () => {
    const { container } = render(<TimePicker id="tp-1" />)
    expect(container.querySelector('#tp-1')).toBeTruthy()
  })

  it('does not render popup by default', () => {
    const { container } = render(<TimePicker />)
    expect(getPopup(container)).toBeNull()
  })
})

// ============================================================================
// Open / close popup
// ============================================================================

describe('TimePicker – Open / close', () => {
  it('opens popup on input focus', () => {
    const { container } = render(<TimePicker />)
    openPopup()
    expect(getPopup(container)).toBeTruthy()
  })

  it('opens popup with defaultOpen', () => {
    const { container } = render(<TimePicker defaultOpen />)
    expect(getPopup(container)).toBeTruthy()
  })

  it('opens popup with controlled open prop', () => {
    const { container } = render(<TimePicker open />)
    expect(getPopup(container)).toBeTruthy()
  })

  it('closes popup on click outside', () => {
    const { container } = render(<TimePicker />)
    openPopup()
    expect(getPopup(container)).toBeTruthy()
    fireEvent.mouseDown(document.body)
    expect(getPopup(container)).toBeNull()
  })

  it('closes popup on Escape key', () => {
    const { container } = render(<TimePicker />)
    openPopup()
    expect(getPopup(container)).toBeTruthy()
    fireEvent.keyDown(screen.getByPlaceholderText('Select time'), { key: 'Escape' })
    expect(getPopup(container)).toBeNull()
  })

  it('calls onOpenChange when opening', () => {
    const onOpenChange = vi.fn()
    render(<TimePicker onOpenChange={onOpenChange} />)
    openPopup()
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('calls onOpenChange when closing', () => {
    const onOpenChange = vi.fn()
    render(<TimePicker onOpenChange={onOpenChange} />)
    openPopup()
    fireEvent.mouseDown(document.body)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

// ============================================================================
// Controlled & uncontrolled value
// ============================================================================

describe('TimePicker – Value', () => {
  it('displays defaultValue formatted', () => {
    render(<TimePicker defaultValue={makeTime(14, 30)} />)
    expect(screen.getByDisplayValue('14:30')).toBeInTheDocument()
  })

  it('displays controlled value', () => {
    render(<TimePicker value={makeTime(9, 5)} />)
    expect(screen.getByDisplayValue('09:05')).toBeInTheDocument()
  })

  it('displays empty when value is null', () => {
    render(<TimePicker value={null} />)
    expect(screen.getByPlaceholderText('Select time')).toHaveValue('')
  })

  it('updates display when controlled value changes', () => {
    const { rerender } = render(<TimePicker value={makeTime(8, 0)} />)
    expect(screen.getByDisplayValue('08:00')).toBeInTheDocument()
    rerender(<TimePicker value={makeTime(16, 45)} />)
    expect(screen.getByDisplayValue('16:45')).toBeInTheDocument()
  })
})

// ============================================================================
// Format
// ============================================================================

describe('TimePicker – Format', () => {
  it('uses HH:mm by default', () => {
    render(<TimePicker value={makeTime(9, 5)} />)
    expect(screen.getByDisplayValue('09:05')).toBeInTheDocument()
  })

  it('uses HH:mm:ss format', () => {
    render(<TimePicker value={makeTime(14, 30, 45)} format="HH:mm:ss" />)
    expect(screen.getByDisplayValue('14:30:45')).toBeInTheDocument()
  })

  it('uses 12-hour format when use12Hours is true', () => {
    render(<TimePicker value={makeTime(14, 30)} use12Hours />)
    expect(screen.getByDisplayValue('02:30 PM')).toBeInTheDocument()
  })

  it('uses custom format hh:mm A', () => {
    render(<TimePicker value={makeTime(9, 15)} format="hh:mm A" />)
    expect(screen.getByDisplayValue('09:15 AM')).toBeInTheDocument()
  })

  it('formats midnight in 12h as 12:00 AM', () => {
    render(<TimePicker value={makeTime(0, 0)} use12Hours />)
    expect(screen.getByDisplayValue('12:00 AM')).toBeInTheDocument()
  })

  it('formats noon in 12h as 12:00 PM', () => {
    render(<TimePicker value={makeTime(12, 0)} use12Hours />)
    expect(screen.getByDisplayValue('12:00 PM')).toBeInTheDocument()
  })
})

// ============================================================================
// Sizes
// ============================================================================

describe('TimePicker – Sizes', () => {
  it('applies sm size height', () => {
    const { container } = render(<TimePicker size="sm" />)
    // Input wrapper is the second child div inside root (the click area)
    const inputWrap = container.querySelector('[style*="height"]') as HTMLElement
    expect(inputWrap.style.height).toBe('1.75rem')
  })

  it('applies md size height (default)', () => {
    const { container } = render(<TimePicker />)
    const inputWrap = container.querySelector('[style*="height"]') as HTMLElement
    expect(inputWrap.style.height).toBe('2.25rem')
  })

  it('applies lg size height', () => {
    const { container } = render(<TimePicker size="lg" />)
    const inputWrap = container.querySelector('[style*="height"]') as HTMLElement
    expect(inputWrap.style.height).toBe('2.75rem')
  })
})

// ============================================================================
// Variants
// ============================================================================

describe('TimePicker – Variants', () => {
  it('uses outlined variant by default (has border)', () => {
    const { container } = render(<TimePicker />)
    const inputWrap = container.querySelector('[style*="border"]') as HTMLElement
    expect(inputWrap.style.border).toContain('1px solid')
  })

  it('uses borderless variant (no visible border)', () => {
    const { container } = render(<TimePicker variant="borderless" />)
    const root = container.firstElementChild as HTMLElement
    const inputWrap = root.children[0] as HTMLElement
    // jsdom serializes border:'none' as 'medium'; verify it does NOT contain a '1px solid' border
    expect(inputWrap.style.border).not.toContain('1px solid')
  })

  it('uses filled variant (has background)', () => {
    const { container } = render(<TimePicker variant="filled" />)
    const inputWrap = container.querySelector('[style*="background-color"]') as HTMLElement
    expect(inputWrap.style.backgroundColor).toContain('var(--j-bgMuted)')
  })
})

// ============================================================================
// Status
// ============================================================================

describe('TimePicker – Status', () => {
  it('applies error border color', () => {
    const { container } = render(<TimePicker status="error" />)
    const inputWrap = container.querySelector('[style*="border"]') as HTMLElement
    expect(inputWrap.style.border).toContain('var(--j-error)')
  })

  it('applies warning border color', () => {
    const { container } = render(<TimePicker status="warning" />)
    const inputWrap = container.querySelector('[style*="border"]') as HTMLElement
    expect(inputWrap.style.border).toContain('var(--j-warning)')
  })
})

// ============================================================================
// Disabled
// ============================================================================

describe('TimePicker – Disabled', () => {
  it('disables the input', () => {
    render(<TimePicker disabled />)
    expect(screen.getByPlaceholderText('Select time')).toBeDisabled()
  })

  it('applies not-allowed cursor', () => {
    const { container } = render(<TimePicker disabled />)
    const inputWrap = container.querySelector('[style*="cursor"]') as HTMLElement
    expect(inputWrap.style.cursor).toBe('not-allowed')
  })

  it('applies opacity 0.5', () => {
    const { container } = render(<TimePicker disabled />)
    const inputWrap = container.querySelector('[style*="opacity"]') as HTMLElement
    expect(inputWrap.style.opacity).toBe('0.5')
  })

  it('does not open popup when disabled', () => {
    const { container } = render(<TimePicker disabled />)
    fireEvent.focus(screen.getByPlaceholderText('Select time'))
    expect(getPopup(container)).toBeNull()
  })
})

// ============================================================================
// AllowClear
// ============================================================================

describe('TimePicker – AllowClear', () => {
  it('shows clear icon when value exists', () => {
    const { container } = render(<TimePicker defaultValue={makeTime(10, 0)} />)
    // Clear icon is an SVG with cross lines
    const svgs = container.querySelectorAll('svg')
    // There should be at least 2: clock icon + clear icon
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  it('clears value on clear click', () => {
    const onChange = vi.fn()
    const { container } = render(<TimePicker defaultValue={makeTime(10, 0)} onChange={onChange} />)
    // Find clear icon span (the one with cursor: pointer before the suffix)
    const clearSpans = container.querySelectorAll('span[style*="cursor: pointer"]')
    const clearSpan = clearSpans[0]
    fireEvent.click(clearSpan)
    expect(onChange).toHaveBeenCalledWith(null, '')
  })

  it('does not show clear icon when allowClear is false', () => {
    const { container } = render(<TimePicker defaultValue={makeTime(10, 0)} allowClear={false} />)
    // Only clock icon SVG
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(1)
  })

  it('does not show clear icon when disabled', () => {
    const { container } = render(<TimePicker defaultValue={makeTime(10, 0)} disabled />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(1) // Only clock icon
  })
})

// ============================================================================
// Column panel interaction
// ============================================================================

describe('TimePicker – Column selection', () => {
  it('renders hour and minute columns in popup (default format HH:mm)', () => {
    const { container } = render(<TimePicker defaultOpen />)
    const cols = getColumns(container)
    expect(cols).toHaveLength(2) // hour + minute
  })

  it('renders 3 columns with HH:mm:ss format', () => {
    const { container } = render(<TimePicker defaultOpen format="HH:mm:ss" />)
    const cols = getColumns(container)
    expect(cols).toHaveLength(3) // hour + minute + second
  })

  it('renders 3 columns with use12Hours (hour + minute + ampm)', () => {
    const { container } = render(<TimePicker defaultOpen use12Hours />)
    const cols = getColumns(container)
    expect(cols).toHaveLength(3) // hour + minute + ampm
  })

  it('renders hour column with 24 items (0-23)', () => {
    const { container } = render(<TimePicker defaultOpen />)
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    expect(hourBtns).toHaveLength(24)
    expect(hourBtns[0].textContent).toBe('00')
    expect(hourBtns[23].textContent).toBe('23')
  })

  it('renders minute column with 60 items (0-59)', () => {
    const { container } = render(<TimePicker defaultOpen />)
    const cols = getColumns(container)
    const minuteBtns = getColumnButtons(cols[1])
    expect(minuteBtns).toHaveLength(60)
    expect(minuteBtns[0].textContent).toBe('00')
    expect(minuteBtns[59].textContent).toBe('59')
  })

  it('renders 12 hours for use12Hours (1-12)', () => {
    const { container } = render(<TimePicker defaultOpen use12Hours />)
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    expect(hourBtns).toHaveLength(12)
    expect(hourBtns[0].textContent).toBe('01')
    expect(hourBtns[11].textContent).toBe('12')
  })

  it('renders AM/PM column for use12Hours', () => {
    const { container } = render(<TimePicker defaultOpen use12Hours />)
    const cols = getColumns(container)
    const ampmBtns = getColumnButtons(cols[2])
    expect(ampmBtns).toHaveLength(2)
    expect(ampmBtns[0].textContent).toBe('AM')
    expect(ampmBtns[1].textContent).toBe('PM')
  })

  it('selects hour on button click (needConfirm=false)', () => {
    const onChange = vi.fn()
    const { container } = render(<TimePicker defaultOpen needConfirm={false} onChange={onChange} />)
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    fireEvent.click(hourBtns[14]) // Click "14"
    expect(onChange).toHaveBeenCalled()
    const [date] = onChange.mock.calls[0]
    expect(date.getHours()).toBe(14)
  })

  it('selects minute on button click (needConfirm=false)', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimePicker defaultOpen needConfirm={false} defaultValue={makeTime(10, 0)} onChange={onChange} />,
    )
    const cols = getColumns(container)
    const minuteBtns = getColumnButtons(cols[1])
    fireEvent.click(minuteBtns[30]) // Click "30"
    expect(onChange).toHaveBeenCalled()
    const [date] = onChange.mock.calls[0]
    expect(date.getMinutes()).toBe(30)
  })
})

// ============================================================================
// Steps
// ============================================================================

describe('TimePicker – Steps', () => {
  it('renders hours with step 2', () => {
    const { container } = render(<TimePicker defaultOpen hourStep={2} />)
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    expect(hourBtns).toHaveLength(12) // 0,2,4,6,8,10,12,14,16,18,20,22
    expect(hourBtns[0].textContent).toBe('00')
    expect(hourBtns[1].textContent).toBe('02')
  })

  it('renders minutes with step 15', () => {
    const { container } = render(<TimePicker defaultOpen minuteStep={15} />)
    const cols = getColumns(container)
    const minuteBtns = getColumnButtons(cols[1])
    expect(minuteBtns).toHaveLength(4) // 0, 15, 30, 45
    expect(minuteBtns[0].textContent).toBe('00')
    expect(minuteBtns[1].textContent).toBe('15')
    expect(minuteBtns[2].textContent).toBe('30')
    expect(minuteBtns[3].textContent).toBe('45')
  })

  it('renders seconds with step 10', () => {
    const { container } = render(<TimePicker defaultOpen format="HH:mm:ss" secondStep={10} />)
    const cols = getColumns(container)
    const secondBtns = getColumnButtons(cols[2])
    expect(secondBtns).toHaveLength(6) // 0,10,20,30,40,50
    expect(secondBtns[0].textContent).toBe('00')
    expect(secondBtns[5].textContent).toBe('50')
  })
})

// ============================================================================
// needConfirm & OK button
// ============================================================================

describe('TimePicker – needConfirm', () => {
  it('shows OK button when needConfirm is true (default)', () => {
    render(<TimePicker defaultOpen />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('does not show OK button when needConfirm is false', () => {
    render(<TimePicker defaultOpen needConfirm={false} showNow={false} />)
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
  })

  it('commits value and closes on OK click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimePicker defaultOpen defaultValue={makeTime(10, 0)} onChange={onChange} />,
    )
    // Select a different hour in pending
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    fireEvent.click(hourBtns[15]) // Pick hour 15
    // onChange not called yet (needConfirm)
    expect(onChange).not.toHaveBeenCalled()
    // Click OK
    fireEvent.click(screen.getByText('OK'))
    expect(onChange).toHaveBeenCalled()
    const [date] = onChange.mock.calls[0]
    expect(date.getHours()).toBe(15)
    // Popup should close
    expect(getPopup(container)).toBeNull()
  })

  it('calls onCalendarChange on column selection with needConfirm', () => {
    const onCalendarChange = vi.fn()
    const { container } = render(
      <TimePicker defaultOpen onCalendarChange={onCalendarChange} />,
    )
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    fireEvent.click(hourBtns[8])
    expect(onCalendarChange).toHaveBeenCalled()
    const [date, timeString] = onCalendarChange.mock.calls[0]
    expect(date.getHours()).toBe(8)
    expect(timeString).toContain('08')
  })
})

// ============================================================================
// showNow & Now button
// ============================================================================

describe('TimePicker – showNow', () => {
  it('shows Now button by default', () => {
    render(<TimePicker defaultOpen />)
    expect(screen.getByText('Now')).toBeInTheDocument()
  })

  it('hides Now button when showNow is false', () => {
    render(<TimePicker defaultOpen showNow={false} />)
    expect(screen.queryByText('Now')).not.toBeInTheDocument()
  })
})

// ============================================================================
// DisabledTime
// ============================================================================

describe('TimePicker – disabledTime', () => {
  it('disables specific hours', () => {
    const { container } = render(
      <TimePicker
        defaultOpen
        disabledTime={() => ({ disabledHours: () => [0, 1, 2] })}
      />,
    )
    const cols = getColumns(container)
    const hourBtns = getColumnButtons(cols[0])
    expect(hourBtns[0]).toBeDisabled()
    expect(hourBtns[1]).toBeDisabled()
    expect(hourBtns[2]).toBeDisabled()
    expect(hourBtns[3]).not.toBeDisabled()
  })

  it('disables specific minutes', () => {
    const { container } = render(
      <TimePicker
        defaultOpen
        defaultValue={makeTime(10, 0)}
        disabledTime={() => ({ disabledMinutes: () => [0, 15, 30, 45] })}
      />,
    )
    const cols = getColumns(container)
    const minuteBtns = getColumnButtons(cols[1])
    expect(minuteBtns[0]).toBeDisabled()
    expect(minuteBtns[15]).toBeDisabled()
    expect(minuteBtns[30]).toBeDisabled()
    expect(minuteBtns[45]).toBeDisabled()
    expect(minuteBtns[1]).not.toBeDisabled()
  })
})

// ============================================================================
// Input typing
// ============================================================================

describe('TimePicker – Input', () => {
  it('parses typed time on blur', () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)
    const input = screen.getByPlaceholderText('Select time')
    fireEvent.change(input, { target: { value: '15:30' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalled()
    const [date] = onChange.mock.calls[0]
    expect(date.getHours()).toBe(15)
    expect(date.getMinutes()).toBe(30)
  })

  it('parses typed time on Enter key', () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)
    const input = screen.getByPlaceholderText('Select time')
    fireEvent.change(input, { target: { value: '08:00' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalled()
    const [date] = onChange.mock.calls[0]
    expect(date.getHours()).toBe(8)
    expect(date.getMinutes()).toBe(0)
  })

  it('does not allow typing when inputReadOnly is true', () => {
    render(<TimePicker inputReadOnly />)
    const input = screen.getByPlaceholderText('Select time')
    expect(input).toHaveAttribute('readOnly')
  })

  it('autoFocus focuses the input', () => {
    render(<TimePicker autoFocus />)
    expect(document.activeElement).toBe(screen.getByPlaceholderText('Select time'))
  })
})

// ============================================================================
// Suffix / prefix
// ============================================================================

describe('TimePicker – Suffix / prefix', () => {
  it('renders custom prefix', () => {
    render(<TimePicker prefix={<span data-testid="pfx">P</span>} />)
    expect(screen.getByTestId('pfx')).toBeInTheDocument()
  })

  it('renders custom suffix', () => {
    render(<TimePicker suffix={<span data-testid="sfx">S</span>} />)
    expect(screen.getByTestId('sfx')).toBeInTheDocument()
  })

  it('hides default clock icon when suffix is null', () => {
    const { container } = render(<TimePicker suffix={null} />)
    // No SVG at all (no clock icon, no clear icon since no value)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
  })
})

// ============================================================================
// Addon
// ============================================================================

describe('TimePicker – Addon', () => {
  it('renders addon in popup', () => {
    render(<TimePicker defaultOpen addon={<div data-testid="addon">Custom</div>} />)
    expect(screen.getByTestId('addon')).toBeInTheDocument()
  })
})

// ============================================================================
// Semantic classNames & styles
// ============================================================================

describe('TimePicker – Semantic classNames & styles', () => {
  it('applies className to root', () => {
    const { container } = render(<TimePicker className="my-tp" />)
    expect(container.firstElementChild).toHaveClass('my-tp')
  })

  it('applies style to root', () => {
    const { container } = render(<TimePicker style={{ margin: '10px' }} />)
    expect((container.firstElementChild as HTMLElement).style.margin).toBe('10px')
  })

  it('applies classNames.root to root', () => {
    const { container } = render(<TimePicker classNames={{ root: 'r-cls' }} />)
    expect(container.firstElementChild).toHaveClass('r-cls')
  })

  it('applies classNames.input to input wrapper', () => {
    const { container } = render(<TimePicker classNames={{ input: 'i-cls' }} />)
    const root = container.firstElementChild as HTMLElement
    const inputWrap = root.querySelector('.i-cls')
    expect(inputWrap).toBeTruthy()
  })

  it('applies classNames.popup to popup', () => {
    const { container } = render(<TimePicker defaultOpen classNames={{ popup: 'p-cls' }} />)
    const popup = container.querySelector('.p-cls')
    expect(popup).toBeTruthy()
  })

  it('applies classNames.footer to footer', () => {
    const { container } = render(<TimePicker defaultOpen classNames={{ footer: 'f-cls' }} />)
    const footer = container.querySelector('.f-cls')
    expect(footer).toBeTruthy()
  })

  it('applies styles.root to root', () => {
    const { container } = render(<TimePicker styles={{ root: { padding: '5px' } }} />)
    expect((container.firstElementChild as HTMLElement).style.padding).toBe('5px')
  })

  it('applies classNames.column to each column', () => {
    const { container } = render(<TimePicker defaultOpen classNames={{ column: 'col-cls' }} />)
    const cols = container.querySelectorAll('.col-cls')
    expect(cols.length).toBeGreaterThanOrEqual(2)
  })
})

// ============================================================================
// Column headers
// ============================================================================

describe('TimePicker – Column headers', () => {
  it('shows Horas and Minutos headers', () => {
    render(<TimePicker defaultOpen />)
    expect(screen.getByText('Horas')).toBeInTheDocument()
    expect(screen.getByText('Minutos')).toBeInTheDocument()
  })

  it('shows Segundos header with HH:mm:ss format', () => {
    render(<TimePicker defaultOpen format="HH:mm:ss" />)
    expect(screen.getByText('Segundos')).toBeInTheDocument()
  })

  it('shows AM/PM header with use12Hours', () => {
    render(<TimePicker defaultOpen use12Hours />)
    expect(screen.getByText('AM/PM')).toBeInTheDocument()
  })
})

// ============================================================================
// RangePicker – Basic rendering
// ============================================================================

describe('TimePicker.RangePicker – Basic', () => {
  it('renders two input fields', () => {
    render(<TimePicker.RangePicker />)
    expect(screen.getByPlaceholderText('Start time')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('End time')).toBeInTheDocument()
  })

  it('renders custom placeholders', () => {
    render(<TimePicker.RangePicker placeholder={['From', 'To']} />)
    expect(screen.getByPlaceholderText('From')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('To')).toBeInTheDocument()
  })

  it('displays defaultValue', () => {
    render(<TimePicker.RangePicker defaultValue={[makeTime(9, 0), makeTime(17, 0)]} />)
    expect(screen.getByDisplayValue('09:00')).toBeInTheDocument()
    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument()
  })

  it('opens popup on start input focus', () => {
    const { container } = render(<TimePicker.RangePicker />)
    fireEvent.focus(screen.getByPlaceholderText('Start time'))
    expect(getPopup(container)).toBeTruthy()
  })

  it('shows Start and End panel labels', () => {
    render(<TimePicker.RangePicker defaultOpen />)
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('shows OK button for needConfirm', () => {
    render(<TimePicker.RangePicker defaultOpen />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('shows Now button by default', () => {
    render(<TimePicker.RangePicker defaultOpen />)
    expect(screen.getByText('Now')).toBeInTheDocument()
  })

  it('closes popup on click outside', () => {
    const { container } = render(<TimePicker.RangePicker />)
    fireEvent.focus(screen.getByPlaceholderText('Start time'))
    expect(getPopup(container)).toBeTruthy()
    fireEvent.mouseDown(document.body)
    expect(getPopup(container)).toBeNull()
  })
})

// ============================================================================
// RangePicker – Disabled
// ============================================================================

describe('TimePicker.RangePicker – Disabled', () => {
  it('disables both inputs when disabled=true', () => {
    render(<TimePicker.RangePicker disabled />)
    expect(screen.getByPlaceholderText('Start time')).toBeDisabled()
    expect(screen.getByPlaceholderText('End time')).toBeDisabled()
  })

  it('disables individual inputs with disabled=[true, false]', () => {
    render(<TimePicker.RangePicker disabled={[true, false]} />)
    expect(screen.getByPlaceholderText('Start time')).toBeDisabled()
    expect(screen.getByPlaceholderText('End time')).not.toBeDisabled()
  })
})

// ============================================================================
// RangePicker – AllowClear
// ============================================================================

describe('TimePicker.RangePicker – AllowClear', () => {
  it('clears both values on clear click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimePicker.RangePicker
        defaultValue={[makeTime(9, 0), makeTime(17, 0)]}
        onChange={onChange}
      />,
    )
    const clearSpans = container.querySelectorAll('span[style*="cursor: pointer"]')
    fireEvent.click(clearSpans[0])
    expect(onChange).toHaveBeenCalledWith(null, ['', ''])
  })
})

// ============================================================================
// RangePicker – Separator
// ============================================================================

describe('TimePicker.RangePicker – Separator', () => {
  it('renders custom separator', () => {
    render(<TimePicker.RangePicker separator={<span data-testid="sep">~</span>} />)
    expect(screen.getByTestId('sep')).toBeInTheDocument()
  })
})

// ============================================================================
// RangePicker – Semantic
// ============================================================================

describe('TimePicker.RangePicker – Semantic', () => {
  it('applies className to root', () => {
    const { container } = render(<TimePicker.RangePicker className="range-cls" />)
    expect(container.firstElementChild).toHaveClass('range-cls')
  })

  it('sets id on root', () => {
    const { container } = render(<TimePicker.RangePicker id="rtp" />)
    expect(container.querySelector('#rtp')).toBeTruthy()
  })
})
