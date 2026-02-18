import { useState } from 'react'
import { TimePicker, Flex, Text, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Demo 1: Basic
// ============================================================================

function BasicDemo() {
  return (
    <TimePicker />
  )
}

// ============================================================================
// Demo 2: Size
// ============================================================================

function SizeDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker size="sm" placeholder="Small" />
      <TimePicker size="md" placeholder="Medium" />
      <TimePicker size="lg" placeholder="Large" />
    </Flex>
  )
}

// ============================================================================
// Demo 3: Controlled
// ============================================================================

function ControlledDemo() {
  const [value, setValue] = useState<Date | null>(null)
  const [timeStr, setTimeStr] = useState('')

  return (
    <Flex vertical gap={8}>
      <TimePicker
        value={value}
        onChange={(t, s) => { setValue(t); setTimeStr(s) }}
      />
      <Text size="sm" type="secondary">Value: {timeStr || '(none)'}</Text>
      <Flex gap={8}>
        <button
          onClick={() => {
            const d = new Date(); d.setHours(14, 30, 0, 0)
            setValue(d); setTimeStr('14:30:00')
          }}
          style={{
            padding: '4px 12px', border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 4, backgroundColor: tokens.colorBg,
            color: tokens.colorText, cursor: 'pointer', fontSize: 12,
          }}
        >
          Set 14:30
        </button>
        <button
          onClick={() => { setValue(null); setTimeStr('') }}
          style={{
            padding: '4px 12px', border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 4, backgroundColor: tokens.colorBg,
            color: tokens.colorText, cursor: 'pointer', fontSize: 12,
          }}
        >
          Clear
        </button>
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 4: 12-Hour
// ============================================================================

function TwelveHourDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker use12Hours placeholder="hh:mm AM/PM" />
      <TimePicker use12Hours format="hh:mm:ss A" placeholder="hh:mm:ss AM/PM" />
    </Flex>
  )
}

// ============================================================================
// Demo 5: Custom Format
// ============================================================================

function FormatDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker format="HH:mm:ss" placeholder="HH:mm:ss" />
      <TimePicker format="HH" placeholder="Hour only" />
    </Flex>
  )
}

// ============================================================================
// Demo 6: Disabled
// ============================================================================

function DisabledDemo() {
  const d = new Date(); d.setHours(14, 30, 0, 0)
  return (
    <TimePicker disabled defaultValue={d} />
  )
}

// ============================================================================
// Demo 7: Status
// ============================================================================

function StatusDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker status="error" placeholder="Error" />
      <TimePicker status="warning" placeholder="Warning" />
    </Flex>
  )
}

// ============================================================================
// Demo 8: Variant
// ============================================================================

function VariantDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker variant="outlined" placeholder="Outlined" />
      <TimePicker variant="filled" placeholder="Filled" />
      <TimePicker variant="borderless" placeholder="Borderless" />
    </Flex>
  )
}

// ============================================================================
// Demo 9: Steps
// ============================================================================

function StepsDemo() {
  return (
    <TimePicker hourStep={2} minuteStep={15} format="HH:mm" placeholder="hourStep=2, minuteStep=15" />
  )
}

// ============================================================================
// Demo 10: RangePicker
// ============================================================================

function RangeDemo() {
  return (
    <TimePicker.RangePicker />
  )
}

// ============================================================================
// Demo 11: Instant (no confirm)
// ============================================================================

function InstantDemo() {
  const [timeStr, setTimeStr] = useState('')

  return (
    <Flex vertical gap={8}>
      <TimePicker
        needConfirm={false}
        onChange={(_t, s) => setTimeStr(s)}
      />
      <Text size="sm" type="secondary">
        Value: {timeStr || '(selects instantly on click)'}
      </Text>
    </Flex>
  )
}

// ============================================================================
// Demo 12: Disabled Time
// ============================================================================

function DisabledTimeDemo() {
  return (
    <TimePicker
      disabledTime={() => ({
        disabledHours: () => [0, 1, 2, 3, 4, 5],
        disabledMinutes: (h: number) => h === 12 ? [0, 30] : [],
      })}
      placeholder="Hours 0-5 disabled"
    />
  )
}

// ============================================================================
// Demo 13: Show Now
// ============================================================================

function ShowNowDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker showNow placeholder="With Now button" />
      <TimePicker showNow={false} placeholder="Without Now" />
    </Flex>
  )
}

// ============================================================================
// Demo 14: Addon
// ============================================================================

function AddonDemo() {
  return (
    <TimePicker
      addon={
        <Text size="sm" type="secondary">
          Business hours: 09:00 - 18:00
        </Text>
      }
    />
  )
}

// ============================================================================
// Demo 15: Change on scroll
// ============================================================================

function ChangeOnScrollDemo() {
  const [timeStr, setTimeStr] = useState('')

  return (
    <Flex vertical gap={8}>
      <TimePicker
        changeOnScroll
        needConfirm={false}
        onChange={(_t, s) => setTimeStr(s)}
        placeholder="Scroll to select"
      />
      <Text size="sm" type="secondary">
        Value: {timeStr || '(scroll columns to change value)'}
      </Text>
    </Flex>
  )
}

// ============================================================================
// Demo 16: Prefix & Suffix
// ============================================================================

