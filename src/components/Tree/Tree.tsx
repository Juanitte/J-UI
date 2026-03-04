import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticStyle, mergeSemanticClassName } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export interface TreeData {
  key: string | number
  title?: ReactNode
  children?: TreeData[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  checkable?: boolean
  isLeaf?: boolean
  icon?: ReactNode | ((props: { selected: boolean; expanded: boolean }) => ReactNode)
  [field: string]: unknown
}

export interface TreeFieldNames {
  title?: string
  key?: string
  children?: string
}

export interface TreeCheckedKeys {
  checked: (string | number)[]
  halfChecked: (string | number)[]
}

export type TreeSemanticSlot = 'root' | 'node' | 'nodeContent' | 'switcher' | 'checkbox' | 'title' | 'icon'
export type TreeClassNames = SemanticClassNames<TreeSemanticSlot>
export type TreeStyles = SemanticStyles<TreeSemanticSlot>

export interface TreeSelectInfo {
  selected: boolean
  selectedNodes: TreeData[]
  node: TreeData
  event: React.MouseEvent
}

export interface TreeCheckInfo {
  checked: boolean
  checkedNodes: TreeData[]
  node: TreeData
  event: React.MouseEvent
  halfCheckedKeys: (string | number)[]
}

export interface TreeExpandInfo {
  expanded: boolean
  node: TreeData
}

export interface TreeDragInfo {
  event: React.DragEvent
  node: TreeData
}

export interface TreeDropInfo {
  event: React.DragEvent
  node: TreeData
  dragNode: TreeData
  dropPosition: -1 | 0 | 1
  dropToGap: boolean
}

export interface TreeRightClickInfo {
  event: React.MouseEvent
  node: TreeData
}

export interface TreeProps {
  treeData?: TreeData[]
  fieldNames?: TreeFieldNames

  checkable?: boolean
  checkedKeys?: (string | number)[] | TreeCheckedKeys
  defaultCheckedKeys?: (string | number)[]
  checkStrictly?: boolean

  selectable?: boolean
  selectedKeys?: (string | number)[]
  defaultSelectedKeys?: (string | number)[]
  multiple?: boolean

  expandedKeys?: (string | number)[]
  defaultExpandedKeys?: (string | number)[]
  defaultExpandAll?: boolean
  autoExpandParent?: boolean

  showLine?: boolean | { showLeafIcon?: ReactNode }
  showIcon?: boolean
  icon?: ReactNode | ((props: { selected: boolean; expanded: boolean; isLeaf: boolean }) => ReactNode)
  switcherIcon?: ReactNode | ((props: { expanded: boolean; isLeaf: boolean }) => ReactNode)
  disabled?: boolean
  height?: number
  titleRender?: (node: TreeData) => ReactNode

  filterTreeNode?: (node: TreeData) => boolean
  loadData?: (node: TreeData) => Promise<void>

  draggable?: boolean | ((node: TreeData) => boolean) | { icon?: ReactNode; nodeDraggable?: (node: TreeData) => boolean }

  onSelect?: (selectedKeys: (string | number)[], info: TreeSelectInfo) => void
  onCheck?: (checkedKeys: (string | number)[] | TreeCheckedKeys, info: TreeCheckInfo) => void
  onExpand?: (expandedKeys: (string | number)[], info: TreeExpandInfo) => void
  onDragStart?: (info: TreeDragInfo) => void
  onDragEnter?: (info: TreeDragInfo) => void
  onDragOver?: (info: TreeDragInfo) => void
  onDragLeave?: (info: TreeDragInfo) => void
  onDragEnd?: (info: TreeDragInfo) => void
  onDrop?: (info: TreeDropInfo) => void
  onRightClick?: (info: TreeRightClickInfo) => void
  onLoad?: (loadedKeys: (string | number)[], info: { node: TreeData }) => void

  className?: string
  style?: CSSProperties
  classNames?: TreeClassNames
  styles?: TreeStyles
}

export interface DirectoryTreeProps extends TreeProps {
  expandAction?: 'click' | 'doubleClick' | false
}

// ============================================================================
// Icons
// ============================================================================

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SwitcherOpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SwitcherClosedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

function LoadingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function LeafIcon() {
  return <span style={{ display: 'inline-block', width: 12, height: 12 }} />
}

function FolderOpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2" />
      <path d="M2 10h20" />
    </svg>
  )
}

function FolderClosedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function DragHandleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" stroke="none">
      <circle cx="5.5" cy="3" r="1.5" />
      <circle cx="10.5" cy="3" r="1.5" />
      <circle cx="5.5" cy="8" r="1.5" />
      <circle cx="10.5" cy="8" r="1.5" />
      <circle cx="5.5" cy="13" r="1.5" />
      <circle cx="10.5" cy="13" r="1.5" />
    </svg>
  )
}

// ============================================================================
// Tree helpers (adapted from TreeSelect)
// ============================================================================

type FieldAccessor = { key: string; title: string; children: string }

function resolveFieldNames(fn?: TreeFieldNames): FieldAccessor {
  return {
    key: fn?.key ?? 'key',
    title: fn?.title ?? 'title',
    children: fn?.children ?? 'children',
  }
}

function getNodeKey(node: TreeData, fa: FieldAccessor): string | number {
  return node[fa.key] as string | number
}

function getNodeTitle(node: TreeData, fa: FieldAccessor): ReactNode {
  return node[fa.title] as ReactNode
}

