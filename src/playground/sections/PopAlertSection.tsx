import { useRef } from 'react'
import { usePopAlert, Text, Button, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic Types ──────────────────────────────────────────────────────────────

function BasicDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.success('Operation completed successfully')}>Success</Button>
      <Button onClick={() => api.error('Something went wrong')}>Error</Button>
      <Button onClick={() => api.info('Here is some information')}>Info</Button>
      <Button onClick={() => api.warning('This is a warning')}>Warning</Button>
      <Button onClick={() => api.loading('Loading data...')}>Loading</Button>
    </div>
  )
}

// ─── 2. Description ─────────────────────────────────────────────────────────────

function DescriptionDemo() {
  const [api, contextHolder] = usePopAlert({ placement: 'topRight' })

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({
        content: 'File uploaded',
        description: 'report-2026.pdf has been uploaded successfully.',
        type: 'success',
        duration: 5,
        closable: true,
      })}>
        Success
      </Button>
      <Button onClick={() => api.open({
        content: 'Upload failed',
        description: 'The file exceeds the maximum size of 10MB.',
        type: 'error',
        duration: 5,
        closable: true,
      })}>
        Error
      </Button>
      <Button onClick={() => api.open({
        content: 'New update available',
        description: 'Version 2.4.0 includes bug fixes and performance improvements.',
        type: 'info',
        duration: 5,
        closable: true,
      })}>
        Info
      </Button>
      <Button onClick={() => api.open({
        content: 'Storage almost full',
        description: 'You have used 90% of your available storage.',
        type: 'warning',
        duration: 5,
        closable: true,
      })}>
        Warning
      </Button>
    </div>
  )
}

// ─── 3. Custom Duration ──────────────────────────────────────────────────────────

function DurationDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.success('Closes in 1 second', 1)}>1s</Button>
      <Button onClick={() => api.info('Closes in 3 seconds (default)')}>3s (default)</Button>
      <Button onClick={() => api.warning('Closes in 10 seconds', 10)}>10s</Button>
      <Button onClick={() => api.open({ content: 'I will stay until closed', type: 'info', duration: 0, closable: true })}>
        Persistent (closable)
      </Button>
    </div>
  )
}

// ─── 3. Closable ─────────────────────────────────────────────────────────────────

function ClosableDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({ content: 'Click the X to close me', type: 'info', closable: true })}>
        With close button
      </Button>
      <Button onClick={() => api.open({
        content: 'onClose callback fires (check console)',
        type: 'warning',
        closable: true,
        onClose: () => console.log('PopAlert closed!'),
      })}>
        With onClose callback
      </Button>
    </div>
  )
}

// ─── 4. Key-based Update ─────────────────────────────────────────────────────────

function UpdateDemo() {
  const [api, contextHolder] = usePopAlert()

  const handleClick = () => {
    api.open({ content: 'Loading...', type: 'loading', key: 'update-demo', duration: 0 })
    setTimeout(() => {
      api.open({ content: 'Data loaded successfully!', type: 'success', key: 'update-demo', duration: 2 })
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {contextHolder}
      <Button onClick={handleClick}>Load data (updates in 2s)</Button>
    </div>
  )
}

// ─── 5. Max Count ────────────────────────────────────────────────────────────────

function MaxCountDemo() {
  const [api, contextHolder] = usePopAlert({ maxCount: 3 })
  const countRef = useRef(0)

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {contextHolder}
      <Button onClick={() => api.info(`Message #${++countRef.current}`, 5)}>
        Add message (max 3)
      </Button>
    </div>
  )
}

// ─── 6. Pause on Hover ──────────────────────────────────────────────────────────

function PauseOnHoverDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({ content: 'Hover me to pause (3s)', type: 'info', duration: 3, pauseOnHover: true })}>
        With pause (default)
      </Button>
      <Button onClick={() => api.open({ content: 'Hover does NOT pause (3s)', type: 'warning', duration: 3, pauseOnHover: false })}>
        Without pause
      </Button>
    </div>
  )
}

// ─── 7. Destroy ──────────────────────────────────────────────────────────────────

function DestroyDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => {
        api.open({ content: 'Targeted message', type: 'info', key: 'destroy-target', duration: 0 })
      }}>
        Create targeted
      </Button>
      <Button color="warning" onClick={() => api.destroy('destroy-target')}>
        Destroy targeted
      </Button>
      <Button onClick={() => {
        api.success('Message A', 0)
        api.warning('Message B', 0)
        api.error('Message C', 0)
      }}>
        Create 3 messages
      </Button>
      <Button color="error" onClick={() => api.destroy()}>
        Destroy all
      </Button>
    </div>
  )
}

// ─── 8. Custom Icon & Styling ────────────────────────────────────────────────────

