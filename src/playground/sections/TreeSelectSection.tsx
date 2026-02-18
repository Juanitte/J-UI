import { useState } from 'react'
import { TreeSelect, Flex, Text, tokens } from '../../index'
import type { TreeSelectTreeData } from '../../index'
import { Section } from './shared'

// ============================================================================
// Shared mock data
// ============================================================================

const treeData: TreeSelectTreeData[] = [
  {
    value: 'parent-1',
    title: 'Parent 1',
    children: [
      {
        value: 'child-1-1',
        title: 'Child 1-1',
        children: [
          { value: 'grandchild-1-1-1', title: 'Grandchild 1-1-1' },
          { value: 'grandchild-1-1-2', title: 'Grandchild 1-1-2' },
        ],
      },
      { value: 'child-1-2', title: 'Child 1-2' },
    ],
  },
  {
    value: 'parent-2',
    title: 'Parent 2',
    children: [
      { value: 'child-2-1', title: 'Child 2-1' },
      { value: 'child-2-2', title: 'Child 2-2' },
      { value: 'child-2-3', title: 'Child 2-3' },
    ],
  },
  {
    value: 'parent-3',
    title: 'Parent 3',
    children: [
      { value: 'child-3-1', title: 'Child 3-1' },
      { value: 'child-3-2', title: 'Child 3-2' },
    ],
  },
]

// ============================================================================
// Demo 1: Basic
// ============================================================================

function BasicDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="Select a node"
      treeDefaultExpandAll
      style={{ width: 280 }}
    />
  )
}

// ============================================================================
// Demo 2: Multiple
// ============================================================================

function MultipleDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="Select multiple nodes"
      multiple
      treeDefaultExpandAll
      allowClear
      style={{ width: 360 }}
    />
  )
}

// ============================================================================
// Demo 3: Checkable
// ============================================================================

function CheckableDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="Check nodes"
      treeCheckable
      treeDefaultExpandAll
      allowClear
      style={{ width: 360 }}
    />
  )
}

// ============================================================================
// Demo 4: Checked Strategy
// ============================================================================

function CheckedStrategyDemo() {
  return (
    <Flex gap={16} wrap="wrap">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">SHOW_ALL</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="SHOW_ALL"
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          treeDefaultExpandAll
          defaultValue={['grandchild-1-1-1', 'grandchild-1-1-2', 'child-1-1', 'child-1-2', 'parent-1']}
          style={{ width: 320 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">SHOW_PARENT</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="SHOW_PARENT"
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          treeDefaultExpandAll
          defaultValue={['grandchild-1-1-1', 'grandchild-1-1-2', 'child-1-1', 'child-1-2', 'parent-1']}
          style={{ width: 320 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">SHOW_CHILD</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="SHOW_CHILD"
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          treeDefaultExpandAll
          defaultValue={['grandchild-1-1-1', 'grandchild-1-1-2', 'child-1-1', 'child-1-2', 'parent-1']}
          style={{ width: 320 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 5: Check Strictly
// ============================================================================

function CheckStrictlyDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="Strict check (no cascade)"
      treeCheckable
      treeCheckStrictly
      treeDefaultExpandAll
      allowClear
      style={{ width: 360 }}
    />
  )
}

// ============================================================================
// Demo 6: With Search
// ============================================================================

function SearchDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="Type to search..."
      showSearch
      treeDefaultExpandAll
      allowClear
      style={{ width: 280 }}
    />
  )
}

// ============================================================================
// Demo 7: Tree Line
// ============================================================================

function TreeLineDemo() {
  return (
    <TreeSelect
      treeData={treeData}
      placeholder="With tree lines"
      treeLine
      treeDefaultExpandAll
      style={{ width: 280 }}
    />
  )
}

// ============================================================================
// Demo 8: Async Loading
// ============================================================================

const asyncTreeData: TreeSelectTreeData[] = [
  { value: 'async-1', title: 'Expand me (async)', isLeaf: false },
  { value: 'async-2', title: 'Expand me too (async)', isLeaf: false },
  { value: 'async-3', title: 'I am a leaf', isLeaf: true },
]

function AsyncLoadingDemo() {
  const [data, setData] = useState<TreeSelectTreeData[]>(asyncTreeData)

  const onLoadData = (node: TreeSelectTreeData) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setData((prev) => {
          function addChildren(nodes: TreeSelectTreeData[]): TreeSelectTreeData[] {
            return nodes.map((n) => {
              if (n.value === node.value) {
                return {
                  ...n,
                  children: [
                    { value: `${node.value}-child-1`, title: `${node.title} Child 1` },
                    { value: `${node.value}-child-2`, title: `${node.title} Child 2` },
                  ],
                }
              }
              if (n.children) return { ...n, children: addChildren(n.children) }
              return n
            })
          }
          return addChildren(prev)
        })
        resolve()
      }, 1000)
    })

  return (
    <TreeSelect
      treeData={data}
      placeholder="Click arrow to load children"
      loadData={onLoadData}
      allowClear
      style={{ width: 320 }}
    />
  )
}