function getNodeChildren(node: TreeData, fa: FieldAccessor): TreeData[] | undefined {
  const ch = node[fa.children]
  return Array.isArray(ch) ? ch as TreeData[] : undefined
}

function findNode(tree: TreeData[], key: string | number, fa: FieldAccessor): TreeData | undefined {
  for (const node of tree) {
    if (getNodeKey(node, fa) === key) return node
    const children = getNodeChildren(node, fa)
    if (children) {
      const found = findNode(children, key, fa)
      if (found) return found
    }
  }
  return undefined
}

function getDescendantKeys(node: TreeData, fa: FieldAccessor): (string | number)[] {
  const result: (string | number)[] = [getNodeKey(node, fa)]
  const children = getNodeChildren(node, fa)
  if (children) {
    for (const child of children) {
      result.push(...getDescendantKeys(child, fa))
    }
  }
  return result
}

function buildParentMap(tree: TreeData[], fa: FieldAccessor, parent: string | number | null = null): Map<string | number, string | number | null> {
  const map = new Map<string | number, string | number | null>()
  for (const node of tree) {
    const k = getNodeKey(node, fa)
    map.set(k, parent)
    const children = getNodeChildren(node, fa)
    if (children) {
      const childMap = buildParentMap(children, fa, k)
      childMap.forEach((v, ck) => map.set(ck, v))
    }
  }
  return map
}

type CheckState = 'unchecked' | 'checked' | 'indeterminate'

function getCheckState(node: TreeData, checkedSet: Set<string | number>, fa: FieldAccessor): CheckState {
  const children = getNodeChildren(node, fa)
  if (!children || children.length === 0) {
    return checkedSet.has(getNodeKey(node, fa)) ? 'checked' : 'unchecked'
  }
  let allChecked = true
  let anyChecked = false
  for (const child of children) {
    const state = getCheckState(child, checkedSet, fa)
    if (state === 'checked') anyChecked = true
    else if (state === 'indeterminate') { anyChecked = true; allChecked = false }
    else allChecked = false
  }
  if (allChecked && anyChecked) return 'checked'
  if (anyChecked) return 'indeterminate'
  return 'unchecked'
}

function cascadeCheck(
  nodeKey: string | number,
  checked: boolean,
  currentChecked: Set<string | number>,
  tree: TreeData[],
  fa: FieldAccessor,
): Set<string | number> {
  const newSet = new Set(currentChecked)
  const node = findNode(tree, nodeKey, fa)
  if (!node) return newSet

  const descendants = getDescendantKeys(node, fa)
  for (const dk of descendants) {
    const dNode = findNode(tree, dk, fa)
    if (dNode?.disabled || dNode?.disableCheckbox) continue
    if (checked) newSet.add(dk)
    else newSet.delete(dk)
  }

  const parentMap = buildParentMap(tree, fa)
  let current = parentMap.get(nodeKey)
  while (current !== null && current !== undefined) {
    const parentNode = findNode(tree, current, fa)
    if (!parentNode) break
    const siblings = getNodeChildren(parentNode, fa) ?? []
    const allSiblingsChecked = siblings.every((s) => {
      if (s.disabled || s.disableCheckbox) return true
      return newSet.has(getNodeKey(s, fa))
    })
    if (allSiblingsChecked) newSet.add(current)
    else newSet.delete(current)
    current = parentMap.get(current)
  }

  return newSet
}

function getDefaultExpandedKeys(tree: TreeData[], fa: FieldAccessor, expandAll?: boolean): (string | number)[] {
  if (!expandAll) return []
  const keys: (string | number)[] = []
  function walk(nodes: TreeData[]) {
    for (const node of nodes) {
      const children = getNodeChildren(node, fa)
      if (children && children.length > 0) {
        keys.push(getNodeKey(node, fa))
        walk(children)
      }
    }
  }
  walk(tree)
  return keys
}

function getAutoExpandParentKeys(
  keys: (string | number)[],
  tree: TreeData[],
  fa: FieldAccessor,
): (string | number)[] {
  const parentMap = buildParentMap(tree, fa)
  const result = new Set(keys)
  for (const key of keys) {
    let current = parentMap.get(key)
    while (current !== null && current !== undefined) {
      result.add(current)
      current = parentMap.get(current)
    }
  }
  return Array.from(result)
}

function getHalfCheckedKeys(tree: TreeData[], checkedSet: Set<string | number>, fa: FieldAccessor): (string | number)[] {
  const result: (string | number)[] = []
  function walk(nodes: TreeData[]) {
    for (const node of nodes) {
      const children = getNodeChildren(node, fa)
      if (children && children.length > 0) {
        const state = getCheckState(node, checkedSet, fa)
        if (state === 'indeterminate') result.push(getNodeKey(node, fa))
        walk(children)
      }
    }
  }
  walk(tree)
  return result
}

function collectNodes(tree: TreeData[], keys: Set<string | number>, fa: FieldAccessor): TreeData[] {
  const result: TreeData[] = []
  function walk(nodes: TreeData[]) {
    for (const node of nodes) {
      if (keys.has(getNodeKey(node, fa))) result.push(node)
      const children = getNodeChildren(node, fa)
      if (children) walk(children)
    }
  }
  walk(tree)
  return result
}

// ============================================================================
// Flat visible list (for keyboard nav)
// ============================================================================

interface FlatNode {
  node: TreeData
  key: string | number
  depth: number
  isLastChild: boolean
  parentIsLast: boolean[]
}

