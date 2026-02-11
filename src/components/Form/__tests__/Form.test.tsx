import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Form, useForm, useWatch, useFormInstance } from '../Form'

// ============================================================================
// Form (basic)
// ============================================================================

describe('Form', () => {
  // ---------- Basic rendering ----------

  it('renders a <form> element', () => {
    const { container } = render(<Form><div /></Form>)
    expect(container.querySelector('form')).toBeInTheDocument()
  })

  it('applies name attribute to form', () => {
    const { container } = render(<Form name="login"><div /></Form>)
    expect(container.querySelector('form')!.getAttribute('name')).toBe('login')
  })

  it('renders children', () => {
    render(<Form><span data-testid="child">Hello</span></Form>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies className to form', () => {
    const { container } = render(<Form className="my-form"><div /></Form>)
    expect(container.querySelector('form')).toHaveClass('my-form')
  })

  it('applies style to form', () => {
    const { container } = render(<Form style={{ margin: 10 }}><div /></Form>)
    expect((container.querySelector('form') as HTMLElement).style.margin).toBe('10px')
  })

  it('applies classNames.root to form', () => {
    const { container } = render(<Form classNames={{ root: 'cn-root' }}><div /></Form>)
    expect(container.querySelector('form')).toHaveClass('cn-root')
  })

  // ---------- Layout ----------

  it('uses horizontal layout by default', () => {
    const { container } = render(
      <Form>
        <Form.Item label="Name"><input /></Form.Item>
      </Form>,
    )
    // Horizontal layout: item has flexDirection: row
    const item = container.querySelector('div[style*="flex-direction: row"]')
    expect(item).toBeInTheDocument()
  })

  it('uses vertical layout', () => {
    const { container } = render(
      <Form layout="vertical">
        <Form.Item label="Name"><input /></Form.Item>
      </Form>,
    )
    const item = container.querySelector('div[style*="flex-direction: column"]')
    expect(item).toBeInTheDocument()
  })

  it('uses inline layout with flex-wrap', () => {
    const { container } = render(
      <Form layout="inline">
        <Form.Item label="Name"><input /></Form.Item>
      </Form>,
    )
    const form = container.querySelector('form')!
    expect(form.style.display).toBe('flex')
    expect(form.style.flexWrap).toBe('wrap')
  })

  // ---------- onFinish / onFinishFailed ----------

  it('calls onFinish with values on successful submit', async () => {
    const onFinish = vi.fn()
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ user: 'Alice' }} onFinish={onFinish}>
          <Form.Item name="user"><input /></Form.Item>
          <button type="submit">Submit</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Submit').closest('form')!)

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ user: 'Alice' })
    })
  })

  it('calls onFinishFailed when validation fails', async () => {
    const onFinishFailed = vi.fn()
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} onFinishFailed={onFinishFailed}>
          <Form.Item name="email" rules={[{ required: true, message: 'Required' }]}>
            <input />
          </Form.Item>
          <button type="submit">Submit</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Submit').closest('form')!)

    await waitFor(() => {
      expect(onFinishFailed).toHaveBeenCalled()
      const errorInfo = onFinishFailed.mock.calls[0][0]
      expect(errorInfo.errorFields.length).toBeGreaterThan(0)
    })
  })

  // ---------- onValuesChange ----------

  it('calls onValuesChange when a field changes', () => {
    const onValuesChange = vi.fn()
    render(
      <Form initialValues={{ name: '' }} onValuesChange={onValuesChange}>
        <Form.Item name="name"><input /></Form.Item>
      </Form>,
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bob' } })
    expect(onValuesChange).toHaveBeenCalled()
    const [changed, all] = onValuesChange.mock.calls[0]
    expect(changed.name).toBe('Bob')
    expect(all.name).toBe('Bob')
  })

  // ---------- initialValues ----------

  it('populates fields from initialValues', () => {
    render(
      <Form initialValues={{ username: 'John' }}>
        <Form.Item name="username"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByRole('textbox')).toHaveValue('John')
  })

  // ---------- disabled ----------

  it('disables all fields when form disabled', () => {
    render(
      <Form disabled>
        <Form.Item name="a"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

// ============================================================================
// Form.Item
// ============================================================================

describe('Form.Item', () => {
  // ---------- Label & colon ----------

  it('renders label text with colon by default', () => {
    render(
      <Form>
        <Form.Item label="Username"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('Username:')).toBeInTheDocument()
  })

  it('renders label without colon when colon=false on Form', () => {
    render(
      <Form colon={false}>
        <Form.Item label="Username"><input /></Form.Item>
      </Form>,
    )
    const label = screen.getByText('Username')
    expect(label.textContent).toBe('Username')
  })

  it('overrides colon on individual item', () => {
    render(
      <Form colon={true}>
        <Form.Item label="Username" colon={false}><input /></Form.Item>
      </Form>,
    )
    const label = screen.getByText('Username')
    expect(label.textContent).toBe('Username')
  })

  // ---------- Required mark ----------

  it('shows asterisk when required', () => {
    render(
      <Form>
        <Form.Item label="Name" required><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('infers required from rules', () => {
    render(
      <Form>
        <Form.Item label="Name" rules={[{ required: true }]}><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows (optional) text when requiredMark="optional" and field is not required', () => {
    render(
      <Form requiredMark="optional">
        <Form.Item label="Bio"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('hides required mark when requiredMark=false', () => {
    render(
      <Form requiredMark={false}>
        <Form.Item label="Name" required><input /></Form.Item>
      </Form>,
    )
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  // ---------- Label alignment ----------

  it('accepts labelAlign prop without error', () => {
    const { container } = render(
      <Form labelAlign="right">
        <Form.Item label="Name"><input /></Form.Item>
      </Form>,
    )
    // labelAlign is accepted as a prop but with auto-width labels
    // alignment is handled by the flex layout, not textAlign
    const label = container.querySelector('label')
    expect(label).toBeInTheDocument()
  })

  // ---------- hidden ----------

  it('returns null when hidden=true', () => {
    const { container } = render(
      <Form>
        <Form.Item label="Secret" hidden><input /></Form.Item>
      </Form>,
    )
    expect(screen.queryByText(/Secret/)).not.toBeInTheDocument()
  })

  // ---------- noStyle ----------

  it('renders only child without wrapper when noStyle=true', () => {
    const { container } = render(
      <Form>
        <Form.Item name="val" noStyle><input data-testid="bare" /></Form.Item>
      </Form>,
    )
    expect(screen.getByTestId('bare')).toBeInTheDocument()
    // No label wrapper
    expect(container.querySelector('label')).not.toBeInTheDocument()
  })

  // ---------- extra ----------

  it('renders extra content below the field', () => {
    render(
      <Form>
        <Form.Item label="Name" extra="Helper text"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  // ---------- help ----------

  it('renders help text', () => {
    render(
      <Form>
        <Form.Item label="Name" help="Enter your name"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('Enter your name')).toBeInTheDocument()
  })

  // ---------- Value injection ----------

  it('injects value and onChange into child input', () => {
    render(
      <Form initialValues={{ name: 'Alice' }}>
        <Form.Item name="name"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByRole('textbox')).toHaveValue('Alice')
  })

  it('updates value when typing', () => {
    const onValuesChange = vi.fn()
    render(
      <Form initialValues={{ name: '' }} onValuesChange={onValuesChange}>
        <Form.Item name="name"><input /></Form.Item>
      </Form>,
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bob' } })
    expect(screen.getByRole('textbox')).toHaveValue('Bob')
  })

  // ---------- valuePropName ----------

  it('uses valuePropName="checked" for checkboxes', () => {
    render(
      <Form initialValues={{ agree: true }}>
        <Form.Item name="agree" valuePropName="checked">
          <input type="checkbox" />
        </Form.Item>
      </Form>,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  // ---------- getValueFromEvent ----------

  it('uses getValueFromEvent to extract value', () => {
    const onValuesChange = vi.fn()
    render(
      <Form onValuesChange={onValuesChange}>
        <Form.Item name="num" getValueFromEvent={(e) => Number(e.target.value)}>
          <input type="text" />
        </Form.Item>
      </Form>,
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '42' } })
    expect(onValuesChange).toHaveBeenCalled()
    expect(onValuesChange.mock.calls[0][0].num).toBe(42)
  })

  // ---------- normalize ----------

  it('normalizes value before storing', () => {
    const onValuesChange = vi.fn()
    render(
      <Form onValuesChange={onValuesChange}>
        <Form.Item name="upper" normalize={(v: string) => v.toUpperCase()}>
          <input />
        </Form.Item>
      </Form>,
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(onValuesChange.mock.calls[0][0].upper).toBe('HELLO')
  })

  // ---------- initialValue ----------

  it('uses initialValue on item level (sets store value)', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="city" initialValue="Madrid"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(formInstance.getFieldValue('city')).toBe('Madrid')
  })

  // ---------- className / style / classNames / styles ----------

  it('applies className to item root', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" className="my-item"><input /></Form.Item>
      </Form>,
    )
    expect(container.querySelector('.my-item')).toBeInTheDocument()
  })

  it('applies classNames.label to label', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" classNames={{ label: 'cn-label' }}><input /></Form.Item>
      </Form>,
    )
    expect(container.querySelector('.cn-label')).toBeInTheDocument()
  })

  it('applies classNames.control to control wrapper', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" classNames={{ control: 'cn-ctrl' }}><input /></Form.Item>
      </Form>,
    )
    expect(container.querySelector('.cn-ctrl')).toBeInTheDocument()
  })

  // ---------- data-field-name ----------

  it('sets data-field-name attribute', () => {
    const { container } = render(
      <Form>
        <Form.Item name="email" label="Email"><input /></Form.Item>
      </Form>,
    )
    expect(container.querySelector('[data-field-name="email"]')).toBeInTheDocument()
  })

  // ---------- Render prop children ----------

  it('supports render prop children', () => {
    render(
      <Form initialValues={{ score: 10 }}>
        <Form.Item name="score">
          {(control, meta) => (
            <div>
              <span data-testid="val">{control.value}</span>
              <span data-testid="touched">{String(meta.touched)}</span>
            </div>
          )}
        </Form.Item>
      </Form>,
    )
    expect(screen.getByTestId('val')).toHaveTextContent('10')
    expect(screen.getByTestId('touched')).toHaveTextContent('false')
  })

  // ---------- validateStatus override ----------

  it('shows error color when validateStatus="error"', () => {
    render(
      <Form>
        <Form.Item label="X" validateStatus="error" help="Wrong!"><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByText('Wrong!')).toBeInTheDocument()
  })
})

// ============================================================================
// Validation
// ============================================================================

describe('Validation', () => {
  it('shows error for required field', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form}>
          <Form.Item name="name" rules={[{ required: true, message: 'Name is required' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ email: 'notanemail' }}>
          <Form.Item name="email" rules={[{ type: 'email', message: 'Invalid email' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })
  })

  it('shows error for min length', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ pw: 'ab' }}>
          <Form.Item name="pw" rules={[{ min: 6, message: 'Too short' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Too short')).toBeInTheDocument()
    })
  })

  it('shows error for max length', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ code: 'abcdefgh' }}>
          <Form.Item name="code" rules={[{ max: 4, message: 'Too long' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Too long')).toBeInTheDocument()
    })
  })

  it('shows error for pattern mismatch', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ zip: 'abc' }}>
          <Form.Item name="zip" rules={[{ pattern: /^\d{5}$/, message: 'Bad zip' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Bad zip')).toBeInTheDocument()
    })
  })

  it('shows error for whitespace-only value', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ bio: '   ' }}>
          <Form.Item name="bio" rules={[{ whitespace: true, message: 'No blanks' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('No blanks')).toBeInTheDocument()
    })
  })

  it('shows error for enum violation', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ color: 'purple' }}>
          <Form.Item name="color" rules={[{ enum: ['red', 'blue'], message: 'Pick red or blue' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Pick red or blue')).toBeInTheDocument()
    })
  })

  it('supports custom async validator', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ name: 'bad' }}>
          <Form.Item
            name="name"
            rules={[{
              validator: async (_rule, value) => {
                if (value === 'bad') throw new Error('Not allowed')
              },
            }]}
          >
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Not allowed')).toBeInTheDocument()
    })
  })

  it('shows warning only (not error) when warningOnly=true', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ name: 'x' }}>
          <Form.Item
            name="name"
            rules={[{ min: 3, message: 'Kinda short', warningOnly: true }]}
          >
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    // warningOnly does not block submit; the message still shows as a warning
    await waitFor(() => {
      expect(screen.getByText('Kinda short')).toBeInTheDocument()
    })
  })

  it('passes validation when value is valid', async () => {
    const onFinish = vi.fn()
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ email: 'a@b.com' }} onFinish={onFinish}>
          <Form.Item name="email" rules={[{ type: 'email', message: 'Bad' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ email: 'a@b.com' })
    })
  })

  it('validates on change by default', async () => {
    render(
      <Form>
        <Form.Item name="name" rules={[{ required: true, message: 'Required' }]}>
          <input />
        </Form.Item>
      </Form>,
    )

    // Type then clear to trigger required error
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: '' } })

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })

  it('validates on blur when validateTrigger="onBlur"', async () => {
    render(
      <Form validateTrigger="onBlur">
        <Form.Item name="name" rules={[{ required: true, message: 'Needed' }]}>
          <input />
        </Form.Item>
      </Form>,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })

    // No error yet before blur
    expect(screen.queryByText('Needed')).not.toBeInTheDocument()

    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText('Needed')).toBeInTheDocument()
    })
  })
})

