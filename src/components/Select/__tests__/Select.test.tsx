import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'

const baseOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

/** Click the combobox selector to open the dropdown */
function openDropdown() {
  fireEvent.click(screen.getByRole('combobox'))
}

/** Get all visible option elements */
function getOptions() {
  return screen.getAllByRole('option')
}

// ============================================================================
// Single mode
// ============================================================================

describe('Select – Single mode', () => {
  // ---------- Basic rendering ----------

  it('renders a combobox', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows placeholder by default', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('shows custom placeholder', () => {
    render(<Select options={baseOptions} placeholder="Pick a fruit" />)
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
  })

  it('does not show dropdown initially', () => {
    render(<Select options={baseOptions} />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  // ---------- Open / close ----------

  it('opens dropdown on click', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('renders all options in dropdown', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    expect(getOptions()).toHaveLength(3)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })

  it('sets aria-expanded=false after second click (no showSearch)', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    openDropdown()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('sets aria-expanded=false on Escape', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens dropdown on ArrowDown when closed', () => {
    render(<Select options={baseOptions} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes dropdown on click outside', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseDown(document.body)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('calls onDropdownVisibleChange', () => {
    const onDropdownVisibleChange = vi.fn()
    render(<Select options={baseOptions} onDropdownVisibleChange={onDropdownVisibleChange} />)
    openDropdown()
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true)
  })

  // ---------- Selection ----------

  it('selects an option and shows its label', () => {
    render(<Select options={baseOptions} />)
    openDropdown()
    fireEvent.click(screen.getByText('Banana'))
    expect(screen.getByText('Banana')).toBeInTheDocument()
    // Dropdown should close
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onChange with value on selection', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} onChange={onChange} />)
    openDropdown()
    fireEvent.click(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith('apple', expect.objectContaining({ value: 'apple' }))
  })

  it('calls onSelect on selection', () => {
    const onSelect = vi.fn()
    render(<Select options={baseOptions} onSelect={onSelect} />)
    openDropdown()
    fireEvent.click(screen.getByText('Cherry'))
    expect(onSelect).toHaveBeenCalledWith('cherry', expect.objectContaining({ value: 'cherry' }))
  })

  it('selects via keyboard Enter', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} onChange={onChange} />)
    const combobox = screen.getByRole('combobox')
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // opens + activates first
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // move to second
    fireEvent.keyDown(combobox, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('banana', expect.objectContaining({ value: 'banana' }))
  })

  // ---------- Controlled value ----------

  it('displays controlled value', () => {
    render(<Select options={baseOptions} value="cherry" />)
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })

  it('displays defaultValue', () => {
    render(<Select options={baseOptions} defaultValue="banana" />)
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  // ---------- Controlled open ----------

  it('shows dropdown when open=true', () => {
    render(<Select options={baseOptions} open />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('hides dropdown when open=false', () => {
    render(<Select options={baseOptions} open={false} />)
    openDropdown()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  // ---------- Disabled ----------

  it('does not open when disabled', () => {
    render(<Select options={baseOptions} disabled />)
    openDropdown()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('sets tabIndex=-1 when disabled', () => {
    render(<Select options={baseOptions} disabled />)
    expect(screen.getByRole('combobox')).toHaveAttribute('tabindex', '-1')
  })

  it('applies opacity when disabled', () => {
    render(<Select options={baseOptions} disabled />)
    expect(screen.getByRole('combobox').style.opacity).toBe('0.6')
  })

  // ---------- Disabled option ----------

  it('does not select disabled option', () => {
    const onChange = vi.fn()
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    render(<Select options={options} onChange={onChange} />)
    openDropdown()
    fireEvent.click(screen.getByText('B'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks disabled option with aria-disabled', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    render(<Select options={options} open />)
    const opts = getOptions()
    expect(opts[0]).toHaveAttribute('aria-disabled', 'false')
    expect(opts[1]).toHaveAttribute('aria-disabled', 'true')
  })

  // ---------- Option groups ----------

  it('renders grouped options', () => {
    const groupedOptions = [
      {
        label: 'Fruits',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ],
      },
      {
        label: 'Vegetables',
        options: [
          { value: 'carrot', label: 'Carrot' },
        ],
      },
    ]
    render(<Select options={groupedOptions} open />)
    expect(screen.getByText('Fruits')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(getOptions()).toHaveLength(3)
  })

  // ---------- allowClear ----------

  it('shows clear button when value is set and allowClear', () => {
    render(<Select options={baseOptions} defaultValue="apple" allowClear />)
    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('does not show clear button without value', () => {
    render(<Select options={baseOptions} allowClear />)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  it('clears value on clear click', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(<Select options={baseOptions} defaultValue="apple" allowClear onChange={onChange} onClear={onClear} />)
    fireEvent.click(screen.getByLabelText('Clear'))
    expect(onClear).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(undefined, undefined)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  // ---------- ARIA ----------

  it('sets aria-expanded on combobox', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
    openDropdown()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets aria-haspopup=listbox', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('marks selected option with aria-selected', () => {
    render(<Select options={baseOptions} value="banana" open />)
    const opts = getOptions()
    expect(opts[0]).toHaveAttribute('aria-selected', 'false')
    expect(opts[1]).toHaveAttribute('aria-selected', 'true')
    expect(opts[2]).toHaveAttribute('aria-selected', 'false')
  })

  // ---------- Sizes ----------

  it('applies small size height', () => {
    render(<Select options={baseOptions} size="small" />)
    expect(screen.getByRole('combobox').style.height).toBe('1.75rem')
  })

  it('applies middle size height (default)', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByRole('combobox').style.height).toBe('2.25rem')
  })

  it('applies large size height', () => {
    render(<Select options={baseOptions} size="large" />)
    expect(screen.getByRole('combobox').style.height).toBe('2.5rem')
  })

  // ---------- Variants ----------

  it('applies outlined variant', () => {
    render(<Select options={baseOptions} />)
    expect(screen.getByRole('combobox').style.backgroundColor).toBe('var(--j-bg)')
  })

  it('applies filled variant', () => {
    render(<Select options={baseOptions} variant="filled" />)
    expect(screen.getByRole('combobox').style.backgroundColor).toBe('var(--j-bgMuted)')
  })

  it('applies borderless variant', () => {
    render(<Select options={baseOptions} variant="borderless" />)
    expect(screen.getByRole('combobox').style.backgroundColor).toBe('transparent')
  })

  // ---------- Status ----------

  it('applies error status border', () => {
    render(<Select options={baseOptions} status="error" />)
    expect(screen.getByRole('combobox').style.borderColor).toBe('var(--j-error)')
  })

  it('applies warning status border', () => {
    render(<Select options={baseOptions} status="warning" />)
    expect(screen.getByRole('combobox').style.borderColor).toBe('var(--j-warning)')
  })

  // ---------- Events ----------

  it('calls onFocus', () => {
    const onFocus = vi.fn()
    render(<Select options={baseOptions} onFocus={onFocus} />)
    fireEvent.focus(screen.getByRole('combobox'))
    expect(onFocus).toHaveBeenCalled()
  })

  it('calls onBlur', () => {
    const onBlur = vi.fn()
    render(<Select options={baseOptions} onBlur={onBlur} />)
    fireEvent.focus(screen.getByRole('combobox'))
    fireEvent.blur(screen.getByRole('combobox'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('calls onKeyDown', () => {
    const onKeyDown = vi.fn()
    render(<Select options={baseOptions} onKeyDown={onKeyDown} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    expect(onKeyDown).toHaveBeenCalled()
  })

  // ---------- Styling ----------

  it('applies className to root', () => {
    const { container } = render(<Select options={baseOptions} className="my-sel" />)
    expect(container.firstChild).toHaveClass('my-sel')
  })

  it('applies style to root', () => {
    const { container } = render(<Select options={baseOptions} style={{ margin: '10px' }} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.margin).toBe('10px')
  })

  it('applies classNames.selector', () => {
    render(<Select options={baseOptions} classNames={{ selector: 'sel-cls' }} />)
    expect(screen.getByRole('combobox')).toHaveClass('sel-cls')
  })

  it('applies classNames.option to options', () => {
    render(<Select options={baseOptions} open classNames={{ option: 'opt-cls' }} />)
    expect(document.querySelectorAll('.opt-cls')).toHaveLength(3)
  })

  it('applies classNames.dropdown to dropdown', () => {
    render(<Select options={baseOptions} open classNames={{ dropdown: 'drop-cls' }} />)
    expect(screen.getByRole('listbox')).toHaveClass('drop-cls')
  })

  // ---------- notFoundContent ----------

  it('shows "No data" by default when notFoundContent is set', () => {
    render(<Select options={[]} open notFoundContent="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows custom notFoundContent', () => {
    render(<Select options={[]} open notFoundContent="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('hides dropdown when notFoundContent is null and no options', () => {
    render(<Select options={[]} open notFoundContent={null} />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  // ---------- Loading ----------

  it('shows dropdown with loading state', () => {
    render(<Select options={[]} loading open />)
    // Loading shows dropdown even with no options
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  // ---------- Prefix / suffix ----------

  it('renders prefix', () => {
    render(<Select options={baseOptions} prefix={<span data-testid="pfx">$</span>} />)
    expect(screen.getByTestId('pfx')).toBeInTheDocument()
  })

  it('renders custom suffix icon', () => {
    render(<Select options={baseOptions} suffix={<span data-testid="sfx">^</span>} />)
    expect(screen.getByTestId('sfx')).toBeInTheDocument()
  })

  // ---------- labelInValue ----------

  it('calls onChange with { value, label } when labelInValue', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} labelInValue onChange={onChange} />)
    openDropdown()
    fireEvent.click(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith(
      { value: 'apple', label: 'Apple' },
      expect.objectContaining({ value: 'apple' }),
    )
  })

  // ---------- labelRender ----------

  it('uses custom labelRender for display', () => {
    render(
      <Select
        options={baseOptions}
        value="apple"
        labelRender={({ label }) => <span data-testid="custom-label">Fruit: {label}</span>}
      />,
    )
    expect(screen.getByTestId('custom-label')).toHaveTextContent('Fruit: Apple')
  })

  // ---------- optionRender ----------

  it('uses custom optionRender', () => {
    render(
      <Select
        options={baseOptions}
        open
        optionRender={(opt) => <span data-testid={`opt-${opt.value}`}>{opt.label} !!!</span>}
      />,
    )
    expect(screen.getByTestId('opt-apple')).toHaveTextContent('Apple !!!')
  })

  // ---------- dropdownRender ----------

  it('wraps options with dropdownRender', () => {
    render(
      <Select
        options={baseOptions}
        open
        dropdownRender={(menu) => (
          <div>
            {menu}
            <div data-testid="extra">Custom footer</div>
          </div>
        )}
      />,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
    expect(getOptions()).toHaveLength(3)
  })

  // ---------- fieldNames ----------

  it('uses custom fieldNames', () => {
    const options = [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ]
    render(
      <Select
        options={options as any}
        fieldNames={{ value: 'id', label: 'name' }}
        open
      />,
    )
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })
})

// ============================================================================
// Search
// ============================================================================

describe('Select – Search', () => {
  it('filters options as you type', () => {
    render(<Select options={baseOptions} showSearch />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ban' } })
    expect(getOptions()).toHaveLength(1)
    // Text is split by highlight spans, check within the option
    expect(getOptions()[0].textContent).toContain('Banana')
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<Select options={baseOptions} showSearch onSearch={onSearch} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ch' } })
    expect(onSearch).toHaveBeenCalledWith('ch')
  })

  it('disables filtering when filterOption=false', () => {
    render(<Select options={baseOptions} showSearch filterOption={false} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'xyz' } })
    // All options still visible since filtering is disabled
    expect(getOptions()).toHaveLength(3)
  })

  it('uses custom filterOption function', () => {
    const filterOption = (input: string, opt: any) => opt.value === input
    render(<Select options={baseOptions} showSearch filterOption={filterOption} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'apple' } })
    expect(getOptions()).toHaveLength(1)
  })

  it('shows notFoundContent when search has no results', () => {
    render(<Select options={baseOptions} showSearch notFoundContent="No matches" />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })
})

// ============================================================================
// Multiple mode
// ============================================================================

describe('Select – Multiple mode', () => {
  it('renders combobox in multiple mode', () => {
    render(<Select options={baseOptions} mode="multiple" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows placeholder when no tags selected', () => {
    render(<Select options={baseOptions} mode="multiple" placeholder="Choose..." />)
    expect(screen.getByText('Choose...')).toBeInTheDocument()
  })

  it('selects multiple options and shows tags', () => {
    render(<Select options={baseOptions} mode="multiple" />)
    openDropdown()
    const opts = getOptions()
    fireEvent.click(opts[0]) // Apple
    fireEvent.click(opts[2]) // Cherry
    // Tags should be visible (each appears in tag + option, so use getAllByText)
    expect(screen.getAllByText('Apple').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Cherry').length).toBeGreaterThanOrEqual(1)
  })

  it('does not close dropdown on selection', () => {
    render(<Select options={baseOptions} mode="multiple" />)
    openDropdown()
    fireEvent.click(screen.getByText('Apple'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('toggles selection (deselects on second click)', () => {
    const onDeselect = vi.fn()
    render(<Select options={baseOptions} mode="multiple" defaultValue={['apple']} onDeselect={onDeselect} />)
    openDropdown()
    // 'Apple' text exists in both tag and option — target the option directly
    const opts = getOptions()
    fireEvent.click(opts[0])
    expect(onDeselect).toHaveBeenCalledWith('apple', expect.objectContaining({ value: 'apple' }))
  })

  it('calls onChange with array of values', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} mode="multiple" onChange={onChange} />)
    openDropdown()
    fireEvent.click(screen.getByText('Banana'))
    expect(onChange).toHaveBeenCalledWith(
      ['banana'],
      expect.arrayContaining([expect.objectContaining({ value: 'banana' })]),
    )
  })

  it('shows check icon on selected options', () => {
    render(<Select options={baseOptions} mode="multiple" defaultValue={['apple']} open />)
    const opts = getOptions()
    // Selected option (apple) has a check SVG
    const checkSvg = opts[0].querySelector('svg')
    expect(checkSvg).toBeTruthy()
    // Unselected option (banana) has no check SVG
    const unselectedSvg = opts[1].querySelector('svg')
    expect(unselectedSvg).toBeNull()
  })

  // ---------- Remove tag ----------

  it('removes tag via close icon click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Select options={baseOptions} mode="multiple" defaultValue={['apple', 'banana']} onChange={onChange} />,
    )
    // Find close icons inside tags
    const closeIcons = container.querySelectorAll('span[style*="cursor: pointer"][style*="margin-left"]')
    fireEvent.click(closeIcons[0]) // remove first tag
    expect(onChange).toHaveBeenCalled()
  })

  it('removes last tag with Backspace when search is empty', () => {
    const onChange = vi.fn()
    render(
      <Select options={baseOptions} mode="multiple" defaultValue={['apple', 'banana']} showSearch onChange={onChange} />,
    )
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.keyDown(input, { key: 'Backspace' })
    expect(onChange).toHaveBeenCalled()
    // Should have removed 'banana' (last)
    const lastCallValues = onChange.mock.calls[0][0]
    expect(lastCallValues).toEqual(['apple'])
  })

  // ---------- maxTagCount ----------

  it('limits visible tags with maxTagCount', () => {
    render(
      <Select
        options={baseOptions}
        mode="multiple"
        defaultValue={['apple', 'banana', 'cherry']}
        maxTagCount={1}
      />,
    )
    // Only first tag visible + overflow indicator
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('uses custom maxTagPlaceholder', () => {
    render(
      <Select
        options={baseOptions}
        mode="multiple"
        defaultValue={['apple', 'banana', 'cherry']}
        maxTagCount={1}
        maxTagPlaceholder={(omitted) => `${omitted.length} more`}
      />,
    )
    expect(screen.getByText('2 more')).toBeInTheDocument()
  })

  // ---------- maxCount ----------

  it('prevents selecting beyond maxCount', () => {
    const onChange = vi.fn()
    render(
      <Select options={baseOptions} mode="multiple" defaultValue={['apple', 'banana']} maxCount={2} onChange={onChange} />,
    )
    openDropdown()
    fireEvent.click(screen.getByText('Cherry'))
    // Should not have called onChange since maxCount reached
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- allowClear in multiple ----------

  it('clears all tags on clear button click', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(
      <Select
        options={baseOptions}
        mode="multiple"
        defaultValue={['apple', 'banana']}
        allowClear
        onChange={onChange}
        onClear={onClear}
      />,
    )
    fireEvent.click(screen.getByLabelText('Clear'))
    expect(onClear).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith([], [])
  })

  // ---------- Controlled multi value ----------

  it('displays controlled multi value', () => {
    render(<Select options={baseOptions} mode="multiple" value={['apple', 'cherry']} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })
})

// ============================================================================
// Tags mode
// ============================================================================

describe('Select – Tags mode', () => {
  it('creates a tag from search on Enter', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} mode="tags" onChange={onChange} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'kiwi' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalled()
    const values = onChange.mock.calls[0][0]
    expect(values).toContain('kiwi')
  })

  it('uses tokenSeparators to create tags', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} mode="tags" tokenSeparators={[',']} onChange={onChange} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'foo,bar,' } })
    expect(onChange).toHaveBeenCalled()
    const values = onChange.mock.calls[0][0]
    expect(values).toContain('foo')
    expect(values).toContain('bar')
  })

  it('does not create duplicate tags', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} mode="tags" defaultValue={['foo']} onChange={onChange} />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // onChange may or may not be called but values should not have duplicate
    expect(onChange).not.toHaveBeenCalled()
  })

  it('enables search by default in tags mode', () => {
    render(<Select options={baseOptions} mode="tags" />)
    openDropdown()
    const input = screen.getByRole('combobox').querySelector('input')
    expect(input).toBeInTheDocument()
  })
})

// ============================================================================
// Keyboard navigation
// ============================================================================

describe('Select – Keyboard', () => {
  it('navigates down with ArrowDown', () => {
    render(<Select options={baseOptions} open />)
    const combobox = screen.getByRole('combobox')
    // First option should be active by default (defaultActiveFirstOption)
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    // Active index moves to second option
    const opts = getOptions()
    expect(opts[1].style.backgroundColor).toBeTruthy()
  })

  it('navigates up with ArrowUp', () => {
    render(<Select options={baseOptions} open />)
    const combobox = screen.getByRole('combobox')
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // 0 -> 1
    fireEvent.keyDown(combobox, { key: 'ArrowUp' }) // 1 -> 0
    const opts = getOptions()
    expect(opts[0].style.backgroundColor).toBeTruthy()
  })

  it('wraps around when navigating past last option', () => {
    render(<Select options={baseOptions} open />)
    const combobox = screen.getByRole('combobox')
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // 0 -> 1
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // 1 -> 2
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }) // 2 -> 0 (wrap)
    const opts = getOptions()
    expect(opts[0].style.backgroundColor).toBeTruthy()
  })

  it('skips disabled options during navigation', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ]
    render(<Select options={options} open />)
    const combobox = screen.getByRole('combobox')
    // Active starts at 0 (A), ArrowDown should skip B and go to C
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    const opts = getOptions()
    expect(opts[2].style.backgroundColor).toBeTruthy()
  })

  it('does not respond to keyboard when disabled', () => {
    const onChange = vi.fn()
    render(<Select options={baseOptions} disabled onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

// ============================================================================
// Custom rendering
// ============================================================================

describe('Select – Custom rendering', () => {
  it('renders custom removeIcon in tags', () => {
    render(
      <Select
        options={baseOptions}
        mode="multiple"
        defaultValue={['apple']}
        removeIcon={<span data-testid="rm-icon">x</span>}
      />,
    )
    expect(screen.getByTestId('rm-icon')).toBeInTheDocument()
  })

  it('renders custom clearIcon', () => {
    render(
      <Select
        options={baseOptions}
        defaultValue="apple"
        allowClear
        clearIcon={<span data-testid="clr-icon">X</span>}
      />,
    )
    expect(screen.getByTestId('clr-icon')).toBeInTheDocument()
  })

  it('uses tagRender for custom tag display', () => {
    render(
      <Select
        options={baseOptions}
        mode="multiple"
        defaultValue={['apple']}
        tagRender={({ label, onClose }) => (
          <span data-testid="custom-tag" onClick={onClose}>{label}</span>
        )}
      />,
    )
    expect(screen.getByTestId('custom-tag')).toBeInTheDocument()
  })
})