// ============================================================================
// Demo 9: Sizes
// ============================================================================

function SizesDemo() {
  return (
    <Flex gap={16} wrap="wrap" align="start">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Small</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Small"
          size="small"
          treeDefaultExpandAll
          style={{ width: 240 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Middle (default)</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Middle"
          size="middle"
          treeDefaultExpandAll
          style={{ width: 240 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Large</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Large"
          size="large"
          treeDefaultExpandAll
          style={{ width: 240 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 10: Disabled
// ============================================================================

const disabledTreeData: TreeSelectTreeData[] = [
  {
    value: 'p1',
    title: 'Parent 1',
    children: [
      { value: 'c1', title: 'Child 1' },
      { value: 'c2', title: 'Child 2 (disabled)', disabled: true },
      { value: 'c3', title: 'Child 3' },
    ],
  },
  { value: 'p2', title: 'Parent 2 (disabled)', disabled: true },
]

function DisabledDemo() {
  return (
    <Flex gap={16} wrap="wrap">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Component disabled</Text>
        <TreeSelect
          treeData={treeData}
          defaultValue="child-1-2"
          disabled
          style={{ width: 240 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Some nodes disabled</Text>
        <TreeSelect
          treeData={disabledTreeData}
          placeholder="Select"
          treeCheckable
          treeDefaultExpandAll
          style={{ width: 280 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 11: Status
// ============================================================================

function StatusDemo() {
  return (
    <Flex gap={16}>
      <TreeSelect
        treeData={treeData}
        placeholder="Error"
        status="error"
        style={{ width: 200 }}
      />
      <TreeSelect
        treeData={treeData}
        placeholder="Warning"
        status="warning"
        style={{ width: 200 }}
      />
    </Flex>
  )
}

// ============================================================================
// Demo 12: Semantic Styles
// ============================================================================

function SemanticStylesDemo() {
  return (
    <Flex gap={24} wrap="wrap">
      <Flex vertical gap={4}>
        <Text size="sm" weight="semibold">Styled selector + dropdown</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Custom styled"
          treeDefaultExpandAll
          style={{ width: 280 }}
          styles={{
            selector: { borderColor: tokens.colorPrimary600, borderWidth: 2 },
            dropdown: { borderColor: tokens.colorPrimary600, borderWidth: 2 },
          }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" weight="semibold">Styled tags + nodes</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Custom tags"
          treeCheckable
          treeDefaultExpandAll
          defaultValue={['child-1-2', 'child-2-1']}
          style={{ width: 320 }}
          styles={{
            tag: { backgroundColor: tokens.colorPrimary100, color: tokens.colorPrimary700, borderRadius: '1rem' },
            node: { borderRadius: '0.5rem' },
          }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 13: Variants
// ============================================================================

function VariantsDemo() {
  return (
    <Flex gap={16} wrap="wrap" align="start">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Outlined (default)</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Outlined"
          variant="outlined"
          treeDefaultExpandAll
          style={{ width: 220 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Filled</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Filled"
          variant="filled"
          treeDefaultExpandAll
          style={{ width: 220 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Borderless</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Borderless"
          variant="borderless"
          treeDefaultExpandAll
          style={{ width: 220 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Underlined</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Underlined"
          variant="underlined"
          treeDefaultExpandAll
          style={{ width: 220 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 14: Placement
// ============================================================================

function PlacementDemo() {
  return (
    <Flex gap={16} wrap="wrap" align="start">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">bottomLeft (default)</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="bottomLeft"
          placement="bottomLeft"
          popupMatchSelectWidth={false}
          treeDefaultExpandAll
          style={{ width: 320 }}
          styles={{ dropdown: { minWidth: 200 } }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">bottomRight</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="bottomRight"
          placement="bottomRight"
          popupMatchSelectWidth={false}
          treeDefaultExpandAll
          style={{ width: 320 }}
          styles={{ dropdown: { minWidth: 200 } }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">topLeft</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="topLeft"
          placement="topLeft"
          popupMatchSelectWidth={false}
          treeDefaultExpandAll
          style={{ width: 320 }}
          styles={{ dropdown: { minWidth: 200 } }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">topRight</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="topRight"
          placement="topRight"
          popupMatchSelectWidth={false}
          treeDefaultExpandAll
          style={{ width: 320 }}
          styles={{ dropdown: { minWidth: 200 } }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 15: Max Count
// ============================================================================

function MaxCountDemo() {
  return (
    <Flex gap={16} wrap="wrap" align="start">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Multiple (max 3)</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Select up to 3"
          multiple
          maxCount={3}
          treeDefaultExpandAll
          allowClear
          style={{ width: 320 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">Checkable (max 3)</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Check up to 3"
          treeCheckable
          treeCheckStrictly
          maxCount={3}
          treeDefaultExpandAll
          allowClear
          style={{ width: 320 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Demo 16: Prefix & Suffix
// ============================================================================

function PrefixSuffixDemo() {
  const searchIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
  const folderIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
  return (
    <Flex gap={16} wrap="wrap" align="start">
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">With prefix</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Select category"
          prefix={folderIcon}
          treeDefaultExpandAll
          style={{ width: 260 }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text size="sm" type="secondary">With custom suffix</Text>
        <TreeSelect
          treeData={treeData}
          placeholder="Search node"
          suffixIcon={searchIcon}
          treeDefaultExpandAll
          style={{ width: 260 }}
        />
      </Flex>
    </Flex>
  )
}

// ============================================================================
// Section
// ============================================================================

export function TreeSelectSection() {
  return (
    <div>
      <Text size="xl" weight="bold">TreeSelect</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A tree-structured dropdown selector. Supports single, multiple, and checkable selection modes.
      </Text>

      <Section title="Basic" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Single selection with a tree dropdown.
          </Text>
          <BasicDemo />
        </Flex>
      </Section>

      <Section title="Multiple" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Multiple selection without checkboxes. Each selected node becomes a tag.
          </Text>
          <MultipleDemo />
        </Flex>
      </Section>

      <Section title="Checkable" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Checkbox mode with parent-child cascade.
          </Text>
          <CheckableDemo />
        </Flex>
      </Section>

      <Section title="Checked Strategy" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Same selection, different tag display strategies.
          </Text>
          <CheckedStrategyDemo />
        </Flex>
      </Section>

      <Section title="Check Strictly" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            No cascade — each node is checked independently.
          </Text>
          <CheckStrictlyDemo />
        </Flex>
      </Section>

      <Section title="With Search" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Type in the selector to filter tree nodes.
          </Text>
          <SearchDemo />
        </Flex>
      </Section>

      <Section title="Tree Line" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Visual tree connectors showing parent-child relationships.
          </Text>
          <TreeLineDemo />
        </Flex>
      </Section>

      <Section title="Async Loading" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Load children dynamically when a node is expanded.
          </Text>
          <AsyncLoadingDemo />
        </Flex>
      </Section>

      <Section title="Variants" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Four variants: outlined (default), filled, borderless, and underlined.
          </Text>
          <VariantsDemo />
        </Flex>
      </Section>

      <Section title="Placement" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Control where the dropdown popup appears relative to the selector.
          </Text>
          <PlacementDemo />
        </Flex>
      </Section>

      <Section title="Max Count" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Limit the number of selectable items in multiple/checkable mode.
          </Text>
          <MaxCountDemo />
        </Flex>
      </Section>

      <Section title="Prefix & Suffix" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Custom prefix and suffix icons in the selector.
          </Text>
          <PrefixSuffixDemo />
        </Flex>
      </Section>

      <Section title="Sizes" align="start">
        <SizesDemo />
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
