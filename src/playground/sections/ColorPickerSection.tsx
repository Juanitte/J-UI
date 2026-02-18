import { useState } from 'react'
import { Text, ColorPicker, tokens } from '../../index'
import type { ColorPickerGradientStop } from '../../index'
import { Section } from './shared'

const presetColors = [
  {
    label: 'Recomendados',
    colors: [
      '#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2',
      '#1677ff', '#722ed1', '#eb2f96',
    ],
  },
  {
    label: 'Neutros',
    colors: [
      '#000000', '#434343', '#666666', '#999999', '#bfbfbf',
      '#d9d9d9', '#f0f0f0', '#ffffff',
    ],
  },
]

// ---- Controlled demo ----

function ControlledDemo() {
  const [hex, setHex] = useState('#1677ff')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ColorPicker
        value={hex}
        onChange={(_, h) => setHex(h)}
        showText
      />
      <Text size="sm" type="secondary">
        Selected: {hex.toUpperCase()}
      </Text>
    </div>
  )
}

// ---- Custom trigger demo ----

function CustomTriggerDemo() {
  const [hex, setHex] = useState('#52c41a')

  return (
    <ColorPicker value={hex} onChange={(_, h) => setHex(h)}>
      <button
        style={{
          padding: '6px 16px',
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: 6,
          backgroundColor: hex,
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 13,
          fontFamily: 'inherit',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {hex.toUpperCase()}
      </button>
    </ColorPicker>
  )
}

// ---- Gradient controlled demo ----

function GradientControlledDemo() {
  const [stops, setStops] = useState<ColorPickerGradientStop[]>([
    { color: '#1677ff', percent: 0 },
    { color: '#f5222d', percent: 100 },
  ])
  const [css, setCss] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ColorPicker
        mode="gradient"
        value={stops}
        onGradientChange={(s, c) => { setStops(s); setCss(c) }}
        showText
      />
      {css && (
        <Text size="sm" type="secondary" style={{ wordBreak: 'break-all' }}>
          {css}
        </Text>
      )}
    </div>
  )
}

// ============================================================================
// Main Section
// ============================================================================

export function ColorPickerSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>
        ColorPicker
      </Text>

      <Section title="Basic">
        <ColorPicker />
        <ColorPicker defaultValue="#52c41a" />
        <ColorPicker defaultValue="#fa8c16" />
        <ColorPicker defaultValue="rgb(114, 46, 209)" />
      </Section>

      <Section title="Sizes">
        <ColorPicker size="sm" defaultValue="#1677ff" />
        <ColorPicker size="md" defaultValue="#1677ff" />
        <ColorPicker size="lg" defaultValue="#1677ff" />
      </Section>

      <Section title="Show text">
        <ColorPicker defaultValue="#1677ff" showText />
        <ColorPicker defaultValue="#52c41a" showText defaultFormat="rgb" />
        <ColorPicker
          defaultValue="#722ed1"
          showText={(color) => <span style={{ fontWeight: 600 }}>Custom text ({color.toHexString().toUpperCase()})</span>}
        />
      </Section>

      <Section title="Disabled" >
        <ColorPicker defaultValue="#1677ff" disabled />
        <ColorPicker defaultValue="#1677ff" disabled showText />
      </Section>

      <Section title="Disabled alpha" align="start">
        <ColorPicker defaultValue="#1677ff" disabledAlpha showText />
      </Section>

      <Section title="Formatos (hex / rgb / hsb)" align="start">
        <div style={{ display: 'flex', gap: 16 }}>
          <ColorPicker defaultValue="#f5222d" defaultFormat="hex" showText />
          <ColorPicker defaultValue="#f5222d" defaultFormat="rgb" showText />
          <ColorPicker defaultValue="#f5222d" defaultFormat="hsb" showText />
        </div>
      </Section>

      <Section title="Presets" align="start">
        <ColorPicker defaultValue="#1677ff" presets={presetColors} showText />
      </Section>

      <Section title="Allow clear" align="start">
        <ColorPicker defaultValue="#eb2f96" allowClear showText />
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Custom trigger (children)" align="start">
        <CustomTriggerDemo />
      </Section>

      <Section title="Trigger hover" align="start">
        <ColorPicker defaultValue="#13c2c2" trigger="hover" showText />
      </Section>

      <Section title="Placement" align="start">
        <div style={{ display: 'flex', gap: 12 }}>
          <ColorPicker defaultValue="#1677ff" placement="bottomLeft" size="sm" />
          <ColorPicker defaultValue="#52c41a" placement="bottomRight" size="sm" />
          <ColorPicker defaultValue="#fa8c16" placement="topLeft" size="sm" />
          <ColorPicker defaultValue="#f5222d" placement="topRight" size="sm" />
        </div>
      </Section>

      <Section title="panelRender" align="start">
        <ColorPicker
          defaultValue="#722ed1"
          showText
          panelRender={(panel) => (
            <div>
              <div style={{
                padding: '6px 0', marginBottom: 8,
                borderBottom: `1px solid ${tokens.colorBorder}`,
                fontSize: 13, fontWeight: 600, color: tokens.colorText,
              }}>
                Elige tu color
              </div>
              {panel}
            </div>
          )}
        />
      </Section>

      <Section title="Semantic styles" align="start">
        <ColorPicker
          defaultValue="#1677ff"
          showText
          styles={{
            trigger: {
              borderRadius: 20,
              border: `2px solid ${tokens.colorPrimary}`,
            },
            panel: {
              borderRadius: 16,
              border: `2px solid ${tokens.colorPrimary}`,
            },
          }}
        />
      </Section>

      <Section title="Gradient mode" align="start">
        <div style={{ display: 'flex', gap: 16 }}>
          <ColorPicker mode="gradient" showText />
          <ColorPicker mode="gradient" defaultValue="#722ed1" showText />
        </div>
      </Section>

      <Section title="Gradient controlled" align="start">
        <GradientControlledDemo />
      </Section>

      <Section title="Gradient with presets" align="start">
        <ColorPicker
          mode="gradient"
          defaultValue="#1677ff"
          presets={presetColors}
          showText
        />
      </Section>
    </div>
  )
}
