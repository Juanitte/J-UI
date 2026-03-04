import { useState } from 'react'
import { Alert, Text, Button, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert title="Success tips" type="success" />
      <Alert title="Informational notes" type="info" />
      <Alert title="Warning" type="warning" />
      <Alert title="Error" type="error" />
    </div>
  )
}

// ─── 2. Description ─────────────────────────────────────────────────────────────

function DescriptionDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert
        title="Success tips"
        type="success"
        showIcon
        description="Detailed description and advice about successful copywriting."
      />
      <Alert
        title="Informational notes"
        type="info"
        showIcon
        description="Additional description and information about copywriting."
      />
      <Alert
        title="Warning"
        type="warning"
        showIcon
        description="This is a warning notice about copywriting."
      />
      <Alert
        title="Error"
        type="error"
        showIcon
        description="This is an error message about copywriting."
      />
    </div>
  )
}

// ─── 3. Closable ─────────────────────────────────────────────────────────────────

function ClosableDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert
        title="Warning text"
        type="warning"
        closable
        showIcon
      />
      <Alert
        title="Error text"
        type="error"
        closable={{
          onClose: () => console.log('Alert closed'),
          afterClose: () => console.log('Alert removed from DOM'),
        }}
        showIcon
        description="Error description. Error description. Error description."
      />
      <Alert
        title="Custom close icon"
        type="info"
        closable={{
          closeIcon: <span style={{ fontSize: 14 }}>✕</span>,
        }}
        showIcon
      />
    </div>
  )
}

// ─── 4. Icon ─────────────────────────────────────────────────────────────────────

function IconDemo() {
  const StarIcon = () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert title="Success tips" type="success" showIcon />
      <Alert title="Informational notes" type="info" showIcon />
      <Alert title="Warning" type="warning" showIcon />
      <Alert title="Error" type="error" showIcon />
      <Alert title="Custom icon alert" type="info" showIcon icon={<StarIcon />} />
    </div>
  )
}

// ─── 5. Action ───────────────────────────────────────────────────────────────────

function ActionDemo() {
  const [accepted, setAccepted] = useState(false)
  const [retries, setRetries] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert
        title={accepted ? 'Accepted!' : 'Success tips'}
        type="success"
        showIcon
        action={
          <Button
            size="sm"
            style={{ backgroundColor: tokens.colorSuccess, color: '#fff', border: 'none' }}
            onClick={() => setAccepted(true)}
          >
            {accepted ? 'Done' : 'Accept'}
          </Button>
        }
      />
      <Alert
        title={`Error — retried ${retries} time(s)`}
        type="error"
        showIcon
        description="Something went wrong. Click retry to try again."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              size="sm"
              style={{ backgroundColor: tokens.colorError, color: '#fff', border: 'none' }}
              onClick={() => setRetries(r => r + 1)}
            >
              Retry
            </Button>
          </div>
        }
        closable
      />
    </div>
  )
}

// ─── 6. Loop Banner ─────────────────────────────────────────────────────────────

function LoopBannerDemo() {
  const marqueeStyle: React.CSSProperties = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'j-alert-marquee 12s linear infinite',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <style>{`
        @keyframes j-alert-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <Alert
        banner
        type="warning"
        title={
          <div style={{ overflow: 'hidden' }}>
            <span style={marqueeStyle}>
              This is a scrolling warning message — please pay attention to this important notice!
            </span>
          </div>
        }
      />
      <Alert
        banner
        type="info"
        showIcon
        title={
          <div style={{ overflow: 'hidden' }}>
            <span style={marqueeStyle}>
              Breaking news: J-UI Alert now supports loop banners with smooth marquee animation.
            </span>
          </div>
        }
      />
    </div>
  )
}

// ─── 7. Smoothly Unmount ─────────────────────────────────────────────────────────

function SmoothlyUnmountDemo() {
  const [alerts, setAlerts] = useState([
    { key: 1, type: 'success' as const, title: 'Success — close me!' },
    { key: 2, type: 'info' as const, title: 'Info — close me!' },
    { key: 3, type: 'warning' as const, title: 'Warning — close me!' },
    { key: 4, type: 'error' as const, title: 'Error — close me!' },
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {alerts.map(a => (
        <Alert
          key={a.key}
          type={a.type}
          title={a.title}
          showIcon
          closable={{
            afterClose: () => setAlerts(prev => prev.filter(x => x.key !== a.key)),
          }}
        />
      ))}
      {alerts.length === 0 && (
        <Button onClick={() => setAlerts([
          { key: Date.now(), type: 'success', title: 'Success — close me!' },
          { key: Date.now() + 1, type: 'info', title: 'Info — close me!' },
          { key: Date.now() + 2, type: 'warning', title: 'Warning — close me!' },
          { key: Date.now() + 3, type: 'error', title: 'Error — close me!' },
        ])}>
          Reset alerts
        </Button>
      )}
    </div>
  )
}

// ─── 8. Banner ───────────────────────────────────────────────────────────────────

function BannerDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Alert banner title="Warning banner (default type)" />
      <Alert banner title="Info banner" type="info" />
      <Alert banner title="Success banner with description" type="success" description="Detailed description for the banner." />
      <Alert banner title="Error banner closable" type="error" closable />
    </div>
  )
}

// ─── 9. ErrorBoundary ─────────────────────────────────────────────────────────────

function BuggyComponent() {
  const [crash, setCrash] = useState(false)
  if (crash) throw new Error('Boom! This component crashed intentionally.')
  return (
    <Button
      color="error"
      onClick={() => setCrash(true)}
    >
      Click to crash
    </Button>
  )
}

const AlertErrorBoundary = (Alert as any).ErrorBoundary

function ErrorBoundaryDemo() {
  return (
    <AlertErrorBoundary title="Render error caught">
      <BuggyComponent />
    </AlertErrorBoundary>
  )
}

// ─── 10. Semantic Styling ────────────────────────────────────────────────────────

function SemanticStylingDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert
        title="Custom styled alert"
        type="info"
        showIcon
        description="This alert uses custom semantic styles for each slot."
        closable
        styles={{
          root: { borderRadius: '1rem', borderStyle: 'dashed' },
          icon: { fontSize: 20 },
          message: { fontStyle: 'italic' },
          description: { color: tokens.colorInfo },
          closeBtn: { color: tokens.colorInfo },
        }}
      />
      <Alert
        title="Gradient background"
        type="success"
        showIcon
        styles={{
          root: {
            background: `linear-gradient(135deg, ${tokens.colorSuccess}, ${tokens.colorInfo})`,
            border: 'none',
            color: '#fff',
          },
          icon: { color: '#fff' },
        }}
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function AlertSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Alert</Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="With Description">
        <DescriptionDemo />
      </Section>

      <Section title="Closable">
        <ClosableDemo />
      </Section>

      <Section title="Icon">
        <IconDemo />
      </Section>

      <Section title="Action">
        <ActionDemo />
      </Section>

      <Section title="Loop Banner">
        <LoopBannerDemo />
      </Section>

      <Section title="Smoothly Unmount">
        <SmoothlyUnmountDemo />
      </Section>

      <Section title="Banner">
        <BannerDemo />
      </Section>

      <Section title="ErrorBoundary">
        <ErrorBoundaryDemo />
      </Section>

      <Section title="Semantic Styling">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