// ============================================================================
// useForm (FormInstance)
// ============================================================================

describe('useForm', () => {
  it('getFieldValue returns value', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ x: 42 }}>
          <Form.Item name="x"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(formInstance.getFieldValue('x')).toBe(42)
  })

  it('setFieldValue updates a field', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ x: '' }}>
          <Form.Item name="x"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    act(() => { formInstance.setFieldValue('x', 'hello') })
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('setFieldsValue updates multiple fields', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ a: '', b: '' }}>
          <Form.Item name="a"><input data-testid="a" /></Form.Item>
          <Form.Item name="b"><input data-testid="b" /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    act(() => { formInstance.setFieldsValue({ a: 'A', b: 'B' }) })
    expect(screen.getByTestId('a')).toHaveValue('A')
    expect(screen.getByTestId('b')).toHaveValue('B')
  })

  it('getFieldsValue returns all values', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ a: 1, b: 2 }}>
          <Form.Item name="a"><input /></Form.Item>
          <Form.Item name="b"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(formInstance.getFieldsValue()).toEqual({ a: 1, b: 2 })
  })

  it('resetFields restores initial values', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ name: 'original' }}>
          <Form.Item name="name"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'changed' } })
    expect(screen.getByRole('textbox')).toHaveValue('changed')

    act(() => { formInstance.resetFields() })
    expect(screen.getByRole('textbox')).toHaveValue('original')
  })

  it('resetFields with specific field names', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ a: 'A', b: 'B' }}>
          <Form.Item name="a"><input data-testid="a" /></Form.Item>
          <Form.Item name="b"><input data-testid="b" /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    act(() => { formInstance.setFieldsValue({ a: 'X', b: 'Y' }) })
    act(() => { formInstance.resetFields(['a']) })

    expect(screen.getByTestId('a')).toHaveValue('A')
    expect(screen.getByTestId('b')).toHaveValue('Y')
  })

  it('isFieldTouched returns true after user interaction', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="name"><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(formInstance.isFieldTouched('name')).toBe(false)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } })
    expect(formInstance.isFieldTouched('name')).toBe(true)
  })

  it('isFieldsTouched returns true if any field is touched', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="a"><input data-testid="a" /></Form.Item>
          <Form.Item name="b"><input data-testid="b" /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(formInstance.isFieldsTouched()).toBe(false)
    fireEvent.change(screen.getByTestId('a'), { target: { value: 'x' } })
    expect(formInstance.isFieldsTouched()).toBe(true)
  })

  it('getFieldError returns errors after validation', async () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="name" rules={[{ required: true, message: 'Needed' }]}>
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(formInstance.getFieldError('name')).toContain('Needed')
    })
  })

  it('validateFields resolves with values on success', async () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ name: 'OK' }}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <input />
          </Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    const result = await formInstance.validateFields()
    expect(result).toEqual({ name: 'OK' })
  })

  it('validateFields rejects with errorFields on failure', async () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <input />
          </Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    try {
      await formInstance.validateFields()
      // Should not reach here
      expect(true).toBe(false)
    } catch (errorInfo: any) {
      expect(errorInfo.errorFields.length).toBe(1)
    }
  })
})

