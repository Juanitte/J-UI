import { useState, useEffect } from 'react'
import { Spinner, Text, Button, Switch, tokens } from '../../index'
import type { SpinnerType } from '../../index'
import { Section } from './shared'

const SPINNER_TYPES: SpinnerType[] = ['gradient', 'ring', 'classic', 'dots', 'bars', 'pulse', 'dash']

// ─── 1. Types ────────────────────────────────────────────────────────────────────

function TypesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* All types at large size with labels */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {SPINNER_TYPES.map((t) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', minWidth: 60 }}>
            <div style={{ height: '2.5rem', display: 'flex', alignItems: 'center' }}>
              {t === 'pulse'
                ? <Spinner type={t} tip="Wait..." size="large" />
                : <Spinner type={t} size="large" />
              }
            </div>
            <Text type="secondary" size="sm">{t}</Text>
          </div>
        ))}
      </div>
      {/* All types at all sizes */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {SPINNER_TYPES.filter((t) => t !== 'pulse').map((t) => (
          <div key={t} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Spinner type={t} size="small" />
            <Spinner type={t} />
            <Spinner type={t} size="large" />
          </div>
        ))}
      </div>
      {/* Pulse with different texts */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Spinner type="pulse" tip="Loading..." size="small" />
        <Spinner type="pulse" tip="Please wait..." />
        <Spinner type="pulse" tip="Processing..." size="large" />
        <Spinner type="pulse" />
      </div>
    </div>
  )
}

// ─── 2. Container Mode ───────────────────────────────────────────────────────────

function ContainerDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 500 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Switch checked={loading} onChange={setLoading} size="small" />
        <Text type="secondary">Loading</Text>
      </div>
      <Spinner spinning={loading} tip="Loading...">
        <div
          style={{
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: '0.5rem',
            padding: '1.5rem',
          }}
        >
          <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Card Content
          </Text>
          <Text type="secondary">
            This content will be blurred while loading. The spinner overlay appears on top
            with a smooth transition. Interact with the switch to toggle the loading state.
          </Text>
        </div>
      </Spinner>
    </div>
  )
}

// ─── 3. Tip Text ─────────────────────────────────────────────────────────────────

function TipDemo() {
  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <Spinner tip="Loading..." size="small" />
      <Spinner tip="Please wait..." />
      <Spinner tip="Processing data..." size="large" />
    </div>
  )
}

// ─── 4. Custom Indicator ─────────────────────────────────────────────────────────

function CustomIndicatorDemo() {
  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
      <Spinner
        indicator={
          <div style={{ width: '1.5rem', height: '1.5rem', animation: 'j-spinner-rotate 1s linear infinite', lineHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill={tokens.colorPrimary} stroke="none">
              <path d="M19.14 12.94a7.07 7.07 0 0 0 .06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.04 7.04 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
            </svg>
          </div>
        }
        tip="Working..."
      />
      <Spinner
        indicator={
          <div style={{ width: '1.5rem', height: '1.5rem', animation: 'j-spinner-rotate 2s linear infinite', lineHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill={tokens.colorPrimary} stroke="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        }
        tip="Worldwide..."
      />
    </div>
  )
}

// ─── 5. Delay ────────────────────────────────────────────────────────────────────

function DelayDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 500 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Switch checked={loading} onChange={setLoading} size="small" />
        <Text type="secondary">Toggle (500ms delay)</Text>
      </div>
      <Spinner spinning={loading} delay={500} tip="Delayed spinner...">
        <div
          style={{
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: '0.5rem',
            padding: '1.5rem',
          }}
        >
          <Text type="secondary">
            The spinner won't show until 500ms have passed. Toggle quickly to see it
            gets suppressed for fast operations.
          </Text>
        </div>
      </Spinner>
    </div>
  )
}

// ─── 6. Percent ──────────────────────────────────────────────────────────────────

function PercentDemo() {
  const [percent, setPercent] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (percent >= 100) { setRunning(false); return }
    const timer = setTimeout(() => setPercent((p) => Math.min(100, p + 5)), 100)
    return () => clearTimeout(timer)
  }, [running, percent])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Spinner percent={0} />
        <Spinner percent={25} />
        <Spinner percent={50} />
        <Spinner percent={75} />
        <Spinner percent={100} />
        <Spinner percent="auto" />
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Spinner percent={0} size="large" />
        <Spinner percent={25} size="large" />
        <Spinner percent={50} size="large" />
        <Spinner percent={75} size="large" />
        <Spinner percent={100} size="large" />
        <Spinner percent="auto" size="large" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Spinner percent={percent} size="large" />
        <Button
          size="sm"
          variant="primary"
          onClick={() => { setPercent(0); setRunning(true) }}
          disabled={running}
        >
          {running ? 'Running...' : 'Start'}
        </Button>
        <Text type="secondary">{percent}%</Text>
      </div>
    </div>
  )
}

// ─── 7. Fullscreen ───────────────────────────────────────────────────────────────

function FullscreenDemo() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <div>
      <Button variant="primary" onClick={() => setShow(true)}>
        Show Fullscreen Spinner (3s)
      </Button>
      <Spinner fullscreen spinning={show} tip="Loading application..." size="large" />
    </div>
  )
}

// ─── 8. Custom Semantic Styling ──────────────────────────────────────────────────

function SemanticStylingDemo() {
  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <Spinner
        tip="Custom colors"
        styles={{
          root: {
            padding: '1.5rem',
            border: `2px dashed ${tokens.colorSuccess}`,
            borderRadius: '1rem',
            background: tokens.colorBgSubtle,
          },
          indicator: { filter: 'hue-rotate(100deg)' },
          tip: { color: tokens.colorSuccess, fontWeight: 600 },
        }}
      />
      <Spinner
        size="large"
        tip="Styled spinner"
        styles={{
          indicator: { filter: 'hue-rotate(260deg)' },
          tip: { color: tokens.colorError, fontStyle: 'italic' },
        }}
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function SpinnerSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Spinner</Text>

      <Section title="Types">
        <TypesDemo />
      </Section>

      <Section title="Container Mode" align="start">
        <ContainerDemo />
      </Section>

      <Section title="Tip Text">
        <TipDemo />
      </Section>

      <Section title="Custom Indicator">
        <CustomIndicatorDemo />
      </Section>

      <Section title="Delay" align="start">
        <DelayDemo />
      </Section>

      <Section title="Percent">
        <PercentDemo />
      </Section>

      <Section title="Fullscreen">
        <FullscreenDemo />
      </Section>

      <Section title="Custom Semantic Styling">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
