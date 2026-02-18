import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
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

export interface TreeSelectTreeData {
  value: string | number
  title?: ReactNode
  children?: TreeSelectTreeData[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  isLeaf?: boolean
  [key: string]: unknown
}

export type TreeSelectSize = 'large' | 'middle' | 'small'
export type TreeSelectVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
export type TreeSelectStatus = 'error' | 'warning'
export type TreeSelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type TreeSelectShowCheckedStrategy = 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'

export type TreeSelectSemanticSlot = 'root' | 'selector' | 'dropdown' | 'tree' | 'node' | 'tag'
export type TreeSelectClassNames = SemanticClassNames<TreeSelectSemanticSlot>
export type TreeSelectStyles = SemanticStyles<TreeSelectSemanticSlot>

export interface TreeSelectFieldNames {
  label?: string
  value?: string
  children?: string
}

export interface TreeSelectTagRenderProps {
  label: ReactNode
  value: string | number
  closable: boolean
  onClose: () => void
}

export interface TreeSelectProps {
  // Data
  treeData?: TreeSelectTreeData[]
  fieldNames?: TreeSelectFieldNames

  // Value
  value?: string | number | (string | number)[]
  defaultValue?: string | number | (string | number)[]
  onChange?: (value: any, labelList: ReactNode[], extra: { triggerValue: string | number }) => void

  // Selection mode
  multiple?: boolean
  treeCheckable?: boolean
  treeCheckStrictly?: boolean
  showCheckedStrategy?: TreeSelectShowCheckedStrategy

  // Tree behavior
  treeDefaultExpandAll?: boolean
  treeDefaultExpandedKeys?: (string | number)[]
  treeExpandedKeys?: (string | number)[]
  onTreeExpand?: (expandedKeys: (string | number)[]) => void
  loadData?: (node: TreeSelectTreeData) => Promise<void>
  treeLine?: boolean
  switcherIcon?: ReactNode

  // Search
  showSearch?: boolean
  filterTreeNode?: boolean | ((inputValue: string, treeNode: TreeSelectTreeData) => boolean)
  treeNodeFilterProp?: string

  // Display
  allowClear?: boolean
  placeholder?: string
  disabled?: boolean
  size?: TreeSelectSize
  variant?: TreeSelectVariant
  status?: TreeSelectStatus
  placement?: TreeSelectPlacement
  maxCount?: number
  maxTagCount?: number
  maxTagPlaceholder?: ReactNode | ((omittedValues: (string | number)[]) => ReactNode)
  tagRender?: (props: TreeSelectTagRenderProps) => ReactNode
  notFoundContent?: ReactNode
  listHeight?: number
  popupMatchSelectWidth?: boolean | number
  dropdownRender?: (menu: ReactNode) => ReactNode
  suffixIcon?: ReactNode
  prefix?: ReactNode

  // Callbacks
  onSearch?: (value: string) => void
  onDropdownVisibleChange?: (open: boolean) => void
  onClear?: () => void

