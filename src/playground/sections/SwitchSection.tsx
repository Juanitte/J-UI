import { useState } from 'react'
import { Switch, Flex, Text, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Icons for Demo 3
// ============================================================================

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ============================================================================
// Demo 1: Basic
// ============================================================================

function BasicDemo() {
  return (
    <Flex gap={16} align="center">
      <Switch defaultChecked />
      <Switch />
    </Flex>
  )
}

// ============================================================================
// Demo 2: Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <Flex gap={16} align="center">
      <Switch disabled defaultChecked />
      <Switch disabled />
    </Flex>
  )
}

// ============================================================================
// Demo 3: Text & Icon
// ============================================================================

function TextIconDemo() {
  return (
    <Flex vertical gap={12}>
      <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
      <Switch checkedChildren="1" unCheckedChildren="0" />
      <Switch checkedChildren={<CheckIcon />} unCheckedChildren={<CloseIcon />} defaultChecked />
      <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" defaultChecked />
    </Flex>
  )
}

// ============================================================================
// Demo 4: Size
// ============================================================================

function SizeDemo() {
  return (
    <Flex gap={16} align="center">
      <Switch defaultChecked />
      <Switch defaultChecked size="small" />
    </Flex>
  )
}

// ============================================================================
// Demo 5: Loading
// ============================================================================

function LoadingDemo() {
  return (
    <Flex gap={16} align="center">
      <Switch loading defaultChecked />
      <Switch loading />
      <Switch loading size="small" defaultChecked />
    </Flex>
  )
}

// ============================================================================
// Demo 6: Controlled
// ============================================================================

function ControlledDemo() {
  const [checked, setChecked] = useState(true)
  const [disabled, setDisabled] = useState(false)

  return (
    <Flex vertical gap={12}>
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(c) => setChecked(c)}
      />
      <Flex gap={8}>
        <button
          onClick={() => setChecked(!checked)}
          style={{
            padding: '4px 12px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 4,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Toggle
        </button>
        <button
          onClick={() => setDisabled(!disabled)}
          style={{
            padding: '4px 12px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 4,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          {disabled ? 'Enable' : 'Disable'}
        </button>
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 7: Value aliases
// ============================================================================

function ValueAliasDemo() {
  const [val, setVal] = useState(true)
  return (
    <Flex vertical gap={12}>
      <Flex gap={16} align="center">
        <Switch value={val} onChange={(c) => setVal(c)} />
        <Text size="sm" type="secondary">Using value prop: {String(val)}</Text>
      </Flex>
      <Flex gap={16} align="center">
        <Switch defaultValue />
        <Text size="sm" type="secondary">Using defaultValue prop</Text>
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 8: Custom styles
// ============================================================================

function CustomStylesDemo() {
  return (
    <Flex vertical gap={12}>
      <Flex gap={16} align="center">
        <Switch
          defaultChecked
          styles={{
            track: { backgroundColor: tokens.colorSuccess },
          }}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
        <Text size="sm" type="secondary">Success color</Text>
      </Flex>
      <Flex gap={16} align="center">
        <Switch
          defaultChecked
          styles={{
            track: { backgroundColor: tokens.colorError },
          }}
        />
        <Text size="sm" type="secondary">Error color</Text>
      </Flex>
      <Flex gap={16} align="center">
        <Switch
          defaultChecked
          styles={{
            track: { backgroundColor: tokens.colorWarning },
            thumb: { boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
          }}
        />
        <Text size="sm" type="secondary">Warning color + custom thumb shadow</Text>
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 9: Focus ring
// ============================================================================

function FocusDemo() {
  return (
    <Flex gap={16} align="center">
      <Switch defaultChecked />
      <Switch />
      <Text size="sm" type="secondary">Tab to see focus ring (keyboard only)</Text>
    </Flex>
  )
}

// ============================================================================
// Demo 10: onChange callback
// ============================================================================

function OnChangeDemo() {
  const [log, setLog] = useState<string[]>([])

  return (
    <Flex vertical gap={8}>
      <Switch
        onChange={(checked) => {
          setLog(prev => [...prev.slice(-4), `${checked}`])
        }}
      />
      <Text size="sm" type="secondary">
        Log: {log.length > 0 ? log.join(' → ') : 'click the switch'}
      </Text>
    </Flex>
  )
}

// ============================================================================
// Section
// ============================================================================

export function SwitchSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Switch</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A toggle switch for switching between two states.
      </Text>

      <Section title="Basic usage">
        <BasicDemo />
      </Section>

      <Section title="Disabled">
        <DisabledDemo />
      </Section>

      <Section title="Text & Icon">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use checkedChildren and unCheckedChildren for custom content inside the switch.
          </Text>
          <TextIconDemo />
        </Flex>
      </Section>

      <Section title="Size">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Default and small sizes.
          </Text>
          <SizeDemo />
        </Flex>
      </Section>

      <Section title="Loading">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Loading state shows a spinner and disables interaction.
          </Text>
          <LoadingDemo />
        </Flex>
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Value / DefaultValue aliases" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            The value prop is an alias for checked, and defaultValue is an alias for defaultChecked.
          </Text>
          <ValueAliasDemo />
        </Flex>
      </Section>

      <Section title="Custom styles" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use the styles prop to customize track, thumb, and inner slots.
          </Text>
          <CustomStylesDemo />
        </Flex>
      </Section>

      <Section title="Focus ring">
        <FocusDemo />
      </Section>

      <Section title="onChange callback" align="start">
        <OnChangeDemo />
      </Section>
    </div>
  )
}
