import { useState } from 'react'
import { Mention, Text, Form, useForm, tokens } from '../../index'
import type { MentionOption } from '../../index'
import { Section } from './shared'

// ============================================================================
// Sample data
// ============================================================================

const userOptions: MentionOption[] = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Brown' },
  { value: 'diana', label: 'Diana Prince' },
  { value: 'edward', label: 'Edward Norton' },
]

const tagOptions: MentionOption[] = [
  { value: 'bug', label: '#bug' },
  { value: 'feature', label: '#feature' },
  { value: 'enhancement', label: '#enhancement' },
  { value: 'docs', label: '#docs' },
  { value: 'urgent', label: '#urgent' },
]

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  const [value, setValue] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Mention
        options={userOptions}
        value={value}
        onChange={setValue}
        placeholder="Type @ to mention someone"
      />
      <Text size="sm" type="secondary">Value: {value || '(empty)'}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Placement
// ============================================================================

function PlacementDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Text size="sm" type="secondary">placement=&quot;bottom&quot; (default):</Text>
      <Mention options={userOptions} placeholder="Type @ — dropdown below" />

      <Text size="sm" type="secondary">placement=&quot;top&quot;:</Text>
      <Mention options={userOptions} placement="top" placeholder="Type @ — dropdown above" />
    </div>
  )
}

// ============================================================================
// Demo: Multiple Prefixes
// ============================================================================

function MultiplePrefixDemo() {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<MentionOption[]>([])

  const handleSearch = (_text: string, prefix: string) => {
    if (prefix === '@') {
      setOptions(userOptions)
    } else if (prefix === '#') {
      setOptions(tagOptions)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Mention
        prefix={['@', '#']}
        options={options}
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        placeholder="@ for users, # for tags"
      />
      <Text size="sm" type="secondary">Value: {value || '(empty)'}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Custom Filter
// ============================================================================

function CustomFilterDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Text size="sm" type="secondary">Starts-with filter (not includes):</Text>
      <Mention
        options={userOptions}
        filterOption={(input, option) =>
          option.value.toLowerCase().startsWith(input.toLowerCase())
        }
        placeholder="Type @a (only alice matches)"
      />
    </div>
  )
}

// ============================================================================
// Demo: Async Loading
// ============================================================================

function AsyncDemo() {
  const [options, setOptions] = useState<MentionOption[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = (text: string) => {
    setLoading(true)
    setOptions([])
    // Simulate API delay
    setTimeout(() => {
      const filtered = userOptions.filter((o) =>
        o.value.toLowerCase().includes(text.toLowerCase()),
      )
      setOptions(filtered)
      setLoading(false)
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Text size="sm" type="secondary">filterOption=false + onSearch (async):</Text>
      <Mention
        options={options}
        filterOption={false}
        onSearch={handleSearch}
        notFoundContent={loading ? 'Loading...' : 'No matches'}
        placeholder="Type @ to search users"
      />
    </div>
  )
}

// ============================================================================
// Demo: ReadOnly & Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Mention options={userOptions} disabled defaultValue="Hello @alice " />
      <Mention options={userOptions} readOnly defaultValue="Hello @bob " />
    </div>
  )
}

// ============================================================================
// Demo: AutoSize
// ============================================================================

function AutoSizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Text size="sm" type="secondary">autoSize (minRows=2, maxRows=6):</Text>
      <Mention
        options={userOptions}
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder="Type here — grows as you type"
      />
    </div>
  )
}

// ============================================================================
// Demo: Size
// ============================================================================

function SizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Mention size="small" options={userOptions} placeholder="Small" />
      <Mention size="middle" options={userOptions} placeholder="Middle (default)" />
      <Mention size="large" options={userOptions} placeholder="Large" />
    </div>
  )
}

// ============================================================================
// Demo: Variants
// ============================================================================

function VariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Mention variant="outlined" options={userOptions} placeholder="Outlined (default)" />
      <Mention variant="filled" options={userOptions} placeholder="Filled" />
      <Mention variant="borderless" options={userOptions} placeholder="Borderless" />
      <Mention variant="underlined" options={userOptions} placeholder="Underlined" />
    </div>
  )
}

// ============================================================================
// Demo: Status
// ============================================================================

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Mention status="error" options={userOptions} placeholder="Error status" />
      <Mention status="warning" options={userOptions} placeholder="Warning status" />
    </div>
  )
}

// ============================================================================
// Demo: AllowClear
// ============================================================================

function AllowClearDemo() {
  const [value, setValue] = useState('Hello @alice ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Mention
        options={userOptions}
        value={value}
        onChange={setValue}
        allowClear
      />
      <Text size="sm" type="secondary">Value: {value || '(empty)'}</Text>
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
        <Form.Item name="comment" label="Comment" rules={[{ required: true }]}>
          <Mention
            options={userOptions}
            placeholder="Type @ to mention someone"
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

export function MentionSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Mention</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Textarea with mention suggestion dropdown triggered by prefix characters.
      </Text>

      <Section title="Basic usage" align="start">
        <BasicDemo />
      </Section>

      <Section title="Placement" align="start">
        <PlacementDemo />
      </Section>

      <Section title="Multiple prefixes" align="start">
        <MultiplePrefixDemo />
      </Section>

      <Section title="Custom filter" align="start">
        <CustomFilterDemo />
      </Section>

      <Section title="Async loading" align="start">
        <AsyncDemo />
      </Section>

      <Section title="Disabled & ReadOnly" align="start">
        <DisabledDemo />
      </Section>

      <Section title="AutoSize" align="start">
        <AutoSizeDemo />
      </Section>

      <Section title="Size" align="start">
        <SizeDemo />
      </Section>

      <Section title="Variants" align="start">
        <VariantsDemo />
      </Section>

      <Section title="Status" align="start">
        <StatusDemo />
      </Section>

      <Section title="Allow Clear" align="start">
        <AllowClearDemo />
      </Section>

      <Section title="Form integration" align="start">
        <FormIntegrationDemo />
      </Section>
    </div>
  )
}
