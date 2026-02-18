import { useState } from 'react'
import { Rate, Text, Form, useForm, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  return <Rate defaultValue={3} />
}

// ============================================================================
// Demo: Half Star
// ============================================================================

function HalfStarDemo() {
  return <Rate allowHalf defaultValue={2.5} />
}

// ============================================================================
// Demo: Show Value
// ============================================================================

function ShowValueDemo() {
  const [value, setValue] = useState(3)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Rate value={value} onChange={setValue} />
      <Text size="sm" type="secondary">{value} star{value !== 1 ? 's' : ''}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Read-only (disabled)
// ============================================================================

function ReadOnlyDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Rate disabled defaultValue={3} />
      <Rate disabled allowHalf defaultValue={3.5} />
    </div>
  )
}

// ============================================================================
// Demo: Size
// ============================================================================

function SizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rate size="small" defaultValue={3} />
      <Rate defaultValue={3} />
      <Rate size="large" defaultValue={3} />
    </div>
  )
}

// ============================================================================
// Demo: Clear
// ============================================================================

function ClearDemo() {
  const [value, setValue] = useState(3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Rate value={value} onChange={setValue} />
      <Text size="sm" type="secondary">
        Click the same star again to clear. Current: {value}
      </Text>
    </div>
  )
}

// ============================================================================
// Demo: Custom Count
// ============================================================================

function CustomCountDemo() {
  return <Rate count={10} defaultValue={6} />
}

// ============================================================================
// Demo: Custom Character
// ============================================================================

function CustomCharacterDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rate character="A" allowHalf defaultValue={3} />
      <Rate character={(index) => String.fromCharCode(65 + index)} allowHalf defaultValue={3} />
      <Rate character="♥" allowHalf defaultValue={2.5} />
    </div>
  )
}

// ============================================================================
// Demo: Tooltips
// ============================================================================

function TooltipsDemo() {
  const [value, setValue] = useState(3)
  const tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Rate tooltips={tooltips} value={value} onChange={setValue} />
      {value > 0 && <Text size="sm" type="secondary">{tooltips[value - 1]}</Text>}
    </div>
  )
}

// ============================================================================
// Demo: Semantic styles
// ============================================================================

function SemanticDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rate
        defaultValue={3}
        styles={{
          character: { color: tokens.colorError, fontSize: '1.5rem' },
        }}
      />
      <Rate
        defaultValue={4}
        styles={{
          root: {
            gap: '1rem',
            padding: '8px 12px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 8,
            backgroundColor: tokens.colorBgSubtle,
          },
          character: { color: tokens.colorSuccess, fontSize: '2rem' },
        }}
      />
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
        <Form.Item name="rating" label="Your rating" rules={[{ required: true }]}>
          <Rate allowHalf />
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

export function RateSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Rate</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A star rating component for collecting user feedback.
      </Text>

      <Section title="Basic usage">
        <BasicDemo />
      </Section>

      <Section title="Half star">
        <HalfStarDemo />
      </Section>

      <Section title="Show value" align="start">
        <ShowValueDemo />
      </Section>

      <Section title="Read-only (disabled)">
        <ReadOnlyDemo />
      </Section>

      <Section title="Size" align="start">
        <SizeDemo />
      </Section>

      <Section title="Clear" align="start">
        <ClearDemo />
      </Section>

      <Section title="Custom count">
        <CustomCountDemo />
      </Section>

      <Section title="Custom character" align="start">
        <CustomCharacterDemo />
      </Section>

      <Section title="Tooltips" align="start">
        <TooltipsDemo />
      </Section>

      <Section title="Semantic styles" align="start">
        <SemanticDemo />
      </Section>

      <Section title="Form integration" align="start">
        <FormIntegrationDemo />
      </Section>
    </div>
  )
}
