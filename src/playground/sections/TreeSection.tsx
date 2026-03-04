import { useState, useCallback } from 'react'
import { Tree, Text, Input, tokens } from '../../index'
import type { TreeData, TreeDropInfo } from '../../index'
import { Section } from './shared'

// ─── Shared data ────────────────────────────────────────────────────────────────

const treeData: TreeData[] = [
  {
    key: 'parent-1',
    title: 'Parent 1',
    children: [
      {
        key: 'child-1-1',
        title: 'Child 1-1',
        children: [
          { key: 'leaf-1-1-1', title: 'Leaf 1-1-1' },
          { key: 'leaf-1-1-2', title: 'Leaf 1-1-2' },
        ],
      },
      { key: 'child-1-2', title: 'Child 1-2' },
    ],
  },
  {
    key: 'parent-2',
    title: 'Parent 2',
    children: [
      { key: 'child-2-1', title: 'Child 2-1' },
      { key: 'child-2-2', title: 'Child 2-2' },
      { key: 'child-2-3', title: 'Child 2-3' },
    ],
  },
  {
    key: 'parent-3',
    title: 'Parent 3',
    children: [
      { key: 'child-3-1', title: 'Child 3-1' },
      { key: 'child-3-2', title: 'Child 3-2' },
    ],
  },
]

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <Tree
      treeData={treeData}
      defaultExpandedKeys={['parent-1']}
    />
  )
}

// ─── 2. Controlled ──────────────────────────────────────────────────────────────

function ControlledDemo() {
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(['parent-1', 'child-1-1'])
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(['leaf-1-1-1'])
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Tree
        treeData={treeData}
        checkable
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={(keys) => {
          setExpandedKeys(keys)
          setAutoExpandParent(false)
        }}
        checkedKeys={checkedKeys}
        onCheck={(keys) => {
          if (Array.isArray(keys)) setCheckedKeys(keys)
        }}
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
      />
      <Text size="sm" type="secondary">
        Checked: [{checkedKeys.join(', ')}]
      </Text>
      <Text size="sm" type="secondary">
        Selected: [{selectedKeys.join(', ')}]
      </Text>
      <Text size="sm" type="secondary">
        Expanded: [{expandedKeys.join(', ')}]
      </Text>
    </div>
  )
}

// ─── 3. Checkable ───────────────────────────────────────────────────────────────

function CheckableDemo() {
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>([])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Tree
        treeData={treeData}
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        onCheck={(keys) => {
          if (Array.isArray(keys)) setCheckedKeys(keys)
        }}
      />
      <Text size="sm" type="secondary">
        Checked: [{checkedKeys.join(', ')}]
      </Text>
    </div>
  )
}

// ─── 4. Show Line ───────────────────────────────────────────────────────────────

function ShowLineDemo() {
  return (
    <Tree
      treeData={treeData}
      showLine
      defaultExpandAll
    />
  )
}

// ─── 5. Custom Icons ────────────────────────────────────────────────────────────

const starIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const heartIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

function CustomIconsDemo() {
  const iconData: TreeData[] = [
    {
      key: 'favorites',
      title: 'Favorites',
      icon: starIcon,
      children: [
        { key: 'fav-1', title: 'Item 1', icon: heartIcon },
        { key: 'fav-2', title: 'Item 2', icon: heartIcon },
      ],
    },
    {
      key: 'recent',
      title: 'Recent',
      icon: starIcon,
      children: [
        { key: 'rec-1', title: 'Recent 1' },
        { key: 'rec-2', title: 'Recent 2' },
      ],
    },
  ]

  return (
    <Tree
      treeData={iconData}
      showIcon
      defaultExpandAll
    />
  )
}

// ─── 6. Async Load ──────────────────────────────────────────────────────────────

function AsyncLoadDemo() {
  const [data, setData] = useState<TreeData[]>([
    { key: 'node-1', title: 'Expand to load' },
    { key: 'node-2', title: 'Expand to load' },
    { key: 'node-3', title: 'Leaf node', isLeaf: true },
  ])

  const loadData = useCallback((node: TreeData): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setData(prev => {
          const clone = JSON.parse(JSON.stringify(prev)) as TreeData[]
          const target = findInTree(clone, node.key)
          if (target) {
            target.children = [
              { key: `${node.key}-child-1`, title: `Child of ${node.title}`, isLeaf: true },
              { key: `${node.key}-child-2`, title: `Child of ${node.title}`, isLeaf: true },
            ]
          }
          return clone
        })
        resolve()
      }, 1000)
    })
  }, [])

  return <Tree treeData={data} loadData={loadData} />
}