function collectVisible(
  nodes: TreeData[],
  fa: FieldAccessor,
  expandedSet: Set<string | number>,
  depth: number,
  parentIsLast: boolean[] = [],
): FlatNode[] {
  const result: FlatNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const k = getNodeKey(node, fa)
    const isLast = i === nodes.length - 1
    result.push({ node, key: k, depth, isLastChild: isLast, parentIsLast: [...parentIsLast] })
    const children = getNodeChildren(node, fa)
    if (children && expandedSet.has(k)) {
      result.push(...collectVisible(children, fa, expandedSet, depth + 1, [...parentIsLast, isLast]))
    }
  }
  return result
}

// ============================================================================
// TreeNodeRow
// ============================================================================

interface TreeNodeRowProps {
  node: TreeData
  depth: number
  fa: FieldAccessor
  treeData: TreeData[]

  expandedKeys: Set<string | number>
  onToggleExpand: (key: string | number, node: TreeData) => void

  selectable: boolean
  selectedKeys: Set<string | number>
  multiple: boolean
  onSelect: (key: string | number, node: TreeData, event: React.MouseEvent) => void

  checkable: boolean
  checkedSet: Set<string | number>
  checkStrictly: boolean
  onCheck: (key: string | number, node: TreeData, event: React.MouseEvent) => void

  showLine: boolean
  showLeafIcon?: ReactNode
  showIcon: boolean
  defaultIcon?: ReactNode | ((props: { selected: boolean; expanded: boolean; isLeaf: boolean }) => ReactNode)
  switcherIcon?: ReactNode | ((props: { expanded: boolean; isLeaf: boolean }) => ReactNode)
  titleRender?: (node: TreeData) => ReactNode
  filterTreeNode?: (node: TreeData) => boolean

  loadData?: (node: TreeData) => Promise<void>
  loadingKeys: Set<string | number>
  loadedKeys: Set<string | number>

  draggableEnabled: boolean
  isDraggable: (node: TreeData) => boolean
  dragIcon?: ReactNode
  onDragStartNode?: (event: React.DragEvent, node: TreeData) => void
  onDragEnterNode?: (event: React.DragEvent, node: TreeData) => void
  onDragOverNode?: (event: React.DragEvent, node: TreeData) => void
  onDragLeaveNode?: (event: React.DragEvent, node: TreeData) => void
  onDragEndNode?: (event: React.DragEvent, node: TreeData) => void
  onDropNode?: (event: React.DragEvent, node: TreeData) => void
  dragOverKey: string | number | null
  dropPosition: -1 | 0 | 1

  onRightClick?: (event: React.MouseEvent, node: TreeData) => void
  expandAction?: 'click' | 'doubleClick' | false

  isLastChild: boolean
  parentIsLast: boolean[]
  disabled: boolean
  focusedKey: string | number | null

  nodeStyle?: CSSProperties
  nodeClassName?: string
  renderChildren?: boolean
}