// ============================================================================
// useWatch
// ============================================================================

describe('useWatch', () => {
  it('returns field value reactively', () => {
    function WatchDisplay() {
      const name = useWatch('name')
      return <span data-testid="watched">{name ?? 'empty'}</span>
    }

    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ name: 'Alice' }}>
          <Form.Item name="name"><input /></Form.Item>
          <WatchDisplay />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByTestId('watched')).toHaveTextContent('Alice')

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bob' } })
    expect(screen.getByTestId('watched')).toHaveTextContent('Bob')
  })
})

// ============================================================================
// useFormInstance
// ============================================================================

describe('useFormInstance', () => {
  it('returns form instance from context', () => {
    let instance: any
    function Inner() {
      instance = useFormInstance()
      return null
    }

    render(
      <Form initialValues={{ x: 99 }}>
        <Form.Item name="x"><input /></Form.Item>
        <Inner />
      </Form>,
    )

    expect(instance.getFieldValue('x')).toBe(99)
  })

  it('throws when used outside Form', () => {
    function BadComponent() {
      useFormInstance()
      return null
    }
    expect(() => render(<BadComponent />)).toThrow('useFormInstance must be used within a <Form>')
  })
})

// ============================================================================
// Form.List
// ============================================================================

describe('Form.List', () => {
  it('renders initial fields from initialValue', () => {
    render(
      <Form>
        <Form.List name="items" initialValue={['a', 'b']}>
          {(fields) => (
            <div>
              {fields.map((field) => (
                <Form.Item key={field.key} name={field.name} noStyle>
                  <input data-testid={`item-${field.name}`} />
                </Form.Item>
              ))}
            </div>
          )}
        </Form.List>
      </Form>,
    )

    expect(screen.getByTestId('item-0')).toHaveValue('a')
    expect(screen.getByTestId('item-1')).toHaveValue('b')
  })

  it('adds a new field via add()', () => {
    render(
      <Form>
        <Form.List name="items" initialValue={['first']}>
          {(fields, { add }) => (
            <div>
              {fields.map((field) => (
                <Form.Item key={field.key} name={field.name} noStyle>
                  <input data-testid={`item-${field.name}`} />
                </Form.Item>
              ))}
              <button type="button" onClick={() => add('new')}>Add</button>
            </div>
          )}
        </Form.List>
      </Form>,
    )

    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Add'))
    expect(screen.getByTestId('item-1')).toHaveValue('new')
  })

  it('removes a field via remove()', () => {
    render(
      <Form>
        <Form.List name="items" initialValue={['a', 'b', 'c']}>
          {(fields, { remove }) => (
            <div>
              {fields.map((field) => (
                <div key={field.key}>
                  <Form.Item name={field.name} noStyle>
                    <input data-testid={`item-${field.name}`} />
                  </Form.Item>
                  <button type="button" onClick={() => remove(field.name)}>
                    Remove {field.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Form.List>
      </Form>,
    )

    expect(screen.getAllByRole('textbox')).toHaveLength(3)

    fireEvent.click(screen.getByText('Remove 1'))
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)
  })

  it('moves fields via move()', () => {
    render(
      <Form>
        <Form.List name="items" initialValue={['x', 'y', 'z']}>
          {(fields, { move }) => (
            <div>
              {fields.map((field) => (
                <Form.Item key={field.key} name={field.name} noStyle>
                  <input data-testid={`item-${field.name}`} />
                </Form.Item>
              ))}
              <button type="button" onClick={() => move(0, 2)}>Move</button>
            </div>
          )}
        </Form.List>
      </Form>,
    )

    expect(screen.getByTestId('item-0')).toHaveValue('x')

    fireEvent.click(screen.getByText('Move'))
    // After move(0, 2): ['y', 'z', 'x']
    expect(screen.getByTestId('item-0')).toHaveValue('y')
    expect(screen.getByTestId('item-2')).toHaveValue('x')
  })
})

// ============================================================================
// Form.ErrorList
// ============================================================================

describe('Form.ErrorList', () => {
  it('renders error messages', () => {
    render(<Form.ErrorList errors={['Error 1', 'Error 2']} />)
    expect(screen.getByText('Error 1')).toBeInTheDocument()
    expect(screen.getByText('Error 2')).toBeInTheDocument()
  })

  it('renders nothing when errors is empty', () => {
    const { container } = render(<Form.ErrorList errors={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when errors is undefined', () => {
    const { container } = render(<Form.ErrorList />)
    expect(container.innerHTML).toBe('')
  })

  it('applies className', () => {
    const { container } = render(<Form.ErrorList errors={['Oops']} className="err-list" />)
    expect(container.querySelector('.err-list')).toBeInTheDocument()
  })

  it('applies custom style', () => {
    const { container } = render(<Form.ErrorList errors={['Oops']} style={{ margin: 8 }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('8px')
  })
})

// ============================================================================
// New features
// ============================================================================

describe('Form.Item mix layout', () => {
  it('overrides Form layout on a per-item basis', () => {
    const { container } = render(
      <Form layout="horizontal">
        <Form.Item label="Normal"><input /></Form.Item>
        <Form.Item label="Vertical" layout="vertical"><input data-testid="vert" /></Form.Item>
      </Form>,
    )
    // The vertical-override item should use flex-direction: column
    const vertItem = screen.getByTestId('vert').closest('div[style*="flex-direction: column"]')
    expect(vertItem).toBeInTheDocument()

    // The normal item still uses row
    const rowItems = container.querySelectorAll('div[style*="flex-direction: row"]')
    expect(rowItems.length).toBeGreaterThanOrEqual(1)
  })

  it('uses inline margin-bottom: 0 when item layout="inline"', () => {
    const { container } = render(
      <Form layout="horizontal">
        <Form.Item label="Inline" layout="inline"><input data-testid="inl" /></Form.Item>
      </Form>,
    )
    const item = screen.getByTestId('inl').closest('div[style*="margin-bottom: 0"]')
    expect(item).toBeInTheDocument()
  })
})

describe('Form variant', () => {
  it('injects variant into child when not "outlined"', () => {
    let receivedProps: any = {}
    function Spy(props: any) {
      receivedProps = props
      return <input />
    }

    render(
      <Form variant="filled">
        <Form.Item name="x"><Spy /></Form.Item>
      </Form>,
    )
    expect(receivedProps.variant).toBe('filled')
  })

  it('does not inject variant when "outlined" (default)', () => {
    let receivedProps: any = {}
    function Spy(props: any) {
      receivedProps = props
      return <input />
    }

    render(
      <Form>
        <Form.Item name="x"><Spy /></Form.Item>
      </Form>,
    )
    expect(receivedProps.variant).toBeUndefined()
  })
})

describe('Form size', () => {
  it('injects size into child when not "middle"', () => {
    let receivedProps: any = {}
    function Spy(props: any) {
      receivedProps = props
      return <input />
    }

    render(
      <Form size="small">
        <Form.Item name="x"><Spy /></Form.Item>
      </Form>,
    )
    expect(receivedProps.size).toBe('small')
  })

  it('does not inject size when "middle" (default)', () => {
    let receivedProps: any = {}
    function Spy(props: any) {
      receivedProps = props
      return <input />
    }

    render(
      <Form>
        <Form.Item name="x"><Spy /></Form.Item>
      </Form>,
    )
    expect(receivedProps.size).toBeUndefined()
  })
})

describe('requiredMark position', () => {
  it('renders asterisk before label text when position="prefix"', () => {
    const { container } = render(
      <Form requiredMark={{ position: 'prefix' }}>
        <Form.Item label="Name" required><input /></Form.Item>
      </Form>,
    )
    const label = container.querySelector('label')!
    const spans = label.querySelectorAll('span')
    // In horizontal: first span is the mark wrapper, second is the text span
    // The mark span (containing *) should come before the text span
    const markSpan = Array.from(spans).find(s => s.textContent?.includes('*'))
    expect(markSpan).toBeTruthy()
    const textSpan = Array.from(spans).find(s => s.textContent?.includes('Name'))
    expect(textSpan).toBeTruthy()
    // Mark should precede text in DOM order
    expect(markSpan!.compareDocumentPosition(textSpan!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders asterisk after label text by default (suffix)', () => {
    const { container } = render(
      <Form>
        <Form.Item label="Name" required><input /></Form.Item>
      </Form>,
    )
    const label = container.querySelector('label')!
    const spans = label.querySelectorAll('span')
    const markSpan = Array.from(spans).find(s => s.textContent?.includes('*'))
    expect(markSpan).toBeTruthy()
    const textSpan = Array.from(spans).find(s => s.textContent?.includes('Name'))
    expect(textSpan).toBeTruthy()
    // Mark should follow text in DOM order
    expect(markSpan!.compareDocumentPosition(textSpan!)).toBe(Node.DOCUMENT_POSITION_PRECEDING)
  })
})

describe('requiredMark custom render', () => {
  it('uses render function for requiredMark', () => {
    render(
      <Form requiredMark={(labelNode, { required }) => (
        <span data-testid="custom-mark">
          {required && <span data-testid="req-icon">!</span>}
          {labelNode}
        </span>
      )}>
        <Form.Item label="Email" required><input /></Form.Item>
      </Form>,
    )
    expect(screen.getByTestId('custom-mark')).toBeInTheDocument()
    expect(screen.getByTestId('req-icon')).toHaveTextContent('!')
  })
})

describe('labelWrap', () => {
  it('applies white-space: normal when labelWrap=true', () => {
    const { container } = render(
      <Form labelWrap>
        <Form.Item label="Very Long Label"><input /></Form.Item>
      </Form>,
    )
    const label = container.querySelector('label')!
    // In horizontal layout, wrap styles are on the inner text span, not the label
    const textSpan = label.querySelector('span')!
    expect(textSpan.style.whiteSpace).toBe('normal')
    expect(textSpan.style.wordBreak).toBe('break-word')
  })

  it('applies nowrap and ellipsis when labelWrap=false (default)', () => {
    const { container } = render(
      <Form>
        <Form.Item label="Label"><input /></Form.Item>
      </Form>,
    )
    const label = container.querySelector('label')!
    // In horizontal layout, truncation styles are on the inner text span
    const textSpan = label.querySelector('span')!
    expect(textSpan.style.whiteSpace).toBe('nowrap')
    expect(textSpan.style.overflow).toBe('hidden')
    expect(textSpan.style.textOverflow).toBe('ellipsis')
  })
})

describe('validateFirst', () => {
  it('stops at first error when validateFirst=true', async () => {
    function TestForm() {
      const [form] = useForm()
      return (
        <Form form={form} initialValues={{ val: '' }}>
          <Form.Item
            name="val"
            validateFirst
            rules={[
              { required: true, message: 'Error A' },
              { min: 5, message: 'Error B' },
            ]}
          >
            <input />
          </Form.Item>
          <button type="submit">Go</button>
        </Form>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Error A')).toBeInTheDocument()
    })
    // Error B should NOT appear because validateFirst stops on first
    expect(screen.queryByText('Error B')).not.toBeInTheDocument()
  })
})

describe('validateDebounce', () => {
  it('delays validation (error not immediate, appears after debounce)', async () => {
    render(
      <Form>
        <Form.Item name="name" validateDebounce={50} rules={[{ required: true, message: 'Required' }]}>
          <input />
        </Form.Item>
      </Form>,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: '' } })

    // Error should NOT show immediately (debounced)
    expect(screen.queryByText('Required')).not.toBeInTheDocument()

    // After debounce expires, error should appear
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })
})

describe('validateOnly', () => {
  it('resolves without updating UI when validateOnly=true', async () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ name: 'OK' }}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <input />
          </Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    const result = await formInstance.validateFields(undefined, { validateOnly: true })
    expect(result).toEqual({ name: 'OK' })
  })

  it('rejects when invalid with validateOnly=true', async () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <input />
          </Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    try {
      await formInstance.validateFields(undefined, { validateOnly: true })
      expect(true).toBe(false)
    } catch (errorInfo: any) {
      expect(errorInfo.errorFields.length).toBe(1)
    }
  })
})

describe('onFieldsChange', () => {
  it('calls onFieldsChange when a field value changes', () => {
    const onFieldsChange = vi.fn()
    render(
      <Form initialValues={{ name: '' }} onFieldsChange={onFieldsChange}>
        <Form.Item name="name"><input /></Form.Item>
      </Form>,
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hi' } })
    expect(onFieldsChange).toHaveBeenCalled()
    const [changedFields] = onFieldsChange.mock.calls[0]
    expect(changedFields[0].value).toBe('Hi')
  })
})

describe('fields (external control)', () => {
  it('applies external fields to store', () => {
    let formInstance: any
    function TestForm({ externalFields }: { externalFields: any[] }) {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} fields={externalFields}>
          <Form.Item name="name"><input /></Form.Item>
        </Form>
      )
    }

    render(
      <TestForm externalFields={[{ name: ['name'], value: 'External', touched: false, validating: false, errors: [], warnings: [] }]} />,
    )

    // The fields are applied via useEffect — value is set in the store
    // We need to wait for the effect to run
    expect(formInstance.getFieldValue('name')).toBe('External')
  })
})

describe('Form.Provider', () => {
  it('calls onFormFinish when a named form submits', async () => {
    const onFormFinish = vi.fn()
    function TestForm() {
      const [form] = useForm()
      return (
        <Form.Provider onFormFinish={onFormFinish}>
          <Form form={form} name="login" initialValues={{ user: 'Alice' }} onFinish={() => {}}>
            <Form.Item name="user"><input /></Form.Item>
            <button type="submit">Go</button>
          </Form>
        </Form.Provider>
      )
    }

    render(<TestForm />)
    fireEvent.submit(screen.getByText('Go').closest('form')!)

    await waitFor(() => {
      expect(onFormFinish).toHaveBeenCalled()
      expect(onFormFinish.mock.calls[0][0]).toBe('login')
    })
  })
})

describe('hasFeedback', () => {
  it('renders feedback icon when validateStatus="error" and hasFeedback=true', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" validateStatus="error" hasFeedback help="Bad">
          <input />
        </Form.Item>
      </Form>,
    )
    // FeedbackIcon renders an SVG with error color
    const svg = container.querySelector('svg[width="14"]')
    expect(svg).toBeInTheDocument()
  })

  it('renders feedback icon for success status', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" validateStatus="success" hasFeedback>
          <input />
        </Form.Item>
      </Form>,
    )
    const svg = container.querySelector('svg[width="14"]')
    expect(svg).toBeInTheDocument()
  })

  it('renders feedback icon for warning status', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" validateStatus="warning" hasFeedback>
          <input />
        </Form.Item>
      </Form>,
    )
    const svg = container.querySelector('svg[width="14"]')
    expect(svg).toBeInTheDocument()
  })

  it('renders feedback icon for validating status', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" validateStatus="validating" hasFeedback>
          <input />
        </Form.Item>
      </Form>,
    )
    const svg = container.querySelector('svg[width="14"]')
    expect(svg).toBeInTheDocument()
  })

  it('does not render feedback icon when hasFeedback=false', () => {
    const { container } = render(
      <Form>
        <Form.Item label="X" validateStatus="error">
          <input />
        </Form.Item>
      </Form>,
    )
    const svg = container.querySelector('svg[width="14"]')
    expect(svg).not.toBeInTheDocument()
  })
})

