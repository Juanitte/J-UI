import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker } from '../ColorPicker'

/** Click the default trigger button to open/close the panel.
 *  When the panel is open many buttons exist — the trigger is always the first. */
function clickTrigger() {
  fireEvent.click(screen.getAllByRole('button')[0])
}

/** Get the first textbox (hex input) when the panel is open in hex format */
function getHexInput() {
  return screen.getAllByRole('textbox')[0] as HTMLInputElement
}

describe('ColorPicker', () => {
  // ---------- Basic rendering ----------

  it('renders a trigger button', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not show panel initially', () => {
    const { container } = render(<ColorPicker />)
    // Panel has width 280
    expect(container.querySelector('div[style*="width: 17.5rem"]')).not.toBeInTheDocument()
  })

  // ---------- Open / close ----------

  it('opens panel on trigger click', () => {
    const { container } = render(<ColorPicker />)
    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()
  })

  it('closes panel on second trigger click', () => {
    const { container } = render(<ColorPicker />)
    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()

    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).not.toBeInTheDocument()
  })

  it('closes panel on outside mousedown', () => {
    const { container } = render(<ColorPicker />)
    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(container.querySelector('div[style*="width: 17.5rem"]')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when opening and closing', () => {
    const onOpenChange = vi.fn()
    render(<ColorPicker onOpenChange={onOpenChange} />)

    clickTrigger()
    expect(onOpenChange).toHaveBeenCalledWith(true)

    clickTrigger()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  // ---------- Controlled open ----------

  it('shows panel when open=true', () => {
    const { container } = render(<ColorPicker open />)
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()
  })

  it('hides panel when open=false regardless of click', () => {
    const { container } = render(<ColorPicker open={false} />)
    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).not.toBeInTheDocument()
  })

  // ---------- Disabled ----------

  it('disables the trigger button when disabled', () => {
    render(<ColorPicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies opacity 0.5 when disabled', () => {
    render(<ColorPicker disabled />)
    expect(screen.getByRole('button').style.opacity).toBe('0.5')
  })

  it('does not open when disabled', () => {
    const onOpenChange = vi.fn()
    render(<ColorPicker disabled onOpenChange={onOpenChange} />)
    clickTrigger()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  // ---------- Sizes ----------

  it('renders small size', () => {
    render(<ColorPicker size="sm" />)
    expect(screen.getByRole('button').style.height).toBe('1.5rem')
  })

  it('renders medium size (default)', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('button').style.height).toBe('2rem')
  })

  it('renders large size', () => {
    render(<ColorPicker size="lg" />)
    expect(screen.getByRole('button').style.height).toBe('2.5rem')
  })

  // ---------- showText ----------

  it('displays hex color text when showText=true', () => {
    render(<ColorPicker defaultValue="#ff0000" showText />)
    expect(screen.getByText('#FF0000')).toBeInTheDocument()
  })

  it('displays custom text via showText function', () => {
    render(
      <ColorPicker
        defaultValue="#ff0000"
        showText={(color) => `Custom: ${color.toHexString()}`}
      />,
    )
    expect(screen.getByText(/Custom: #ff0000/)).toBeInTheDocument()
  })

  it('does not show text when showText is false', () => {
    const { container } = render(<ColorPicker defaultValue="#ff0000" />)
    expect(container.textContent).toBe('')
  })

  // ---------- Format switching ----------

  it('shows format selector in panel', () => {
    render(<ColorPicker open />)
    // Default format is 'hex', shown as uppercase button text
    expect(screen.getByText('HEX')).toBeInTheDocument()
  })

  it('switches format when clicking format option', () => {
    const onFormatChange = vi.fn()
    render(<ColorPicker open onFormatChange={onFormatChange} />)

    // Open format dropdown
    fireEvent.click(screen.getByText('HEX'))
    // Select RGB
    fireEvent.click(screen.getByText('RGB'))

    expect(onFormatChange).toHaveBeenCalledWith('rgb')
  })

  it('respects controlled format', () => {
    render(<ColorPicker open format="hsb" />)
    expect(screen.getByText('HSB')).toBeInTheDocument()
  })

  it('respects defaultFormat', () => {
    render(<ColorPicker open defaultFormat="rgb" />)
    expect(screen.getByText('RGB')).toBeInTheDocument()
  })

  // ---------- Hex input ----------

  it('renders hex input in panel', () => {
    render(<ColorPicker open defaultValue="#ff0000" />)
    // Hex format: hex input + alpha input = 2 textboxes
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs).toHaveLength(2)
    expect(inputs[0].value).toBe('#FF0000')
  })

  it('updates color on hex input blur', () => {
    const onChange = vi.fn()
    render(<ColorPicker open defaultValue="#ff0000" onChange={onChange} />)

    const input = getHexInput()
    fireEvent.change(input, { target: { value: '#00ff00' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalled()
    const [colorObj, hex] = onChange.mock.calls[0]
    expect(hex).toBe('#00ff00')
    expect(colorObj.toHexString()).toBe('#00ff00')
  })

  it('updates color on hex input Enter', () => {
    const onChange = vi.fn()
    render(<ColorPicker open defaultValue="#ff0000" onChange={onChange} />)

    const input = getHexInput()
    fireEvent.change(input, { target: { value: '#0000ff' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).toHaveBeenCalled()
  })

  it('reverts invalid hex on blur', () => {
    render(<ColorPicker open defaultValue="#ff0000" />)

    const input = getHexInput()
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.blur(input)

    // Should revert to the current color
    expect(input.value).toBe('#FF0000')
  })

  // ---------- RGB inputs ----------

  it('shows 3 numeric inputs in RGB format', () => {
    render(<ColorPicker open defaultFormat="rgb" defaultValue="#ff0000" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    // RGB: 3 inputs + alpha input = 4
    expect(inputs).toHaveLength(4)
    expect(inputs[0].value).toBe('255')
    expect(inputs[1].value).toBe('0')
    expect(inputs[2].value).toBe('0')
  })

  // ---------- HSB inputs ----------

  it('shows 3 numeric inputs in HSB format', () => {
    render(<ColorPicker open defaultFormat="hsb" defaultValue="#ff0000" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    // HSB: 3 inputs + alpha = 4
    expect(inputs).toHaveLength(4)
    expect(inputs[0].value).toBe('0')   // H
    expect(inputs[1].value).toBe('100') // S
    expect(inputs[2].value).toBe('100') // B
  })

  // ---------- Alpha ----------

  it('shows alpha input by default', () => {
    render(<ColorPicker open defaultFormat="rgb" defaultValue="#ff0000" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    // Last numeric input is alpha (100%)
    expect(inputs[3].value).toBe('100')
    // Percent sign
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('hides alpha input when disabledAlpha=true', () => {
    render(<ColorPicker open disabledAlpha defaultFormat="rgb" defaultValue="#ff0000" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    // Only 3 RGB inputs, no alpha
    expect(inputs).toHaveLength(3)
    expect(screen.queryByText('%')).not.toBeInTheDocument()
  })

  // ---------- allowClear ----------

  it('shows clear button when allowClear=true', () => {
    render(<ColorPicker open allowClear />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('does not show clear button by default', () => {
    render(<ColorPicker open />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn()
    render(<ColorPicker open allowClear onClear={onClear} />)
    fireEvent.click(screen.getByText('Clear'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  // ---------- Presets ----------

  it('renders preset colors', () => {
    const presets = [
      { label: 'Recommended', colors: ['#ff0000', '#00ff00', '#0000ff'] },
    ]
    render(<ColorPicker open presets={presets} />)

    expect(screen.getByText('Recommended')).toBeInTheDocument()
    // 3 preset color buttons + trigger button + format dropdown button + clear button = NO
    // Just the 3 preset buttons inside the panel
    const panel = document.querySelector('div[style*="width: 17.5rem"]')!
    const presetBtns = panel.querySelectorAll('button[style*="width: 1.25rem"]')
    expect(presetBtns).toHaveLength(3)
  })

  it('selects a preset color', () => {
    const onChange = vi.fn()
    const presets = [
      { label: 'Colors', colors: ['#ff0000'] },
    ]
    render(<ColorPicker open presets={presets} onChange={onChange} />)

    const panel = document.querySelector('div[style*="width: 17.5rem"]')!
    const presetBtn = panel.querySelector('button[style*="width: 1.25rem"]')!
    fireEvent.click(presetBtn)

    expect(onChange).toHaveBeenCalled()
    const hex = onChange.mock.calls[0][1]
    expect(hex).toBe('#ff0000')
  })

  // ---------- panelRender ----------

  it('wraps panel content with panelRender', () => {
    render(
      <ColorPicker
        open
        panelRender={(panel) => <div data-testid="custom-wrapper">{panel}</div>}
      />,
    )
    expect(screen.getByTestId('custom-wrapper')).toBeInTheDocument()
  })

  // ---------- Custom children trigger ----------

  it('renders custom children as trigger', () => {
    render(
      <ColorPicker>
        <span data-testid="custom-trigger">Pick color</span>
      </ColorPicker>,
    )
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
  })

  it('opens panel when clicking custom children trigger', () => {
    const { container } = render(
      <ColorPicker>
        <span data-testid="custom-trigger">Pick</span>
      </ColorPicker>,
    )
    fireEvent.click(screen.getByTestId('custom-trigger'))
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()
  })

  // ---------- Hover trigger ----------

  it('opens panel on mouseEnter when trigger="hover"', () => {
    const { container } = render(<ColorPicker trigger="hover" />)
    const root = container.firstChild as HTMLElement
    fireEvent.mouseEnter(root)
    expect(container.querySelector('div[style*="width: 17.5rem"]')).toBeInTheDocument()
  })

  it('does not open on click when trigger="hover"', () => {
    const { container } = render(<ColorPicker trigger="hover" />)
    clickTrigger()
    expect(container.querySelector('div[style*="width: 17.5rem"]')).not.toBeInTheDocument()
  })

  // ---------- Controlled value ----------

  it('displays controlled value color', () => {
    render(<ColorPicker value="#00ff00" showText />)
    expect(screen.getByText('#00FF00')).toBeInTheDocument()
  })

  it('updates display when controlled value changes', () => {
    const { rerender } = render(<ColorPicker value="#ff0000" showText />)
    expect(screen.getByText('#FF0000')).toBeInTheDocument()

    rerender(<ColorPicker value="#0000ff" showText />)
    expect(screen.getByText('#0000FF')).toBeInTheDocument()
  })

  // ---------- defaultValue ----------

  it('uses defaultValue as initial color', () => {
    render(<ColorPicker defaultValue="#ff0000" showText />)
    expect(screen.getByText('#FF0000')).toBeInTheDocument()
  })

  // ---------- Mode tabs ----------

  it('does not show mode tabs by default (single only)', () => {
    render(<ColorPicker open />)
    expect(screen.queryByText('Single')).not.toBeInTheDocument()
    expect(screen.queryByText('Gradient')).not.toBeInTheDocument()
  })

  it('shows mode tabs when mode="gradient"', () => {
    render(<ColorPicker open mode="gradient" />)
    expect(screen.getByText('Single')).toBeInTheDocument()
    expect(screen.getByText('Gradient')).toBeInTheDocument()
  })

  it('shows mode tabs when mode is an array', () => {
    render(<ColorPicker open mode={['single', 'gradient']} />)
    expect(screen.getByText('Single')).toBeInTheDocument()
    expect(screen.getByText('Gradient')).toBeInTheDocument()
  })

  it('calls onModeChange when switching modes', () => {
    const onModeChange = vi.fn()
    render(<ColorPicker open mode="gradient" onModeChange={onModeChange} />)

    fireEvent.click(screen.getByText('Single'))
    expect(onModeChange).toHaveBeenCalledWith('single')
  })

  it('shows gradient angle input in gradient mode', () => {
    render(<ColorPicker open mode="gradient" />)
    // Angle label
    expect(screen.getByText('Angle')).toBeInTheDocument()
    // Degree symbol
    expect(screen.getByText('°')).toBeInTheDocument()
  })

  it('shows angle text when showText=true in gradient mode', () => {
    render(<ColorPicker mode="gradient" showText />)
    // Default angle is 90°
    expect(screen.getByText('90°')).toBeInTheDocument()
  })

  // ---------- showText with different formats ----------

  it('shows rgb string when format=rgb and showText=true', () => {
    render(<ColorPicker defaultValue="#ff0000" format="rgb" showText />)
    expect(screen.getByText('rgb(255, 0, 0)')).toBeInTheDocument()
  })

  it('shows hsb string when format=hsb and showText=true', () => {
    render(<ColorPicker defaultValue="#ff0000" format="hsb" showText />)
    expect(screen.getByText('hsb(0, 100%, 100%)')).toBeInTheDocument()
  })

  // ---------- Placement ----------

  it('positions panel below by default (bottomLeft)', () => {
    const { container } = render(<ColorPicker open />)
    const panel = container.querySelector('div[style*="width: 17.5rem"]') as HTMLElement
    expect(panel.style.top).toBe('100%')
    expect(panel.style.left).toBe('0px')
  })

  // ---------- Styling ----------

  it('applies className to root', () => {
    const { container } = render(<ColorPicker className="my-picker" />)
    expect(container.firstChild).toHaveClass('my-picker')
  })

  it('applies style to root', () => {
    const { container } = render(<ColorPicker style={{ margin: 20 }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('20px')
  })

  it('applies classNames.root to root', () => {
    const { container } = render(<ColorPicker classNames={{ root: 'cn-root' }} />)
    expect(container.firstChild).toHaveClass('cn-root')
  })

  it('applies classNames.trigger to trigger button', () => {
    render(<ColorPicker classNames={{ trigger: 'cn-trigger' }} />)
    expect(screen.getByRole('button')).toHaveClass('cn-trigger')
  })

  it('applies classNames.panel to the panel', () => {
    const { container } = render(<ColorPicker open classNames={{ panel: 'cn-panel' }} />)
    expect(container.querySelector('.cn-panel')).toBeInTheDocument()
  })

  // ---------- onChangeComplete ----------

  it('calls onChangeComplete on hex input commit', () => {
    const onChangeComplete = vi.fn()
    render(<ColorPicker open defaultValue="#ff0000" onChangeComplete={onChangeComplete} />)

    const input = getHexInput()
    fireEvent.change(input, { target: { value: '#00ff00' } })
    fireEvent.blur(input)

    expect(onChangeComplete).toHaveBeenCalled()
  })
})
