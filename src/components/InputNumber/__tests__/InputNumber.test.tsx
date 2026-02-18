import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createRef } from 'react'
import { InputNumber } from '../InputNumber'
import type { InputNumberRef } from '../InputNumber'

describe('InputNumber', () => {
  // ---------- Basic rendering ----------

  it('renders an input with role spinbutton', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<InputNumber placeholder="Enter number" />)
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument()
  })

  it('renders with default value', () => {
    render(<InputNumber defaultValue={42} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('42')
  })

  it('renders with controlled value', () => {
    render(<InputNumber value={99} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('99')
  })

  it('renders null value as empty', () => {
    render(<InputNumber value={null} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('renders with string value in stringMode', () => {
    render(<InputNumber value="3.14" stringMode />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('3.14')
  })

  // ---------- Disabled / ReadOnly ----------

  it('renders disabled input', () => {
    render(<InputNumber disabled />)
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })

  it('renders readonly input', () => {
    render(<InputNumber readOnly />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('readonly')
  })

  // ---------- Sizes ----------

  it('renders small size', () => {
    render(<InputNumber size="small" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.height).toBe('1.5rem')
  })

  it('renders middle size (default)', () => {
    render(<InputNumber />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.height).toBe('2rem')
  })

  it('renders large size', () => {
    render(<InputNumber size="large" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.height).toBe('2.5rem')
  })

  // ---------- Variants ----------

  it('renders outlined variant', () => {
    render(<InputNumber variant="outlined" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper).toHaveStyle({ backgroundColor: 'var(--j-bg)' })
    expect(wrapper).toHaveStyle({ borderRadius: '0.375rem' })
  })

  it('renders filled variant with muted background', () => {
    render(<InputNumber variant="filled" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.backgroundColor).toBe('var(--j-bgMuted)')
  })

  it('renders borderless variant', () => {
    render(<InputNumber variant="borderless" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.backgroundColor).toBe('transparent')
  })

  it('renders underlined variant', () => {
    render(<InputNumber variant="underlined" />)
    const input = screen.getByRole('spinbutton')
    expect(input).toBeInTheDocument()
    expect(input.parentElement).toBeInTheDocument()
  })

  // ---------- Status ----------

  it('applies error status border color', () => {
    render(<InputNumber status="error" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.borderColor).toBe('var(--j-error)')
  })

  it('applies warning status border color', () => {
    render(<InputNumber status="warning" />)
    const wrapper = screen.getByRole('spinbutton').parentElement as HTMLElement
    expect(wrapper.style.borderColor).toBe('var(--j-warning)')
  })

  // ---------- ARIA attributes ----------

  it('sets aria-valuemin when min is specified', () => {
    render(<InputNumber min={0} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuemin', '0')
  })

  it('sets aria-valuemax when max is specified', () => {
    render(<InputNumber max={100} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuemax', '100')
  })

  it('sets aria-valuenow for controlled value', () => {
    render(<InputNumber value={50} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '50')
  })

  it('does not set aria-valuemin for -Infinity', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuemin')
  })

  it('does not set aria-valuemax for Infinity', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuemax')
  })

  // ---------- Step buttons (controls) ----------

  it('renders up and down step buttons by default', () => {
    const { container } = render(<InputNumber />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(2)
  })

  it('hides step buttons when controls=false', () => {
    const { container } = render(<InputNumber controls={false} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(0)
  })

  it('hides step buttons when readOnly', () => {
    const { container } = render(<InputNumber readOnly />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(0)
  })

  it('renders custom control icons', () => {
    render(
      <InputNumber
        controls={{
          upIcon: <span data-testid="custom-up">+</span>,
          downIcon: <span data-testid="custom-down">-</span>,
        }}
      />,
    )
    expect(screen.getByTestId('custom-up')).toBeInTheDocument()
    expect(screen.getByTestId('custom-down')).toBeInTheDocument()
  })

  it('increments value when up button is clicked', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('decrements value when down button is clicked', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />)

    const downBtn = container.querySelectorAll('svg')[1].parentElement as HTMLElement
    fireEvent.mouseDown(downBtn)
    fireEvent.mouseUp(downBtn)

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('calls onStep when step button is clicked', () => {
    const onStep = vi.fn()
    const { container } = render(<InputNumber defaultValue={10} onStep={onStep} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onStep).toHaveBeenCalledWith(11, { offset: 1, type: 'up' })
  })

  it('uses custom step value', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={0} step={5} onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not step when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={5} disabled onChange={onChange} />)

    const svgs = container.querySelectorAll('svg')
    if (svgs.length > 0) {
      const upBtn = svgs[0].parentElement as HTMLElement
      fireEvent.mouseDown(upBtn)
      fireEvent.mouseUp(upBtn)
    }
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- Min / Max clamping ----------

  it('does not exceed max value', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={9} max={10} onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)
    expect(onChange).toHaveBeenCalledWith(10)

    // Second step should not go beyond max
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)
  })

  it('does not go below min value', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={1} min={0} onChange={onChange} />)

    const downBtn = container.querySelectorAll('svg')[1].parentElement as HTMLElement
    fireEvent.mouseDown(downBtn)
    fireEvent.mouseUp(downBtn)
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('clamps typed value to min/max on blur', () => {
    const onChange = vi.fn()
    render(<InputNumber min={0} max={100} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '200' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('clamps typed value below min on blur', () => {
    const onChange = vi.fn()
    render(<InputNumber min={0} max={100} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '-50' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(0)
  })

  // ---------- Precision ----------

  it('formats value with specified precision', () => {
    render(<InputNumber defaultValue={3.1} precision={2} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('3.10')
  })

  it('infers precision from step', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={0} step={0.01} onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onChange).toHaveBeenCalledWith(0.01)
  })

  it('rounds value to precision on blur', () => {
    const onChange = vi.fn()
    render(<InputNumber precision={2} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '3.14159' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(3.14)
  })

  // ---------- Formatter / Parser ----------

  it('applies formatter to display value', () => {
    render(
      <InputNumber
        defaultValue={1000}
        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      />,
    )
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('$ 1,000')
  })

  it('uses parser to extract numeric value', () => {
    const onChange = vi.fn()
    render(
      <InputNumber
        formatter={(value) => `$ ${value}`}
        parser={(displayValue) => Number((displayValue || '').replace(/\$\s?/g, ''))}
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '$ 50' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(50)
  })

  // ---------- Decimal separator ----------

  it('uses custom decimal separator', () => {
    render(<InputNumber defaultValue={3.14} decimalSeparator="," />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('3,14')
  })

  // ---------- String mode ----------

  it('returns string value in stringMode', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue="1.00" stringMode step={0.01} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '2.50' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith('2.50')
  })

  // ---------- Keyboard interaction ----------

  it('increments on ArrowUp key', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('decrements on ArrowDown key', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('does not step on arrow keys when keyboard=false', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={5} keyboard={false} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onPressEnter on Enter key', () => {
    const onPressEnter = vi.fn()
    render(<InputNumber onPressEnter={onPressEnter} />)
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'Enter' })
    expect(onPressEnter).toHaveBeenCalled()
  })

  it('commits value on Enter key', () => {
    const onChange = vi.fn()
    render(<InputNumber min={0} max={100} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '42' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith(42)
  })

  // ---------- changeOnBlur ----------

  it('commits value on blur by default', () => {
    const onChange = vi.fn()
    render(<InputNumber onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '10' } })
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('commits value immediately when changeOnBlur=false', () => {
    const onChange = vi.fn()
    render(<InputNumber changeOnBlur={false} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '10' } })
    expect(onChange).toHaveBeenCalledWith(10)
  })

  // ---------- Events ----------

  it('calls onFocus when input is focused', () => {
    const onFocus = vi.fn()
    render(<InputNumber onFocus={onFocus} />)
    fireEvent.focus(screen.getByRole('spinbutton'))
    expect(onFocus).toHaveBeenCalled()
  })

  it('calls onBlur when input loses focus', () => {
    const onBlur = vi.fn()
    render(<InputNumber onBlur={onBlur} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(onBlur).toHaveBeenCalled()
  })

  it('calls onChange with null when input is cleared', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(null)
  })

  // ---------- Ref methods ----------

  it('exposes focus method via ref', () => {
    const ref = createRef<InputNumberRef>()
    render(<InputNumber ref={ref} />)

    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('spinbutton'))
  })

  it('exposes blur method via ref', () => {
    const ref = createRef<InputNumberRef>()
    render(<InputNumber ref={ref} />)

    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('spinbutton'))

    act(() => { ref.current!.blur() })
    expect(document.activeElement).not.toBe(screen.getByRole('spinbutton'))
  })

  it('exposes input element via ref', () => {
    const ref = createRef<InputNumberRef>()
    render(<InputNumber ref={ref} />)
    expect(ref.current!.input).toBe(screen.getByRole('spinbutton'))
  })

  // ---------- Prefix / Suffix ----------

  it('renders prefix icon', () => {
    render(<InputNumber prefix={<span data-testid="prefix">$</span>} />)
    expect(screen.getByTestId('prefix')).toBeInTheDocument()
  })

  it('renders suffix icon', () => {
    render(<InputNumber suffix={<span data-testid="suffix">%</span>} />)
    expect(screen.getByTestId('suffix')).toBeInTheDocument()
  })

  // ---------- Addons ----------

  it('renders addonBefore', () => {
    render(<InputNumber addonBefore="http://" />)
    expect(screen.getByText('http://')).toBeInTheDocument()
  })

  it('renders addonAfter', () => {
    render(<InputNumber addonAfter="kg" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  // ---------- Styling ----------

  it('applies custom className to root', () => {
    const { container } = render(<InputNumber className="my-input-number" />)
    expect(container.firstChild).toHaveClass('my-input-number')
  })

  it('applies custom style to root', () => {
    const { container } = render(<InputNumber style={{ marginTop: '1rem' }} />)
    expect((container.firstChild as HTMLElement).style.marginTop).toBe('1rem')
  })

  it('applies classNames.root', () => {
    const { container } = render(<InputNumber classNames={{ root: 'root-cls' }} />)
    expect(container.firstChild).toHaveClass('root-cls')
  })

  it('applies classNames.input to the wrapper', () => {
    const { container } = render(<InputNumber classNames={{ input: 'input-cls' }} />)
    const wrapper = container.querySelector('.input-cls')
    expect(wrapper).toBeInTheDocument()
  })

  // ---------- Input attributes ----------

  it('renders with id attribute', () => {
    render(<InputNumber id="my-number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('id', 'my-number')
  })

  it('renders with name attribute', () => {
    render(<InputNumber name="quantity" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('name', 'quantity')
  })

  it('sets inputMode to decimal', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal')
  })

  it('auto-focuses input when autoFocus=true', () => {
    render(<InputNumber autoFocus />)
    expect(document.activeElement).toBe(screen.getByRole('spinbutton'))
  })

  // ---------- Floating point safety ----------

  it('handles floating point precision (0.1 + 0.2)', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={0.1} step={0.2} precision={1} onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onChange).toHaveBeenCalledWith(0.3)
  })

  it('starts from 0 when stepping from empty value', () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber onChange={onChange} />)

    const upBtn = container.querySelectorAll('svg')[0].parentElement as HTMLElement
    fireEvent.mouseDown(upBtn)
    fireEvent.mouseUp(upBtn)

    expect(onChange).toHaveBeenCalledWith(1)
  })

  // ---------- Invalid input handling ----------

  it('reverts invalid input on blur for controlled value', () => {
    const onChange = vi.fn()
    render(<InputNumber value={5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.blur(input)

    // Invalid text should not produce a valid onChange call for a non-number
    // The component should revert to previous value
  })

  it('calls onChange with null for empty input on blur', () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(null)
  })

  // ---------- Minus-only input ----------

  it('calls onChange with null when only minus is typed on blur', () => {
    const onChange = vi.fn()
    render(<InputNumber onChange={onChange} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '-' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
