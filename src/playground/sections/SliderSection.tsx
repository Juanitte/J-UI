import { useState } from 'react'
import { Slider, InputNumber, Flex, Text, tokens } from '../../index'
import { Section } from './shared'

// ============================================================================
// Demo 1: Basic
// ============================================================================

function BasicDemo() {
  const [value, setValue] = useState(30)
  return (
    <Flex vertical gap={8} style={{ width: 300 }}>
      <Slider value={value} onChange={(v) => setValue(v as number)} />
      <Text size="sm" type="secondary">Value: {value}</Text>
    </Flex>
  )
}

// ============================================================================
// Demo 2: With InputNumber
// ============================================================================

function WithInputNumberDemo() {
  const [value, setValue] = useState(30)
  return (
    <Flex gap={16} align="center" style={{ width: 400 }}>
      <Slider
        value={value}
        onChange={(v) => setValue(v as number)}
        style={{ flex: 1 }}
      />
      <InputNumber
        value={value}
        min={0}
        max={100}
        onChange={(v) => setValue(Number(v ?? 0))}
        style={{ width: 80 }}
      />
    </Flex>
  )
}

// ============================================================================
// Demo 3: Vertical
// ============================================================================

function VerticalDemo() {
  return (
    <Flex gap={32} style={{ height: 200 }}>
      <Slider vertical defaultValue={30} />
      <Slider vertical range defaultValue={[20, 60]} />
    </Flex>
  )
}

// ============================================================================
// Demo 4: Marks
// ============================================================================

function MarksDemo() {
  const marks = {
    0: '0°C',
    26: '26°C',
    37: '37°C',
    100: {
      style: { color: tokens.colorError },
      label: '100°C',
    },
  }

  return (
    <Flex vertical gap={24} style={{ width: 400 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          included=true (default)
        </Text>
        <Slider marks={marks} defaultValue={37} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          included=false
        </Text>
        <Slider marks={marks} included={false} defaultValue={37} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          step=null (only marks selectable)
        </Text>
        <Slider marks={marks} step={null} defaultValue={26} />
      </div>
    </Flex>
  )
}

// ============================================================================
// Demo 5: Range
// ============================================================================

function RangeDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <Slider range defaultValue={[20, 50]} />
      <Slider range defaultValue={[10, 80]} />
    </Flex>
  )
}

// ============================================================================
// Demo 6: Tooltip
// ============================================================================

function TooltipDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Default tooltip
        </Text>
        <Slider defaultValue={30} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Custom formatter
        </Text>
        <Slider defaultValue={50} tooltip={{ formatter: (v) => `${v}%` }} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Always visible
        </Text>
        <Slider defaultValue={40} tooltip={{ open: true }} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Hidden tooltip
        </Text>
        <Slider defaultValue={60} tooltip={{ open: false }} />
      </div>
    </Flex>
  )
}

// ============================================================================
// Demo 7: Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <Slider disabled defaultValue={30} />
      <Slider disabled range defaultValue={[20, 60]} />
    </Flex>
  )
}

// ============================================================================
// Demo 8: Draggable track
// ============================================================================

function DraggableTrackDemo() {
  return (
    <div style={{ width: 400 }}>
      <Slider range draggableTrack defaultValue={[20, 50]} />
    </div>
  )
}

// ============================================================================
// Demo 9: Custom styles
// ============================================================================

function CustomStylesDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <Slider
        defaultValue={50}
        styles={{
          track: { backgroundColor: tokens.colorSuccess },
          handle: { borderColor: tokens.colorSuccess, backgroundColor: tokens.colorSuccess50 },
          rail: { backgroundColor: tokens.colorSuccess100 },
        }}
      />
      <Slider
        range
        defaultValue={[20, 60]}
        styles={{
          track: { backgroundColor: tokens.colorWarning },
          handle: { borderColor: tokens.colorWarning },
        }}
      />
    </Flex>
  )
}

// ============================================================================
// Demo 10: Steps with dots
// ============================================================================

function StepsWithDotsDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <Slider step={10} dots defaultValue={30} />
      <Slider step={25} dots range defaultValue={[25, 75]} marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }} />
    </Flex>
  )
}

// ============================================================================
// Demo 11: Reverse
// ============================================================================

function ReverseDemo() {
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Horizontal reverse
        </Text>
        <Slider reverse defaultValue={70} />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Range reverse
        </Text>
        <Slider reverse range defaultValue={[20, 60]} />
      </div>
    </Flex>
  )
}

// ============================================================================
// Demo 12: Multiple handles
// ============================================================================

function MultiHandleDemo() {
  const [values, setValues] = useState([10, 30, 50, 80])
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          4 handles
        </Text>
        <Slider
          range
          value={values}
          onChange={(v) => setValues(v as number[])}
        />
        <Text size="sm" type="secondary">Values: [{values.join(', ')}]</Text>
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          3 handles with marks
        </Text>
        <Slider
          range
          defaultValue={[20, 50, 80]}
          marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
        />
      </div>
    </Flex>
  )
}

// ============================================================================
// Demo 13: Editable (dynamic handles)
// ============================================================================

function EditableDemo() {
  const [values, setValues] = useState([20, 50, 80])
  return (
    <Flex vertical gap={16} style={{ width: 400 }}>
      <Slider
        range={{ editable: true, minCount: 2, maxCount: 6 }}
        value={values}
        onChange={(v) => setValues(v as number[])}
      />
      <Text size="sm" type="secondary">
        Values: [{values.join(', ')}] ({values.length} handles)
      </Text>
    </Flex>
  )
}

// ============================================================================
// Section
// ============================================================================

export function SliderSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Slider</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A Slider component for selecting a value or range from a continuous or discrete set.
      </Text>

      <Section title="Basic usage" align="start">
        <BasicDemo />
      </Section>

      <Section title="With InputNumber" align="start">
        <WithInputNumberDemo />
      </Section>

      <Section title="Vertical" align="start">
        <VerticalDemo />
      </Section>

      <Section title="Graduated marks" align="start">
        <MarksDemo />
      </Section>

      <Section title="Range" align="start">
        <RangeDemo />
      </Section>

      <Section title="Tooltip" align="start">
        <TooltipDemo />
      </Section>

      <Section title="Disabled" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Draggable track" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Drag the filled track to move both handles at once.
          </Text>
          <DraggableTrackDemo />
        </Flex>
      </Section>

      <Section title="Custom styles" align="start">
        <CustomStylesDemo />
      </Section>

      <Section title="Steps with dots" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            The step prop restricts movement to fixed increments. The dots prop adds visual indicators at each step position.
          </Text>
          <StepsWithDotsDemo />
        </Flex>
      </Section>

      <Section title="Reverse" align="start">
        <ReverseDemo />
      </Section>

      <Section title="Multiple handles" align="start">
        <MultiHandleDemo />
      </Section>

      <Section title="Editable (dynamic handles)" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Click the rail to add handles. Drag a handle away from the rail to remove it. Press Delete to remove the focused handle. (min: 2, max: 6)
          </Text>
          <EditableDemo />
        </Flex>
      </Section>
    </div>
  )
}