function PrefixSuffixDemo() {
  return (
    <Flex gap={16} align="center">
      <TimePicker
        prefix={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
        placeholder="With prefix"
      />
      <TimePicker
        suffix={
          <Text size="sm" type="secondary">hrs</Text>
        }
        placeholder="Custom suffix"
      />
      <TimePicker
        suffix={null}
        placeholder="No suffix"
      />
    </Flex>
  )
}

// ============================================================================
// Demo 17: Analog Clock
// ============================================================================

function AnalogDemo() {
  const [timeStr, setTimeStr] = useState('')

  return (
    <Flex gap={16} align="start">
      <Flex vertical gap={8}>
        <TimePicker
          showAnalog
          onChange={(_t, s) => setTimeStr(s)}
        />
        <Text size="sm" type="secondary">
          Value: {timeStr || '(click/drag the clock dial)'}
        </Text>
      </Flex>
      <TimePicker showAnalog use12Hours placeholder="12h analog" />
      <TimePicker showAnalog format="HH:mm:ss" placeholder="With seconds" />
    </Flex>
  )
}

// ============================================================================
// Demo 18: Semantic Styles
// ============================================================================

function SemanticStylesDemo() {
  return (
    <Flex vertical gap={16}>
      <Text size="sm" type="secondary" style={{ display: 'block' }}>
        Slots: <Text code>root</Text>, <Text code>input</Text>, <Text code>popup</Text>, <Text code>column</Text>, <Text code>footer</Text>
      </Text>
      <Flex gap={16} align="center">
        <TimePicker
          placeholder="Custom input"
          styles={{
            input: {
              backgroundColor: tokens.colorPrimary50,
              borderColor: tokens.colorPrimary,
              color: tokens.colorPrimary,
              fontWeight: 600,
            },
          }}
        />
        <Text size="sm" type="secondary">Styled input slot</Text>
      </Flex>
      <Flex gap={16} align="center">
        <TimePicker
          placeholder="Custom popup & columns"
          styles={{
            popup: {
              borderRadius: 12,
              border: `2px solid ${tokens.colorSuccess700}`,
              backgroundColor: tokens.colorBg,
            },
            column: {
              backgroundColor: tokens.colorSuccess400,
            },
            footer: {
              backgroundColor: tokens.colorSuccess200,
            },
          }}
        />
        <Text size="sm" type="secondary">Styled popup, column & footer slots</Text>
      </Flex>
      <Flex gap={16} align="center">
        <TimePicker
          placeholder="Full custom"
          styles={{
            root: { opacity: 0.9 },
            input: {
              border: `2px solid ${tokens.colorWarning700}`,
              borderRadius: 8,
            },
            popup: {
              border: `2px solid ${tokens.colorWarning700}`,
              borderRadius: 12,
              backgroundColor: tokens.colorBg,
            },
            column: {
              backgroundColor: tokens.colorWarning500,
            },
          }}
        />
        <Text size="sm" type="secondary">Multiple slots combined</Text>
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Section
// ============================================================================

export function TimePickerSection() {
  return (
    <div>
      <Text size="xl" weight="bold">TimePicker</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A time selection control with scrollable columns for hours, minutes, and seconds.
      </Text>

      <Section title="Basic usage">
        <BasicDemo />
      </Section>

      <Section title="Size">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Three sizes: sm, md, lg.
          </Text>
          <SizeDemo />
        </Flex>
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="12-Hour format">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use use12Hours for an AM/PM column. Optionally combine with a custom format.
          </Text>
          <TwelveHourDemo />
        </Flex>
      </Section>

      <Section title="Custom format">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            The format prop determines which columns appear.
          </Text>
          <FormatDemo />
        </Flex>
      </Section>

      <Section title="Disabled">
        <DisabledDemo />
      </Section>

      <Section title="Status">
        <StatusDemo />
      </Section>

      <Section title="Variant">
        <VariantDemo />
      </Section>

      <Section title="Steps">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            hourStep=2, minuteStep=15 — only show those increments.
          </Text>
          <StepsDemo />
        </Flex>
      </Section>

      <Section title="RangePicker">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            TimePicker.RangePicker for selecting start and end times.
          </Text>
          <RangeDemo />
        </Flex>
      </Section>

      <Section title="Instant mode (no confirm)" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            With needConfirm=false, selections are applied instantly without OK button.
          </Text>
          <InstantDemo />
        </Flex>
      </Section>

      <Section title="Disabled time">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use disabledTime to disable specific hours, minutes, or seconds.
          </Text>
          <DisabledTimeDemo />
        </Flex>
      </Section>

      <Section title="Show Now button">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            The Now button sets the current time. Shown by default when needConfirm is true.
          </Text>
          <ShowNowDemo />
        </Flex>
      </Section>

      <Section title="Addon">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Render custom content at the bottom of the time picker panel using the addon prop.
          </Text>
          <AddonDemo />
        </Flex>
      </Section>

      <Section title="Change on scroll" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            With changeOnScroll and needConfirm=false, scrolling the columns selects the nearest value automatically.
          </Text>
          <ChangeOnScrollDemo />
        </Flex>
      </Section>

      <Section title="Prefix & Suffix">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Custom prefix and suffix icons. Pass suffix=null to remove the default clock icon.
          </Text>
          <PrefixSuffixDemo />
        </Flex>
      </Section>

      <Section title="Analog Clock" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use showAnalog for a circular clock dial. Click or drag to select time. Auto-advances from hours to minutes.
          </Text>
          <AnalogDemo />
        </Flex>
      </Section>

      <Section title="Semantic styles" align="start">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
