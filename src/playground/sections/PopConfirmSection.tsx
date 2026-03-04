import { useState } from 'react'
import { PopConfirm, Text, Button, Checkbox, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <PopConfirm
      title="Are you sure you want to delete this item?"
      onConfirm={() => console.log('Confirmed')}
      onCancel={() => console.log('Cancelled')}
    >
      <Button variant="outline">Delete</Button>
    </PopConfirm>
  )
}

// ─── 2. Description ──────────────────────────────────────────────────────────────

function DescriptionDemo() {
  return (
    <PopConfirm
      title="Delete this file?"
      description="This action cannot be undone. All associated data will be permanently removed."
      onConfirm={() => console.log('Confirmed')}
    >
      <Button variant="outline" color="error">Delete file</Button>
    </PopConfirm>
  )
}

// ─── 3. Icon ─────────────────────────────────────────────────────────────────────

function IconDemo() {
  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <PopConfirm title="Default warning icon" onConfirm={() => {}}>
        <Button variant="outline">Default icon</Button>
      </PopConfirm>
      <PopConfirm
        title="Custom info icon"
        icon={<span style={{ color: tokens.colorInfo }}><InfoIcon /></span>}
        onConfirm={() => {}}
      >
        <Button variant="outline">Custom icon</Button>
      </PopConfirm>
      <PopConfirm title="No icon at all" icon={null} onConfirm={() => {}}>
        <Button variant="outline">No icon</Button>
      </PopConfirm>
    </div>
  )
}

// ─── 4. Placement ────────────────────────────────────────────────────────────────

function PlacementDemo() {
  const btnStyle = { width: '5.25rem', textAlign: 'center' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', padding: '2rem 0' }}>
      {/* Top row */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <PopConfirm title="Confirm?" placement="topLeft" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>TL</Button>
        </PopConfirm>
        <PopConfirm title="Confirm?" placement="top" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>Top</Button>
        </PopConfirm>
        <PopConfirm title="Confirm?" placement="topRight" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>TR</Button>
        </PopConfirm>
      </div>

      {/* Middle rows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '20.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PopConfirm title="Confirm?" placement="leftTop" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>LT</Button>
          </PopConfirm>
          <PopConfirm title="Confirm?" placement="left" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>Left</Button>
          </PopConfirm>
          <PopConfirm title="Confirm?" placement="leftBottom" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>LB</Button>
          </PopConfirm>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PopConfirm title="Confirm?" placement="rightTop" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>RT</Button>
          </PopConfirm>
          <PopConfirm title="Confirm?" placement="right" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>Right</Button>
          </PopConfirm>
          <PopConfirm title="Confirm?" placement="rightBottom" onConfirm={() => {}}>
            <Button variant="outline" style={btnStyle}>RB</Button>
          </PopConfirm>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <PopConfirm title="Confirm?" placement="bottomLeft" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>BL</Button>
        </PopConfirm>
        <PopConfirm title="Confirm?" placement="bottom" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>Bottom</Button>
        </PopConfirm>
        <PopConfirm title="Confirm?" placement="bottomRight" onConfirm={() => {}}>
          <Button variant="outline" style={btnStyle}>BR</Button>
        </PopConfirm>
      </div>
    </div>
  )
}

// ─── 5. Internationalization ─────────────────────────────────────────────────────

function I18nDemo() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <PopConfirm title="¿Estás seguro?" okText="Sí" cancelText="No" onConfirm={() => {}}>
        <Button variant="outline">Spanish</Button>
      </PopConfirm>
      <PopConfirm title="Sind Sie sicher?" okText="Ja" cancelText="Nein" onConfirm={() => {}}>
        <Button variant="outline">German</Button>
      </PopConfirm>
      <PopConfirm title="Confirmez-vous?" okText="Oui" cancelText="Non" onConfirm={() => {}}>
        <Button variant="outline">French</Button>
      </PopConfirm>
    </div>
  )
}

// ─── 6. Async Close ──────────────────────────────────────────────────────────────

function AsyncDemo() {
  return (
    <PopConfirm
      title="Submit this form?"
      description="The OK button will show a loading spinner until the async operation completes (2s)."
      onConfirm={() => new Promise<void>((resolve) => setTimeout(resolve, 2000))}
    >
      <Button variant="outline">Async Confirm</Button>
    </PopConfirm>
  )
}

// ─── 7. Conditional ──────────────────────────────────────────────────────────────

function ConditionalDemo() {
  const [disabled, setDisabled] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <PopConfirm
        title="Are you sure?"
        disabled={disabled}
        onConfirm={() => console.log('Confirmed')}
      >
        <Button variant="outline">Delete</Button>
      </PopConfirm>
      <Checkbox checked={disabled} onChange={(e) => setDisabled(e.target.checked)}>
        Disable PopConfirm
      </Checkbox>
    </div>
  )
}

// ─── 8. Button Props ─────────────────────────────────────────────────────────────

function ButtonPropsDemo() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <PopConfirm
        title="Delete permanently?"
        okButtonProps={{
          style: { backgroundColor: tokens.colorError, borderColor: tokens.colorError },
        }}
        onConfirm={() => {}}
      >
        <Button variant="outline" color="error">Danger OK</Button>
      </PopConfirm>
      <PopConfirm
        title="Proceed with action?"
        showCancel={false}
        onConfirm={() => {}}
      >
        <Button variant="outline">No Cancel Button</Button>
      </PopConfirm>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function PopConfirmSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>PopConfirm</Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Description">
        <DescriptionDemo />
      </Section>

      <Section title="Icon">
        <IconDemo />
      </Section>

      <Section title="Placement">
        <PlacementDemo />
      </Section>

      <Section title="Internationalization">
        <I18nDemo />
      </Section>

      <Section title="Async Close">
        <AsyncDemo />
      </Section>

      <Section title="Conditional">
        <ConditionalDemo />
      </Section>

      <Section title="Button Props">
        <ButtonPropsDemo />
      </Section>
    </div>
  )
}