  // Standard
  open?: boolean
  className?: string
  style?: CSSProperties
  classNames?: TreeSelectClassNames
  styles?: TreeSelectStyles
}

// ============================================================================
// Icons
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

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

function CloseTagIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

// ============================================================================
// Size config
// ============================================================================

const sizeConfig: Record<TreeSelectSize, { height: string; fontSize: string; padding: string; tagLineHeight: string }> = {
  large: { height: '2.5rem', fontSize: '1rem', padding: '0.5rem 0.75rem', tagLineHeight: '1.75rem' },
  middle: { height: '2.25rem', fontSize: '0.875rem', padding: '0.375rem 0.75rem', tagLineHeight: '1.5rem' },
  small: { height: '1.75rem', fontSize: '0.875rem', padding: '0.125rem 0.5rem', tagLineHeight: '1rem' },
}

// ============================================================================
// Tree helpers
// ============================================================================

type FieldAccessor = Required<TreeSelectFieldNames>

function resolveFieldNames(fn?: TreeSelectFieldNames): FieldAccessor {
  return {
    label: fn?.label ?? 'title',
    value: fn?.value ?? 'value',
    children: fn?.children ?? 'children',
  }
}

function getNodeValue(node: TreeSelectTreeData, fa: FieldAccessor): string | number {
  return node[fa.value] as string | number
}

function getNodeLabel(node: TreeSelectTreeData, fa: FieldAccessor): ReactNode {
  return node[fa.label] as ReactNode
}

function getNodeChildren(node: TreeSelectTreeData, fa: FieldAccessor): TreeSelectTreeData[] | undefined {
  const ch = node[fa.children]
  return Array.isArray(ch) ? ch as TreeSelectTreeData[] : undefined
}

function findNode(tree: TreeSelectTreeData[], value: string | number, fa: FieldAccessor): TreeSelectTreeData | undefined {
  for (const node of tree) {
    if (getNodeValue(node, fa) === value) return node
    const children = getNodeChildren(node, fa)
    if (children) {
      const found = findNode(children, value, fa)
      if (found) return found
    }
  }
  return undefined
}

function getLabelByValue(tree: TreeSelectTreeData[], value: string | number, fa: FieldAccessor): ReactNode {
  const node = findNode(tree, value, fa)
  return node ? getNodeLabel(node, fa) : String(value)
}

interface FlatNode {
  node: TreeSelectTreeData
  value: string | number
  depth: number
  parentValue: string | number | null
}

/** Get all descendant values (including self) */
function getDescendantValues(node: TreeSelectTreeData, fa: FieldAccessor): (string | number)[] {
  const result: (string | number)[] = [getNodeValue(node, fa)]
  const children = getNodeChildren(node, fa)
  if (children) {
    for (const child of children) {
      result.push(...getDescendantValues(child, fa))
    }
  }
  return result
}

/** Get leaf-only values under a node */
function getLeafValues(node: TreeSelectTreeData, fa: FieldAccessor): (string | number)[] {
  const children = getNodeChildren(node, fa)
  if (!children || children.length === 0) return [getNodeValue(node, fa)]
  const result: (string | number)[] = []
  for (const child of children) {
    result.push(...getLeafValues(child, fa))
  }
  return result
}

/** Build parent map: childValue → parentValue */
function buildParentMap(tree: TreeSelectTreeData[], fa: FieldAccessor, parent: string | number | null = null): Map<string | number, string | number | null> {
  const map = new Map<string | number, string | number | null>()
  for (const node of tree) {
    const val = getNodeValue(node, fa)
    map.set(val, parent)
    const children = getNodeChildren(node, fa)
    if (children) {
      const childMap = buildParentMap(children, fa, val)
      childMap.forEach((v, k) => map.set(k, v))
    }
  }
  return map
}

type CheckState = 'unchecked' | 'checked' | 'indeterminate'

function getCheckState(
  node: TreeSelectTreeData,
  checkedSet: Set<string | number>,
  fa: FieldAccessor,
): CheckState {
  const children = getNodeChildren(node, fa)
  if (!children || children.length === 0) {
    return checkedSet.has(getNodeValue(node, fa)) ? 'checked' : 'unchecked'
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

/** Cascade check: toggle a node and cascade to descendants + ancestors */
function cascadeCheck(
  nodeValue: string | number,
  checked: boolean,
  currentChecked: Set<string | number>,
  tree: TreeSelectTreeData[],
  fa: FieldAccessor,
): Set<string | number> {
  const newSet = new Set(currentChecked)
  const node = findNode(tree, nodeValue, fa)
  if (!node) return newSet

  // Toggle descendants (skip disabled)
  const descendants = getDescendantValues(node, fa)
  for (const dv of descendants) {
    const dNode = findNode(tree, dv, fa)
    if (dNode?.disabled || dNode?.disableCheckbox) continue
    if (checked) newSet.add(dv)
    else newSet.delete(dv)
  }

  // Cascade upward
  const parentMap = buildParentMap(tree, fa)
  let current = parentMap.get(nodeValue)
  while (current !== null && current !== undefined) {
    const parentNode = findNode(tree, current, fa)
    if (!parentNode) break
    const siblings = getNodeChildren(parentNode, fa) ?? []
    const allChecked = siblings.every((s) => {
      if (s.disabled || s.disableCheckbox) return true
      return newSet.has(getNodeValue(s, fa))
    })
    if (allChecked) newSet.add(current)
    else newSet.delete(current)
    current = parentMap.get(current)
  }

  return newSet
}

/** Compute display values based on showCheckedStrategy */
function computeDisplayValues(
  checkedSet: Set<string | number>,
  tree: TreeSelectTreeData[],
  fa: FieldAccessor,
  strategy: TreeSelectShowCheckedStrategy,
): (string | number)[] {
  const checked = Array.from(checkedSet)
  if (strategy === 'SHOW_ALL') return checked

  if (strategy === 'SHOW_CHILD') {
    return checked.filter((v) => {
      const node = findNode(tree, v, fa)
      if (!node) return false
      const children = getNodeChildren(node, fa)
      return !children || children.length === 0
    })
  }

  // SHOW_PARENT: collapse to highest fully-checked ancestors
  const result: (string | number)[] = []
  const consumed = new Set<string | number>()

  function tryCollapse(nodes: TreeSelectTreeData[]): void {
    for (const node of nodes) {
      const val = getNodeValue(node, fa)
      const children = getNodeChildren(node, fa)
      if (children && children.length > 0) {
        const allLeafs = getLeafValues(node, fa)
        const allSelected = allLeafs.length > 0 && allLeafs.every((lv) => checkedSet.has(lv))
        if (allSelected) {
          result.push(val)
          for (const lv of allLeafs) consumed.add(lv)
          // Also consume all intermediate parent values
          const allDesc = getDescendantValues(node, fa)
          for (const d of allDesc) consumed.add(d)
        } else {
          tryCollapse(children)
        }
      }
    }
  }

  tryCollapse(tree)
  for (const v of checked) {
    if (!consumed.has(v)) result.push(v)
  }
  return result
}

/** Filter tree for search: keep matching nodes + their ancestors */
function filterTreeForSearch(
  tree: TreeSelectTreeData[],
  search: string,
  filterFn: ((inputValue: string, treeNode: TreeSelectTreeData) => boolean) | undefined,
  fa: FieldAccessor,
  filterProp?: string,
): TreeSelectTreeData[] {
  if (!search) return tree

  const defaultFilter = (input: string, node: TreeSelectTreeData): boolean => {
    const prop = filterProp ?? fa.label
    const text = String(node[prop] ?? '')
    return text.toLowerCase().includes(input.toLowerCase())
  }
  const matchFn = filterFn ?? defaultFilter

  function filterNodes(nodes: TreeSelectTreeData[]): TreeSelectTreeData[] {
    const result: TreeSelectTreeData[] = []
    for (const node of nodes) {
      const children = getNodeChildren(node, fa)
      const filteredChildren = children ? filterNodes(children) : []
      if (matchFn(search, node) || filteredChildren.length > 0) {
        result.push(filteredChildren.length > 0 && children
          ? { ...node, [fa.children]: filteredChildren }
          : node,
        )
      }
    }
    return result
  }

  return filterNodes(tree)
}

/** Get keys for default expansion */
function getDefaultExpandedKeys(
  tree: TreeSelectTreeData[],
  fa: FieldAccessor,
  expandAll?: boolean,
): (string | number)[] {
  if (!expandAll) return []
  const keys: (string | number)[] = []
  function walk(nodes: TreeSelectTreeData[]) {
    for (const node of nodes) {
      const children = getNodeChildren(node, fa)
      if (children && children.length > 0) {
        keys.push(getNodeValue(node, fa))
        walk(children)
      }
    }
  }
  walk(tree)
  return keys
}

/** Get all parent keys of nodes that match search (to auto-expand) */
function getExpandKeysForSearch(
  tree: TreeSelectTreeData[],
  search: string,
  filterFn: ((inputValue: string, treeNode: TreeSelectTreeData) => boolean) | undefined,
  fa: FieldAccessor,
  filterProp?: string,
): (string | number)[] {
  if (!search) return []
  const defaultFilter = (input: string, node: TreeSelectTreeData): boolean => {
    const prop = filterProp ?? fa.label
    const text = String(node[prop] ?? '')
    return text.toLowerCase().includes(input.toLowerCase())
  }
  const matchFn = filterFn ?? defaultFilter
  const keys = new Set<string | number>()

  function walk(nodes: TreeSelectTreeData[], ancestors: (string | number)[]): void {
    for (const node of nodes) {
      const val = getNodeValue(node, fa)
      const children = getNodeChildren(node, fa)
      if (matchFn(search, node)) {
        for (const a of ancestors) keys.add(a)
      }
      if (children) {
        walk(children, [...ancestors, val])
      }
    }
  }
  walk(tree, [])
  return Array.from(keys)
}

// ============================================================================
// TreeNodeRow
// ============================================================================

interface TreeNodeRowProps {
  node: TreeSelectTreeData
  depth: number
  fa: FieldAccessor
  expandedKeys: Set<string | number>
  onToggleExpand: (value: string | number) => void
  selectedValue: string | number | null
  selectedMultiValues: Set<string | number>
  checkedSet: Set<string | number>
  isMultiple: boolean
  treeCheckable: boolean
  isCheckStrictly: boolean
  onSelect: (value: string | number, node: TreeSelectTreeData) => void
  onCheck: (value: string | number, node: TreeSelectTreeData) => void
  treeLine: boolean
  switcherIcon?: ReactNode
  loadData?: (node: TreeSelectTreeData) => Promise<void>
  loadingKeys: Set<string | number>
  loadedKeys: Set<string | number>
  search: string
  filterProp: string
  nodeStyle?: CSSProperties
  nodeClassName?: string
  focusedValue: string | number | null
  isLastChild: boolean
  parentIsLast: boolean[]
  disabled: boolean
}

function TreeNodeRow({
  node,
  depth,
  fa,
  expandedKeys,
  onToggleExpand,
  selectedValue,
  selectedMultiValues,
  checkedSet,
  isMultiple,
  treeCheckable,
  isCheckStrictly,
  onSelect,
  onCheck,
  treeLine,
  switcherIcon,
  loadData,
  loadingKeys,
  loadedKeys,
  search,
  filterProp,
  nodeStyle,
  nodeClassName,
  focusedValue,
  isLastChild,
  parentIsLast,
  disabled: globalDisabled,
}: TreeNodeRowProps) {
  const val = getNodeValue(node, fa)
  const label = getNodeLabel(node, fa)
  const children = getNodeChildren(node, fa)
  const hasChildren = (children && children.length > 0) || (loadData && !node.isLeaf && !loadedKeys.has(val))
  const isExpanded = expandedKeys.has(val)
  const isLoading = loadingKeys.has(val)
  const isDisabled = globalDisabled || !!node.disabled
  const isSelectable = node.selectable !== false
  const isFocused = focusedValue === val

  const isSelected = isMultiple || treeCheckable
    ? selectedMultiValues.has(val)
    : selectedValue === val

  const checkState: CheckState = treeCheckable
    ? (isCheckStrictly
      ? (checkedSet.has(val) ? 'checked' : 'unchecked')
      : getCheckState(node, checkedSet, fa))
    : 'unchecked'

  const rowRef = useRef<HTMLDivElement>(null)

  // Ref-based hover
  const handleMouseEnter = useCallback(() => {
    if (isDisabled || !rowRef.current) return
    rowRef.current.style.backgroundColor = tokens.colorBgMuted
  }, [isDisabled])

  const handleMouseLeave = useCallback(() => {
    if (!rowRef.current) return
    rowRef.current.style.backgroundColor = ''
  }, [])

  const handleSwitcherClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading) return
    if (loadData && !loadedKeys.has(val) && !node.isLeaf) {
      // trigger loadData handled by parent
    }
    onToggleExpand(val)
  }, [val, isLoading, loadData, loadedKeys, node.isLeaf, onToggleExpand])

