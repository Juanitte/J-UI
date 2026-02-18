import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Radio } from '../Radio'

// ============================================================================
// Radio (standalone)
// ============================================================================

describe('Radio', () => {
  // ---------- Basic rendering ----------

  it('renders a radio input', () => {
    render(<Radio />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders children as label text', () => {
    render(<Radio>Option A</Radio>)
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })

  it('does not render label span when children is undefined', () => {
    const { container } = render(<Radio />)
    // Only the radio box span should exist, no label span
    const label = container.querySelector('label')!
    // label > span.radioBox > input + maybe indicator
    // No extra label span
    const spans = label.querySelectorAll(':scope > span')
    expect(spans).toHaveLength(1) // only the radio box
  })

  // ---------- Checked ----------

  it('is unchecked by default', () => {
    render(<Radio />)
    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('respects defaultChecked', () => {
    render(<Radio defaultChecked />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('respects controlled checked', () => {
    render(<Radio checked />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('shows indicator dot when checked', () => {
    const { container } = render(<Radio checked />)
    // Indicator is a small white circle inside the radio box
    const radioBox = container.querySelector('label > span') as HTMLElement
    const indicator = radioBox.querySelector('span')
    expect(indicator).toBeInTheDocument()
    expect(indicator!.style.borderRadius).toBe('50%')
  })

  it('does not show indicator when unchecked', () => {
    const { container } = render(<Radio />)
    const radioBox = container.querySelector('label > span') as HTMLElement
    // Only the hidden input is inside, no indicator span
    const innerSpans = radioBox.querySelectorAll('span')
    expect(innerSpans).toHaveLength(0)
  })

  // ---------- Disabled ----------

  it('disables the input when disabled', () => {
    render(<Radio disabled>Disabled</Radio>)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('applies opacity when disabled', () => {
    const { container } = render(<Radio disabled />)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.opacity).toBe('0.5')
  })

  it('applies cursor not-allowed when disabled', () => {
    const { container } = render(<Radio disabled />)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.cursor).toBe('not-allowed')
  })

  // ---------- onChange ----------

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Radio onChange={onChange} value="a">A</Radio>)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.checked).toBe(true)
    expect(onChange.mock.calls[0][0].target.value).toBe('a')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<Radio onChange={onChange} disabled>A</Radio>)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('updates internal state in uncontrolled mode', () => {
    render(<Radio>A</Radio>)
    const radio = screen.getByRole('radio')
    fireEvent.click(radio)
    expect(radio).toBeChecked()
  })

  // ---------- Attributes ----------

  it('passes id to input', () => {
    render(<Radio id="my-radio" />)
    expect(screen.getByRole('radio')).toHaveAttribute('id', 'my-radio')
  })

  it('passes name to input', () => {
    render(<Radio name="group1" />)
    expect(screen.getByRole('radio')).toHaveAttribute('name', 'group1')
  })

  it('passes tabIndex to input', () => {
    render(<Radio tabIndex={-1} />)
    expect(screen.getByRole('radio')).toHaveAttribute('tabindex', '-1')
  })

  it('passes value to input as string', () => {
    render(<Radio value={42} />)
    expect(screen.getByRole('radio')).toHaveAttribute('value', '42')
  })

  // ---------- autoFocus ----------

  it('auto-focuses the input when autoFocus is true', () => {
    render(<Radio autoFocus />)
    expect(document.activeElement).toBe(screen.getByRole('radio'))
  })

  // ---------- Styling ----------

  it('applies className to root label', () => {
    const { container } = render(<Radio className="custom-radio" />)
    expect(container.querySelector('label')).toHaveClass('custom-radio')
  })

  it('applies style to root label', () => {
    const { container } = render(<Radio style={{ marginTop: '10px' }} />)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.marginTop).toBe('10px')
  })

  it('applies classNames.root', () => {
    const { container } = render(<Radio classNames={{ root: 'root-cls' }} />)
    expect(container.querySelector('label')).toHaveClass('root-cls')
  })

  it('applies classNames.radio to the radio box', () => {
    const { container } = render(<Radio classNames={{ radio: 'radio-cls' }} />)
    const radioBox = container.querySelector('.radio-cls')
    expect(radioBox).toBeInTheDocument()
  })

  it('applies classNames.label to the label span', () => {
    render(<Radio classNames={{ label: 'label-cls' }}>Text</Radio>)
    expect(document.querySelector('.label-cls')).toBeInTheDocument()
  })

  it('applies classNames.indicator when checked', () => {
    const { container } = render(<Radio checked classNames={{ indicator: 'ind-cls' }} />)
    expect(container.querySelector('.ind-cls')).toBeInTheDocument()
  })

  it('applies styles.root to root label', () => {
    const { container } = render(<Radio styles={{ root: { padding: '5px' } }} />)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.padding).toBe('5px')
  })

  it('applies styles.radio to radio box', () => {
    const { container } = render(<Radio styles={{ radio: { border: '3px solid red' } }} />)
    const radioBox = container.querySelector('label > span') as HTMLElement
    expect(radioBox.style.border).toBe('3px solid red')
  })

  it('applies styles.label to label span', () => {
    const { container } = render(<Radio styles={{ label: { color: 'red' } }}>Text</Radio>)
    const labelSpan = container.querySelector('label')!.querySelectorAll(':scope > span')[1] as HTMLElement
    expect(labelSpan.style.color).toBe('red')
  })

  // ---------- Radio box visual ----------

  it('applies circular shape to radio box', () => {
    const { container } = render(<Radio />)
    const radioBox = container.querySelector('label > span') as HTMLElement
    expect(radioBox.style.borderRadius).toBe('50%')
  })

  it('applies primary background when checked', () => {
    const { container } = render(<Radio checked />)
    const radioBox = container.querySelector('label > span') as HTMLElement
    expect(radioBox.style.backgroundColor).toContain('var(--j-primary)')
  })
})

// ============================================================================
// Radio.Button (standalone, outside group)
// ============================================================================

describe('Radio.Button', () => {
  it('renders a radio input inside a label', () => {
    render(<Radio.Button>Option</Radio.Button>)
    expect(screen.getByRole('radio')).toBeInTheDocument()
    expect(screen.getByText('Option')).toBeInTheDocument()
  })

  it('applies middle size by default', () => {
    const { container } = render(<Radio.Button>Btn</Radio.Button>)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.height).toBe('2rem')
  })

  it('is unchecked by default', () => {
    render(<Radio.Button>Btn</Radio.Button>)
    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('respects controlled checked', () => {
    render(<Radio.Button checked>Btn</Radio.Button>)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Radio.Button onChange={onChange} value="x">X</Radio.Button>)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('x')
  })

  it('disables the input when disabled', () => {
    render(<Radio.Button disabled>Btn</Radio.Button>)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('applies className to root label', () => {
    const { container } = render(<Radio.Button className="btn-cls">Btn</Radio.Button>)
    expect(container.querySelector('label')).toHaveClass('btn-cls')
  })

  it('applies style to root label', () => {
    const { container } = render(<Radio.Button style={{ color: 'red' }}>Btn</Radio.Button>)
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.color).toBe('red')
  })
})

// ============================================================================
// Radio.Group
// ============================================================================

describe('Radio.Group', () => {
  // ---------- Basic rendering ----------

  it('renders a radiogroup role', () => {
    render(
      <Radio.Group>
        <Radio value="a">A</Radio>
      </Radio.Group>,
    )
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('renders radio children', () => {
    render(
      <Radio.Group>
        <Radio value="a">Alpha</Radio>
        <Radio value="b">Beta</Radio>
      </Radio.Group>,
    )
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  // ---------- Options prop ----------

  it('renders options from string array', () => {
    render(<Radio.Group options={['Red', 'Green', 'Blue']} />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('renders options from number array', () => {
    render(<Radio.Group options={[1, 2, 3]} />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders options from RadioOptionType array', () => {
    const options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ]
    render(<Radio.Group options={options} />)
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('disables individual options via disabled prop', () => {
    const options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b', disabled: true },
    ]
    render(<Radio.Group options={options} />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).not.toBeDisabled()
    expect(radios[1]).toBeDisabled()
  })

  // ---------- defaultValue / value ----------

  it('selects defaultValue', () => {
    render(<Radio.Group options={['A', 'B', 'C']} defaultValue="B" />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).not.toBeChecked()
    expect(radios[1]).toBeChecked()
    expect(radios[2]).not.toBeChecked()
  })

  it('selects controlled value', () => {
    render(<Radio.Group options={['A', 'B']} value="A" />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toBeChecked()
    expect(radios[1]).not.toBeChecked()
  })

  it('switches selection when clicking another radio', () => {
    render(<Radio.Group options={['A', 'B', 'C']} defaultValue="A" />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toBeChecked()

    fireEvent.click(radios[2])
    expect(radios[0]).not.toBeChecked()
    expect(radios[2]).toBeChecked()
  })

  // ---------- onChange ----------

  it('calls onChange with selected value', () => {
    const onChange = vi.fn()
    render(<Radio.Group options={['X', 'Y']} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('radio')[1])
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('Y')
    expect(onChange.mock.calls[0][0].target.checked).toBe(true)
  })

  it('calls onChange with children radios', () => {
    const onChange = vi.fn()
    render(
      <Radio.Group onChange={onChange}>
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
      </Radio.Group>,
    )
    fireEvent.click(screen.getAllByRole('radio')[0])
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('one')
  })

  // ---------- Disabled group ----------

  it('disables all radios when group is disabled', () => {
    render(<Radio.Group options={['A', 'B', 'C']} disabled />)
    screen.getAllByRole('radio').forEach(radio => {
      expect(radio).toBeDisabled()
    })
  })

  it('does not call onChange when group is disabled', () => {
    const onChange = vi.fn()
    render(<Radio.Group options={['A', 'B']} disabled onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('radio')[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- Name ----------

  it('passes name to all radios', () => {
    render(<Radio.Group options={['A', 'B']} name="my-group" />)
    screen.getAllByRole('radio').forEach(radio => {
      expect(radio).toHaveAttribute('name', 'my-group')
    })
  })

  it('passes name to children radios', () => {
    render(
      <Radio.Group name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </Radio.Group>,
    )
    screen.getAllByRole('radio').forEach(radio => {
      expect(radio).toHaveAttribute('name', 'grp')
    })
  })

  // ---------- optionType='button' ----------

  it('renders button-style options with optionType=button', () => {
    const { container } = render(
      <Radio.Group options={['X', 'Y', 'Z']} optionType="button" />,
    )
    // Button-type radios are rendered inside labels with height
    const labels = container.querySelectorAll('label')
    expect(labels).toHaveLength(3)
    // First label should have border-radius only on left side
    expect(labels[0].style.borderRadius).toContain('0.375rem 0 0 0.375rem')
    // Last label should have border-radius only on right side
    expect(labels[2].style.borderRadius).toContain('0 0.375rem 0.375rem 0')
  })

  it('renders single button with full border-radius', () => {
    const { container } = render(
      <Radio.Group options={['Only']} optionType="button" />,
    )
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.borderRadius).toBe('0.375rem')
  })

  it('renders middle button without border-radius', () => {
    const { container } = render(
      <Radio.Group options={['A', 'B', 'C']} optionType="button" />,
    )
    const labels = container.querySelectorAll('label')
    expect(labels[1].style.borderRadius).toBe('0')
  })

  it('applies negative margin on non-first buttons', () => {
    const { container } = render(
      <Radio.Group options={['A', 'B', 'C']} optionType="button" />,
    )
    const labels = container.querySelectorAll('label')
    expect(labels[1].style.marginLeft).toBe('-1px')
    expect(labels[2].style.marginLeft).toBe('-1px')
  })

  it('renders button-style children with optionType=button', () => {
    const { container } = render(
      <Radio.Group optionType="button">
        <Radio.Button value="a">A</Radio.Button>
        <Radio.Button value="b">B</Radio.Button>
      </Radio.Group>,
    )
    const labels = container.querySelectorAll('label')
    expect(labels).toHaveLength(2)
    // First gets left radius, last gets right radius
    expect(labels[0].style.borderRadius).toContain('0.375rem 0 0 0.375rem')
    expect(labels[1].style.borderRadius).toContain('0 0.375rem 0.375rem 0')
  })

  // ---------- buttonStyle ----------

  it('applies solid style on checked button', () => {
    const { container } = render(
      <Radio.Group options={['A', 'B']} optionType="button" buttonStyle="solid" value="A" />,
    )
    const labels = container.querySelectorAll('label')
    // Checked button has primary background
    expect(labels[0].style.backgroundColor).toContain('var(--j-primary)')
    expect(labels[0].style.color).toContain('var(--j-primary-contrast)')
  })

  it('applies outline style on checked button', () => {
    const { container } = render(
      <Radio.Group options={['A', 'B']} optionType="button" buttonStyle="outline" value="A" />,
    )
    const labels = container.querySelectorAll('label')
    // Checked outline button has primary border and text, bg is colorBg
    expect(labels[0].style.borderColor).toContain('var(--j-primary)')
    expect(labels[0].style.color).toContain('var(--j-primary)')
    expect(labels[0].style.backgroundColor).toContain('var(--j-bg)')
  })

  // ---------- Sizes ----------

  it('applies small size to button options', () => {
    const { container } = render(
      <Radio.Group options={['A']} optionType="button" size="small" />,
    )
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.height).toBe('1.5rem')
    expect(label.style.fontSize).toBe('0.75rem')
  })

  it('applies middle size to button options (default)', () => {
    const { container } = render(
      <Radio.Group options={['A']} optionType="button" />,
    )
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.height).toBe('2rem')
    expect(label.style.fontSize).toBe('0.875rem')
  })

  it('applies large size to button options', () => {
    const { container } = render(
      <Radio.Group options={['A']} optionType="button" size="large" />,
    )
    const label = container.querySelector('label') as HTMLElement
    expect(label.style.height).toBe('2.5rem')
    expect(label.style.fontSize).toBe('1rem')
  })

  // ---------- Styling ----------

  it('applies className to radiogroup div', () => {
    render(<Radio.Group options={['A']} className="grp-cls" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('grp-cls')
  })

  it('applies style to radiogroup div', () => {
    render(<Radio.Group options={['A']} style={{ margin: '10px' }} />)
    expect(screen.getByRole('radiogroup').style.margin).toBe('10px')
  })

  it('applies classNames.root to radiogroup div', () => {
    render(<Radio.Group options={['A']} classNames={{ root: 'root-cls' }} />)
    expect(screen.getByRole('radiogroup')).toHaveClass('root-cls')
  })

  it('applies styles.root to radiogroup div', () => {
    render(<Radio.Group options={['A']} styles={{ root: { padding: '5px' } }} />)
    expect(screen.getByRole('radiogroup').style.padding).toBe('5px')
  })

  it('uses gap 0 for button optionType', () => {
    render(<Radio.Group options={['A', 'B']} optionType="button" />)
    expect(screen.getByRole('radiogroup').style.gap).toBe('0')
  })

  it('uses gap 0.5rem for default optionType', () => {
    render(<Radio.Group options={['A', 'B']} />)
    expect(screen.getByRole('radiogroup').style.gap).toBe('0.5rem')
  })

  // ---------- Mixed: group disabled + individual disabled ----------

  it('individual disabled overrides when group is not disabled', () => {
    const options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b', disabled: true },
    ]
    render(<Radio.Group options={options} />)
    expect(screen.getAllByRole('radio')[0]).not.toBeDisabled()
    expect(screen.getAllByRole('radio')[1]).toBeDisabled()
  })

  it('group disabled takes precedence over individual enabled', () => {
    const options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]
    render(<Radio.Group options={options} disabled />)
    expect(screen.getAllByRole('radio')[0]).toBeDisabled()
    expect(screen.getAllByRole('radio')[1]).toBeDisabled()
  })

  // ---------- Z-index on checked button ----------

  it('applies z-index on checked button', () => {
    const { container } = render(
      <Radio.Group options={['A', 'B']} optionType="button" value="A" />,
    )
    const labels = container.querySelectorAll('label')
    expect(labels[0].style.zIndex).toBe('1')
    expect(labels[1].style.zIndex).toBe('')
  })

  // ---------- Uncontrolled group ----------

  it('updates selection internally in uncontrolled mode', () => {
    render(<Radio.Group options={['A', 'B', 'C']} />)
    const radios = screen.getAllByRole('radio')

    // None selected initially
    radios.forEach(r => expect(r).not.toBeChecked())

    fireEvent.click(radios[1])
    expect(radios[1]).toBeChecked()
    expect(radios[0]).not.toBeChecked()

    fireEvent.click(radios[2])
    expect(radios[2]).toBeChecked()
    expect(radios[1]).not.toBeChecked()
  })
})
