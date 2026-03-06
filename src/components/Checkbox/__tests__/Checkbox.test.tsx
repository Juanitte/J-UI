import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  // ---------- Basic rendering ----------

  it('renders a checkbox input', () => {
    render(<Checkbox>Accept</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders children as label text', () => {
    render(<Checkbox>Terms and Conditions</Checkbox>)
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument()
  })

  it('does not render label span when children is undefined', () => {
    const { container } = render(<Checkbox />)
    // Only the checkbox box span should exist, no label span
    const label = container.querySelector('label')!
    // label > span.checkbox + (no label span)
    expect(label.children).toHaveLength(1)
  })

  it('renders inside a <label> element', () => {
    const { container } = render(<Checkbox>Click me</Checkbox>)
    const label = container.querySelector('label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('Click me')
  })

  // ---------- Uncontrolled ----------

  it('is unchecked by default', () => {
    render(<Checkbox>Opt</Checkbox>)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('respects defaultChecked', () => {
    render(<Checkbox defaultChecked>Opt</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('toggles checked state when clicked (uncontrolled)', () => {
    render(<Checkbox>Toggle</Checkbox>)
    const input = screen.getByRole('checkbox')
    expect(input).not.toBeChecked()

    fireEvent.click(input)
    expect(input).toBeChecked()

    fireEvent.click(input)
    expect(input).not.toBeChecked()
  })

  // ---------- Controlled ----------

  it('respects controlled checked=true', () => {
    render(<Checkbox checked onChange={() => {}}>On</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('respects controlled checked=false', () => {
    render(<Checkbox checked={false} onChange={() => {}}>Off</Checkbox>)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('does not toggle when controlled without state update', () => {
    render(<Checkbox checked={false} onChange={() => {}}>Static</Checkbox>)
    const input = screen.getByRole('checkbox')
    fireEvent.click(input)
    expect(input).not.toBeChecked()
  })

  // ---------- onChange ----------

  it('calls onChange with checked=true when checking', () => {
    const onChange = vi.fn()
    render(<Checkbox onChange={onChange}>Test</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ checked: true }),
      }),
    )
  })

  it('calls onChange with checked=false when unchecking', () => {
    const onChange = vi.fn()
    render(<Checkbox defaultChecked onChange={onChange}>Test</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ checked: false }),
      }),
    )
  })

  it('includes value in onChange event', () => {
    const onChange = vi.fn()
    render(<Checkbox value="agree" onChange={onChange}>Agree</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ checked: true, value: 'agree' }),
      }),
    )
  })

  // ---------- Disabled ----------

  it('renders disabled input when disabled', () => {
    render(<Checkbox disabled>Disabled</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<Checkbox disabled onChange={onChange}>Nope</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies disabled class when disabled', () => {
    const { container } = render(<Checkbox disabled>Dim</Checkbox>)
    const label = container.querySelector('label')!
    expect(label).toHaveClass('ino-checkbox--disabled')
  })

  // ---------- Indeterminate ----------

  it('shows minus icon when indeterminate', () => {
    const { container } = render(<Checkbox indeterminate>Partial</Checkbox>)
    // MinusIcon renders a <line> element
    expect(container.querySelector('line')).toBeInTheDocument()
  })

  it('shows check icon when checked and not indeterminate', () => {
    const { container } = render(<Checkbox defaultChecked>Done</Checkbox>)
    // CheckIcon renders a <polyline> element
    expect(container.querySelector('polyline')).toBeInTheDocument()
  })

  it('prefers indeterminate over checked visually', () => {
    const { container } = render(
      <Checkbox checked indeterminate onChange={() => {}}>Both</Checkbox>,
    )
    // indeterminate renders MinusIcon (<line>)
    expect(container.querySelector('line')).toBeInTheDocument()
  })

  it('does not show indicator when unchecked and not indeterminate', () => {
    const { container } = render(<Checkbox>Empty</Checkbox>)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('sets native indeterminate property on input', () => {
    render(<Checkbox indeterminate>Partial</Checkbox>)
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  // ---------- autoFocus ----------

  it('focuses the input on mount when autoFocus is true', () => {
    render(<Checkbox autoFocus>Focus me</Checkbox>)
    expect(screen.getByRole('checkbox')).toHaveFocus()
  })

  // ---------- HTML attributes ----------

  it('sets id on input', () => {
    render(<Checkbox id="my-cb">Labelled</Checkbox>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'my-cb')
  })

  it('sets name on input', () => {
    render(<Checkbox name="agreement">Agree</Checkbox>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'agreement')
  })

  it('sets tabIndex on input', () => {
    render(<Checkbox tabIndex={-1}>Skip</Checkbox>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabindex', '-1')
  })

  it('sets value attribute on input', () => {
    render(<Checkbox value="yes">Yes</Checkbox>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'yes')
  })

  // ---------- Focus ring ----------

  it('focus ring is handled via CSS :focus-visible', () => {
    const { container } = render(<Checkbox>Focus ring</Checkbox>)
    const box = container.querySelector('label > span')! as HTMLElement
    // Focus ring is now CSS-only via :focus-visible pseudo-class on .ino-checkbox__box
    expect(box).toHaveClass('ino-checkbox__box')
  })

  // ---------- Styling ----------

  it('applies className to root label', () => {
    const { container } = render(<Checkbox className="custom-root">Styled</Checkbox>)
    expect(container.querySelector('label')).toHaveClass('custom-root')
  })

  it('applies style to root label', () => {
    const { container } = render(<Checkbox style={{ margin: 10 }}>Styled</Checkbox>)
    expect(container.querySelector('label')!.style.margin).toBe('10px')
  })

  it('applies classNames.root to root label', () => {
    const { container } = render(
      <Checkbox classNames={{ root: 'cn-root' }}>Slots</Checkbox>,
    )
    expect(container.querySelector('label')).toHaveClass('cn-root')
  })

  it('applies classNames.checkbox to checkbox box', () => {
    const { container } = render(
      <Checkbox classNames={{ checkbox: 'cn-box' }}>Slots</Checkbox>,
    )
    expect(container.querySelector('.cn-box')).toBeInTheDocument()
  })

  it('applies classNames.indicator when active', () => {
    const { container } = render(
      <Checkbox defaultChecked classNames={{ indicator: 'cn-ind' }}>Slots</Checkbox>,
    )
    expect(container.querySelector('.cn-ind')).toBeInTheDocument()
  })

  it('applies classNames.label to label span', () => {
    const { container } = render(
      <Checkbox classNames={{ label: 'cn-label' }}>Slots</Checkbox>,
    )
    expect(container.querySelector('.cn-label')).toBeInTheDocument()
  })

  it('applies styles.checkbox to checkbox box', () => {
    const { container } = render(
      <Checkbox styles={{ checkbox: { borderRadius: 999 } }}>Round</Checkbox>,
    )
    const box = container.querySelector('label > span') as HTMLElement
    expect(box.style.borderRadius).toBe('999px')
  })

  it('applies styles.label to label span', () => {
    render(
      <Checkbox styles={{ label: { fontWeight: 'bold' } }}>Bold</Checkbox>,
    )
    const label = screen.getByText('Bold')
    expect(label.style.fontWeight).toBe('bold')
  })
})

// ============================================================================
// Checkbox.Group
// ============================================================================

describe('Checkbox.Group', () => {
  // ---------- Basic rendering ----------

  it('renders a group role container', () => {
    render(<Checkbox.Group options={['A', 'B']} />)
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders checkboxes from string options', () => {
    render(<Checkbox.Group options={['Apple', 'Banana']} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('renders checkboxes from number options', () => {
    render(<Checkbox.Group options={[1, 2, 3]} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('renders checkboxes from object options', () => {
    const opts = [
      { label: 'Red', value: 'r' },
      { label: 'Green', value: 'g' },
    ]
    render(<Checkbox.Group options={opts} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
  })

  it('renders Checkbox children instead of options', () => {
    render(
      <Checkbox.Group>
        <Checkbox value="x">X</Checkbox>
        <Checkbox value="y">Y</Checkbox>
      </Checkbox.Group>,
    )
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  // ---------- Uncontrolled ----------

  it('starts with defaultValue checked', () => {
    render(<Checkbox.Group options={['A', 'B', 'C']} defaultValue={['B']} />)
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes[0]).not.toBeChecked() // A
    expect(boxes[1]).toBeChecked()     // B
    expect(boxes[2]).not.toBeChecked() // C
  })

  it('toggles values when clicked (uncontrolled)', () => {
    render(<Checkbox.Group options={['A', 'B']} />)
    const boxes = screen.getAllByRole('checkbox')

    fireEvent.click(boxes[0])
    expect(boxes[0]).toBeChecked()

    fireEvent.click(boxes[0])
    expect(boxes[0]).not.toBeChecked()
  })

  // ---------- Controlled ----------

  it('respects controlled value', () => {
    render(<Checkbox.Group options={['A', 'B']} value={['A']} onChange={() => {}} />)
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes[0]).toBeChecked()
    expect(boxes[1]).not.toBeChecked()
  })

  it('does not toggle when controlled without state update', () => {
    render(<Checkbox.Group options={['A', 'B']} value={['A']} onChange={() => {}} />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[1])
    expect(boxes[1]).not.toBeChecked()
  })

  // ---------- onChange ----------

  it('calls onChange with added value on check', () => {
    const onChange = vi.fn()
    render(<Checkbox.Group options={['A', 'B']} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(onChange).toHaveBeenCalledWith(['A'])
  })

  it('calls onChange with removed value on uncheck', () => {
    const onChange = vi.fn()
    render(<Checkbox.Group options={['A', 'B']} defaultValue={['A', 'B']} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(onChange).toHaveBeenCalledWith(['B'])
  })

  // ---------- Disabled ----------

  it('disables all checkboxes when group is disabled', () => {
    render(<Checkbox.Group options={['A', 'B']} disabled />)
    screen.getAllByRole('checkbox').forEach(cb => {
      expect(cb).toBeDisabled()
    })
  })

  it('disables individual option via option.disabled', () => {
    const opts = [
      { label: 'OK', value: 'ok' },
      { label: 'No', value: 'no', disabled: true },
    ]
    render(<Checkbox.Group options={opts} />)
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes[0]).not.toBeDisabled()
    expect(boxes[1]).toBeDisabled()
  })

  it('does not call onChange for disabled group', () => {
    const onChange = vi.fn()
    render(<Checkbox.Group options={['A']} disabled onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- name ----------

  it('sets name attribute on all inputs', () => {
    render(<Checkbox.Group options={['A', 'B']} name="colors" />)
    screen.getAllByRole('checkbox').forEach(cb => {
      expect(cb).toHaveAttribute('name', 'colors')
    })
  })

  // ---------- Styling ----------

  it('applies className to group root', () => {
    render(<Checkbox.Group options={['A']} className="grp" />)
    expect(screen.getByRole('group')).toHaveClass('grp')
  })

  it('applies style to group root', () => {
    render(<Checkbox.Group options={['A']} style={{ gap: 16 }} />)
    expect(screen.getByRole('group').style.gap).toBe('16px')
  })

  it('applies classNames.root to group root', () => {
    render(<Checkbox.Group options={['A']} classNames={{ root: 'cn-grp' }} />)
    expect(screen.getByRole('group')).toHaveClass('cn-grp')
  })

  // ---------- Children with group context ----------

  it('manages Checkbox children via context', () => {
    const onChange = vi.fn()
    render(
      <Checkbox.Group onChange={onChange}>
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
      </Checkbox.Group>,
    )
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(onChange).toHaveBeenCalledWith(['a'])
  })
})