function findInTree(nodes: TreeData[], key: string | number): TreeData | undefined {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children) {
      const found = findInTree(node.children, key)
      if (found) return found
    }
  }
  return undefined
}

// ─── 7. Searchable ──────────────────────────────────────────────────────────────

function SearchableDemo() {
  const [search, setSearch] = useState('')

  const filterFn = useCallback(
    (node: TreeData) => {
      if (!search) return true
      const title = String(node.title ?? '')
      return title.toLowerCase().includes(search.toLowerCase())
    },
    [search],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Input
        placeholder="Search tree nodes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '16rem' }}
        size="small"
      />
      <Tree
        treeData={treeData}
        defaultExpandAll
        filterTreeNode={search ? filterFn : undefined}
      />
    </div>
  )
}

// ─── 8. Draggable ───────────────────────────────────────────────────────────────

function DraggableDemo() {
  const [data, setData] = useState<TreeData[]>(treeData)

  const handleDrop = useCallback((info: TreeDropInfo) => {
    const { node, dragNode, dropPosition } = info

    setData(prev => {
      const clone = JSON.parse(JSON.stringify(prev)) as TreeData[]

      // Remove drag node from its current position
      const removeNode = (nodes: TreeData[], key: string | number): TreeData | null => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].key === key) {
            return nodes.splice(i, 1)[0]
          }
          if (nodes[i].children) {
            const found = removeNode(nodes[i].children!, key)
            if (found) return found
          }
        }
        return null
      }

      const removed = removeNode(clone, dragNode.key)
      if (!removed) return prev

      if (dropPosition === 0) {
        // Drop inside the target node
        const target = findInTree(clone, node.key)
        if (target) {
          if (!target.children) target.children = []
          target.children.push(removed)
        }
      } else {
        // Drop before (-1) or after (1) the target node
        const insertIntoParent = (nodes: TreeData[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].key === node.key) {
              const idx = dropPosition === -1 ? i : i + 1
              nodes.splice(idx, 0, removed)
              return true
            }
            if (nodes[i].children) {
              if (insertIntoParent(nodes[i].children!)) return true
            }
          }
          return false
        }
        insertIntoParent(clone)
      }

      return clone
    })
  }, [])

  return (
    <Tree
      treeData={data}
      draggable
      defaultExpandAll
      onDrop={handleDrop}
    />
  )
}

// ─── 9. DirectoryTree ───────────────────────────────────────────────────────────

function DirectoryTreeDemo() {
  const dirData: TreeData[] = [
    {
      key: 'src',
      title: 'src',
      children: [
        {
          key: 'components',
          title: 'components',
          children: [
            { key: 'Button.tsx', title: 'Button.tsx', isLeaf: true },
            { key: 'Input.tsx', title: 'Input.tsx', isLeaf: true },
            { key: 'Tree.tsx', title: 'Tree.tsx', isLeaf: true },
          ],
        },
        {
          key: 'utils',
          title: 'utils',
          children: [
            { key: 'helpers.ts', title: 'helpers.ts', isLeaf: true },
            { key: 'tokens.ts', title: 'tokens.ts', isLeaf: true },
          ],
        },
        { key: 'index.ts', title: 'index.ts', isLeaf: true },
      ],
    },
    {
      key: 'package.json',
      title: 'package.json',
      isLeaf: true,
    },
    {
      key: 'tsconfig.json',
      title: 'tsconfig.json',
      isLeaf: true,
    },
  ]

  return (
    <Tree.DirectoryTree
      treeData={dirData}
      defaultExpandedKeys={['src', 'components']}
    />
  )
}

// ─── 10. Title Render ───────────────────────────────────────────────────────────

