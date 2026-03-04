import { useState } from 'react'
import { Drawer, Text, Button, Input, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        title="Basic Drawer"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  )
}

// ─── 2. Placement ────────────────────────────────────────────────────────────────

function PlacementDemo() {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'left' | 'right' | 'top' | 'bottom'>('right')

  const openDrawer = (p: typeof placement) => {
    setPlacement(p)
    setOpen(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => openDrawer('top')}>Top</Button>
        <Button onClick={() => openDrawer('right')}>Right</Button>
        <Button onClick={() => openDrawer('bottom')}>Bottom</Button>
        <Button onClick={() => openDrawer('left')}>Left</Button>
      </div>
      <Drawer
        title={`${placement.charAt(0).toUpperCase() + placement.slice(1)} Drawer`}
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>This drawer slides from the {placement}.</p>
      </Drawer>
    </div>
  )
}

// ─── 3. Extra Actions ────────────────────────────────────────────────────────────

function ExtraActionsDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer
        title="Extra Actions"
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" color="primary" onClick={() => setOpen(false)}>Save</Button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>The header shows extra action buttons next to the title.</p>
      </Drawer>
    </div>
  )
}

// ─── 4. Size ─────────────────────────────────────────────────────────────────────

function SizeDemo() {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<'default' | 'large'>('default')

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => { setSize('default'); setOpen(true) }}>Default (378px)</Button>
        <Button onClick={() => { setSize('large'); setOpen(true) }}>Large (736px)</Button>
      </div>
      <Drawer
        title={`${size === 'default' ? 'Default' : 'Large'} Size Drawer`}
        size={size}
        open={open}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>This drawer uses the "{size}" size preset.</p>
      </Drawer>
    </div>
  )
}

// ─── 5. Footer ───────────────────────────────────────────────────────────────────

function FooterDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open with Footer</Button>
      <Drawer
        title="Drawer with Footer"
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="primary" onClick={() => setOpen(false)}>Submit</Button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>Content above the footer.</p>
        <p>The footer sticks to the bottom of the drawer.</p>
      </Drawer>
    </div>
  )
}

// ─── 6. Closable Config ──────────────────────────────────────────────────────────

function ClosableConfigDemo() {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => setOpen1(true)}>Custom Close Icon</Button>
      <Drawer
        title="Custom Close Icon"
        open={open1}
        onClose={() => setOpen1(false)}
        closeIcon={<span style={{ fontSize: 16 }}>X</span>}
      >
        <p style={{ margin: 0 }}>This drawer has a custom close icon.</p>
      </Drawer>

      <Button onClick={() => setOpen2(true)}>No Close Button</Button>
      <Drawer
        title="No Close Button"
        open={open2}
        onClose={() => setOpen2(false)}
        closable={false}
      >
        <p style={{ margin: 0 }}>This drawer has no close button. Click mask to close.</p>
      </Drawer>
    </div>
  )
}

// ─── 7. Loading ──────────────────────────────────────────────────────────────────

function LoadingDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleOpen = () => {
    setOpen(true)
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open Loading Drawer</Button>
      <Drawer
        title="Loading Drawer"
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
      >
        <p style={{ margin: 0 }}>Content loaded after 2 seconds.</p>
        <p>This content replaces the skeleton once loading is complete.</p>
      </Drawer>
    </div>
  )
}

// ─── 8. Destroy on Close ─────────────────────────────────────────────────────────

function DestroyOnCloseDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open (destroyOnClose)</Button>
      <Drawer
        title="Destroy on Close"
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
      >
        <p style={{ margin: 0, marginBottom: 12 }}>Type something below, then close and reopen — the input will reset.</p>
        <Input placeholder="Type here..." />
      </Drawer>
    </div>
  )
}

// ─── 9. Semantic Styling ─────────────────────────────────────────────────────────

function SemanticStylingDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Styled Drawer</Button>
      <Drawer
        title="Styled Drawer"
        open={open}
        onClose={() => setOpen(false)}
        footer={<span>Custom styled footer</span>}
        styles={{
          header: {
            background: `linear-gradient(135deg, ${tokens.colorPrimary}, ${tokens.colorInfo})`,
            color: '#fff',
            borderBottom: 'none',
          },
          body: { backgroundColor: tokens.colorBgSubtle },
          footer: { borderTop: `2px dashed ${tokens.colorPrimary}` },
          closeBtn: { color: '#fff' },
        }}
      >
        <p style={{ margin: 0 }}>This drawer uses custom semantic styles for header, body, footer, and close button.</p>
      </Drawer>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function DrawerSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Drawer</Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Placement">
        <PlacementDemo />
      </Section>

      <Section title="Extra Actions">
        <ExtraActionsDemo />
      </Section>

      <Section title="Size">
        <SizeDemo />
      </Section>

      <Section title="Footer">
        <FooterDemo />
      </Section>

      <Section title="Closable Config">
        <ClosableConfigDemo />
      </Section>

      <Section title="Loading">
        <LoadingDemo />
      </Section>

      <Section title="Destroy on Close">
        <DestroyOnCloseDemo />
      </Section>

      <Section title="Semantic Styling">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
