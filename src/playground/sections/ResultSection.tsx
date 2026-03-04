import { useState } from 'react'
import { Result, Text, Button, Toggle, tokens } from '../../index'
import { Section } from './shared'

// ─── Inline error icon ───────────────────────────────────────────────────────

function ErrorLineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={tokens.colorError} stroke="none" style={{ flexShrink: 0 }}>
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

// ─── 1. Success ──────────────────────────────────────────────────────────────────

function SuccessDemo() {
  return (
    <Result
      status="success"
      title="Payment Completed Successfully!"
      subTitle="Transaction ID: TXN-48291038 — Your subscription is now active and ready to use."
      extra={
        <>
          <Button variant="primary">Go to Dashboard</Button>
          <Button>View Receipt</Button>
        </>
      }
    />
  )
}

// ─── 2. Info ─────────────────────────────────────────────────────────────────────

function InfoDemo() {
  return (
    <Result
      title="Your request has been processed"
      extra={<Button variant="primary">View Details</Button>}
    />
  )
}

// ─── 3. Warning ──────────────────────────────────────────────────────────────────

function WarningDemo() {
  return (
    <Result
      status="warning"
      title="Some issues require your attention"
      extra={<Button variant="primary">Review Issues</Button>}
    />
  )
}

// ─── 4. Error ────────────────────────────────────────────────────────────────────

function ErrorContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Text weight="bold">The deployment encountered the following errors:</Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ErrorLineIcon />
        <Text type="error">
          Build step failed due to missing dependencies.
        </Text>
        <Button variant="link" size="sm">Install now &gt;</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ErrorLineIcon />
        <Text type="error">
          Environment variables are not configured.
        </Text>
        <Button variant="link" size="sm">Configure settings &gt;</Button>
      </div>
    </div>
  )
}

function ErrorDemo() {
  const [mode, setMode] = useState<string | number>('visible')
  const [showLogs, setShowLogs] = useState(false)
  const toggleMode = mode === 'toggle'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <Toggle
        options={[
          { label: 'Always visible', value: 'visible' },
          { label: 'Toggle on click', value: 'toggle' },
        ]}
        value={mode}
        onChange={setMode}
        size="small"
      />
      <Result
        style={{ alignSelf: 'stretch' }}
        status="error"
        title="Deployment Failed"
        subTitle="Please review and fix the following issues before trying again."
        extra={
          <>
            <Button variant="primary" onClick={toggleMode ? () => setShowLogs((v) => !v) : undefined}>
              {toggleMode && showLogs ? 'Hide Logs' : 'View Logs'}
            </Button>
            <Button>Retry</Button>
          </>
        }
      >
        {(!toggleMode || showLogs) ? <ErrorContent /> : null}
      </Result>
    </div>
  )
}

// ─── 5. Custom Icon ──────────────────────────────────────────────────────────────

function CustomIconDemo() {
  return (
    <Result
      icon={<span style={{ fontSize: '4.5rem' }}>&#128640;</span>}
      title="Launch Successful!"
      subTitle="Your application has been deployed to production."
      extra={<Button variant="primary">Open App</Button>}
    />
  )
}

// ─── 6. 403 ──────────────────────────────────────────────────────────────────────

function Http403Demo() {
  return (
    <Result
      status={403}
      title="403"
      subTitle="You don't have permission to access this resource."
      extra={<Button variant="primary">Back Home</Button>}
    />
  )
}

// ─── 7. 404 ──────────────────────────────────────────────────────────────────────

function Http404Demo() {
  return (
    <Result
      status={404}
      title="404"
      subTitle="The page you're looking for doesn't exist or has been moved."
      extra={<Button variant="primary">Back Home</Button>}
    />
  )
}

// ─── 8. 500 ──────────────────────────────────────────────────────────────────────

function Http500Demo() {
  return (
    <Result
      status={500}
      title="500"
      subTitle="An unexpected error occurred on the server. Please try again later."
      extra={<Button variant="primary">Back Home</Button>}
    />
  )
}

// ─── 9. Custom Semantic Styling ──────────────────────────────────────────────────

function SemanticStylingDemo() {
  return (
    <Result
      status="info"
      title="Styled Result"
      subTitle="This result uses custom classNames and styles to customize each semantic slot."
      extra={<Button variant="primary">Continue</Button>}
      styles={{
        root: { border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.75rem', background: tokens.colorBgSubtle },
        icon: { color: tokens.colorInfo },
        title: { color: tokens.colorPrimary },
        subtitle: { fontStyle: 'italic' },
        extra: { paddingTop: '0.5rem' },
      }}
    />
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function ResultSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Result</Text>

      <Section title="Success">
        <SuccessDemo />
      </Section>

      <Section title="Info">
        <InfoDemo />
      </Section>

      <Section title="Warning">
        <WarningDemo />
      </Section>

      <Section title="Error with Content">
        <ErrorDemo />
      </Section>

      <Section title="Custom Icon">
        <CustomIconDemo />
      </Section>

      <Section title="403">
        <Http403Demo />
      </Section>

      <Section title="404">
        <Http404Demo />
      </Section>

      <Section title="500">
        <Http500Demo />
      </Section>

      <Section title="Custom Semantic Styling">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