function TitleRenderDemo() {
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0 0.375rem',
    fontSize: '0.6875rem',
    lineHeight: '1.25rem',
    borderRadius: '0.625rem',
    backgroundColor: tokens.colorPrimary50,
    color: tokens.colorPrimary,
    marginLeft: '0.5rem',
    fontWeight: 600,
  }

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      titleRender={(node) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {String(node.title)}
          {node.children && node.children.length > 0 && (
            <span style={badgeStyle}>{node.children.length}</span>
          )}
        </span>
      )}
    />
  )
}

// ─── 12. Disabled ───────────────────────────────────────────────────────────────

function DisabledDemo() {
  const disabledData: TreeData[] = [
    {
      key: 'p-1',
      title: 'Normal parent',
      children: [
        { key: 'c-1', title: 'Normal child' },
        { key: 'c-2', title: 'Disabled child', disabled: true },
        { key: 'c-3', title: 'Disabled checkbox', disableCheckbox: true },
      ],
    },
    {
      key: 'p-2',
      title: 'Disabled parent',
      disabled: true,
      children: [
        { key: 'c-4', title: 'Child of disabled' },
      ],
    },
  ]

  return (
    <Tree
      treeData={disabledData}
      checkable
      defaultExpandAll
    />
  )
}

// ─── 13. Semantic Styling ───────────────────────────────────────────────────────

function SemanticDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Text size="sm" type="secondary" style={{ display: 'block' }}>
        Slots: <Text code>root</Text>, <Text code>node</Text>, <Text code>nodeContent</Text>,{' '}
        <Text code>switcher</Text>, <Text code>checkbox</Text>, <Text code>title</Text>,{' '}
        <Text code>icon</Text>
      </Text>
      <Tree
        treeData={treeData}
        defaultExpandAll
        styles={{
          root: {
            backgroundColor: tokens.colorBgSubtle,
            borderRadius: '0.5rem',
            padding: '0.5rem',
            border: `1px solid ${tokens.colorBorder}`,
          },
          node: {
            borderRadius: '0.375rem',
          },
        }}
      />
    </div>
  )
}

// ─── 14. Custom Switcher Icon ────────────────────────────────────────────────────

function CustomSwitcherDemo() {
  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      showLine
      switcherIcon={({ expanded }: { expanded: boolean }) =>
        expanded
          ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )
          : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )
      }
    />
  )
}

// ─── 15. Virtual Scroll ──────────────────────────────────────────────────────────

const bigTreeData: TreeData[] = Array.from({ length: 100 }, (_, i) => ({
  key: `node-${i}`,
  title: `Node ${i}`,
  children: Array.from({ length: 10 }, (_, j) => ({
    key: `node-${i}-${j}`,
    title: `Child ${i}-${j}`,
    isLeaf: true,
  })),
}))

function VirtualScrollDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text size="sm" type="secondary">
        100 parent nodes with 10 children each (1100 total), rendered with virtual scroll via <Text code>height={'{300}'}</Text>
      </Text>
      <Tree
        treeData={bigTreeData}
        defaultExpandAll
        height={300}
      />
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────────

export function TreeSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Tree</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A hierarchical list structure component. Supports expand/collapse, selection, checkboxes, drag-and-drop, async loading, and a DirectoryTree variant.
      </Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Controlled">
        <ControlledDemo />
      </Section>

      <Section title="Checkable">
        <CheckableDemo />
      </Section>

      <Section title="Show Line">
        <ShowLineDemo />
      </Section>

      <Section title="Custom Icons">
        <CustomIconsDemo />
      </Section>

      <Section title="Async Loading">
        <AsyncLoadDemo />
      </Section>

      <Section title="Searchable">
        <SearchableDemo />
      </Section>

      <Section title="Draggable">
        <DraggableDemo />
      </Section>

      <Section title="DirectoryTree">
        <DirectoryTreeDemo />
      </Section>

      <Section title="Title Render">
        <TitleRenderDemo />
      </Section>

      <Section title="Disabled">
        <DisabledDemo />
      </Section>

      <Section title="Semantic Styling">
        <SemanticDemo />
      </Section>

      <Section title="Custom Switcher Icon">
        <CustomSwitcherDemo />
      </Section>

      <Section title="Virtual Scroll">
        <VirtualScrollDemo />
      </Section>
    </div>
  )
}