function CustomStylingDemo() {
  const [api, contextHolder] = usePopAlert()

  const StarIcon = () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({
        content: 'Custom star icon!',
        type: 'success',
        icon: <StarIcon />,
      })}>
        Custom icon
      </Button>
      <Button onClick={() => api.open({
        content: 'Styled with semantic slots',
        type: 'info',
        styles: {
          root: { borderRadius: '2rem', borderStyle: 'dashed' },
          content: { fontWeight: 600 },
        },
      })}>
        Semantic styles
      </Button>
      <Button onClick={() => api.open({
        content: 'Gradient background',
        type: 'success',
        styles: {
          root: {
            background: `linear-gradient(135deg, ${tokens.colorSuccess}, ${tokens.colorInfo})`,
            border: 'none',
            color: '#fff',
          },
          icon: { color: '#fff' },
          content: { color: '#fff' },
        },
      })}>
        Gradient
      </Button>
    </div>
  )
}

// ─── 9. Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBarDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({ content: 'Success with progress (3s)', type: 'success', showProgress: true })}>
        Success
      </Button>
      <Button onClick={() => api.open({ content: 'Error with progress (5s)', type: 'error', duration: 5, showProgress: true })}>
        Error (5s)
      </Button>
      <Button onClick={() => api.open({ content: 'Hover to pause progress', type: 'info', duration: 6, showProgress: true, pauseOnHover: true })}>
        Pause on hover
      </Button>
      <Button onClick={() => api.open({ content: 'Closable with progress', type: 'warning', duration: 8, showProgress: true, closable: true })}>
        Closable
      </Button>
    </div>
  )
}

// ─── 10. Placement ───────────────────────────────────────────────────────────────

function PlacementDemo() {
  const [apiTL, holderTL] = usePopAlert({ placement: 'topLeft' })
  const [apiTR, holderTR] = usePopAlert({ placement: 'topRight' })
  const [apiBL, holderBL] = usePopAlert({ placement: 'bottomLeft' })
  const [apiBR, holderBR] = usePopAlert({ placement: 'bottomRight' })
  const [apiL, holderL] = usePopAlert({ placement: 'left' })
  const [apiR, holderR] = usePopAlert({ placement: 'right' })
  const [apiB, holderB] = usePopAlert({ placement: 'bottom' })

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {holderTL}{holderTR}{holderBL}{holderBR}{holderL}{holderR}{holderB}
      <Button onClick={() => apiTL.info('Top Left')}>Top Left</Button>
      <Button onClick={() => apiTR.success('Top Right')}>Top Right</Button>
      <Button onClick={() => apiBL.warning('Bottom Left')}>Bottom Left</Button>
      <Button onClick={() => apiBR.error('Bottom Right')}>Bottom Right</Button>
      <Button onClick={() => apiL.info('Left Center')}>Left</Button>
      <Button onClick={() => apiR.success('Right Center')}>Right</Button>
      <Button onClick={() => apiB.warning('Bottom Center')}>Bottom</Button>
    </div>
  )
}

// ─── 11. Size ────────────────────────────────────────────────────────────────────

function SizeDemo() {
  const [api, contextHolder] = usePopAlert()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {contextHolder}
      <Button onClick={() => api.open({ content: 'Small message', type: 'info', size: 'sm' })}>Small</Button>
      <Button onClick={() => api.open({ content: 'Medium message (default)', type: 'success', size: 'md' })}>Medium</Button>
      <Button onClick={() => api.open({ content: 'Large message', type: 'warning', size: 'lg' })}>Large</Button>
    </div>
  )
}

// ─── 12. Hook Config ─────────────────────────────────────────────────────────────

function HookConfigDemo() {
  const [api, contextHolder] = usePopAlert({ offset: '3.75rem', duration: 5, size: 'lg', placement: 'topRight' })

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {contextHolder}
      <Button onClick={() => api.info('Top-right, large, 60px offset, 5s')}>
        Custom hook config
      </Button>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function PopAlertSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>PopAlert</Text>

      <Section title="Basic Types">
        <BasicDemo />
      </Section>

      <Section title="Description">
        <DescriptionDemo />
      </Section>

      <Section title="Custom Duration">
        <DurationDemo />
      </Section>

      <Section title="Closable">
        <ClosableDemo />
      </Section>

      <Section title="Key-based Update">
        <UpdateDemo />
      </Section>

      <Section title="Max Count">
        <MaxCountDemo />
      </Section>

      <Section title="Pause on Hover">
        <PauseOnHoverDemo />
      </Section>

      <Section title="Destroy">
        <DestroyDemo />
      </Section>

      <Section title="Custom Icon & Styling">
        <CustomStylingDemo />
      </Section>

      <Section title="Progress Bar">
        <ProgressBarDemo />
      </Section>

      <Section title="Placement">
        <PlacementDemo />
      </Section>

      <Section title="Size">
        <SizeDemo />
      </Section>

      <Section title="Hook Config">
        <HookConfigDemo />
      </Section>
    </div>
  )
}
