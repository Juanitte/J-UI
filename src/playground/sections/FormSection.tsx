import { useState } from 'react'
import { Text, Form, Checkbox, DatePicker, tokens } from '../../index'
import type { FormInstance, FormRequiredMark } from '../../index'
import { Section } from './shared'

const { useForm, useWatch } = Form

// ============================================================================
// Shared input style (no Input component in J-UI yet)
// ============================================================================

const inputStyle = (status?: 'error' | 'warning'): React.CSSProperties => ({
  width: '100%',
  height: 36,
  padding: '0 12px',
  border: `1px solid ${status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : tokens.colorBorder}`,
  borderRadius: 6,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  backgroundColor: 'transparent',
  color: tokens.colorText,
  boxSizing: 'border-box' as const,
})

// Simple native input wrapper that accepts status prop
function NativeInput({ status, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { status?: 'error' | 'warning' }) {
  return <input {...props} style={{ ...inputStyle(status), ...props.style }} />
}

function SubmitBtn({ children = 'Submit' }: { children?: React.ReactNode }) {
  return (
    <button type="submit" style={{
      padding: '8px 24px', border: 'none', borderRadius: 6,
      backgroundColor: tokens.colorPrimary, color: tokens.colorPrimaryContrast,
      cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
    }}>
      {children}
    </button>
  )
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px', border: `1px solid ${tokens.colorBorder}`, borderRadius: 4,
        backgroundColor: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
        color: tokens.colorText,
      }}
    >
      {children}
    </button>
  )
}

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(values) => alert(JSON.stringify(values, null, 2))}
      style={{ width: 360 }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please enter your username' }]}
      >
        <NativeInput placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <NativeInput type="password" placeholder="Enter password" />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <SubmitBtn>Log in</SubmitBtn>
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Validation Rules
// ============================================================================

function ValidationDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(values) => alert('Success: ' + JSON.stringify(values))}
      style={{ width: 400 }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Not a valid email address' },
        ]}
      >
        <NativeInput placeholder="user@example.com" />
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={[
          { required: true, message: 'Age is required' },
          { pattern: /^\d+$/, message: 'Must be a number' },
        ]}
      >
        <NativeInput placeholder="Enter your age" />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Bio"
        rules={[
          { min: 10, message: 'Must be at least 10 characters' },
          { max: 100, message: 'Must be at most 100 characters' },
        ]}
      >
        <NativeInput placeholder="Tell us about yourself" />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="Nickname"
        rules={[
          { warningOnly: true, min: 3, message: 'Nickname is usually 3+ characters' },
        ]}
        extra="Warnings won't block submission"
      >
        <NativeInput placeholder="Optional nickname" />
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
        rules={[
          { type: 'url', message: 'Must be a valid URL' },
        ]}
      >
        <NativeInput placeholder="https://example.com" />
      </Form.Item>

      <Form.Item>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Layouts
// ============================================================================

