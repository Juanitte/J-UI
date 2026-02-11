import { useState } from 'react'
import { Input, Text, Form, useForm, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Icons for demos
// ============================================================================

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  const [value, setValue] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
      <Input
        placeholder="Enter something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Text size="sm" type="secondary">Value: {value || '(empty)'}</Text>
    </div>
  )
}

// ============================================================================
// Demo: Sizes
// ============================================================================

function SizesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input size="small" placeholder="Small" />
      <Input size="middle" placeholder="Middle (default)" />
      <Input size="large" placeholder="Large" />
    </div>
  )
}

// ============================================================================
// Demo: Variants
// ============================================================================

function VariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input variant="outlined" placeholder="Outlined (default)" />
      <Input variant="filled" placeholder="Filled" />
      <Input variant="borderless" placeholder="Borderless" />
      <Input variant="underlined" placeholder="Underlined" />
    </div>
  )
}

// ============================================================================
// Demo: Status
// ============================================================================

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input status="error" placeholder="Error status" />
      <Input status="warning" placeholder="Warning status" />
      <Input status="error" variant="filled" placeholder="Error + filled" />
      <Input status="warning" variant="underlined" placeholder="Warning + underlined" />
    </div>
  )
}

// ============================================================================
// Demo: Prefix & Suffix
// ============================================================================

function PrefixSuffixDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input prefix={<UserIcon />} placeholder="Username" />
      <Input prefix={<MailIcon />} suffix={<InfoIcon />} placeholder="Email" />
      <Input prefix="$" suffix=".00" placeholder="Amount" />
      <Input prefix={<LockIcon />} placeholder="Password" type="password" />
    </div>
  )
}

// ============================================================================
// Demo: Addon before & after
// ============================================================================

function AddonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <Input addonBefore="https://" addonAfter=".com" placeholder="mysite" />
      <Input addonBefore="+" addonAfter="kg" placeholder="Weight" />
      <Input addonBefore={<UserIcon />} placeholder="With icon addon" />
    </div>
  )
}

// ============================================================================
// Demo: Allow clear
// ============================================================================

function AllowClearDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input allowClear placeholder="Type and clear..." defaultValue="Hello world" />
      <Input allowClear prefix={<UserIcon />} placeholder="With prefix + clear" />
    </div>
  )
}

// ============================================================================
// Demo: Show count / maxLength
// ============================================================================

function CountDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">showCount + maxLength:</Text>
      <Input showCount maxLength={20} placeholder="Max 20 chars" />

      <Text size="sm" type="secondary">count.max + exceedFormatter (truncates):</Text>
      <Input
        count={{
          max: 10,
          show: true,
          exceedFormatter: (val, { max }) => val.slice(0, max),
        }}
        placeholder="Max 10 chars (auto-truncate)"
      />

      <Text size="sm" type="secondary">Custom count formatter:</Text>
      <Input
        count={{
          show: ({ count, maxLength }) => (
            <span style={{ color: count > 15 ? tokens.colorError : tokens.colorTextMuted }}>
              {count}{maxLength ? ` / ${maxLength}` : ''} chars
            </span>
          ),
          max: 20,
        }}
        placeholder="Custom count display"
      />
    </div>
  )
}

// ============================================================================
// Demo: Password
// ============================================================================

function PasswordDemo() {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">Basic password:</Text>
      <Input.Password placeholder="Enter password" />

      <Text size="sm" type="secondary">Controlled visibility:</Text>
      <Input.Password
        placeholder="Controlled toggle"
        visibilityToggle={{ visible, onVisibleChange: setVisible }}
      />
      <Text size="sm" type="secondary">Password visible: {visible ? 'Yes' : 'No'}</Text>

      <Text size="sm" type="secondary">With prefix icon:</Text>
      <Input.Password prefix={<LockIcon />} placeholder="Secure password" />
    </div>
  )
}

// ============================================================================
// Demo: Search
// ============================================================================

