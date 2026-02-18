import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NestedSelect } from '../NestedSelect'
import type { NestedSelectOption } from '../NestedSelect'

const options: NestedSelectOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
          { value: 'xiasha', label: 'Xiasha' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          { value: 'zhonghuamen', label: 'Zhonghuamen' },
        ],
      },
    ],
  },
]

/** Open the dropdown by clicking the selector */
function openDropdown() {
  fireEvent.click(screen.getByRole('combobox'))
}

describe('NestedSelect', () => {
  // ---------- Basic rendering ----------

  it('renders a combobox selector', () => {
    render(<NestedSelect options={options} />)
    const selector = screen.getByRole('combobox')
    expect(selector).toBeInTheDocument()
    expect(selector).toHaveAttribute('aria-haspopup', 'listbox')
    expect(selector).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders placeholder text', () => {
    render(<NestedSelect options={options} placeholder="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('renders default placeholder', () => {
    render(<NestedSelect options={options} />)
    expect(screen.getByText('Seleccionar')).toBeInTheDocument()
  })

  it('does not show dropdown initially', () => {
    render(<NestedSelect options={options} />)
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  // ---------- Dropdown open/close ----------

  it('opens dropdown on click', () => {
    render(<NestedSelect options={options} />)
    openDropdown()

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Zhejiang')).toBeInTheDocument()
    expect(screen.getByText('Jiangsu')).toBeInTheDocument()
  })

  it('shows first-level options as role="option"', () => {
    render(<NestedSelect options={options} />)
    openDropdown()

    const opts = screen.getAllByRole('option')
    expect(opts).toHaveLength(2)
  })

  it('closes dropdown on Escape', () => {
    render(<NestedSelect options={options} />)
    openDropdown()
    expect(screen.getByText('Zhejiang')).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })

    expect(screen.queryByText('Zhejiang')).not.toBeInTheDocument()
  })

  it('toggles dropdown on repeated clicks', () => {
    render(<NestedSelect options={options} />)

    openDropdown()
    expect(screen.getByText('Zhejiang')).toBeInTheDocument()

    openDropdown() // close
    expect(screen.queryByText('Zhejiang')).not.toBeInTheDocument()
  })

  // ---------- Cascading selection (single mode) ----------

  it('expands children on click and selects leaf', () => {
    const onChange = vi.fn()
    render(<NestedSelect options={options} onChange={onChange} />)
    openDropdown()

    // Click first level
    fireEvent.click(screen.getByText('Zhejiang'))
    // Second level appears
    expect(screen.getByText('Hangzhou')).toBeInTheDocument()

    // Click second level
    fireEvent.click(screen.getByText('Hangzhou'))
    // Third level appears
    expect(screen.getByText('West Lake')).toBeInTheDocument()

    // Click leaf
    fireEvent.click(screen.getByText('West Lake'))

    expect(onChange).toHaveBeenCalledWith(
      ['zhejiang', 'hangzhou', 'xihu'],
      expect.any(Array),
    )
  })

  it('displays selected path as "A / B / C"', () => {
    render(<NestedSelect options={options} defaultValue={['zhejiang', 'hangzhou', 'xihu']} />)
    expect(screen.getByText('Zhejiang / Hangzhou / West Lake')).toBeInTheDocument()
  })

  it('closes dropdown after selecting a leaf', () => {
    render(<NestedSelect options={options} />)
    openDropdown()

    fireEvent.click(screen.getByText('Zhejiang'))
    fireEvent.click(screen.getByText('Hangzhou'))
    fireEvent.click(screen.getByText('West Lake'))

    // Dropdown should be closed
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  // ---------- changeOnSelect ----------

  it('calls onChange on intermediate selection when changeOnSelect=true', () => {
    const onChange = vi.fn()
    render(<NestedSelect options={options} changeOnSelect onChange={onChange} />)
    openDropdown()

    fireEvent.click(screen.getByText('Zhejiang'))

    expect(onChange).toHaveBeenCalledWith(
      ['zhejiang'],
      expect.any(Array),
    )
  })

  // ---------- Controlled value ----------

  it('respects controlled value prop', () => {
    render(<NestedSelect options={options} value={['jiangsu', 'nanjing', 'zhonghuamen']} />)
    expect(screen.getByText('Jiangsu / Nanjing / Zhonghuamen')).toBeInTheDocument()
  })

  // ---------- Controlled open ----------

  it('respects controlled open prop', () => {
    render(<NestedSelect options={options} open />)
    expect(screen.getByText('Zhejiang')).toBeInTheDocument()
  })

  // ---------- Disabled ----------

  it('does not open when disabled', () => {
    render(<NestedSelect options={options} disabled />)
    openDropdown()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('renders with opacity and cursor not-allowed when disabled', () => {
    render(<NestedSelect options={options} disabled />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.opacity).toBe('0.6')
    expect(selector.style.cursor).toBe('not-allowed')
  })

  // ---------- Disabled options ----------

  it('does not select disabled options', () => {
    const onChange = vi.fn()
    const disabledOpts: NestedSelectOption[] = [
      { value: 'a', label: 'Enabled' },
      { value: 'b', label: 'Disabled', disabled: true },
    ]
    render(<NestedSelect options={disabledOpts} onChange={onChange} />)
    openDropdown()

    fireEvent.click(screen.getByText('Disabled'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders disabled options with aria-disabled', () => {
    const disabledOpts: NestedSelectOption[] = [
      { value: 'a', label: 'Disabled', disabled: true },
    ]
    render(<NestedSelect options={disabledOpts} />)
    openDropdown()

    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true')
  })

  // ---------- allowClear ----------

  it('shows clear button when value is selected', () => {
    render(<NestedSelect options={options} defaultValue={['zhejiang', 'hangzhou', 'xihu']} />)
    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('clears value on clear button click', () => {
    const onChange = vi.fn()
    render(
      <NestedSelect options={options} defaultValue={['zhejiang', 'hangzhou', 'xihu']} onChange={onChange} />
    )

    fireEvent.click(screen.getByLabelText('Clear'))

    expect(onChange).toHaveBeenCalledWith([], [])
    expect(screen.getByText('Seleccionar')).toBeInTheDocument()
  })

  it('does not show clear button when allowClear=false', () => {
    render(
      <NestedSelect options={options} allowClear={false} defaultValue={['zhejiang', 'hangzhou', 'xihu']} />
    )
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  // ---------- showSearch ----------

  it('renders search input when showSearch=true', () => {
    render(<NestedSelect options={options} showSearch />)
    openDropdown()

    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('filters options by search value', async () => {
    render(<NestedSelect options={options} showSearch />)
    openDropdown()

    const searchInput = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(searchInput, { target: { value: 'West' } })

    await waitFor(() => {
      // highlightMatch wraps the matched substring in <strong>, fragmenting
      // the text across DOM nodes — query by role and check textContent
      const resultOptions = screen.getAllByRole('option')
      const match = resultOptions.find((el) =>
        el.textContent?.includes('West Lake'),
      )
      expect(match).toBeTruthy()
    })
  })

  it('shows notFoundContent when search has no results', async () => {
    render(<NestedSelect options={options} showSearch notFoundContent="No match" />)
    openDropdown()

    const searchInput = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(searchInput, { target: { value: 'zzzzzzz' } })

    await waitFor(() => {
      expect(screen.getByText('No match')).toBeInTheDocument()
    })
  })

  // ---------- Keyboard navigation ----------

  it('opens dropdown on Enter key', () => {
    render(<NestedSelect options={options} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })

    expect(screen.getByText('Zhejiang')).toBeInTheDocument()
  })

  it('opens dropdown on Space key', () => {
    render(<NestedSelect options={options} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: ' ' })

    expect(screen.getByText('Zhejiang')).toBeInTheDocument()
  })

  // ---------- displayRender ----------

  it('uses custom displayRender', () => {
    const displayRender = (labels: string[]) => labels.join(' > ')
    render(
      <NestedSelect
        options={options}
        defaultValue={['zhejiang', 'hangzhou', 'xihu']}
        displayRender={displayRender}
      />
    )
    expect(screen.getByText('Zhejiang > Hangzhou > West Lake')).toBeInTheDocument()
  })

  // ---------- prefix ----------

  it('renders prefix content in selector', () => {
    render(<NestedSelect options={options} prefix={<span data-testid="prefix">📍</span>} />)
    expect(screen.getByTestId('prefix')).toBeInTheDocument()
  })

  // ---------- popupRender ----------

  it('wraps dropdown content with popupRender', () => {
    const popupRender = (menus: React.ReactNode) => (
      <div data-testid="custom-popup">{menus}</div>
    )
    render(<NestedSelect options={options} popupRender={popupRender} />)
    openDropdown()

    expect(screen.getByTestId('custom-popup')).toBeInTheDocument()
  })

  // ---------- Variant ----------

  it('renders outlined variant by default', () => {
    render(<NestedSelect options={options} />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.border).toContain('1px solid')
  })

  it('renders filled variant', () => {
    render(<NestedSelect options={options} variant="filled" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.border).toBe('1px solid transparent')
  })

  it('renders borderless variant', () => {
    render(<NestedSelect options={options} variant="borderless" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.backgroundColor).toBe('transparent')
  })

  // ---------- Status ----------

  it('applies error border color', () => {
    render(<NestedSelect options={options} status="error" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.borderColor).not.toBe('')
  })

  it('applies warning border color', () => {
    render(<NestedSelect options={options} status="warning" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.borderColor).not.toBe('')
  })

  // ---------- Size ----------

  it('renders large size', () => {
    render(<NestedSelect options={options} size="large" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.height).toBe('2.5rem')
  })

  it('renders middle size (default)', () => {
    render(<NestedSelect options={options} />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.height).toBe('2.25rem')
  })

  it('renders small size', () => {
    render(<NestedSelect options={options} size="small" />)
    const selector = screen.getByRole('combobox')
    expect(selector.style.height).toBe('1.75rem')
  })

  // ---------- Multiple mode ----------

  it('renders tags in multiple mode', () => {
    render(
      <NestedSelect
        options={options}
        multiple
        defaultValue={[
          ['zhejiang', 'hangzhou', 'xihu'],
          ['jiangsu', 'nanjing', 'zhonghuamen'],
        ]}
      />
    )
    expect(screen.getByText('Zhejiang / Hangzhou / West Lake')).toBeInTheDocument()
    expect(screen.getByText('Jiangsu / Nanjing / Zhonghuamen')).toBeInTheDocument()
  })

  it('shows placeholder when no selections in multiple mode', () => {
    render(<NestedSelect options={options} multiple placeholder="Select items" />)
    expect(screen.getByText('Select items')).toBeInTheDocument()
  })

  it('limits visible tags with maxTagCount', () => {
    render(
      <NestedSelect
        options={options}
        multiple
        maxTagCount={1}
        defaultValue={[
          ['zhejiang', 'hangzhou', 'xihu'],
          ['jiangsu', 'nanjing', 'zhonghuamen'],
        ]}
      />
    )
    // Should show 1 tag + "+1" overflow indicator
    expect(screen.getByText('Zhejiang / Hangzhou / West Lake')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('uses custom maxTagPlaceholder', () => {
    render(
      <NestedSelect
        options={options}
        multiple
        maxTagCount={0}
        maxTagPlaceholder={(omitted) => `${omitted.length} items`}
        defaultValue={[
          ['zhejiang', 'hangzhou', 'xihu'],
          ['jiangsu', 'nanjing', 'zhonghuamen'],
        ]}
      />
    )
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('clears all selections in multiple mode', () => {
    const onChange = vi.fn()
    render(
      <NestedSelect
        options={options}
        multiple
        defaultValue={[['zhejiang', 'hangzhou', 'xihu']]}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByLabelText('Clear'))

    expect(onChange).toHaveBeenCalledWith([], [])
  })

  // ---------- fieldNames ----------

  it('uses custom fieldNames mapping', () => {
    const customOpts = [
      { id: 'a', name: 'Alpha', items: [{ id: 'a1', name: 'Alpha One' }] },
    ]
    render(
      <NestedSelect
        options={customOpts as unknown as NestedSelectOption[]}
        fieldNames={{ label: 'name', value: 'id', children: 'items' }}
      />
    )
    openDropdown()

    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  // ---------- suffixIcon ----------

  it('renders custom suffix icon', () => {
    render(
      <NestedSelect options={options} suffixIcon={<span data-testid="suffix">▼</span>} />
    )
    expect(screen.getByTestId('suffix')).toBeInTheDocument()
  })

  // ---------- expandIcon ----------

  it('renders custom expand icon on parent options', () => {
    render(
      <NestedSelect options={options} expandIcon={<span data-testid="expand-icon">→</span>} />
    )
    openDropdown()

    expect(screen.getAllByTestId('expand-icon').length).toBeGreaterThanOrEqual(1)
  })

  // ---------- onDropdownVisibleChange ----------

  it('calls onDropdownVisibleChange when dropdown opens/closes', () => {
    const onDropdownVisibleChange = vi.fn()
    render(<NestedSelect options={options} onDropdownVisibleChange={onDropdownVisibleChange} />)

    openDropdown()
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true)

    openDropdown() // close
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(false)
  })

  // ---------- className & style ----------

  it('applies custom className to root', () => {
    const { container } = render(<NestedSelect options={options} className="my-cascader" />)
    expect(container.firstChild).toHaveClass('my-cascader')
  })

  it('applies custom style to root', () => {
    const { container } = render(<NestedSelect options={options} style={{ margin: 10 }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.root', () => {
    const { container } = render(
      <NestedSelect options={options} classNames={{ root: 'custom-root' }} />
    )
    expect(container.firstChild).toHaveClass('custom-root')
  })

  it('applies classNames.selector', () => {
    render(
      <NestedSelect options={options} classNames={{ selector: 'custom-sel' }} />
    )
    expect(screen.getByRole('combobox')).toHaveClass('custom-sel')
  })

  it('applies classNames.dropdown to the dropdown', () => {
    const { container } = render(
      <NestedSelect options={options} classNames={{ dropdown: 'custom-dd' }} />
    )
    openDropdown()
    expect(container.querySelector('.custom-dd')).toBeInTheDocument()
  })

  it('applies classNames.menu to menu columns', () => {
    const { container } = render(
      <NestedSelect options={options} classNames={{ menu: 'custom-menu' }} />
    )
    openDropdown()
    expect(container.querySelector('.custom-menu')).toBeInTheDocument()
  })

  it('applies classNames.option to each option', () => {
    const { container } = render(
      <NestedSelect options={options} classNames={{ option: 'custom-opt' }} />
    )
    openDropdown()
    expect(container.querySelectorAll('.custom-opt')).toHaveLength(2)
  })

  // ---------- Edge cases ----------

  it('renders with empty options array', () => {
    render(<NestedSelect options={[]} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})

describe('NestedSelect.Panel', () => {
  it('renders cascade menus inline without a dropdown', () => {
    render(<NestedSelect.Panel options={options} />)
    // Shows first level options directly
    expect(screen.getByText('Zhejiang')).toBeInTheDocument()
    expect(screen.getByText('Jiangsu')).toBeInTheDocument()
  })

  it('expands children on click', () => {
    render(<NestedSelect.Panel options={options} />)

    fireEvent.click(screen.getByText('Zhejiang'))
    expect(screen.getByText('Hangzhou')).toBeInTheDocument()
  })

  it('calls onChange when a leaf is selected', () => {
    const onChange = vi.fn()
    render(<NestedSelect.Panel options={options} onChange={onChange} />)

    fireEvent.click(screen.getByText('Zhejiang'))
    fireEvent.click(screen.getByText('Hangzhou'))
    fireEvent.click(screen.getByText('West Lake'))

    expect(onChange).toHaveBeenCalledWith(
      ['zhejiang', 'hangzhou', 'xihu'],
      expect.any(Array),
    )
  })

  it('applies custom className', () => {
    const { container } = render(
      <NestedSelect.Panel options={options} className="my-panel" />
    )
    expect(container.firstChild).toHaveClass('my-panel')
  })
})
