import { useState } from 'react'
import { Progress, Text, Button, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress percent={30} />
      <Progress percent={50} />
      <Progress percent={70} />
      <Progress percent={100} />
    </div>
  )
}

// ─── 2. Status ───────────────────────────────────────────────────────────────────

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress percent={50} status="normal" />
      <Progress percent={60} status="active" />
      <Progress percent={100} status="success" />
      <Progress percent={70} status="exception" />
      <Progress percent={100} />
    </div>
  )
}

// ─── 3. Dynamic ──────────────────────────────────────────────────────────────────

function DynamicDemo() {
  const [percent, setPercent] = useState(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress percent={percent} status={percent < 100 ? 'active' : undefined} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setPercent((p) => Math.max(0, p - 10))}>−10</Button>
        <Button size="sm" onClick={() => setPercent((p) => Math.min(100, p + 10))}>+10</Button>
      </div>
    </div>
  )
}

// ─── 4. Custom Format ────────────────────────────────────────────────────────────

function FormatDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress percent={75} format={(p) => `${p} Days`} />
      <Progress percent={100} format={(p) => (p === 100 ? 'Done!' : `${p}%`)} />
      <Progress percent={60} showInfo={false} />
    </div>
  )
}

// ─── 5. Gradient ─────────────────────────────────────────────────────────────────

function GradientDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress
        percent={80}
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />
      <Progress
        percent={90}
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
      />
      <Progress
        percent={70}
        strokeColor={{ '0%': tokens.colorError, '50%': tokens.colorWarning, '100%': tokens.colorSuccess }}
      />
    </div>
  )
}

// ─── 6. Steps ────────────────────────────────────────────────────────────────────

function StepsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress percent={60} steps={5} />
      <Progress percent={50} steps={10} strokeColor={tokens.colorSuccess} />
      <Progress
        percent={70}
        steps={7}
        strokeColor={[
          tokens.colorError,
          tokens.colorWarning,
          tokens.colorWarning,
          tokens.colorPrimary,
          tokens.colorPrimary,
          tokens.colorSuccess,
          tokens.colorSuccess,
        ]}
      />
    </div>
  )
}

// ─── 7. Size ─────────────────────────────────────────────────────────────────────

function SizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Text weight="bold">Line presets</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        <Progress percent={50} size="default" />
        <Progress percent={50} size="small" />
      </div>

      <Text weight="bold">Line with numeric size (height)</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        <Progress percent={50} size={20} />
        <Progress percent={50} size={4} />
      </div>

      <Text weight="bold">Line with [width, height]</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Progress percent={50} size={[300, 12]} />
        <Progress percent={75} size={[200, 20]} percentPosition={{ type: 'inner', align: 'center' }} />
      </div>

      <Text weight="bold">Circle sizes</Text>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Progress type="circle" percent={75} width={40} />
        <Progress type="circle" percent={75} width={80} />
        <Progress type="circle" percent={75} />
        <Progress type="circle" percent={75} width={160} />
      </div>

      <Text weight="bold">Mini circle (responsive — hover for Tooltip)</Text>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Progress type="circle" percent={30} width={14} />
        <Progress type="circle" percent={60} width={14} />
        <Progress type="circle" percent={100} width={14} />
        <Progress type="circle" percent={70} width={14} status="exception" />
      </div>
    </div>
  )
}

// ─── 8. Linecap ──────────────────────────────────────────────────────────────────

function LinecapDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Text weight="bold">Line</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        <Progress percent={60} strokeLinecap="round" />
        <Progress percent={60} strokeLinecap="butt" />
        <Progress percent={60} strokeLinecap="square" />
      </div>
      <Text weight="bold">Circle</Text>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Progress type="circle" percent={60} strokeLinecap="round" width={100} />
        <Progress type="circle" percent={60} strokeLinecap="butt" width={100} />
        <Progress type="circle" percent={60} strokeLinecap="square" width={100} />
      </div>
      <Text weight="bold">Dashboard</Text>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Progress type="dashboard" percent={60} strokeLinecap="round" width={100} />
        <Progress type="dashboard" percent={60} strokeLinecap="butt" width={100} />
        <Progress type="dashboard" percent={60} strokeLinecap="square" width={100} />
      </div>
    </div>
  )
}

