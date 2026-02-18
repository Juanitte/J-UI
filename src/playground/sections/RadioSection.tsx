import { useState } from 'react'
import { Radio, Text, Form, useForm, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  return <Radio>Radio</Radio>
}

// ============================================================================
// Demo: Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Radio disabled>Disabled</Radio>
      <Radio disabled checked>Disabled checked</Radio>
    </div>
  )
}

// ============================================================================
// Demo: Controlled
// ============================================================================

function ControlledDemo() {
  const [value, setValue] = useState('a')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio.Group value={value} onChange={(e) => setValue(e.target.value as string)}>
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
        <Radio value="c">C</Radio>
        <Radio value="d">D</Radio>
      </Radio.Group>
      <Text size="sm" type="secondary">Selected: {value}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Group with options
// ============================================================================

const plainOptions = ['Apple', 'Pear', 'Orange']

const optionsWithDisabled = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange', disabled: true },
]

function GroupDemo() {
  const [value1, setValue1] = useState('Apple')
  const [value2, setValue2] = useState('apple')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio.Group
        options={plainOptions}
        value={value1}
        onChange={(e) => setValue1(e.target.value as string)}
      />
      <Radio.Group
        options={optionsWithDisabled}
        value={value2}
        onChange={(e) => setValue2(e.target.value as string)}
      />
    </div>
  )
}

// ============================================================================
// Demo: Vertical
// ============================================================================

function VerticalDemo() {
  const [value, setValue] = useState(1)

  return (
    <Radio.Group
      value={value}
      onChange={(e) => setValue(e.target.value as number)}
      style={{ flexDirection: 'column', alignItems: 'flex-start' }}
    >
      <Radio value={1}>Option A</Radio>
      <Radio value={2}>Option B</Radio>
      <Radio value={3}>Option C</Radio>
      <Radio value={4}>Option D (more)</Radio>
    </Radio.Group>
  )
}

// ============================================================================
// Demo: Radio.Button
// ============================================================================

function ButtonDemo() {
  const [value, setValue] = useState('a')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio.Group
        value={value}
        onChange={(e) => setValue(e.target.value as string)}
        optionType="button"
        options={[
          { label: 'Madrid', value: 'a' },
          { label: 'Barcelona', value: 'b' },
          { label: 'Valencia', value: 'c' },
          { label: 'Sevilla', value: 'd' },
        ]}
      />
    </div>
  )
}

// ============================================================================
// Demo: Radio.Button Solid
// ============================================================================

function ButtonSolidDemo() {
  const [value, setValue] = useState('a')

  return (
    <Radio.Group
      value={value}
      onChange={(e) => setValue(e.target.value as string)}
      optionType="button"
      buttonStyle="solid"
      options={[
        { label: 'Madrid', value: 'a' },
        { label: 'Barcelona', value: 'b' },
        { label: 'Valencia', value: 'c' },
        { label: 'Sevilla', value: 'd' },
      ]}
    />
  )
}

// ============================================================================
// Demo: Button with disabled
// ============================================================================

function ButtonDisabledDemo() {
  return (
    <Radio.Group
      defaultValue="a"
      optionType="button"
      options={[
        { label: 'Madrid', value: 'a' },
        { label: 'Barcelona', value: 'b' },
        { label: 'Valencia', value: 'c', disabled: true },
        { label: 'Sevilla', value: 'd' },
      ]}
    />
  )
}

// ============================================================================
// Demo: Size
// ============================================================================

function SizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio.Group
        defaultValue="a"
        size="small"
        optionType="button"
        options={[
          { label: 'Small', value: 'a' },
          { label: 'Medium', value: 'b' },
          { label: 'Large', value: 'c' },
        ]}
      />
      <Radio.Group
        defaultValue="a"
        size="middle"
        optionType="button"
        options={[
          { label: 'Small', value: 'a' },
          { label: 'Medium', value: 'b' },
          { label: 'Large', value: 'c' },
        ]}
      />
      <Radio.Group
        defaultValue="a"
        size="large"
        optionType="button"
        options={[
          { label: 'Small', value: 'a' },
          { label: 'Medium', value: 'b' },
          { label: 'Large', value: 'c' },
        ]}
      />
    </div>
  )
}

// ============================================================================
// Demo: Semantic styles
// ============================================================================

function SemanticDemo() {
  const [value, setValue] = useState('green')

  return (
    <Radio.Group
      value={value}
      onChange={(e) => setValue(e.target.value as string)}
      style={{ flexDirection: 'column', alignItems: 'flex-start' }}
    >
      <Radio
        value="green"
        styles={{
          radio: {
            border: `2px solid ${tokens.colorSuccess}`,
            backgroundColor: value === 'green' ? tokens.colorSuccess : 'transparent',
          },
          label: {
            fontWeight: 600,
            color: tokens.colorSuccess,
          },
        }}
      >
        Green radio
      </Radio>
      <Radio
        value="orange"
        styles={{
          radio: {
            border: `2px solid ${tokens.colorWarning}`,
            backgroundColor: value === 'orange' ? tokens.colorWarning : 'transparent',
          },
          label: {
            fontStyle: 'italic',
            color: tokens.colorWarning,
          },
        }}
      >
        Orange radio
      </Radio>
    </Radio.Group>
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
        <Form.Item name="fruit" label="Favorite fruit" rules={[{ required: true }]}>
          <Radio.Group
            options={[
              { label: 'Apple', value: 'apple' },
              { label: 'Pear', value: 'pear' },
              { label: 'Orange', value: 'orange' },
            ]}
          />
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

export function RadioSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Radio</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Radio buttons allow selection of a single option from a set.
      </Text>

      <Section title="Basic usage">
        <BasicDemo />
      </Section>

      <Section title="Disabled">
        <DisabledDemo />
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Group with options" align="start">
        <GroupDemo />
      </Section>

      <Section title="Vertical layout" align="start">
        <VerticalDemo />
      </Section>

      <Section title="Radio.Button" align="start">
        <ButtonDemo />
      </Section>

      <Section title="Radio.Button solid" align="start">
        <ButtonSolidDemo />
      </Section>

      <Section title="Radio.Button disabled" align="start">
        <ButtonDisabledDemo />
      </Section>

      <Section title="Size (button)" align="start">
        <SizeDemo />
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