function LayoutsDemo() {
  const layouts: Array<'horizontal' | 'vertical' | 'inline'> = ['horizontal', 'vertical', 'inline']
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'inline'>('horizontal')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 500 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {layouts.map(l => (
          <button
            key={l}
            type="button"
            onClick={() => setLayout(l)}
            style={{
              padding: '4px 12px', border: `1px solid ${l === layout ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: 4, backgroundColor: l === layout ? tokens.colorPrimaryBg : 'transparent',
              color: l === layout ? tokens.colorPrimary : tokens.colorText,
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <Form layout={layout} onFinish={(v) => alert(JSON.stringify(v))}>
        <Form.Item name="field1" label="Field A" rules={[{ required: true }]}>
          <NativeInput placeholder="Field A" />
        </Form.Item>
        <Form.Item name="field2" label="Field B">
          <NativeInput placeholder="Field B" />
        </Form.Item>
        <Form.Item>
          <SubmitBtn />
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: Mix Layout (per-item layout override)
// ============================================================================

function MixLayoutDemo() {
  return (
    <Form
      layout="horizontal"
      onFinish={(v) => alert(JSON.stringify(v, null, 2))}
      style={{ width: 500 }}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <NativeInput placeholder="Horizontal layout" />
      </Form.Item>
      <Form.Item name="bio" label="Bio" layout="vertical">
        <NativeInput placeholder="This item uses vertical layout" />
      </Form.Item>
      <Form.Item name="notes" label="Notes">
        <NativeInput placeholder="Back to horizontal" />
      </Form.Item>
      <Form.Item>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Form disabled
// ============================================================================

function DisabledDemo() {
  const [disabled, setDisabled] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Checkbox checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>
        Form disabled
      </Checkbox>
      <Form
        layout="vertical"
        disabled={disabled}
        initialValues={{ username: 'admin', date: new Date() }}
      >
        <Form.Item name="username" label="Username">
          <NativeInput placeholder="Username" />
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker placeholder="Select date" />
        </Form.Item>
        <Form.Item name="agree" valuePropName="checked">
          <Checkbox>I agree</Checkbox>
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: Form variants
// ============================================================================

function VariantsDemo() {
  type V = 'outlined' | 'filled' | 'borderless' | 'underlined'
  const variants: V[] = ['outlined', 'filled', 'borderless', 'underlined']
  const [variant, setVariant] = useState<V>('outlined')

  // Variant-aware input that reads the variant prop injected by Form.Item
  const VariantInput = ({ variant: v, status, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { variant?: V; status?: 'error' | 'warning' }) => {
    const base: React.CSSProperties = {
      width: '100%', height: 36, padding: '0 12px', fontSize: 14, fontFamily: 'inherit',
      outline: 'none', color: tokens.colorText, boxSizing: 'border-box' as const,
      borderRadius: 6, transition: 'all 0.2s ease',
    }
    const borderColor = status === 'error' ? tokens.colorError : status === 'warning' ? tokens.colorWarning : tokens.colorBorder
    const variantStyles: Record<V, React.CSSProperties> = {
      outlined: { ...base, border: `1px solid ${borderColor}`, backgroundColor: 'transparent' },
      filled: { ...base, border: '1px solid transparent', backgroundColor: tokens.colorBgMuted },
      borderless: { ...base, border: 'none', backgroundColor: 'transparent' },
      underlined: { ...base, border: 'none', borderBottom: `1px solid ${borderColor}`, borderRadius: 0, backgroundColor: 'transparent' },
    }
    return <input {...props} style={{ ...variantStyles[v || 'outlined'], ...props.style }} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {variants.map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            style={{
              padding: '4px 12px', border: `1px solid ${v === variant ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: 4, backgroundColor: v === variant ? tokens.colorPrimaryBg : 'transparent',
              color: v === variant ? tokens.colorPrimary : tokens.colorText,
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <Form layout="vertical" variant={variant}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <VariantInput placeholder="Username" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <VariantInput placeholder="Email" />
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: Required mark styles
// ============================================================================

function RequiredMarkDemo() {
  const options: { label: string; value: FormRequiredMark }[] = [
    { label: 'Default (suffix)', value: true },
    { label: 'Optional', value: 'optional' },
    { label: 'Prefix', value: { position: 'prefix' } },
    { label: 'Suffix', value: { position: 'suffix' } },
    { label: 'Hidden', value: false },
    { label: 'Custom render', value: (label, { required }) => (
      <>
        {label}
        {required
          ? <span style={{ color: tokens.colorError, marginLeft: 4, fontSize: 11 }}>(required)</span>
          : <span style={{ color: tokens.colorTextMuted, marginLeft: 4, fontSize: 11 }}>(optional)</span>
        }
      </>
    )},
  ]
  const [markIdx, setMarkIdx] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 500 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setMarkIdx(i)}
            style={{
              padding: '4px 12px', border: `1px solid ${i === markIdx ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: 4, backgroundColor: i === markIdx ? tokens.colorPrimaryBg : 'transparent',
              color: i === markIdx ? tokens.colorPrimary : tokens.colorText,
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <Form layout="horizontal" requiredMark={options[markIdx].value}>
        <Form.Item name="field1" label="Required field" rules={[{ required: true }]}>
          <NativeInput placeholder="This is required" />
        </Form.Item>
        <Form.Item name="field2" label="Optional field">
          <NativeInput placeholder="This is optional" />
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: Label wrap
// ============================================================================

function LabelWrapDemo() {
  const [wrap, setWrap] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 500 }}>
      <Checkbox checked={wrap} onChange={(e) => setWrap(e.target.checked)}>
        labelWrap
      </Checkbox>
      <Form layout="horizontal" labelWrap={wrap}>
        <Form.Item name="field1" label="Short">
          <NativeInput placeholder="Short label" />
        </Form.Item>
        <Form.Item name="field2" label="Very long label that might overflow the label area">
          <NativeInput placeholder="Long label" />
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: hasFeedback
// ============================================================================

function HasFeedbackDemo() {
  return (
    <Form layout="vertical" style={{ width: 400 }}>
      <Form.Item name="success" label="Success" validateStatus="success" hasFeedback>
        <NativeInput />
      </Form.Item>
      <Form.Item name="warning" label="Warning" validateStatus="warning" hasFeedback help="This is a warning">
        <NativeInput />
      </Form.Item>
      <Form.Item name="error" label="Error" validateStatus="error" hasFeedback help="This field has an error">
        <NativeInput />
      </Form.Item>
      <Form.Item name="validating" label="Validating" validateStatus="validating" hasFeedback help="Checking...">
        <NativeInput />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Validate trigger & debounce
// ============================================================================

function ValidateTriggerDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(v) => alert(JSON.stringify(v))}
      style={{ width: 400 }}
    >
      <Form.Item
        name="onChange"
        label="Validate on change (default)"
        rules={[{ required: true, message: 'Required' }, { min: 3, message: 'Min 3 chars' }]}
      >
        <NativeInput placeholder="Type here..." />
      </Form.Item>

      <Form.Item
        name="onBlur"
        label="Validate on blur"
        validateTrigger="onBlur"
        rules={[{ required: true, message: 'Required' }, { min: 3, message: 'Min 3 chars' }]}
      >
        <NativeInput placeholder="Validates when you leave the field" />
      </Form.Item>

      <Form.Item
        name="debounced"
        label="Debounced validation (500ms)"
        validateDebounce={500}
        rules={[{ required: true, message: 'Required' }, { min: 3, message: 'Min 3 chars' }]}
      >
        <NativeInput placeholder="Type and wait 500ms..." />
      </Form.Item>

      <Form.Item>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Validate Only (dynamic submit button)
// ============================================================================

function ValidateOnlyDemo() {
  const [form] = useForm()
  const [submittable, setSubmittable] = useState(false)

  // Watch a field to trigger re-renders on change
  useWatch('username', form)
  useWatch('email', form)

  const checkSubmittable = () => {
    form.validateFields(undefined, { validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(v) => alert(JSON.stringify(v))}
      onValuesChange={() => setTimeout(checkSubmittable, 0)}
      style={{ width: 400 }}
    >
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <NativeInput placeholder="Required field" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email', message: 'Invalid email' }]}>
        <NativeInput placeholder="Required email" />
      </Form.Item>
      <Form.Item>
        <button
          type="submit"
          disabled={!submittable}
          style={{
            padding: '8px 24px', border: 'none', borderRadius: 6,
            backgroundColor: submittable ? tokens.colorPrimary : tokens.colorBgMuted,
            color: submittable ? tokens.colorPrimaryContrast : tokens.colorTextMuted,
            cursor: submittable ? 'pointer' : 'not-allowed',
            fontSize: 14, fontFamily: 'inherit',
          }}
        >
          Submit {!submittable && '(fill all fields)'}
        </button>
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Nested fields
// ============================================================================

function NestedFieldsDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(values) => alert(JSON.stringify(values, null, 2))}
      style={{ width: 400 }}
    >
      <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
        <NativeInput placeholder="user.name" />
      </Form.Item>
      <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', message: 'Invalid email' }]}>
        <NativeInput placeholder="user.email" />
      </Form.Item>
      <Form.Item name={['user', 'address', 'city']} label="City">
        <NativeInput placeholder="user.address.city" />
      </Form.Item>
      <Form.Item name={['user', 'address', 'zip']} label="ZIP">
        <NativeInput placeholder="user.address.zip" />
      </Form.Item>
      <Form.Item>
        <SubmitBtn>Submit (check nested structure)</SubmitBtn>
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: With J-UI Components
// ============================================================================

function JUIComponentsDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(values) => alert(JSON.stringify(values, null, 2))}
      style={{ width: 400 }}
    >
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker placeholder="Select date" />
      </Form.Item>

      <Form.Item
        name="agree"
        valuePropName="checked"
        rules={[{
          validator: (_rule, value) =>
            value ? Promise.resolve() : Promise.reject('You must agree to the terms'),
        }]}
      >
        <Checkbox>I agree to the terms</Checkbox>
      </Form.Item>

      <Form.Item>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Dynamic Fields (Form.List)
// ============================================================================

function DynamicFieldsDemo() {
  return (
    <Form
      layout="vertical"
      onFinish={(values) => alert(JSON.stringify(values, null, 2))}
      style={{ width: 500 }}
    >
      <Form.List name="passengers" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <div>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' }}>
                <Form.Item
                  name={[field.name, 'name']}
                  rules={[{ required: true, message: 'Name required' }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <NativeInput placeholder="Passenger name" />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'age']}
                  rules={[{ required: true, message: 'Age required' }]}
                  style={{ width: 100, marginBottom: 0 }}
                >
                  <NativeInput placeholder="Age" />
                </Form.Item>
                <button
                  type="button"
                  onClick={() => remove(field.name)}
                  style={{
                    marginTop: 4, padding: '6px 12px', border: `1px solid ${tokens.colorBorder}`,
                    borderRadius: 4, backgroundColor: 'transparent', cursor: 'pointer',
                    fontSize: 13, fontFamily: 'inherit', color: tokens.colorError,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => add()}
              style={{
                padding: '6px 16px', border: `1px dashed ${tokens.colorBorder}`,
                borderRadius: 6, backgroundColor: 'transparent', cursor: 'pointer',
                fontSize: 13, fontFamily: 'inherit', color: tokens.colorPrimary, width: '100%',
              }}
            >
              + Add passenger
            </button>
          </div>
        )}
      </Form.List>

      <Form.Item style={{ marginTop: 16 }}>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: External Control (useForm)
// ============================================================================

function ExternalControlDemo() {
  const [form] = useForm()
  const [output, setOutput] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      <Form form={form} layout="vertical" onFinish={(v) => setOutput(JSON.stringify(v, null, 2))}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <NativeInput placeholder="Your name" />
        </Form.Item>
        <Form.Item name="city" label="City">
          <NativeInput placeholder="Your city" />
        </Form.Item>
      </Form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Btn onClick={() => form.setFieldsValue({ name: 'John', city: 'Madrid' })}>Fill values</Btn>
        <Btn onClick={() => form.resetFields()}>Reset</Btn>
        <Btn onClick={() => form.validateFields().then(v => setOutput(JSON.stringify(v, null, 2))).catch(() => {})}>Validate</Btn>
        <Btn onClick={() => setOutput(JSON.stringify(form.getFieldsValue(), null, 2))}>Get values</Btn>
        <Btn onClick={() => form.submit()}>Submit</Btn>
      </div>
      {output && (
        <pre style={{ padding: 12, backgroundColor: tokens.colorBgMuted, borderRadius: 6, fontSize: 12, margin: 0, whiteSpace: 'pre-wrap' }}>
          {output}
        </pre>
      )}
    </div>
  )
}

// ============================================================================
// Demo: useWatch
// ============================================================================

function WatchDemo() {
  const [form] = useForm()

  return (
    <Form form={form} layout="vertical" style={{ width: 360 }}>
      <Form.Item name="greeting" label="Greeting">
        <NativeInput placeholder="Type something..." />
      </Form.Item>
      <WatchDisplay form={form} />
    </Form>
  )
}

function WatchDisplay({ form }: { form: FormInstance }) {
  const greeting = useWatch('greeting', form)
  return (
    <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 16 }}>
      Live value: {greeting || '(empty)'}
    </Text>
  )
}

// ============================================================================
// Demo: Dependencies (password confirm)
// ============================================================================

function DependenciesDemoWithForm() {
  const [form] = useForm()

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => alert('Success: ' + JSON.stringify(values))}
      style={{ width: 360 }}
    >
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Password is required' }, { min: 6, message: 'At least 6 characters' }]}
      >
        <NativeInput type="password" placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          {
            validator: (_rule, value) => {
              if (!value) return Promise.resolve()
              const pw = form.getFieldValue('password')
              if (value === pw) return Promise.resolve()
              return Promise.reject('Passwords do not match')
            },
          },
        ]}
      >
        <NativeInput type="password" placeholder="Confirm password" />
      </Form.Item>

      <Form.Item>
        <SubmitBtn>Register</SubmitBtn>
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Render prop
// ============================================================================

function RenderPropDemo() {
  return (
    <Form layout="vertical" onFinish={(v) => alert(JSON.stringify(v))} style={{ width: 360 }}>
      <Form.Item
        name="custom"
        label="Custom control"
        rules={[{ required: true, message: 'Please select a value' }]}
      >
        {(control, meta) => (
          <div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Option A', 'Option B', 'Option C'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => control.onChange(opt)}
                  style={{
                    padding: '6px 14px',
                    border: `1px solid ${control.value === opt ? tokens.colorPrimary : tokens.colorBorder}`,
                    borderRadius: 4,
                    backgroundColor: control.value === opt ? tokens.colorPrimaryBg : 'transparent',
                    color: control.value === opt ? tokens.colorPrimary : tokens.colorText,
                    cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {meta.errors.length > 0 && (
              <div style={{ color: tokens.colorError, fontSize: 12, marginTop: 4 }}>
                {meta.errors[0]}
              </div>
            )}
          </div>
        )}
      </Form.Item>

      <Form.Item>
        <SubmitBtn />
      </Form.Item>
    </Form>
  )
}

// ============================================================================
// Demo: Form.Provider (control between forms)
// ============================================================================

function FormProviderDemo() {
  const [mainForm] = useForm()
  const [contactForm] = useForm()
  const [showModal, setShowModal] = useState(false)
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([])

  return (
    <Form.Provider
      onFormFinish={(name, { values }) => {
        if (name === 'contactForm') {
          setContacts(prev => [...prev, values as { name: string; phone: string }])
          contactForm.resetFields()
          setShowModal(false)
        }
      }}
    >
      <div style={{ width: 400 }}>
        <Form form={mainForm} name="mainForm" layout="vertical" onFinish={(v) => alert(JSON.stringify({ ...v, contacts }, null, 2))}>
          <Form.Item name="project" label="Project name" rules={[{ required: true }]}>
            <NativeInput placeholder="My project" />
          </Form.Item>

          <Form.Item label="Contacts">
            {contacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {contacts.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 12px', border: `1px solid ${tokens.colorBorder}`, borderRadius: 6, fontSize: 13,
                  }}>
                    <span>{c.name} — {c.phone}</span>
                    <button type="button" onClick={() => setContacts(prev => prev.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.colorError, fontSize: 13, fontFamily: 'inherit' }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>No contacts added yet</Text>
            )}
            <button type="button" onClick={() => setShowModal(true)} style={{
              padding: '6px 16px', border: `1px dashed ${tokens.colorBorder}`, borderRadius: 6,
              backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              color: tokens.colorPrimary, width: '100%',
            }}>
              + Add contact
            </button>
          </Form.Item>

          <Form.Item>
            <SubmitBtn>Submit all</SubmitBtn>
          </Form.Item>
        </Form>

        {/* Simple modal overlay (placeholder until Modal component) */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <div style={{
              backgroundColor: tokens.colorBg, borderRadius: 8, padding: 24,
              width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
              <Text size="md" weight="semibold" style={{ display: 'block', marginBottom: 16 }}>
                Add contact
              </Text>
              <Form form={contactForm} name="contactForm" layout="vertical" onFinish={() => {}}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <NativeInput placeholder="Contact name" />
                </Form.Item>
                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                  <NativeInput placeholder="Phone number" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <Btn onClick={() => setShowModal(false)}>Cancel</Btn>
                  <button type="button" onClick={() => contactForm.submit()} style={{
                    padding: '6px 16px', border: 'none', borderRadius: 4,
                    backgroundColor: tokens.colorPrimary, color: tokens.colorPrimaryContrast,
                    cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                  }}>
                    Add
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </Form.Provider>
  )
}

// ============================================================================
// Main Section
// ============================================================================

export function FormSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>
        Form
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Validation rules" align="start">
        <ValidationDemo />
      </Section>

      <Section title="Layouts" align="start">
        <LayoutsDemo />
      </Section>

      <Section title="Mix layout (per-item override)" align="start">
        <MixLayoutDemo />
      </Section>

      <Section title="Form disabled" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Form variants" align="start">
        <VariantsDemo />
      </Section>

      <Section title="Required mark styles" align="start">
        <RequiredMarkDemo />
      </Section>

      <Section title="Label wrap" align="start">
        <LabelWrapDemo />
      </Section>

      <Section title="hasFeedback (custom validation status)" align="start">
        <HasFeedbackDemo />
      </Section>

      <Section title="Validate trigger & debounce" align="start">
        <ValidateTriggerDemo />
      </Section>

      <Section title="Validate only (dynamic submit)" align="start">
        <ValidateOnlyDemo />
      </Section>

      <Section title="Nested fields" align="start">
        <NestedFieldsDemo />
      </Section>

      <Section title="With J-UI components" align="start">
        <JUIComponentsDemo />
      </Section>

      <Section title="Dynamic fields (Form.List)" align="start">
        <DynamicFieldsDemo />
      </Section>

      <Section title="External control (useForm)" align="start">
        <ExternalControlDemo />
      </Section>

      <Section title="useWatch" align="start">
        <WatchDemo />
      </Section>

      <Section title="Dependencies (password confirm)" align="start">
        <DependenciesDemoWithForm />
      </Section>

      <Section title="Render prop children" align="start">
        <RenderPropDemo />
      </Section>

      <Section title="Form.Provider (control between forms)" align="start">
        <FormProviderDemo />
      </Section>
    </div>
  )
}
