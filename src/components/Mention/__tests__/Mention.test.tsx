import { vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { Mention } from '../Mention'
import type { MentionRef } from '../Mention'

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

const baseOptions = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
]

/** Simulate typing @text into the textarea to trigger mention detection */
function triggerMention(textarea: HTMLTextAreaElement, text: string, prefix = '@') {
  const value = prefix + text
  fireEvent.change(textarea, { target: { value, selectionStart: value.length } })
}

describe('Mention', () => {
  // ---------- Basic rendering ----------

  it('renders a textarea element', () => {
    render(<Mention />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Mention placeholder="Type @ to mention" />)
    expect(screen.getByPlaceholderText('Type @ to mention')).toBeInTheDocument()
  })

  it('renders with default value', () => {
    render(<Mention defaultValue="Hello @alice " />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('Hello @alice ')
  })

  it('renders with controlled value', () => {
    render(<Mention value="Controlled text" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('Controlled text')
  })

  // ---------- Disabled / ReadOnly ----------

  it('renders disabled textarea', () => {
    render(<Mention disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders readonly textarea', () => {
    render(<Mention readOnly />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  // ---------- Sizes ----------

  it('renders small size', () => {
    render(<Mention size="small" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea).toHaveStyle({ fontSize: '0.75rem' })
  })

  it('renders middle size (default)', () => {
    render(<Mention />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea).toHaveStyle({ fontSize: '0.875rem' })
  })

  it('renders large size', () => {
    render(<Mention size="large" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea).toHaveStyle({ fontSize: '1rem' })
  })

  // ---------- Variants ----------

  it('renders outlined variant', () => {
    render(<Mention variant="outlined" />)
    const wrapper = screen.getByRole('textbox').parentElement as HTMLElement
    expect(wrapper).toHaveStyle({ backgroundColor: 'var(--j-bg)' })
  })

  it('renders filled variant with muted background', () => {
    render(<Mention variant="filled" />)
    const wrapper = screen.getByRole('textbox').parentElement as HTMLElement
    expect(wrapper.style.backgroundColor).toBe('var(--j-bgMuted)')
  })

  it('renders borderless variant', () => {
    render(<Mention variant="borderless" />)
    const wrapper = screen.getByRole('textbox').parentElement as HTMLElement
    expect(wrapper.style.backgroundColor).toBe('transparent')
  })

  it('renders underlined variant', () => {
    render(<Mention variant="underlined" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  // ---------- Status ----------

  it('applies error status border color', () => {
    render(<Mention status="error" />)
    const wrapper = screen.getByRole('textbox').parentElement as HTMLElement
    expect(wrapper.style.borderColor).toBe('var(--j-error)')
  })

  it('applies warning status border color', () => {
    render(<Mention status="warning" />)
    const wrapper = screen.getByRole('textbox').parentElement as HTMLElement
    expect(wrapper.style.borderColor).toBe('var(--j-warning)')
  })

  // ---------- ARIA attributes ----------

  it('sets aria-haspopup="listbox"', () => {
    render(<Mention />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('sets aria-expanded=false when dropdown is closed', () => {
    render(<Mention />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('sets aria-autocomplete="list"', () => {
    render(<Mention />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'list')
  })

  // ---------- Dropdown trigger ----------

  it('opens dropdown when prefix is typed', () => {
    const { container } = render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()
  })

  it('shows filtered options matching search text', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'al')
    expect(screen.getByRole('option')).toHaveTextContent('Alice')
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('shows all options when search text is empty', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
  })

  it('shows notFoundContent when no options match', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'xyz')
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('shows custom notFoundContent', () => {
    render(<Mention options={baseOptions} notFoundContent="Nothing here" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'xyz')
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('hides dropdown when notFoundContent is null and no matches', () => {
    const { container } = render(<Mention options={baseOptions} notFoundContent={null} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'xyz')
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  it('does not open dropdown when disabled', () => {
    const { container } = render(<Mention options={baseOptions} disabled />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: '@', selectionStart: 1 } })
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  it('does not open dropdown when readOnly', () => {
    const { container } = render(<Mention options={baseOptions} readOnly />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: '@', selectionStart: 1 } })
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  // ---------- Option selection ----------

  it('inserts mention when option is clicked', () => {
    const onChange = vi.fn()
    render(<Mention options={baseOptions} onChange={onChange} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    fireEvent.click(screen.getByText('Alice'))

    expect(onChange).toHaveBeenCalledWith('@alice ')
  })

  it('calls onSelect when option is selected', () => {
    const onSelect = vi.fn()
    render(<Mention options={baseOptions} onSelect={onSelect} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    fireEvent.click(screen.getByText('Bob'))

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'bob' }),
      '@',
    )
  })

  it('closes dropdown after selecting an option', () => {
    const { container } = render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Carol'))
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  it('does not select disabled options', () => {
    const onChange = vi.fn()
    const options = [
      { value: 'alice', label: 'Alice', disabled: true },
      { value: 'bob', label: 'Bob' },
    ]
    render(<Mention options={options} onChange={onChange} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    // onChange is called once for the @ typing, reset it
    onChange.mockClear()

    fireEvent.click(screen.getByText('Alice'))
    // Should not produce a new onChange call for a disabled option
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- Custom split ----------

  it('uses custom split character', () => {
    const onChange = vi.fn()
    render(<Mention options={baseOptions} split=", " onChange={onChange} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    fireEvent.click(screen.getByText('Alice'))

    expect(onChange).toHaveBeenCalledWith('@alice, ')
  })

  // ---------- Custom prefix ----------

  it('supports custom prefix character', () => {
    const { container } = render(<Mention options={baseOptions} prefix="#" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '', '#')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()
  })

  it('supports multiple prefix characters', () => {
    const { container } = render(<Mention options={baseOptions} prefix={['@', '#']} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '', '@')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()
  })

  // ---------- onSearch ----------

  it('calls onSearch when mention is detected', () => {
    const onSearch = vi.fn()
    render(<Mention options={baseOptions} onSearch={onSearch} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'al')
    expect(onSearch).toHaveBeenCalledWith('al', '@')
  })

  // ---------- filterOption ----------

  it('disables filtering when filterOption=false', () => {
    render(<Mention options={baseOptions} filterOption={false} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'xyz')
    // All options should still be shown when filterOption is false
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
  })

  it('uses custom filterOption function', () => {
    const customFilter = (_input: string, option: { value: string }) => option.value.startsWith('b')
    render(<Mention options={baseOptions} filterOption={customFilter} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Bob')
  })

  // ---------- validateSearch ----------

  it('prevents dropdown when validateSearch returns false', () => {
    const validateSearch = vi.fn(() => false)
    const { container } = render(<Mention options={baseOptions} validateSearch={validateSearch} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, 'al')
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
    expect(validateSearch).toHaveBeenCalled()
  })

  // ---------- Keyboard navigation ----------

  it('navigates down with ArrowDown', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const options = screen.getAllByRole('option')

    // First option should be active by default
    expect(options[0]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('navigates up with ArrowUp', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const options = screen.getAllByRole('option')

    // Move down first
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    expect(options[1]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(textarea, { key: 'ArrowUp' })
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps around with ArrowDown at the end', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const options = screen.getAllByRole('option')

    // Navigate to last option
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    expect(options[2]).toHaveAttribute('aria-selected', 'true')

    // One more should wrap to first
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('selects option with Enter key', () => {
    const onChange = vi.fn()
    render(<Mention options={baseOptions} onChange={onChange} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    fireEvent.keyDown(textarea, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('@alice ')
  })

  it('closes dropdown with Escape key', () => {
    const { container } = render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()

    fireEvent.keyDown(textarea, { key: 'Escape' })
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  it('skips disabled options during keyboard navigation', () => {
    const options = [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob', disabled: true },
      { value: 'carol', label: 'Carol' },
    ]
    render(<Mention options={options} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const optionEls = screen.getAllByRole('option')

    // First enabled option is active
    expect(optionEls[0]).toHaveAttribute('aria-selected', 'true')

    // ArrowDown should skip disabled Bob and go to Carol
    fireEvent.keyDown(textarea, { key: 'ArrowDown' })
    expect(optionEls[2]).toHaveAttribute('aria-selected', 'true')
  })

  // ---------- Events ----------

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Mention onChange={onChange} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Hello', selectionStart: 5 } })
    expect(onChange).toHaveBeenCalledWith('Hello')
  })

  it('calls onFocus when textarea is focused', () => {
    const onFocus = vi.fn()
    render(<Mention onFocus={onFocus} />)
    fireEvent.focus(screen.getByRole('textbox'))
    expect(onFocus).toHaveBeenCalled()
  })

  it('calls onBlur when textarea loses focus', () => {
    const onBlur = vi.fn()
    render(<Mention onBlur={onBlur} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.focus(textarea)
    fireEvent.blur(textarea)
    expect(onBlur).toHaveBeenCalled()
  })

  // ---------- allowClear ----------

  it('shows clear button when allowClear=true and has value', () => {
    render(<Mention allowClear defaultValue="some text" />)
    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<Mention allowClear />)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  it('clears value when clear button is clicked', () => {
    const onChange = vi.fn()
    render(<Mention allowClear defaultValue="text" onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Clear'))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('does not show clear button when disabled', () => {
    render(<Mention allowClear defaultValue="text" disabled />)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  it('does not show clear button when readOnly', () => {
    render(<Mention allowClear defaultValue="text" readOnly />)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  // ---------- Ref methods ----------

  it('exposes focus method via ref', () => {
    const ref = createRef<MentionRef>()
    render(<Mention ref={ref} />)

    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  it('exposes blur method via ref', () => {
    const ref = createRef<MentionRef>()
    render(<Mention ref={ref} />)

    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('textbox'))

    act(() => { ref.current!.blur() })
    expect(document.activeElement).not.toBe(screen.getByRole('textbox'))
  })

  it('exposes textarea element via ref', () => {
    const ref = createRef<MentionRef>()
    render(<Mention ref={ref} />)
    expect(ref.current!.textarea).toBe(screen.getByRole('textbox'))
  })

  // ---------- Rows ----------

  it('renders with custom rows', () => {
    render(<Mention rows={4} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4')
  })

  it('sets rows=1 when autoSize is enabled', () => {
    render(<Mention autoSize />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '1')
  })

  // ---------- Styling ----------

  it('applies custom className to root', () => {
    const { container } = render(<Mention className="my-mention" />)
    expect(container.firstChild).toHaveClass('my-mention')
  })

  it('applies custom style to root', () => {
    const { container } = render(<Mention style={{ marginTop: '1rem' }} />)
    expect((container.firstChild as HTMLElement).style.marginTop).toBe('1rem')
  })

  it('applies classNames.root', () => {
    const { container } = render(<Mention classNames={{ root: 'root-cls' }} />)
    expect(container.firstChild).toHaveClass('root-cls')
  })

  it('applies classNames.textarea', () => {
    render(<Mention classNames={{ textarea: 'ta-cls' }} />)
    expect(screen.getByRole('textbox')).toHaveClass('ta-cls')
  })

  // ---------- Input attributes ----------

  it('renders with id attribute', () => {
    render(<Mention id="my-mention" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-mention')
  })

  it('auto-focuses textarea when autoFocus=true', () => {
    render(<Mention autoFocus />)
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  // ---------- Option rendering ----------

  it('renders option label when provided', () => {
    const options = [{ value: 'user1', label: 'User One' }]
    render(<Mention options={options} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(screen.getByText('User One')).toBeInTheDocument()
  })

  it('renders option value when label is not provided', () => {
    const options = [{ value: 'user1' }]
    render(<Mention options={options} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('marks disabled options with aria-disabled', () => {
    const options = [{ value: 'disabled_user', label: 'Disabled', disabled: true }]
    render(<Mention options={options} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true')
  })

  // ---------- Placement ----------

  it('renders dropdown below by default', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const dropdown = screen.getByRole('listbox')
    expect(dropdown.style.top).toBe('100%')
  })

  it('renders dropdown above when placement="top"', () => {
    render(<Mention options={baseOptions} placement="top" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    const dropdown = screen.getByRole('listbox')
    expect(dropdown.style.bottom).toBe('100%')
  })

  // ---------- Resize ----------

  it('disables resize by default', () => {
    render(<Mention />)
    expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'none' })
  })

  it('enables vertical resize when resize=true', () => {
    render(<Mention resize />)
    expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'vertical' })
  })

  it('disables resize when autoSize is active', () => {
    render(<Mention resize autoSize />)
    expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'none' })
  })

  // ---------- Click outside ----------

  it('closes dropdown on click outside', () => {
    const { container } = render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    triggerMention(textarea, '')
    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(container.querySelector('[role="listbox"]')).not.toBeInTheDocument()
  })

  // ---------- Mention context detection ----------

  it('detects mention after existing text', () => {
    render(<Mention options={baseOptions} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    const value = 'Hello @'
    fireEvent.change(textarea, { target: { value, selectionStart: value.length } })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
  })

  it('detects mention with preceding text and search term', () => {
    const onSearch = vi.fn()
    render(<Mention options={baseOptions} onSearch={onSearch} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

    const value = 'Hello @bo'
    fireEvent.change(textarea, { target: { value, selectionStart: value.length } })

    expect(onSearch).toHaveBeenCalledWith('bo', '@')
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