// ─── 9. Circle ───────────────────────────────────────────────────────────────────

function CircleDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <Progress type="circle" percent={75} />
      <Progress type="circle" percent={100} />
      <Progress type="circle" percent={70} status="exception" />
      <Progress type="circle" percent={80} width={80} />
      <Progress
        type="circle"
        percent={85}
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
      />
    </div>
  )
}

// ─── 10. Circle Steps ────────────────────────────────────────────────────────────

function CircleStepsDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <Progress type="circle" percent={50} steps={4} />
      <Progress type="circle" percent={75} steps={6} strokeColor={tokens.colorSuccess} />
      <Progress type="circle" percent={100} steps={8} />
      <Progress
        type="circle"
        percent={60}
        steps={5}
        strokeColor={[
          tokens.colorError,
          tokens.colorWarning,
          tokens.colorPrimary,
          tokens.colorPrimary,
          tokens.colorSuccess,
        ]}
      />
      <Progress type="dashboard" percent={66} steps={3} width={100} />
    </div>
  )
}

// ─── 11. Dashboard ───────────────────────────────────────────────────────────────

function DashboardDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <Progress type="dashboard" percent={75} />
      <Progress type="dashboard" percent={60} gapDegree={30} />
      <Progress type="dashboard" percent={60} gapDegree={200} />
      <div style={{ display: 'flex', gap: 16 }}>
        <Progress type="dashboard" percent={75} gapPosition="top" width={90} />
        <Progress type="dashboard" percent={75} gapPosition="left" width={90} />
        <Progress type="dashboard" percent={75} gapPosition="right" width={90} />
        <Progress type="dashboard" percent={75} gapPosition="bottom" width={90} />
      </div>
    </div>
  )
}

// ─── 12. Percent Position ────────────────────────────────────────────────────────

function PercentPositionDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Text weight="bold">Outer (default)</Text>
      <Progress percent={60} />

      <Text weight="bold">Inner — end</Text>
      <Progress percent={60} size={20} percentPosition={{ type: 'inner', align: 'end' }} />

      <Text weight="bold">Inner — center</Text>
      <Progress percent={75} size={20} percentPosition={{ type: 'inner', align: 'center' }} />

      <Text weight="bold">Inner — start</Text>
      <Progress percent={80} size={20} percentPosition={{ type: 'inner', align: 'start' }} />

      <Text weight="bold">Outer — start</Text>
      <Progress percent={45} percentPosition={{ type: 'outer', align: 'start' }} />
    </div>
  )
}

// ─── 13. Success Segment & Styling ───────────────────────────────────────────────

function SuccessDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <Progress
        percent={80}
        success={{ percent: 30, strokeColor: tokens.colorSuccess }}
      />
      <Progress
        percent={60}
        trailColor={tokens.colorBgSubtle}
        strokeColor={tokens.colorInfo}
      />
      <Progress
        type="circle"
        percent={75}
        success={{ percent: 30, strokeColor: tokens.colorSuccess }}
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function ProgressSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Progress</Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Status" align="start">
        <StatusDemo />
      </Section>

      <Section title="Dynamic" align="start">
        <DynamicDemo />
      </Section>

      <Section title="Custom Format" align="start">
        <FormatDemo />
      </Section>

      <Section title="Gradient Stroke" align="start">
        <GradientDemo />
      </Section>

      <Section title="Steps" align="start">
        <StepsDemo />
      </Section>

      <Section title="Size" align="start">
        <SizeDemo />
      </Section>

      <Section title="Linecap" align="start">
        <LinecapDemo />
      </Section>

      <Section title="Circle">
        <CircleDemo />
      </Section>

      <Section title="Circle Steps">
        <CircleStepsDemo />
      </Section>

      <Section title="Dashboard">
        <DashboardDemo />
      </Section>

      <Section title="Percent Position" align="start">
        <PercentPositionDemo />
      </Section>

      <Section title="Success Segment & Styling" align="start">
        <SuccessDemo />
      </Section>
    </div>
  )
}
