import { useState } from 'react'
import { Transfer, Flex, Text, tokens } from '../../index'
import type { TransferItem } from '../../index'
import { Section } from './shared'

// ============================================================================
// Shared mock data
// ============================================================================

const mockData: TransferItem[] = Array.from({ length: 10 }, (_, i) => ({
  key: `item-${i + 1}`,
  title: `Item ${i + 1}`,
  description: `Description of item ${i + 1}`,
  disabled: i === 3,
}))

// ============================================================================
// Demo 1: Basic
// ============================================================================

function BasicDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-6', 'item-7']}
    />
  )
}

// ============================================================================
// Demo 2: With Search
// ============================================================================

function SearchDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-8', 'item-9']}
      showSearch
    />
  )
}

// ============================================================================
// Demo 3: Controlled
// ============================================================================

function ControlledDemo() {
  const [targetKeys, setTargetKeys] = useState<string[]>(['item-2', 'item-5'])
  const [log, setLog] = useState<string[]>([])

  return (
    <Flex vertical gap={8}>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={(keys, direction, moveKeys) => {
          setTargetKeys(keys)
          setLog(prev => [...prev.slice(-2), `${direction}: [${moveKeys.join(', ')}]`])
        }}
      />
      <Text size="sm" type="secondary">
        Log: {log.length > 0 ? log.join(' | ') : '(transfer items to see log)'}
      </Text>
      <button
        onClick={() => { setTargetKeys(['item-2', 'item-5']); setLog([]) }}
        style={{
          alignSelf: 'flex-start',
          padding: '4px 12px', border: `1px solid ${tokens.colorBorder}`,
          borderRadius: 4, backgroundColor: tokens.colorBg,
          color: tokens.colorText, cursor: 'pointer', fontSize: 12,
        }}
      >
        Reset
      </button>
    </Flex>
  )
}

// ============================================================================
// Demo 4: Custom Render
// ============================================================================

function CustomRenderDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-3']}
      render={(item) => (
        <Flex vertical gap={0} style={{ overflow: 'hidden' }}>
          <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{item.title}</span>
          <span style={{ fontSize: '0.6875rem', color: tokens.colorTextMuted }}>
            {item.description}
          </span>
        </Flex>
      )}
      listStyle={{ height: '22rem' }}
    />
  )
}

// ============================================================================
// Demo 5: One Way
// ============================================================================

function OneWayDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-1', 'item-5', 'item-8']}
      oneWay
    />
  )
}

// ============================================================================
// Demo 6: Custom Titles & Operations
// ============================================================================

function CustomTitlesDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-6']}
      titles={['Available', 'Chosen']}
      operations={['Add', 'Remove']}
    />
  )
}

// ============================================================================
// Demo 7: Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-2', 'item-7']}
      disabled
    />
  )
}

// ============================================================================
// Demo 8: Status
// ============================================================================

function StatusDemo() {
  return (
    <Flex gap={24}>
      <Transfer
        dataSource={mockData.slice(0, 5)}
        defaultTargetKeys={['item-2']}
        status="error"
      />
      <Transfer
        dataSource={mockData.slice(0, 5)}
        defaultTargetKeys={['item-3']}
        status="warning"
      />
    </Flex>
  )
}

// ============================================================================
// Demo 9: Advanced (footer + custom sizes)
// ============================================================================

function AdvancedDemo() {
  return (
    <Transfer
      dataSource={mockData}
      defaultTargetKeys={['item-3', 'item-7']}
      titles={['Source', 'Target']}
      showSearch
      footer={({ direction }) => (
        <span style={{ fontSize: '0.75rem', color: tokens.colorTextMuted }}>
          {direction === 'left' ? 'Select items to add' : 'Drop zone'}
        </span>
      )}
      listStyle={{ width: '16rem', height: '22rem' }}
    />
  )
}

// ============================================================================
// Demo 10: Pagination
// ============================================================================

const largeMockData: TransferItem[] = Array.from({ length: 30 }, (_, i) => ({
  key: `p-${i + 1}`,
  title: `Content ${i + 1}`,
  description: `Description of content ${i + 1}`,
  disabled: i === 5,
}))

function PaginationDemo() {
  return (
    <Transfer
      dataSource={largeMockData}
      defaultTargetKeys={['p-3', 'p-12', 'p-18', 'p-25']}
      showSearch
      pagination={{ pageSize: 8 }}
    />
  )
}

// ============================================================================
// Demo 11: Semantic Styles
// ============================================================================

function SemanticStylesDemo() {
  return (
    <Flex gap={24} wrap="wrap">
      <Flex vertical gap={4}>
        <Text size="sm" weight="semibold">Styled lists</Text>
        <Transfer
          dataSource={mockData.slice(0, 6)}
          defaultTargetKeys={['item-4']}
          styles={{
            list: { borderColor: tokens.colorPrimary600, borderWidth: 2 },
            header: { backgroundColor: tokens.colorPrimary500, color: tokens.colorText },
          }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" weight="semibold">Styled items + operations</Text>
        <Transfer
          dataSource={mockData.slice(0, 6)}
          defaultTargetKeys={['item-2', 'item-5']}
          styles={{
            item: { borderBottom: `1px solid ${tokens.colorBorder}` },
            operation: { gap: '1rem' },
          }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Section
// ============================================================================

export function TransferSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Transfer</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A two-column list selector for moving items between source and target.
      </Text>

      <Section title="Basic" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Uncontrolled with defaultTargetKeys. Item 4 is disabled.
          </Text>
          <BasicDemo />
        </Flex>
      </Section>

      <Section title="With Search" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Enable showSearch to filter items in both lists.
          </Text>
          <SearchDemo />
        </Flex>
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Custom Render" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use the render prop to customize how each item is displayed.
          </Text>
          <CustomRenderDemo />
        </Flex>
      </Section>

      <Section title="One Way" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            With oneWay, items can only be added to the target. Remove them with the close button.
          </Text>
          <OneWayDemo />
        </Flex>
      </Section>

      <Section title="Custom Titles & Operations" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Customize header titles and transfer button labels.
          </Text>
          <CustomTitlesDemo />
        </Flex>
      </Section>

      <Section title="Disabled" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Status" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Status prop for form validation: error and warning.
          </Text>
          <StatusDemo />
        </Flex>
      </Section>

      <Section title="Advanced" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Footer content, custom list dimensions, and search combined.
          </Text>
          <AdvancedDemo />
        </Flex>
      </Section>

      <Section title="Pagination" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Large datasets with pagination. 30 items, 8 per page.
          </Text>
          <PaginationDemo />
        </Flex>
      </Section>

      <Section title="Semantic Styles" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Customize appearance of individual slots via the styles prop.
          </Text>
          <SemanticStylesDemo />
        </Flex>
      </Section>
    </div>
  )
}
