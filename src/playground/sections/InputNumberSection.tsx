import { useState } from 'react'
import { InputNumber, Text, Form, useForm, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Icons for demos
// ============================================================================

const DollarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const PercentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
)

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  const [value, setValue] = useState<number | string | null>(3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
      <InputNumber
        placeholder="Enter a number"
        value={value}
        onChange={(v) => setValue(v)}
      />
      <Text size="sm" type="secondary">Value: {value === null ? '(null)' : String(value)}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Sizes
// ============================================================================

function SizesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <InputNumber size="small" placeholder="Small" defaultValue={1} />
      <InputNumber size="middle" placeholder="Middle (default)" defaultValue={2} />
      <InputNumber size="large" placeholder="Large" defaultValue={3} />
    </div>
  )
}

// ============================================================================
// Demo: Variants
// ============================================================================

function VariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <InputNumber variant="outlined" placeholder="Outlined (default)" />
      <InputNumber variant="filled" placeholder="Filled" />
      <InputNumber variant="borderless" placeholder="Borderless" />
      <InputNumber variant="underlined" placeholder="Underlined" />
    </div>
  )
}

// ============================================================================
// Demo: Status
// ============================================================================

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <InputNumber status="error" placeholder="Error status" />
      <InputNumber status="warning" placeholder="Warning status" />
      <InputNumber status="error" variant="filled" placeholder="Error + filled" />
      <InputNumber status="warning" variant="underlined" placeholder="Warning + underlined" />
    </div>
  )
}

// ============================================================================
// Demo: Min / Max / Step
// ============================================================================

function MinMaxStepDemo() {
  const [value1, setValue1] = useState<number | string | null>(3)
  const [value2, setValue2] = useState<number | string | null>(0.5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">min=0, max=10, step=1:</Text>
      <InputNumber min={0} max={10} step={1} value={value1} onChange={setValue1} />
      <Text size="sm" type="secondary">Value: {String(value1)}</Text>

      <Text size="sm" type="secondary">min=0, max=1, step=0.1:</Text>
      <InputNumber min={0} max={1} step={0.1} value={value2} onChange={setValue2} />
      <Text size="sm" type="secondary">Value: {String(value2)}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Precision
// ============================================================================

function PrecisionDemo() {
  const [value, setValue] = useState<number | string | null>(1.5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
      <Text size="sm" type="secondary">precision=2 (always 2 decimal places):</Text>
      <InputNumber precision={2} value={value} onChange={setValue} />
      <Text size="sm" type="secondary">Value: {String(value)}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Formatter / Parser
// ============================================================================

function FormatterDemo() {
  const [currency, setCurrency] = useState<number | string | null>(1000)
  const [percent, setPercent] = useState<number | string | null>(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">Currency formatter:</Text>
      <InputNumber
        value={currency}
        onChange={setCurrency}
        formatter={(val) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(val) => (val || '').replace(/\$\s?|(,*)/g, '')}
        prefix={<DollarIcon />}
      />

      <Text size="sm" type="secondary">Percentage formatter:</Text>
      <InputNumber
        value={percent}
        onChange={setPercent}
        min={0}
        max={100}
        formatter={(val) => `${val}%`}
        parser={(val) => (val || '').replace('%', '')}
        suffix={<PercentIcon />}
      />
    </div>
  )
}

// ============================================================================
// Demo: Prefix & Suffix
// ============================================================================

function PrefixSuffixDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <InputNumber prefix={<DollarIcon />} placeholder="Amount" />
      <InputNumber suffix="kg" placeholder="Weight" />
      <InputNumber prefix={<DollarIcon />} suffix=".00" placeholder="Price" />
    </div>
  )
}

// ============================================================================
// Demo: Addon
// ============================================================================

function AddonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <InputNumber addonBefore="+" addonAfter="kg" placeholder="Weight" />
      <InputNumber addonBefore="$" addonAfter="USD" placeholder="Amount" />
    </div>
  )
}

// ============================================================================
// Demo: Controls
// ============================================================================

function ControlsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">Controls hidden:</Text>
      <InputNumber controls={false} defaultValue={5} />

      <Text size="sm" type="secondary">Custom icons:</Text>
      <InputNumber
        controls={{ upIcon: <ArrowUpIcon />, downIcon: <ArrowDownIcon /> }}
        defaultValue={5}
      />
    </div>
  )
}

// ============================================================================
// Demo: Keyboard & Wheel
// ============================================================================

function KeyboardWheelDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">Keyboard disabled (arrow keys won&apos;t work):</Text>
      <InputNumber keyboard={false} defaultValue={5} />

      <Text size="sm" type="secondary">Mouse wheel enabled (focus + scroll):</Text>
      <InputNumber changeOnWheel defaultValue={5} />
    </div>
  )
}

// ============================================================================
// Demo: Disabled & ReadOnly
// ============================================================================

function DisabledDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <InputNumber disabled defaultValue={42} />
      <InputNumber readOnly defaultValue={100} />
    </div>
  )
}

// ============================================================================
// Demo: Form integration
// ============================================================================

function FormIntegrationDemo() {
  const [form] = useForm()

  return (
    <div style={{ width: 400 }}>
      <Form form={form} layout="vertical" onFinish={(v) => alert(JSON.stringify(v, null, 2))}>
        <Form.Item name="age" label="Age" rules={[{ required: true }, { type: 'number', min: 0, max: 150 }]}>
          <InputNumber placeholder="Your age" min={0} max={150} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <InputNumber placeholder="How many?" min={1} step={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            style={{
              padding: '8px 24px', border: 'none', borderRadius: 6,
              backgroundColor: tokens.colorPrimary, color: tokens.colorPrimaryContrast,
              cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
            }}
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Main Section
// ============================================================================

export function InputNumberSection() {
  return (
    <div>
      <Text size="xl" weight="bold">InputNumber</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Numeric input with increment/decrement controls, formatting, and precision.
      </Text>

      <Section title="Basic usage" align="start">
        <BasicDemo />
      </Section>

      <Section title="Sizes" align="start">
        <SizesDemo />
      </Section>

      <Section title="Variants" align="start">
        <VariantsDemo />
      </Section>

      <Section title="Status" align="start">
        <StatusDemo />
      </Section>

      <Section title="Min / Max / Step" align="start">
        <MinMaxStepDemo />
      </Section>

      <Section title="Precision" align="start">
        <PrecisionDemo />
      </Section>

      <Section title="Formatter / Parser" align="start">
        <FormatterDemo />
      </Section>

      <Section title="Prefix & Suffix" align="start">
        <PrefixSuffixDemo />
      </Section>

      <Section title="Addon Before & After" align="start">
        <AddonDemo />
      </Section>

      <Section title="Controls" align="start">
        <ControlsDemo />
      </Section>

      <Section title="Keyboard & Wheel" align="start">
        <KeyboardWheelDemo />
      </Section>

      <Section title="Disabled & ReadOnly" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Form integration" align="start">
        <FormIntegrationDemo />
      </Section>
    </div>
  )
}