  const handleRowClick = useCallback(() => {
    if (isDisabled) return
    if (treeCheckable) {
      if (!node.disableCheckbox) onCheck(val, node)
    } else {
      if (isSelectable) onSelect(val, node)
    }
  }, [isDisabled, treeCheckable, isSelectable, val, node, onCheck, onSelect])

  // Highlight matching text
  const renderLabel = () => {
    if (!search || typeof label !== 'string') return label
    const idx = label.toLowerCase().indexOf(search.toLowerCase())
    if (idx === -1) return label
    return (
      <>
        {label.slice(0, idx)}
        <span style={{ color: tokens.colorPrimary, fontWeight: 600 }}>{label.slice(idx, idx + search.length)}</span>
        {label.slice(idx + search.length)}
      </>
    )
  }

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '1.75rem',
    padding: treeLine ? '0 0.5rem' : '0.125rem 0.5rem',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    borderRadius: '0.25rem',
    transition: 'background-color 0.1s',
    outline: isFocused ? `2px solid ${tokens.colorPrimary}` : 'none',
    outlineOffset: -2,
    ...nodeStyle,
  }

  // Checkbox rendering
  const renderCheckbox = () => {
    if (!treeCheckable) return null
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

  const lineStyle = `2px solid ${tokens.colorBorder}`

  // Indent + tree lines
  const renderIndent = () => {
    const indents: ReactNode[] = []
    for (let i = 0; i < depth; i++) {
      if (treeLine) {
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

    if (!hasChildren) {
      if (treeLine && depth > 0) {
        return (
          <span style={{ ...switcherBase, alignSelf: 'stretch', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: 0, height: '50%', borderLeft: lineStyle }} />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', width: '0.75rem', borderTop: lineStyle }} />
            {!isLastChild && (
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', bottom: 0, borderLeft: lineStyle }} />
            )}
          </span>
        )
      }
      if (treeLine) {
        return <span style={switcherBase} />
      }
      return <span style={switcherBase}><LeafIcon /></span>
    }

    const iconContent = isLoading
      ? <LoadingIcon />
      : switcherIcon
        ? switcherIcon
        : isExpanded ? <SwitcherOpenIcon /> : <SwitcherClosedIcon />

    if (treeLine && depth > 0) {
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
          {/* Background mask to visually cut the line behind the icon */}
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

    if (treeLine) {
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

  return (
    <>
      <div
        ref={rowRef}
        style={rowStyle}
        className={nodeClassName}
        onClick={handleRowClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-value={val}
      >
        {renderIndent()}
        {renderSwitcher()}
        {renderCheckbox()}
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '0.8125rem',
          ...(isSelected && !treeCheckable ? { color: tokens.colorPrimary, fontWeight: 600 } : {}),
        }}>
          {renderLabel()}
        </span>
      </div>
      {isExpanded && children && children.map((child, idx) => (
        <TreeNodeRow
          key={String(getNodeValue(child, fa))}
          node={child}
          depth={depth + 1}
          fa={fa}
          expandedKeys={expandedKeys}
          onToggleExpand={onToggleExpand}
          selectedValue={selectedValue}
          selectedMultiValues={selectedMultiValues}
          checkedSet={checkedSet}
          isMultiple={isMultiple}
          treeCheckable={treeCheckable}
          isCheckStrictly={isCheckStrictly}
          onSelect={onSelect}
          onCheck={onCheck}
          treeLine={treeLine}
          switcherIcon={switcherIcon}
          loadData={loadData}
          loadingKeys={loadingKeys}
          loadedKeys={loadedKeys}
          search={search}
          filterProp={filterProp}
          nodeStyle={nodeStyle}
          nodeClassName={nodeClassName}
          focusedValue={focusedValue}
          isLastChild={idx === children.length - 1}
          parentIsLast={[...parentIsLast, isLastChild]}
          disabled={globalDisabled}
        />
      ))}
    </>
  )
}

// ============================================================================
// TreeSelectComponent
// ============================================================================

function TreeSelectComponent(props: TreeSelectProps) {
  const {
    treeData = [],
    fieldNames: fieldNamesProp,
    value: controlledValue,
    defaultValue,
    onChange,
    multiple = false,
    treeCheckable = false,
    treeCheckStrictly = false,
    showCheckedStrategy = 'SHOW_ALL',
    treeDefaultExpandAll = false,
    treeDefaultExpandedKeys,
    treeExpandedKeys: controlledExpandedKeys,
    onTreeExpand,
    loadData,
    treeLine = false,
    switcherIcon,
    showSearch = false,
    filterTreeNode,
    treeNodeFilterProp,
    allowClear = false,
    placeholder,
    disabled = false,
    size = 'middle',
    variant = 'outlined',
    status,
    placement = 'bottomLeft',
    maxCount,
    maxTagCount,
    maxTagPlaceholder,
    tagRender,
    notFoundContent,
    listHeight = 256,
    popupMatchSelectWidth = true,
    dropdownRender,
    suffixIcon,
    prefix,
    onSearch,
    onDropdownVisibleChange,
    onClear,
    open: controlledOpen,
    className,
    style,
    classNames: semanticClassNames,
    styles: semanticStyles,
  } = props

  const fa = useMemo(() => resolveFieldNames(fieldNamesProp), [fieldNamesProp])
  const isMulti = multiple || treeCheckable
  const sc = sizeConfig[size]

  // Refs
  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')

  // ---- Open state ----
  const isControlledOpen = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isControlledOpen ? controlledOpen! : internalOpen
  const setOpen = useCallback((val: boolean) => {
    if (!isControlledOpen) setInternalOpen(val)
    onDropdownVisibleChange?.(val)
  }, [isControlledOpen, onDropdownVisibleChange])

  // Animation
  const [isAnimating, setIsAnimating] = useState(false)
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimating(true))
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  // Flip
  const [flipUp, setFlipUp] = useState(placement.startsWith('top'))
  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current || !rootRef.current) return
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom
    if (!flipUp && dropdownRef.current.getBoundingClientRect().bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) setFlipUp(true)
    } else if (flipUp && dropdownRef.current.getBoundingClientRect().top < 0) {
      if (spaceBelow > spaceAbove) setFlipUp(false)
    }
  })

  // ---- Value state ----
  const isControlledValue = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
    () => defaultValue ?? (isMulti ? [] : ''),
  )
  const currentValue = isControlledValue ? controlledValue! : internalValue

  const currentMultiValues: (string | number)[] = useMemo(() => {
    if (!isMulti) return []
    return Array.isArray(currentValue) ? currentValue : (currentValue !== '' ? [currentValue] : [])
  }, [isMulti, currentValue])

  const currentSingleValue: string | number | null = useMemo(() => {
    if (isMulti) return null
    if (Array.isArray(currentValue)) return currentValue[0] ?? null
    return currentValue !== '' ? currentValue : null
  }, [isMulti, currentValue])

  // Checked set for checkable mode
  const checkedSet = useMemo(() => new Set(currentMultiValues), [currentMultiValues])

  // ---- Expanded keys ----
  const isControlledExpanded = controlledExpandedKeys !== undefined
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>(() =>
    treeDefaultExpandedKeys ?? getDefaultExpandedKeys(treeData, fa, treeDefaultExpandAll),
  )
  const expandedKeysArray = isControlledExpanded ? controlledExpandedKeys! : internalExpanded
  const expandedKeys = useMemo(() => new Set(expandedKeysArray), [expandedKeysArray])

  const setExpandedKeys = useCallback((keys: (string | number)[]) => {
    if (!isControlledExpanded) setInternalExpanded(keys)
    onTreeExpand?.(keys)
  }, [isControlledExpanded, onTreeExpand])

  // ---- Search ----
  const [searchValue, setSearchValue] = useState('')
  const [searchExpandKeys, setSearchExpandKeys] = useState<(string | number)[]>([])

  const filterFn = useMemo(() => {
    if (filterTreeNode === false) return undefined
    if (typeof filterTreeNode === 'function') return filterTreeNode
    return undefined
  }, [filterTreeNode])

  const filteredTree = useMemo(() => {
    if (!searchValue || filterTreeNode === false) return treeData
    return filterTreeForSearch(treeData, searchValue, filterFn, fa, treeNodeFilterProp)
  }, [treeData, searchValue, filterTreeNode, filterFn, fa, treeNodeFilterProp])

  const effectiveExpandedKeys = useMemo(() => {
    if (searchValue && filterTreeNode !== false) {
      const merged = new Set([...expandedKeysArray, ...searchExpandKeys])
      return merged
    }
    return expandedKeys
  }, [searchValue, filterTreeNode, expandedKeysArray, searchExpandKeys, expandedKeys])

  // ---- Loading ----
  const [loadingKeys, setLoadingKeys] = useState<Set<string | number>>(new Set())
  const [loadedKeys, setLoadedKeys] = useState<Set<string | number>>(new Set())

  // ---- Focus ----
  const [isFocused, setIsFocused] = useState(false)
  const [focusedValue, setFocusedValue] = useState<string | number | null>(null)

  // Click outside
  useEffect(() => {
    if (!isOpen && !isFocused) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setOpen(false)
          setSearchValue('')
        }
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isFocused, setOpen])

  // ---- Visible flat list for keyboard nav ----
  const visibleNodes = useMemo(() => {
    function collect(nodes: TreeSelectTreeData[], depth: number): FlatNode[] {
      const result: FlatNode[] = []
      for (const node of nodes) {
        const val = getNodeValue(node, fa)
        result.push({ node, value: val, depth, parentValue: null })
        const children = getNodeChildren(node, fa)
        if (children && effectiveExpandedKeys.has(val)) {
          result.push(...collect(children, depth + 1))
        }
      }
      return result
    }
    return collect(filteredTree, 0)
  }, [filteredTree, fa, effectiveExpandedKeys])

  // ---- Handlers ----
  const handleToggleExpand = useCallback((value: string | number) => {
    const node = findNode(treeData, value, fa)
    if (!node) return

    const isCurrentlyExpanded = expandedKeysArray.includes(value)

    // Handle loadData
    if (loadData && !loadedKeys.has(value) && !node.isLeaf && !isCurrentlyExpanded) {
      setLoadingKeys((prev) => new Set([...prev, value]))
      loadData(node).then(() => {
        setLoadingKeys((prev) => {
          const next = new Set(prev)
          next.delete(value)
          return next
        })
        setLoadedKeys((prev) => new Set([...prev, value]))
      })
    }

    const newKeys = isCurrentlyExpanded
      ? expandedKeysArray.filter((k) => k !== value)
      : [...expandedKeysArray, value]
    setExpandedKeys(newKeys)
  }, [treeData, fa, expandedKeysArray, loadData, loadedKeys, setExpandedKeys])

  const fireChange = useCallback((newValue: string | number | (string | number)[], triggerValue: string | number) => {
    if (!isControlledValue) setInternalValue(newValue)
    if (onChange) {
      const valArr = Array.isArray(newValue) ? newValue : [newValue]
      const labels = valArr.map((v) => getLabelByValue(treeData, v, fa))
      onChange(newValue, labels, { triggerValue })
    }
  }, [isControlledValue, onChange, treeData, fa])

  const handleSelect = useCallback((value: string | number, _node: TreeSelectTreeData) => {
    if (isMulti && !treeCheckable) {
      // Multiple without checkbox — toggle in array
      const exists = currentMultiValues.includes(value)
      if (!exists && maxCount !== undefined && currentMultiValues.length >= maxCount) return
      const newVals = exists
        ? currentMultiValues.filter((v) => v !== value)
        : [...currentMultiValues, value]
      fireChange(newVals, value)
    } else {
      // Single select
      fireChange(value, value)
      setOpen(false)
      setSearchValue('')
    }
  }, [isMulti, treeCheckable, currentMultiValues, maxCount, fireChange, setOpen])

  const handleCheck = useCallback((value: string | number, _node: TreeSelectTreeData) => {
    let newChecked: Set<string | number>
    if (treeCheckStrictly) {
      newChecked = new Set(checkedSet)
      if (newChecked.has(value)) newChecked.delete(value)
      else {
        if (maxCount !== undefined && newChecked.size >= maxCount) return
        newChecked.add(value)
      }
    } else {
      const isCurrentlyChecked = checkedSet.has(value)
      if (!isCurrentlyChecked && maxCount !== undefined) {
        // Estimate how many would be added
        const node = findNode(treeData, value, fa)
        if (node) {
          const descendants = getDescendantValues(node, fa).filter((d) => !checkedSet.has(d))
          if (checkedSet.size + descendants.length > maxCount) return
        }
      }
      newChecked = cascadeCheck(value, !isCurrentlyChecked, checkedSet, treeData, fa)
    }
    fireChange(Array.from(newChecked), value)
  }, [treeCheckStrictly, checkedSet, treeData, fa, maxCount, fireChange])

  const handleRemoveTag = useCallback((value: string | number) => {
    if (treeCheckable && !treeCheckStrictly) {
      // Uncheck with cascade
      const newChecked = cascadeCheck(value, false, checkedSet, treeData, fa)
      fireChange(Array.from(newChecked), value)
    } else {
      const newVals = currentMultiValues.filter((v) => v !== value)
      fireChange(newVals, value)
    }
  }, [treeCheckable, treeCheckStrictly, checkedSet, treeData, fa, currentMultiValues, fireChange])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    fireChange(isMulti ? [] : '', currentSingleValue ?? 0)
    onClear?.()
    setSearchValue('')
  }, [isMulti, fireChange, currentSingleValue, onClear])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchValue(val)
    onSearch?.(val)
    if (val) {
      const newExpandKeys = getExpandKeysForSearch(treeData, val, filterFn, fa, treeNodeFilterProp)
      setSearchExpandKeys(newExpandKeys)
    } else {
      setSearchExpandKeys([])
    }
    if (!isOpen) setOpen(true)
  }, [onSearch, treeData, filterFn, fa, treeNodeFilterProp, isOpen, setOpen])

  const handleSelectorClick = useCallback(() => {
    if (disabled) return
    if (!isOpen) {
      setFlipUp(placement.startsWith('top'))
      setOpen(true)
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
    } else if (!showSearch) {
      setOpen(false)
    }
  }, [disabled, isOpen, setOpen, showSearch, placement])

  // Keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Escape') {
      setOpen(false)
      setSearchValue('')
      return
    }

    if (e.key === 'Enter' && isOpen && focusedValue !== null) {
      e.preventDefault()
      const node = findNode(filteredTree, focusedValue, fa)
      if (node && !node.disabled) {
        if (treeCheckable) {
          if (!node.disableCheckbox) handleCheck(focusedValue, node)
        } else {
          if (node.selectable !== false) handleSelect(focusedValue, node)
        }
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setOpen(true)
        return
      }
      const currentIdx = focusedValue !== null
        ? visibleNodes.findIndex((n) => n.value === focusedValue)
        : -1
      let nextIdx: number
      if (e.key === 'ArrowDown') {
        nextIdx = currentIdx < visibleNodes.length - 1 ? currentIdx + 1 : 0
      } else {
        nextIdx = currentIdx > 0 ? currentIdx - 1 : visibleNodes.length - 1
      }
      if (visibleNodes[nextIdx]) {
        setFocusedValue(visibleNodes[nextIdx].value)
        // Scroll into view
        const el = dropdownRef.current?.querySelector(`[data-value="${visibleNodes[nextIdx].value}"]`)
        el?.scrollIntoView({ block: 'nearest' })
      }
      return
    }

    if (e.key === 'ArrowRight' && isOpen && focusedValue !== null) {
      if (!effectiveExpandedKeys.has(focusedValue)) {
        handleToggleExpand(focusedValue)
      }
      return
    }

    if (e.key === 'ArrowLeft' && isOpen && focusedValue !== null) {
      if (effectiveExpandedKeys.has(focusedValue)) {
        handleToggleExpand(focusedValue)
      }
      return
    }

    // Backspace to remove last tag in multi
    if (e.key === 'Backspace' && isMulti && !searchValue && currentMultiValues.length > 0) {
      const lastVal = currentMultiValues[currentMultiValues.length - 1]
      handleRemoveTag(lastVal)
    }
  }, [disabled, isOpen, focusedValue, filteredTree, fa, treeCheckable, handleCheck, handleSelect, visibleNodes, effectiveExpandedKeys, handleToggleExpand, isMulti, searchValue, currentMultiValues, handleRemoveTag, setOpen])

  // Reset focused on close
  useEffect(() => {
    if (!isOpen) setFocusedValue(null)
  }, [isOpen])

  // ---- Display values for tags ----
  const displayValues = useMemo((): (string | number)[] => {
    if (!isMulti) return []
    if (treeCheckable && !treeCheckStrictly) {
      return computeDisplayValues(checkedSet, treeData, fa, showCheckedStrategy)
    }
    return currentMultiValues
  }, [isMulti, treeCheckable, treeCheckStrictly, checkedSet, treeData, fa, showCheckedStrategy, currentMultiValues])

  // ---- Styles ----
  const variantStyles: Record<TreeSelectVariant, CSSProperties> = {
    outlined: { border: `1px solid ${tokens.colorBorder}`, backgroundColor: tokens.colorBg },
    filled: { border: '1px solid transparent', backgroundColor: tokens.colorBgMuted },
    borderless: { border: '1px solid transparent', backgroundColor: 'transparent' },
    underlined: { border: 'none', borderBottom: `1px solid ${tokens.colorBorder}`, borderRadius: 0, backgroundColor: 'transparent' },
  }

  const statusBorderColor = status === 'error'
    ? tokens.colorError
    : status === 'warning'
      ? tokens.colorWarning
      : undefined

  const focusRingColor = status === 'error'
    ? tokens.colorErrorBg
    : status === 'warning'
      ? tokens.colorWarningBg
      : tokens.colorPrimaryLight

  const hasClearable = isMulti
    ? currentMultiValues.length > 0
    : currentSingleValue !== null

  const selectorStyle: CSSProperties = mergeSemanticStyle({
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    minHeight: sc.height,
    padding: sc.padding,
    fontSize: sc.fontSize,
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    ...variantStyles[variant],
    ...(statusBorderColor ? { borderColor: statusBorderColor } : {}),
    ...(isFocused || isOpen ? {
      borderColor: statusBorderColor ?? tokens.colorPrimary,
      ...(variant === 'underlined' ? { borderBottomColor: statusBorderColor ?? tokens.colorPrimary } : {}),
      boxShadow: isFocused && focusSourceRef.current === 'keyboard' ? `0 0 0 2px ${focusRingColor}` : 'none',
    } : {}),
    ...(disabled ? { opacity: 0.5, pointerEvents: 'none' as const } : {}),
  }, semanticStyles?.selector)

  const isRight = placement.endsWith('Right')

  const dropdownBaseStyle: CSSProperties = mergeSemanticStyle({
    position: 'absolute',
    left: isRight ? undefined : 0,
    right: isRight ? 0 : undefined,
    zIndex: 1050,
    ...(typeof popupMatchSelectWidth === 'number'
      ? { width: popupMatchSelectWidth }
      : popupMatchSelectWidth
        ? { width: '100%' }
        : { minWidth: '7.5rem' }),
    maxHeight: listHeight,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorBorderHover} transparent`,
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: '0 6px 16px rgba(0,0,0,.08)',
    padding: '0.25rem',
    opacity: isAnimating ? 1 : 0,
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    ...(flipUp
      ? { bottom: '100%', marginBottom: '0.25rem', transform: isAnimating ? 'translateY(0)' : 'translateY(6px)' }
      : { top: '100%', marginTop: '0.25rem', transform: isAnimating ? 'translateY(0)' : 'translateY(-6px)' }),
  }, semanticStyles?.dropdown)

  const searchInputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: tokens.colorText,
    fontSize: sc.fontSize,
    padding: 0,
    margin: 0,
    fontFamily: 'inherit',
  }

  const tagBaseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: sc.tagLineHeight,
    padding: '0 0.375rem',
    borderRadius: '0.25rem',
    backgroundColor: tokens.colorBgMuted,
    fontSize: '0.75rem',
    lineHeight: sc.tagLineHeight,
    maxWidth: '100%',
    overflow: 'hidden',
  }

  const clearBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '0.125rem',
    borderRadius: '50%',
    color: tokens.colorTextMuted,
    transition: 'color 0.15s, background-color 0.15s',
    flexShrink: 0,
  }

  // ---- Render tags ----
  const renderTags = () => {
    if (displayValues.length === 0 && !searchValue) {
      return showSearch && isOpen ? null : (
        <span style={{ color: tokens.colorTextSubtle, flex: 1, lineHeight: sc.tagLineHeight }}>
          {placeholder}
        </span>
      )
    }

    const visibleCount = maxTagCount !== undefined ? Math.min(maxTagCount, displayValues.length) : displayValues.length
    const visibleVals = displayValues.slice(0, visibleCount)
    const omittedVals = displayValues.slice(visibleCount)

    return (
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', flex: 1, overflow: 'hidden', alignItems: 'center' }}>
        {visibleVals.map((val) => {
          const displayLabel = getLabelByValue(treeData, val, fa)
          const closable = !disabled

          if (tagRender) {
            return (
              <span key={String(val)}>
                {tagRender({ label: displayLabel, value: val, closable, onClose: () => handleRemoveTag(val) })}
              </span>
            )
          }

          return (
            <span key={String(val)} style={mergeSemanticStyle(tagBaseStyle, semanticStyles?.tag)} className={semanticClassNames?.tag}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayLabel}</span>
              {closable && (
                <span
                  style={{ display: 'inline-flex', cursor: 'pointer', marginLeft: '0.25rem', color: tokens.colorTextMuted }}
                  onClick={(e) => { e.stopPropagation(); handleRemoveTag(val) }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CloseTagIcon />
                </span>
              )}
            </span>
          )
        })}
        {omittedVals.length > 0 && (
          <span style={mergeSemanticStyle(tagBaseStyle, semanticStyles?.tag)} className={semanticClassNames?.tag}>
            {typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(omittedVals)
              : maxTagPlaceholder ?? `+${omittedVals.length}`}
          </span>
        )}
        {showSearch && (
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onMouseDown={() => { mouseDownRef.current = true }}
            onFocus={() => {
              if (!isFocused) {
                focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
                mouseDownRef.current = false
              }
              setIsFocused(true)
            }}
            style={{
              ...searchInputStyle,
              width: `${Math.max(0.25, (searchValue.length + 1) * 0.5)}rem`,
              minWidth: displayValues.length === 0 && !searchValue ? '100%' : '0.25rem',
            }}
            autoComplete="off"
            placeholder={displayValues.length === 0 ? placeholder : undefined}
          />
        )}
      </span>
    )
  }

  // ---- Render single value ----
  const renderSingleValue = () => {
    if (showSearch && isOpen) {
      const selectedLabel = currentSingleValue !== null ? getLabelByValue(treeData, currentSingleValue, fa) : null
      return (
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onMouseDown={() => { mouseDownRef.current = true }}
          onFocus={() => {
            if (!isFocused) {
              focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
              mouseDownRef.current = false
            }
            setIsFocused(true)
          }}
          style={{ ...searchInputStyle, width: '100%', lineHeight: sc.height }}
          autoComplete="off"
          placeholder={selectedLabel ? String(selectedLabel) : placeholder}
        />
      )
    }

    if (currentSingleValue !== null) {
      const label = getLabelByValue(treeData, currentSingleValue, fa)
      return (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {label}
        </span>
      )
    }

    return <span style={{ color: tokens.colorTextSubtle, flex: 1 }}>{placeholder}</span>
  }

  // ---- Tree content ----
  const treeContent = (
    <div style={mergeSemanticStyle({ padding: '0.125rem' }, semanticStyles?.tree)} className={semanticClassNames?.tree}>
      {filteredTree.length === 0
        ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: tokens.colorTextMuted, fontSize: '0.8125rem' }}>
            {notFoundContent ?? 'No data'}
          </div>
        )
        : filteredTree.map((node, idx) => (
          <TreeNodeRow
            key={String(getNodeValue(node, fa))}
            node={node}
            depth={0}
            fa={fa}
            expandedKeys={effectiveExpandedKeys}
            onToggleExpand={handleToggleExpand}
            selectedValue={currentSingleValue}
            selectedMultiValues={checkedSet}
            checkedSet={checkedSet}
            isMultiple={isMulti && !treeCheckable}
            treeCheckable={treeCheckable}
            isCheckStrictly={treeCheckStrictly}
            onSelect={handleSelect}
            onCheck={handleCheck}
            treeLine={treeLine}
            switcherIcon={switcherIcon}
            loadData={loadData}
            loadingKeys={loadingKeys}
            loadedKeys={loadedKeys}
            search={searchValue}
            filterProp={treeNodeFilterProp ?? fa.label}
            nodeStyle={semanticStyles?.node}
            nodeClassName={semanticClassNames?.node}
            focusedValue={focusedValue}
            isLastChild={idx === filteredTree.length - 1}
            parentIsLast={[]}
            disabled={disabled}
          />
        ))
      }
    </div>
  )

  return (
    <div
      ref={rootRef}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block', width: '100%' }, semanticStyles?.root, style)}
      className={mergeSemanticClassName(className, semanticClassNames?.root)}
      onKeyDown={!showSearch ? handleKeyDown : undefined}
      tabIndex={showSearch ? undefined : 0}
      onMouseDown={() => { mouseDownRef.current = true }}
      onFocus={(e) => {
        if (e.target === e.currentTarget) {
          focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
          mouseDownRef.current = false
        }
        setIsFocused(true)
      }}
      onBlur={() => { if (!isOpen) setIsFocused(false) }}
    >
      {/* Selector */}
      <div
        style={selectorStyle}
        className={semanticClassNames?.selector}
        onClick={handleSelectorClick}
      >
        {prefix && <span style={{ display: 'flex', color: tokens.colorTextMuted, marginRight: '0.25rem', flexShrink: 0 }}>{prefix}</span>}
        {isMulti ? renderTags() : renderSingleValue()}
        {allowClear && hasClearable && !disabled && (
          <button
            type="button"
            style={clearBtnStyle}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = tokens.colorText
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
            tabIndex={-1}
            aria-label="Clear"
          >
            <ClearIcon />
          </button>
        )}
        <span style={{
          display: 'flex',
          color: tokens.colorTextMuted,
          pointerEvents: 'none',
          transition: suffixIcon ? undefined : 'transform 0.2s ease',
          transform: suffixIcon ? undefined : (isOpen ? 'rotate(180deg)' : 'rotate(0deg)'),
          flexShrink: 0,
        }}>
          {suffixIcon ?? <ChevronDownIcon />}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={dropdownBaseStyle}
          className={`j-treeselect-dropdown${semanticClassNames?.dropdown ? ` ${semanticClassNames.dropdown}` : ''}`}
          onMouseDown={(e) => e.preventDefault()}
        >
          {dropdownRender ? dropdownRender(treeContent) : treeContent}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .j-treeselect-dropdown::-webkit-scrollbar { width: 4px; }
        .j-treeselect-dropdown::-webkit-scrollbar-track { background: transparent; }
        .j-treeselect-dropdown::-webkit-scrollbar-thumb { background: ${tokens.colorBorderHover}; border-radius: 4px; }
        .j-treeselect-dropdown::-webkit-scrollbar-thumb:hover { background: ${tokens.colorTextSubtle}; }
      `}</style>
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const TreeSelect = Object.assign(TreeSelectComponent, {
  SHOW_ALL: 'SHOW_ALL' as const,
  SHOW_PARENT: 'SHOW_PARENT' as const,
  SHOW_CHILD: 'SHOW_CHILD' as const,
})