function TreeNodeRow({
  node,
  depth,
  fa,
  treeData,
  expandedKeys,
  onToggleExpand,
  selectable,
  selectedKeys,
  multiple: _multiple,
  onSelect,
  checkable: globalCheckable,
  checkedSet,
  checkStrictly,
  onCheck,
  showLine,
  showLeafIcon,
  showIcon,
  defaultIcon,
  switcherIcon,
  titleRender,
  filterTreeNode,
  loadData,
  loadingKeys,
  loadedKeys,
  draggableEnabled,
  isDraggable,
  dragIcon,
  onDragStartNode,
  onDragEnterNode,
  onDragOverNode,
  onDragLeaveNode,
  onDragEndNode,
  onDropNode,
  dragOverKey,
  dropPosition,
  onRightClick,
  expandAction,
  isLastChild,
  parentIsLast,
  disabled: globalDisabled,
  focusedKey,
  nodeStyle,
  nodeClassName,
  renderChildren = true,
}: TreeNodeRowProps) {
  const k = getNodeKey(node, fa)
  const title = getNodeTitle(node, fa)
  const children = getNodeChildren(node, fa)
  const hasChildren = (children && children.length > 0) || (loadData && !node.isLeaf && !loadedKeys.has(k))
  const isExpanded = expandedKeys.has(k)
  const isLoading = loadingKeys.has(k)
  const isDisabled = globalDisabled || !!node.disabled
  const isSelectable = selectable && node.selectable !== false
  const isSelected = selectedKeys.has(k)
  const nodeCheckable = globalCheckable && node.checkable !== false
  const isFiltered = filterTreeNode ? !filterTreeNode(node) : false
  const isFocused = focusedKey === k
  const isLeaf = !hasChildren
  const canDrag = draggableEnabled && isDraggable(node)
  const isDragOver = dragOverKey === k

  const checkState: CheckState = nodeCheckable
    ? (checkStrictly
      ? (checkedSet.has(k) ? 'checked' : 'unchecked')
      : getCheckState(node, checkedSet, fa))
    : 'unchecked'

  const rowRef = useRef<HTMLDivElement>(null)

  // Ref-based hover
  const handleMouseEnter = useCallback(() => {
    if (isDisabled || !rowRef.current) return
    if (nodeStyle && ('backgroundColor' in nodeStyle || 'borderColor' in nodeStyle || 'border' in nodeStyle)) {
      rowRef.current.style.filter = 'brightness(1.15)'
    } else {
      rowRef.current.style.backgroundColor = tokens.colorBgMuted
    }
  }, [isDisabled, nodeStyle])

  const handleMouseLeave = useCallback(() => {
    if (!rowRef.current) return
    if (nodeStyle && ('backgroundColor' in nodeStyle || 'borderColor' in nodeStyle || 'border' in nodeStyle)) {
      rowRef.current.style.filter = ''
    } else {
      rowRef.current.style.backgroundColor = isSelected ? tokens.colorPrimary50 : ''
    }
  }, [nodeStyle, isSelected])

  const handleSwitcherClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading) return
    onToggleExpand(k, node)
  }, [k, node, isLoading, onToggleExpand])

  const handleRowClick = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return
    if (nodeCheckable) {
      if (!node.disableCheckbox) onCheck(k, node, e)
    } else if (isSelectable) {
      onSelect(k, node, e)
    }
    if (expandAction === 'click' && hasChildren) {
      onToggleExpand(k, node)
    }
  }, [isDisabled, nodeCheckable, isSelectable, k, node, onCheck, onSelect, expandAction, hasChildren, onToggleExpand])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return
    if (expandAction === 'doubleClick' && hasChildren) {
      onToggleExpand(k, node)
    }
    e.preventDefault()
  }, [isDisabled, expandAction, hasChildren, k, node, onToggleExpand])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (onRightClick) {
      e.preventDefault()
      onRightClick(e, node)
    }
  }, [onRightClick, node])

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(k))
    onDragStartNode?.(e, node)
  }, [k, node, onDragStartNode])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragOverNode?.(e, node)
  }, [node, onDragOverNode])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragEnterNode?.(e, node)
  }, [node, onDragEnterNode])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    onDragLeaveNode?.(e, node)
  }, [node, onDragLeaveNode])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    onDragEndNode?.(e, node)
  }, [node, onDragEndNode])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDropNode?.(e, node)
  }, [node, onDropNode])

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '1.75rem',
    padding: showLine ? '0 0.5rem' : '0.125rem 0.5rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : isFiltered ? 0.4 : 1,
    borderRadius: '0.25rem',
    transition: 'background-color 0.1s',
    outline: isFocused ? `2px solid ${tokens.colorPrimary}` : 'none',
    outlineOffset: -2,
    backgroundColor: isSelected ? tokens.colorPrimary50 : undefined,
    position: 'relative',
    ...nodeStyle,
  }

  // Drop indicator
  const dropIndicatorStyle: CSSProperties | undefined = isDragOver
    ? dropPosition === 0
      ? { outline: `2px solid ${tokens.colorPrimary}`, outlineOffset: -2, borderRadius: '0.25rem' }
      : undefined
    : undefined

  if (dropIndicatorStyle) {
    Object.assign(rowStyle, dropIndicatorStyle)
  }

  const lineStyle = `2px solid ${tokens.colorBorder}`

  // Indent + tree lines
  const renderIndent = () => {
    const indents: ReactNode[] = []
    for (let i = 0; i < depth; i++) {
      if (showLine) {
        const showVerticalLine = !parentIsLast[i]
        indents.push(
          <span
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '1.5rem',
              alignSelf: 'stretch',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {showVerticalLine && (
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: 0,
                bottom: 0,
                borderLeft: lineStyle,
              }} />
            )}
          </span>,
        )
      } else {
        indents.push(
          <span key={i} style={{ display: 'inline-block', width: '1.5rem', flexShrink: 0 }} />,
        )
      }
    }
    return indents
  }

  // Switcher
  const renderSwitcher = () => {
    const switcherBase: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.5rem',
      flexShrink: 0,
    }

    const resolvedSwitcherIcon = typeof switcherIcon === 'function'
      ? switcherIcon({ expanded: isExpanded, isLeaf })
      : switcherIcon

    if (!hasChildren) {
      if (showLine && depth > 0) {
        return (
          <span style={{ ...switcherBase, alignSelf: 'stretch', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: 0, height: '50%', borderLeft: lineStyle }} />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', width: '0.75rem', borderTop: lineStyle }} />
            {!isLastChild && (
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', bottom: 0, borderLeft: lineStyle }} />
            )}
            {showLeafIcon !== undefined && (
              <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.colorBg }}>
                {showLeafIcon}
              </span>
            )}
          </span>
        )
      }
      if (showLine) {
        return <span style={switcherBase}>{showLeafIcon ?? null}</span>
      }
      return <span style={switcherBase}><LeafIcon /></span>
    }

    const iconContent = isLoading
      ? <LoadingIcon />
      : resolvedSwitcherIcon
        ? resolvedSwitcherIcon
        : isExpanded ? <SwitcherOpenIcon /> : <SwitcherClosedIcon />

    if (showLine && depth > 0) {
      return (
        <span
          onClick={handleSwitcherClick}
          style={{
            ...switcherBase,
            alignSelf: 'stretch',
            position: 'relative',
            cursor: 'pointer',
            color: tokens.colorTextMuted,
          }}
        >
          <span style={{ position: 'absolute', left: '0.75rem', top: 0, height: '50%', borderLeft: lineStyle }} />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', width: '0.75rem', borderTop: lineStyle }} />
          {!isLastChild && (
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', bottom: 0, borderLeft: lineStyle }} />
          )}
          <span style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1rem',
            height: '1rem',
            backgroundColor: tokens.colorBg,
            borderRadius: '0.125rem',
          }}>
            {iconContent}
          </span>
        </span>
      )
    }

    if (showLine) {
      return (
        <span
          onClick={handleSwitcherClick}
          style={{ ...switcherBase, cursor: 'pointer', color: tokens.colorTextMuted }}
        >
          {iconContent}
        </span>
      )
    }

    return (
      <span
        onClick={handleSwitcherClick}
        style={{ ...switcherBase, cursor: 'pointer', color: tokens.colorTextMuted }}
      >
        {iconContent}
      </span>
    )
  }

  // Checkbox
  const renderCheckbox = () => {
    if (!nodeCheckable) return null
    const isCheckDisabled = isDisabled || !!node.disableCheckbox
    const boxStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '0.875rem',
      height: '0.875rem',
      borderRadius: '0.1875rem',
      border: `1.5px solid ${checkState !== 'unchecked' ? tokens.colorPrimary : tokens.colorBorder}`,
      backgroundColor: checkState !== 'unchecked' ? tokens.colorPrimary : 'transparent',
      color: '#fff',
      marginRight: '0.375rem',
      flexShrink: 0,
      transition: 'all 0.15s ease',
      cursor: isCheckDisabled ? 'not-allowed' : 'pointer',
      opacity: isCheckDisabled ? 0.5 : 1,
    }
    return (
      <span style={boxStyle}>
        {checkState === 'checked' && <CheckIcon />}
        {checkState === 'indeterminate' && <MinusIcon />}
      </span>
    )
  }

  // Icon
  const renderIcon = () => {
    if (!showIcon) return null
    const iconElement = node.icon
      ? (typeof node.icon === 'function' ? node.icon({ selected: isSelected, expanded: isExpanded }) : node.icon)
      : defaultIcon
        ? (typeof defaultIcon === 'function' ? defaultIcon({ selected: isSelected, expanded: isExpanded, isLeaf }) : defaultIcon)
        : null
    if (!iconElement) return null
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '0.25rem',
        flexShrink: 0,
        color: tokens.colorTextMuted,
      }}>
        {iconElement}
      </span>
    )
  }

  // Title
  const renderTitle = () => {
    const content = titleRender ? titleRender(node) : title
    return (
      <span style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.8125rem',
        ...(isSelected ? { color: tokens.colorPrimary, fontWeight: 600 } : {}),
      }}>
        {content}
      </span>
    )
  }

  // Drag handle
  const renderDragHandle = () => {
    if (!canDrag) return null
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '0.25rem',
        color: tokens.colorTextSubtle,
        cursor: 'grab',
        flexShrink: 0,
      }}>
        {dragIcon ?? <DragHandleIcon />}
      </span>
    )
  }

  return (
    <>
      <div
        ref={rowRef}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        style={rowStyle}
        className={nodeClassName}
        onClick={handleRowClick}
        onDoubleClick={expandAction === 'doubleClick' ? handleDoubleClick : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={onRightClick ? handleContextMenu : undefined}
        draggable={canDrag}
        onDragStart={canDrag ? handleDragStart : undefined}
        onDragOver={draggableEnabled ? handleDragOver : undefined}
        onDragEnter={draggableEnabled ? handleDragEnter : undefined}
        onDragLeave={draggableEnabled ? handleDragLeave : undefined}
        onDragEnd={canDrag ? handleDragEnd : undefined}
        onDrop={draggableEnabled ? handleDrop : undefined}
        data-key={k}
      >
        {/* Drop indicator line — before */}
        {isDragOver && dropPosition === -1 && (
          <span style={{
            position: 'absolute',
            top: 0,
            left: `${depth * 1.5 + 1.5}rem`,
            right: 0,
            height: 2,
            backgroundColor: tokens.colorPrimary,
            borderRadius: 1,
          }} />
        )}

        {renderDragHandle()}
        {renderIndent()}
        {renderSwitcher()}
        {renderCheckbox()}
        {renderIcon()}
        {renderTitle()}

        {/* Drop indicator line — after */}
        {isDragOver && dropPosition === 1 && (
          <span style={{
            position: 'absolute',
            bottom: 0,
            left: `${depth * 1.5 + 1.5}rem`,
            right: 0,
            height: 2,
            backgroundColor: tokens.colorPrimary,
            borderRadius: 1,
          }} />
        )}
      </div>
      {renderChildren && children && children.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease-out',
        }}>
          <div style={{ overflow: 'hidden' }}>
            {children.map((child, idx) => (
              <TreeNodeRow
                key={String(getNodeKey(child, fa))}
                node={child}
                depth={depth + 1}
                fa={fa}
                treeData={treeData}
                expandedKeys={expandedKeys}
                onToggleExpand={onToggleExpand}
                selectable={selectable}
                selectedKeys={selectedKeys}
                multiple={_multiple}
                onSelect={onSelect}
                checkable={globalCheckable}
                checkedSet={checkedSet}
                checkStrictly={checkStrictly}
                onCheck={onCheck}
                showLine={showLine}
                showLeafIcon={showLeafIcon}
                showIcon={showIcon}
                defaultIcon={defaultIcon}
                switcherIcon={switcherIcon}
                titleRender={titleRender}
                filterTreeNode={filterTreeNode}
                loadData={loadData}
                loadingKeys={loadingKeys}
                loadedKeys={loadedKeys}
                draggableEnabled={draggableEnabled}
                isDraggable={isDraggable}
                dragIcon={dragIcon}
                onDragStartNode={onDragStartNode}
                onDragEnterNode={onDragEnterNode}
                onDragOverNode={onDragOverNode}
                onDragLeaveNode={onDragLeaveNode}
                onDragEndNode={onDragEndNode}
                onDropNode={onDropNode}
                dragOverKey={dragOverKey}
                dropPosition={dropPosition}
                onRightClick={onRightClick}
                expandAction={expandAction}
                isLastChild={idx === children.length - 1}
                parentIsLast={[...parentIsLast, isLastChild]}
                disabled={globalDisabled}
                focusedKey={focusedKey}
                nodeStyle={nodeStyle}
                nodeClassName={nodeClassName}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================================
// TreeComponent
// ============================================================================

function TreeComponent({
  treeData = [],
  fieldNames: fieldNamesProp,
  checkable = false,
  checkedKeys: controlledCheckedKeys,
  defaultCheckedKeys,
  checkStrictly = false,
  selectable = true,
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  multiple = false,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys: defaultExpandedKeysProp,
  defaultExpandAll = false,
  autoExpandParent = false,
  showLine: showLineProp = false,
  showIcon = false,
  icon: defaultIcon,
  switcherIcon,
  disabled = false,
  height,
  titleRender,
  filterTreeNode,
  loadData,
  draggable: draggableProp = false,
  onSelect,
  onCheck,
  onExpand,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  onRightClick,
  onLoad,
  className,
  style,
  classNames,
  styles,
}: TreeProps) {
  const fa = useMemo(() => resolveFieldNames(fieldNamesProp), [fieldNamesProp])

  // ── Show line ──
  const showLine = !!showLineProp
  const showLeafIcon = typeof showLineProp === 'object' ? showLineProp.showLeafIcon : undefined

  // ── Draggable ──
  const draggableEnabled = !!draggableProp
  const isDraggable = useCallback((node: TreeData): boolean => {
    if (!draggableProp) return false
    if (typeof draggableProp === 'function') return draggableProp(node)
    if (typeof draggableProp === 'object' && draggableProp.nodeDraggable) return draggableProp.nodeDraggable(node)
    return true
  }, [draggableProp])
  const dragIcon = typeof draggableProp === 'object' ? draggableProp.icon : undefined

  // ── Expanded keys ──
  const isControlledExpanded = controlledExpandedKeys !== undefined
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>(() => {
    const base = defaultExpandedKeysProp ?? getDefaultExpandedKeys(treeData, fa, defaultExpandAll)
    return autoExpandParent ? getAutoExpandParentKeys(base, treeData, fa) : base
  })
  const expandedKeysArray = isControlledExpanded ? controlledExpandedKeys! : internalExpanded
  const expandedKeysSet = useMemo(() => new Set(expandedKeysArray), [expandedKeysArray])

  // ── Selected keys ──
  const isControlledSelected = controlledSelectedKeys !== undefined
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>(
    () => defaultSelectedKeys ?? [],
  )
  const currentSelectedKeys = isControlledSelected ? controlledSelectedKeys! : internalSelected
  const selectedSet = useMemo(() => new Set(currentSelectedKeys), [currentSelectedKeys])

  // ── Checked keys ──
  const isControlledChecked = controlledCheckedKeys !== undefined
  const [internalChecked, setInternalChecked] = useState<(string | number)[]>(
    () => defaultCheckedKeys ?? [],
  )
  const resolveCheckedArray = (ck: typeof controlledCheckedKeys): (string | number)[] => {
    if (!ck) return []
    if (Array.isArray(ck)) return ck
    return ck.checked
  }
  const currentCheckedArray = isControlledChecked ? resolveCheckedArray(controlledCheckedKeys) : internalChecked
  const checkedSet = useMemo(() => new Set(currentCheckedArray), [currentCheckedArray])

  // ── Loading ──
  const [loadingKeys, setLoadingKeys] = useState<Set<string | number>>(new Set())
  const [loadedKeys, setLoadedKeys] = useState<Set<string | number>>(new Set())

  // ── Drag state ──
  const [dragNodeKey, setDragNodeKey] = useState<string | number | null>(null)
  const [dragOverKey, setDragOverKey] = useState<string | number | null>(null)
  const [dropPositionState, setDropPositionState] = useState<-1 | 0 | 1>(0)

  // ── Focus ──
  const [focusedKey, setFocusedKey] = useState<string | number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const isMouseFocusRef = useRef(false)

  // ── Virtual scroll ──
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  // ── Visible flat list ──
  const visibleNodes = useMemo(
    () => collectVisible(treeData, fa, expandedKeysSet, 0),
    [treeData, fa, expandedKeysSet],
  )

  // ── Handlers ──
  const handleToggleExpand = useCallback((key: string | number, node: TreeData) => {
    const isExpanded = expandedKeysSet.has(key)

    // Async load
    if (loadData && !isExpanded && !loadedKeys.has(key) && !node.isLeaf) {
      setLoadingKeys(prev => { const s = new Set(prev); s.add(key); return s })
      loadData(node).then(() => {
        setLoadingKeys(prev => { const s = new Set(prev); s.delete(key); return s })
        setLoadedKeys(prev => { const s = new Set(prev); s.add(key); return s })
        onLoad?.(Array.from(new Set([...loadedKeys, key])), { node })
      })
    }

    const newKeys = isExpanded
      ? expandedKeysArray.filter(k => k !== key)
      : [...expandedKeysArray, key]

    if (!isControlledExpanded) setInternalExpanded(newKeys)
    onExpand?.(newKeys, { expanded: !isExpanded, node })
  }, [expandedKeysSet, expandedKeysArray, isControlledExpanded, loadData, loadedKeys, onExpand, onLoad])

  const handleSelect = useCallback((key: string | number, node: TreeData, event: React.MouseEvent) => {
    let newKeys: (string | number)[]
    if (multiple) {
      newKeys = selectedSet.has(key)
        ? currentSelectedKeys.filter(k => k !== key)
        : [...currentSelectedKeys, key]
    } else {
      newKeys = selectedSet.has(key) ? [] : [key]
    }
    if (!isControlledSelected) setInternalSelected(newKeys)
    const selectedNodes = collectNodes(treeData, new Set(newKeys), fa)
    onSelect?.(newKeys, { selected: !selectedSet.has(key), selectedNodes, node, event })
  }, [multiple, selectedSet, currentSelectedKeys, isControlledSelected, treeData, fa, onSelect])

  const handleCheck = useCallback((key: string | number, node: TreeData, event: React.MouseEvent) => {
    const isChecked = checkedSet.has(key)
    let newCheckedArray: (string | number)[]

    if (checkStrictly) {
      newCheckedArray = isChecked
        ? currentCheckedArray.filter(k => k !== key)
        : [...currentCheckedArray, key]
    } else {
      const newSet = cascadeCheck(key, !isChecked, checkedSet, treeData, fa)
      newCheckedArray = Array.from(newSet)
    }

    if (!isControlledChecked) setInternalChecked(newCheckedArray)

    const newCheckedSet = new Set(newCheckedArray)
    const checkedNodes = collectNodes(treeData, newCheckedSet, fa)
    const halfCheckedKeys = checkStrictly ? [] : getHalfCheckedKeys(treeData, newCheckedSet, fa)

    if (checkStrictly) {
      onCheck?.({ checked: newCheckedArray, halfChecked: halfCheckedKeys }, {
        checked: !isChecked,
        checkedNodes,
        node,
        event,
        halfCheckedKeys,
      })
    } else {
      onCheck?.(newCheckedArray, {
        checked: !isChecked,
        checkedNodes,
        node,
        event,
        halfCheckedKeys,
      })
    }
  }, [checkedSet, currentCheckedArray, isControlledChecked, checkStrictly, treeData, fa, onCheck])

  // ── Drag handlers ──
  const handleDragStartNode = useCallback((event: React.DragEvent, node: TreeData) => {
    setDragNodeKey(getNodeKey(node, fa))
    onDragStart?.({ event, node })
  }, [fa, onDragStart])

  const handleDragEnterNode = useCallback((event: React.DragEvent, node: TreeData) => {
    const k = getNodeKey(node, fa)
    setDragOverKey(k)
    onDragEnter?.({ event, node })
  }, [fa, onDragEnter])

  const handleDragOverNode = useCallback((event: React.DragEvent, node: TreeData) => {
    const k = getNodeKey(node, fa)
    setDragOverKey(k)

    // Calculate drop position from mouse Y
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const relY = event.clientY - rect.top
    const height = rect.height
    if (relY < height * 0.25) setDropPositionState(-1)
    else if (relY > height * 0.75) setDropPositionState(1)
    else setDropPositionState(0)

    onDragOver?.({ event, node })
  }, [fa, onDragOver])

  const handleDragLeaveNode = useCallback((_event: React.DragEvent, node: TreeData) => {
    onDragLeave?.({ event: _event, node })
  }, [onDragLeave])

  const handleDragEndNode = useCallback((_event: React.DragEvent, node: TreeData) => {
    setDragNodeKey(null)
    setDragOverKey(null)
    onDragEnd?.({ event: _event, node })
  }, [onDragEnd])

  const handleDropNode = useCallback((event: React.DragEvent, node: TreeData) => {
    const dragNode = dragNodeKey !== null ? findNode(treeData, dragNodeKey, fa) : undefined
    if (dragNode) {
      onDrop?.({
        event,
        node,
        dragNode,
        dropPosition: dropPositionState,
        dropToGap: dropPositionState !== 0,
      })
    }
    setDragNodeKey(null)
    setDragOverKey(null)
  }, [dragNodeKey, treeData, fa, dropPositionState, onDrop])

  // ── Keyboard ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!visibleNodes.length) return

    const currentIndex = focusedKey !== null
      ? visibleNodes.findIndex(n => n.key === focusedKey)
      : -1

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0
        setFocusedKey(visibleNodes[next].key)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = currentIndex > 0 ? currentIndex - 1 : visibleNodes.length - 1
        setFocusedKey(visibleNodes[prev].key)
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (currentIndex >= 0) {
          const node = visibleNodes[currentIndex]
          const children = getNodeChildren(node.node, fa)
          if (children && children.length > 0) {
            if (!expandedKeysSet.has(node.key)) {
              handleToggleExpand(node.key, node.node)
            } else {
              // Move to first child
              const childKey = getNodeKey(children[0], fa)
              setFocusedKey(childKey)
            }
          }
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (currentIndex >= 0) {
          const node = visibleNodes[currentIndex]
          if (expandedKeysSet.has(node.key)) {
            handleToggleExpand(node.key, node.node)
          } else {
            // Move to parent
            const parentMap = buildParentMap(treeData, fa)
            const parentKey = parentMap.get(node.key)
            if (parentKey !== null && parentKey !== undefined) {
              setFocusedKey(parentKey)
            }
          }
        }
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        if (currentIndex >= 0) {
          const node = visibleNodes[currentIndex]
          if (checkable && node.node.checkable !== false && !node.node.disableCheckbox && !node.node.disabled) {
            handleCheck(node.key, node.node, e as unknown as React.MouseEvent)
          } else if (selectable && node.node.selectable !== false && !node.node.disabled) {
            handleSelect(node.key, node.node, e as unknown as React.MouseEvent)
          }
        }
        break
      }
      case 'Home': {
        e.preventDefault()
        if (visibleNodes.length > 0) setFocusedKey(visibleNodes[0].key)
        break
      }
      case 'End': {
        e.preventDefault()
        if (visibleNodes.length > 0) setFocusedKey(visibleNodes[visibleNodes.length - 1].key)
        break
      }
    }
  }, [visibleNodes, focusedKey, fa, expandedKeysSet, treeData, handleToggleExpand, checkable, selectable, handleCheck, handleSelect])

  const handleFocus = useCallback(() => {
    if (isMouseFocusRef.current) {
      isMouseFocusRef.current = false
      return
    }
    if (focusedKey === null && visibleNodes.length > 0) {
      setFocusedKey(visibleNodes[0].key)
    }
  }, [focusedKey, visibleNodes])

  const handleBlur = useCallback(() => {
    setFocusedKey(null)
  }, [])

  const handleMouseDown = useCallback(() => {
    isMouseFocusRef.current = true
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // ── Expand action (for DirectoryTree) — passed via internal __expandAction ──
  const expandAction = (style as any)?.__expandAction as ('click' | 'doubleClick' | false) | undefined

  // ── Root style ──
  const rootStyle: CSSProperties = {
    padding: '0.25rem',
    fontSize: '0.875rem',
    color: tokens.colorText,
    lineHeight: 1.5,
    outline: 'none',
  }

  // ── Shared row props factory ──
  const makeRowProps = (
    node: TreeData,
    depth: number,
    isLastChild: boolean,
    parentIsLastArr: boolean[],
  ) => ({
    node,
    depth,
    fa,
    treeData,
    expandedKeys: expandedKeysSet,
    onToggleExpand: handleToggleExpand,
    selectable,
    selectedKeys: selectedSet,
    multiple,
    onSelect: handleSelect,
    checkable,
    checkedSet,
    checkStrictly,
    onCheck: handleCheck,
    showLine,
    showLeafIcon,
    showIcon,
    defaultIcon,
    switcherIcon,
    titleRender,
    filterTreeNode,
    loadData,
    loadingKeys,
    loadedKeys,
    draggableEnabled,
    isDraggable,
    dragIcon,
    onDragStartNode: handleDragStartNode,
    onDragEnterNode: handleDragEnterNode,
    onDragOverNode: handleDragOverNode,
    onDragLeaveNode: handleDragLeaveNode,
    onDragEndNode: handleDragEndNode,
    onDropNode: handleDropNode,
    dragOverKey,
    dropPosition: dropPositionState,
    onRightClick: onRightClick ? (e: React.MouseEvent, n: TreeData) => onRightClick({ event: e, node: n }) : undefined,
    expandAction,
    isLastChild,
    parentIsLast: parentIsLastArr,
    disabled,
    focusedKey,
    nodeStyle: styles?.node,
    nodeClassName: classNames?.node,
  })

  // ── Virtual scroll rendering ──
  if (height !== undefined) {
    const ROW_HEIGHT = 28
    const totalHeight = visibleNodes.length * ROW_HEIGHT
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2)
    const endIndex = Math.min(visibleNodes.length, Math.ceil((scrollTop + height) / ROW_HEIGHT) + 2)

    return (
      <div
        ref={rootRef}
        role="tree"
        tabIndex={0}
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle({ ...rootStyle, width: '100%' }, styles?.root, style)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={scrollContainerRef}
          style={{ height, overflowY: 'auto' }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleNodes.slice(startIndex, endIndex).map((flatNode, i) => (
              <div
                key={String(flatNode.key)}
                style={{
                  position: 'absolute',
                  top: (startIndex + i) * ROW_HEIGHT,
                  left: 0,
                  right: 0,
                }}
              >
                <TreeNodeRow
                  {...makeRowProps(flatNode.node, flatNode.depth, flatNode.isLastChild, flatNode.parentIsLast)}
                  renderChildren={false}
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      role="tree"
      tabIndex={0}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
    >
      {treeData.map((node, idx) => (
        <TreeNodeRow
          key={String(getNodeKey(node, fa))}
          {...makeRowProps(node, 0, idx === treeData.length - 1, [])}
        />
      ))}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ============================================================================
// DirectoryTree
// ============================================================================

function DirectoryTreeComponent({
  expandAction = 'click',
  showIcon: showIconProp,
  icon: iconProp,
  multiple: multipleProp,
  style: styleProp,
  ...rest
}: DirectoryTreeProps) {
  const defaultDirIcon = useCallback(
    ({ expanded, isLeaf }: { selected: boolean; expanded: boolean; isLeaf: boolean }) => {
      if (isLeaf) return <FileIcon />
      return expanded ? <FolderOpenIcon /> : <FolderClosedIcon />
    },
    [],
  )

  // Pass expandAction through style hack (avoids adding prop to TreeProps)
  const mergedStyle = useMemo(() => ({
    ...styleProp,
    __expandAction: expandAction,
  } as CSSProperties), [styleProp, expandAction])

  return (
    <TreeComponent
      {...rest}
      showIcon={showIconProp ?? true}
      icon={iconProp ?? defaultDirIcon}
      multiple={multipleProp ?? true}
      style={mergedStyle}
    />
  )
}

// ============================================================================
// Export
// ============================================================================

export const Tree = Object.assign(TreeComponent, {
  DirectoryTree: DirectoryTreeComponent,
})