function SearchDemo() {
  const [loading, setLoading] = useState(false)

  const handleSearch = (val: string) => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
    // eslint-disable-next-line no-console
    console.log('Search:', val)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Text size="sm" type="secondary">Basic search (icon in suffix):</Text>
      <Input.Search placeholder="Search..." onSearch={(v) => console.log('Search:', v)} />

      <Text size="sm" type="secondary">With enter button:</Text>
      <Input.Search enterButton placeholder="Search..." onSearch={(v) => console.log('Search:', v)} />

      <Text size="sm" type="secondary">Custom button text:</Text>
      <Input.Search enterButton="Go" placeholder="Search..." onSearch={(v) => console.log('Search:', v)} />

      <Text size="sm" type="secondary">Loading state:</Text>
      <Input.Search
        enterButton
        loading={loading}
        placeholder="Search..."
        onSearch={handleSearch}
      />
    </div>
  )
}

// ============================================================================
// Demo: TextArea
// ============================================================================

function TextAreaDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 350 }}>
      <Text size="sm" type="secondary">Basic textarea:</Text>
      <Input.TextArea placeholder="Enter text..." rows={3} />

      <Text size="sm" type="secondary">autoSize (auto-grow):</Text>
      <Input.TextArea placeholder="Type to grow..." autoSize />

      <Text size="sm" type="secondary">autoSize with min/max rows:</Text>
      <Input.TextArea
        placeholder="Min 2, max 6 rows"
        autoSize={{ minRows: 2, maxRows: 6 }}
      />

      <Text size="sm" type="secondary">With showCount + maxLength:</Text>
      <Input.TextArea
        showCount
        maxLength={100}
        placeholder="Max 100 characters"
        rows={3}
      />
    </div>
  )
}

// ============================================================================
// Demo: OTP
// ============================================================================

function OTPDemo() {
  const [value, setValue] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 350 }}>
      <Text size="sm" type="secondary">Basic OTP (6 digits):</Text>
      <Input.OTP onChange={(v) => setValue(v)} />
      <Text size="sm" type="secondary">Value: {value || '(empty)'}</Text>

      <Text size="sm" type="secondary">With mask:</Text>
      <Input.OTP mask />

      <Text size="sm" type="secondary">Custom mask character:</Text>
      <Input.OTP mask="*" />

      <Text size="sm" type="secondary">4-digit code, large:</Text>
      <Input.OTP length={4} size="large" />

      <Text size="sm" type="secondary">Digits only (formatter):</Text>
      <Input.OTP formatter={(v) => v.replace(/\D/g, '')} />
    </div>
  )
}

// ============================================================================
// Demo: Disabled & ReadOnly
// ============================================================================

function DisabledDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Input disabled placeholder="Disabled" defaultValue="Disabled input" />
      <Input readOnly defaultValue="ReadOnly input" />
      <Input.TextArea disabled placeholder="Disabled textarea" defaultValue="Disabled content" rows={2} />
      <Input.Password disabled placeholder="Disabled password" defaultValue="secret" />
      <Input.OTP disabled defaultValue="1234" length={4} />
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
        <Form.Item name="username" label="Username" rules={[{ required: true }, { min: 3, message: 'At least 3 characters' }]}>
          <Input prefix={<UserIcon />} placeholder="Username" allowClear />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
          <Input prefix={<MailIcon />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }, { min: 6 }]}>
          <Input.Password prefix={<LockIcon />} placeholder="Password" />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea placeholder="Tell us about yourself" autoSize={{ minRows: 2, maxRows: 4 }} showCount maxLength={200} />
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

export function InputSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Input</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Text input, textarea, search, password, and OTP components.
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

      <Section title="Prefix & Suffix" align="start">
        <PrefixSuffixDemo />
      </Section>

      <Section title="Addon Before & After" align="start">
        <AddonDemo />
      </Section>

      <Section title="Allow clear" align="start">
        <AllowClearDemo />
      </Section>

      <Section title="Show count / maxLength" align="start">
        <CountDemo />
      </Section>

      <Section title="Password" align="start">
        <PasswordDemo />
      </Section>

      <Section title="Search" align="start">
        <SearchDemo />
      </Section>

      <Section title="TextArea" align="start">
        <TextAreaDemo />
      </Section>

      <Section title="OTP" align="start">
        <OTPDemo />
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