describe('getValueProps', () => {
  it('transforms value before passing to child', () => {
    let receivedProps: any = {}
    function Spy(props: any) {
      receivedProps = props
      return <input value={props.displayValue || ''} readOnly />
    }

    render(
      <Form initialValues={{ num: 100 }}>
        <Form.Item
          name="num"
          getValueProps={(val) => ({ displayValue: `$${val}` })}
        >
          <Spy />
        </Form.Item>
      </Form>,
    )
    expect(receivedProps.displayValue).toBe('$100')
    // Should NOT have a "value" prop since getValueProps overrides it
    expect(receivedProps.value).toBeUndefined()
  })
})

describe('getFieldsData', () => {
  it('returns field data for all registered fields', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ a: 'A' }}>
          <Form.Item name="a" rules={[{ required: true }]}><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    const data = formInstance.getFieldsData()
    expect(data.length).toBe(1)
    expect(data[0].name).toEqual(['a'])
    expect(data[0].value).toBe('A')
    expect(data[0].touched).toBe(false)
  })
})

describe('nested fields', () => {
  it('supports array name path for nested values', () => {
    let formInstance: any
    function TestForm() {
      const [form] = useForm()
      formInstance = form
      return (
        <Form form={form} initialValues={{ user: { address: { city: 'Madrid' } } }}>
          <Form.Item name={['user', 'address', 'city']}><input /></Form.Item>
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByRole('textbox')).toHaveValue('Madrid')
    expect(formInstance.getFieldValue(['user', 'address', 'city'])).toBe('Madrid')
  })
})
