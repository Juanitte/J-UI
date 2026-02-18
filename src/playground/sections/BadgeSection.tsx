import { useState } from 'react'
import { Avatar, Badge, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── Icons ──────────────────────────────────────────────────────────────────────

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

// ─── 1. Basic Count ─────────────────────────────────────────────────────────────

function BasicCountDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={25}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={100}>
        <Avatar shape="square" size="large" />
      </Badge>
    </div>
  )
}

// ─── 2. Overflow Count ──────────────────────────────────────────────────────────

function OverflowCountDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Default overflow (99)
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge count={99}>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={100}>
            <Avatar shape="square" size="large" />
          </Badge>
        </div>
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Custom overflowCount
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge count={10} overflowCount={5}>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={1000} overflowCount={999}>
            <Avatar shape="square" size="large" />
          </Badge>
        </div>
      </div>
    </div>
  )
}

// ─── 3. Dot Mode ────────────────────────────────────────────────────────────────

function DotDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge dot>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot>
        <MailIcon size={20} />
      </Badge>
      <Badge dot>
        <a href="#" style={{ color: tokens.colorPrimary }}>Link with dot</a>
      </Badge>
    </div>
  )
}

// ─── Standalone ─────────────────────────────────────────────────────────────────

function StandaloneDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge count={25} />
      <Badge count={4} color="green" />
      <Badge dot />
      <Badge dot color="blue" />
      <Badge status="processing" text="Processing" />
    </div>
  )
}

// ─── Clickable ──────────────────────────────────────────────────────────────────

function ClickableDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <a href="#" onClick={e => e.preventDefault()}>
        <Badge count={5}>
          <Avatar shape="square" size="large" />
        </Badge>
      </a>
      <a href="#" onClick={e => e.preventDefault()}>
        <Badge dot>
          <Avatar shape="square" size="large" />
        </Badge>
      </a>
    </div>
  )
}

// ─── 4. showZero ────────────────────────────────────────────────────────────────

function ShowZeroDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Badge count={0}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Text size="sm" type="secondary">Hidden (default)</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Badge count={0} showZero>
          <Avatar shape="square" size="large" />
        </Badge>
        <Text size="sm" type="secondary">showZero</Text>
      </div>
    </div>
  )
}

// ─── 5. Sizes ───────────────────────────────────────────────────────────────────

function SizesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge count={5} size="default">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} size="small">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot size="default">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot size="small">
        <Avatar shape="square" size="large" />
      </Badge>
    </div>
  )
}

// ─── Preset Colors ──────────────────────────────────────────────────────────────

const PRESET_NAMES = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green',
  'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
] as const

function PresetColorsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Preset colors
        </Text>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {PRESET_NAMES.map(name => (
            <Badge key={name} color={name} count={name} />
          ))}
        </div>
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Custom colors
        </Text>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Badge color="#f50" count="#f50" />
          <Badge color="rgb(45, 183, 245)" count="rgb" />
          <Badge color="hsl(102, 53%, 61%)" count="hsl" />
          <Badge color="hwb(205 6% 9%)" count="hwb" />
        </div>
      </div>
    </div>
  )
}

// ─── 6. Custom Colors ───────────────────────────────────────────────────────────

function ColorsDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge count={5} color="#faad14">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} color={tokens.colorSuccess as string}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} color={tokens.colorInfo as string}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot color="#722ed1">
        <Avatar shape="square" size="large" />
      </Badge>
    </div>
  )
}

// ─── 7. Status (Standalone) ─────────────────────────────────────────────────────

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Badge status="success" text="Success" />
      <Badge status="processing" text="Processing" />
      <Badge status="default" text="Default" />
      <Badge status="error" text="Error" />
      <Badge status="warning" text="Warning" />
    </div>
  )
}

// ─── 8. Offset ──────────────────────────────────────────────────────────────────

function OffsetDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Badge count={5}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Text size="sm" type="secondary">Default</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Badge count={5} offset={[-5, 5]}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Text size="sm" type="secondary">offset={'{[-5, 5]}'}</Text>
      </div>
    </div>
  )
}

// ─── 9. Badge.Ribbon ────────────────────────────────────────────────────────────

function RibbonDemo() {
  const cardStyle = {
    width: 280,
    padding: '1.5rem',
    backgroundColor: tokens.colorBg as string,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
  }

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Badge.Ribbon text="New">
        <div style={cardStyle}>
          <Text weight="bold" style={{ display: 'block', marginBottom: 8 }}>Card Title</Text>
          <Text type="secondary">Card content goes here.</Text>
        </div>
      </Badge.Ribbon>
      <Badge.Ribbon text="Sale" color={tokens.colorError as string} placement="start">
        <div style={cardStyle}>
          <Text weight="bold" style={{ display: 'block', marginBottom: 8 }}>Another Card</Text>
          <Text type="secondary">Ribbon on the start side.</Text>
        </div>
      </Badge.Ribbon>
      <Badge.Ribbon text="VIP" color="#722ed1">
        <div style={cardStyle}>
          <Text weight="bold" style={{ display: 'block', marginBottom: 8 }}>Custom Color</Text>
          <Text type="secondary">Purple ribbon with custom color.</Text>
        </div>
      </Badge.Ribbon>
    </div>
  )
}

// ─── 10. Dynamic Count ──────────────────────────────────────────────────────────

function DynamicDemo() {
  const [count, setCount] = useState(5)
  const [showDot, setShowDot] = useState(true)

  const btnStyle = {
    padding: '4px 12px',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: 4,
    backgroundColor: tokens.colorBg as string,
    color: tokens.colorText as string,
    cursor: 'pointer',
    fontSize: 13,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Badge count={count}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot={showDot}>
          <Avatar shape="square" size="large" />
        </Badge>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnStyle} onClick={() => setCount(c => Math.max(0, c - 1))}>-</button>
        <button style={btnStyle} onClick={() => setCount(c => c + 1)}>+</button>
        <button style={btnStyle} onClick={() => setShowDot(d => !d)}>Toggle Dot</button>
      </div>
    </div>
  )
}

// ─── 11. Semantic Styles ────────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Badge
        count={5}
        styles={{
          indicator: {
            backgroundColor: '#722ed1',
            boxShadow: '0 0 0 2px #f0e6ff',
          },
        }}
      >
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge
        status="success"
        text="Custom styled status"
        styles={{
          indicator: { width: '0.625rem', height: '0.625rem' },
        }}
      />
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export function BadgeSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Badge</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Notification indicator for wrapping content with a count or status dot.
      </Text>

      <Section title="Basic Count">
        <BasicCountDemo />
      </Section>

      <Section title="Overflow Count" align="start">
        <OverflowCountDemo />
      </Section>

      <Section title="Standalone">
        <StandaloneDemo />
      </Section>

      <Section title="Clickable">
        <ClickableDemo />
      </Section>

      <Section title="Dot Mode">
        <DotDemo />
      </Section>

      <Section title="Show Zero">
        <ShowZeroDemo />
      </Section>

      <Section title="Sizes">
        <SizesDemo />
      </Section>

      <Section title="Preset Colors" align="start">
        <PresetColorsDemo />
      </Section>

      <Section title="Custom Colors">
        <ColorsDemo />
      </Section>

      <Section title="Status (Standalone)" align="start">
        <StatusDemo />
      </Section>

      <Section title="Offset">
        <OffsetDemo />
      </Section>

      <Section title="Badge.Ribbon" align="start">
        <RibbonDemo />
      </Section>

      <Section title="Dynamic Count" align="start">
        <DynamicDemo />
      </Section>

      <Section title="Semantic Styles">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
