import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataDisplay } from '../DataDisplay'
import type { DataDisplayItem } from '../DataDisplay'

// ============================================================================
// Helpers
// ============================================================================

const defaultItems: DataDisplayItem[] = [
  { key: '1', label: 'Name', children: 'John Doe' },
  { key: '2', label: 'Age', children: '30' },
  { key: '3', label: 'Email', children: 'john@example.com' },
  { key: '4', label: 'City', children: 'Madrid' },
  { key: '5', label: 'Country', children: 'Spain' },
  { key: '6', label: 'Phone', children: '+34 600 000 000' },
]

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getTable(container: HTMLElement) {
  return getRoot(container).querySelector('table') as HTMLElement
}

function getRows(container: HTMLElement) {
  const tbody = getTable(container).querySelector('tbody') as HTMLElement
  return Array.from(tbody.querySelectorAll('tr')) as HTMLElement[]
}

function getLabels(container: HTMLElement) {
  return Array.from(getTable(container).querySelectorAll('th')) as HTMLElement[]
}

function getContents(container: HTMLElement) {
  return Array.from(getTable(container).querySelectorAll('td')) as HTMLElement[]
}

function getHeader(container: HTMLElement) {
  // Header is the div before the table (if present)
  const root = getRoot(container)
  const firstChild = root.firstElementChild as HTMLElement
  return firstChild.tagName === 'DIV' ? firstChild : null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('DataDisplay', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('renders a table', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const table = getTable(container)
      expect(table).toBeTruthy()
      expect(table.tagName).toBe('TABLE')
    })

    it('renders labels as th elements', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels.length).toBe(6)
    })

    it('renders content as td elements', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const contents = getContents(container)
      expect(contents.length).toBe(6)
    })

    it('renders label text', () => {
      render(<DataDisplay items={defaultItems} />)
      expect(screen.getByText('Name:')).toBeTruthy()
      expect(screen.getByText('Age:')).toBeTruthy()
    })

    it('renders content text', () => {
      render(<DataDisplay items={defaultItems} />)
      expect(screen.getByText('John Doe')).toBeTruthy()
      expect(screen.getByText('30')).toBeTruthy()
    })

    it('applies className to root', () => {
      const { container } = render(<DataDisplay items={defaultItems} className="my-dd" />)
      expect(getRoot(container).className).toContain('my-dd')
    })

    it('applies style to root', () => {
      const { container } = render(<DataDisplay items={defaultItems} style={{ maxWidth: '800px' }} />)
      expect(getRoot(container).style.maxWidth).toBe('800px')
    })

    it('root has width 100%', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      expect(getRoot(container).style.width).toBe('100%')
    })

    it('table has width 100%', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      expect(getTable(container).style.width).toBe('100%')
    })
  })

  // ============================================================================
  // Colon
  // ============================================================================

  describe('colon', () => {
    it('appends colon to labels by default', () => {
      render(<DataDisplay items={[{ key: '1', label: 'Name', children: 'John' }]} />)
      expect(screen.getByText('Name:')).toBeTruthy()
    })

    it('does not append colon when colon=false', () => {
      render(<DataDisplay items={[{ key: '1', label: 'Name', children: 'John' }]} colon={false} />)
      const th = screen.getByText('Name')
      expect(th.textContent).toBe('Name')
    })

    it('does not append colon when label is empty', () => {
      const { container } = render(<DataDisplay items={[{ key: '1', children: 'Value' }]} />)
      const labels = getLabels(container)
      expect(labels[0].textContent).toBe('')
    })
  })

  // ============================================================================
  // Title and extra
  // ============================================================================

  describe('title and extra', () => {
    it('renders header when title is provided', () => {
      const { container } = render(<DataDisplay items={defaultItems} title="User Info" />)
      const header = getHeader(container)
      expect(header).toBeTruthy()
      expect(screen.getByText('User Info')).toBeTruthy()
    })

    it('renders header when extra is provided', () => {
      render(<DataDisplay items={defaultItems} extra={<button>Edit</button>} />)
      expect(screen.getByText('Edit')).toBeTruthy()
    })

    it('renders both title and extra', () => {
      render(<DataDisplay items={defaultItems} title="Info" extra={<span>More</span>} />)
      expect(screen.getByText('Info')).toBeTruthy()
      expect(screen.getByText('More')).toBeTruthy()
    })

    it('does not render header when neither title nor extra', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const header = getHeader(container)
      expect(header).toBeNull()
    })

    it('header has flex layout', () => {
      const { container } = render(<DataDisplay items={defaultItems} title="Title" />)
      const header = getHeader(container)
      expect(header!.style.display).toBe('flex')
      expect(header!.style.justifyContent).toBe('space-between')
    })

    it('title has fontWeight 600', () => {
      const { container } = render(<DataDisplay items={defaultItems} title="Title" />)
      const header = getHeader(container)
      const titleEl = header!.firstElementChild as HTMLElement
      expect(titleEl.style.fontWeight).toBe('600')
    })
  })

  // ============================================================================
  // Column count
  // ============================================================================

  describe('column count', () => {
    it('default column count is 3', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      // 6 items / 3 columns = 2 rows
      const rows = getRows(container)
      expect(rows.length).toBe(2)
    })

    it('column=1 produces one item per row', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={1} />)
      const rows = getRows(container)
      expect(rows.length).toBe(2)
    })

    it('column=2 distributes items into rows of 2', () => {
      const { container } = render(<DataDisplay items={defaultItems} column={2} />)
      // 6 items / 2 columns = 3 rows
      const rows = getRows(container)
      expect(rows.length).toBe(3)
    })

    it('column=6 puts all items in one row', () => {
      const { container } = render(<DataDisplay items={defaultItems} column={6} />)
      const rows = getRows(container)
      expect(rows.length).toBe(1)
    })

    it('renders colgroup with correct number of cols', () => {
      const { container } = render(<DataDisplay items={defaultItems} column={3} />)
      const cols = getTable(container).querySelectorAll('col')
      // Horizontal: 3 columns × 2 (th+td) = 6 cols
      expect(cols.length).toBe(6)
    })
  })

  // ============================================================================
  // Layout: horizontal (default)
  // ============================================================================

  describe('horizontal layout', () => {
    it('each row has th and td pairs', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={2} />)
      const rows = getRows(container)
      // 1 row: th, td, th, td
      const firstRow = rows[0]
      const cells = Array.from(firstRow.children)
      expect(cells.length).toBe(4) // 2 th + 2 td
      expect(cells[0].tagName).toBe('TH')
      expect(cells[1].tagName).toBe('TD')
      expect(cells[2].tagName).toBe('TH')
      expect(cells[3].tagName).toBe('TD')
    })

    it('label cells have text-align left', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.textAlign).toBe('left')
    })

    it('label cells have fontWeight 500', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.fontWeight).toBe('500')
    })
  })

  // ============================================================================
  // Layout: vertical
  // ============================================================================

  describe('vertical layout', () => {
    it('produces two tr per logical row (labels + values)', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={2} layout="vertical" />)
      const rows = getRows(container)
      // 1 logical row → 2 tr (labels row + values row)
      expect(rows.length).toBe(2)
    })

    it('labels row has th cells', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={2} layout="vertical" />)
      const rows = getRows(container)
      const labelRow = rows[0]
      const cells = Array.from(labelRow.children)
      expect(cells.every(c => c.tagName === 'TH')).toBe(true)
    })

    it('values row has td cells', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={2} layout="vertical" />)
      const rows = getRows(container)
      const valueRow = rows[1]
      const cells = Array.from(valueRow.children)
      expect(cells.every(c => c.tagName === 'TD')).toBe(true)
    })

    it('vertical colgroup has columns equal to column count', () => {
      const { container } = render(<DataDisplay items={defaultItems} column={3} layout="vertical" />)
      const cols = getTable(container).querySelectorAll('col')
      expect(cols.length).toBe(3)
    })

    it('vertical cols have equal width', () => {
      const { container } = render(<DataDisplay items={defaultItems} column={3} layout="vertical" />)
      const cols = getTable(container).querySelectorAll('col')
      Array.from(cols).forEach((col) => {
        expect((col as HTMLElement).style.width).toContain('33.3333')
      })
    })
  })

  // ============================================================================
  // Bordered mode
  // ============================================================================

  describe('bordered mode', () => {
    it('table has border-collapse separate when bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      expect(getTable(container).style.borderCollapse).toBe('separate')
    })

    it('table has top and left border when bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      const table = getTable(container)
      expect(table.style.borderTop).toContain('1px solid')
      expect(table.style.borderLeft).toContain('1px solid')
    })

    it('table has border-radius when bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      expect(getTable(container).style.borderRadius).toBe('0.5rem')
    })

    it('label cells have background and borders when bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      const labels = getLabels(container)
      expect(labels[0].style.borderBottom).toContain('1px solid')
      expect(labels[0].style.borderRight).toContain('1px solid')
      expect(labels[0].style.backgroundColor).toBeTruthy()
    })

    it('content cells have borders when bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      const contents = getContents(container)
      expect(contents[0].style.borderBottom).toContain('1px solid')
      expect(contents[0].style.borderRight).toContain('1px solid')
    })

    it('first-row first-label has borderTopLeftRadius', () => {
      const { container } = render(<DataDisplay items={defaultItems} bordered />)
      const labels = getLabels(container)
      expect(labels[0].style.borderTopLeftRadius).toBe('0.5rem')
    })
  })

  // ============================================================================
  // Non-bordered (default)
  // ============================================================================

  describe('non-bordered (default)', () => {
    it('table has border-collapse collapse', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      expect(getTable(container).style.borderCollapse).toBe('collapse')
    })

    it('label cells do not have border', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.borderBottom).not.toContain('1px solid')
    })

    it('label has whiteSpace nowrap in horizontal non-bordered', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.whiteSpace).toBe('nowrap')
    })
  })

  // ============================================================================
  // Size variants
  // ============================================================================

  describe('size variants', () => {
    it('small size has smaller cell padding', () => {
      const { container } = render(<DataDisplay items={defaultItems} size="small" />)
      const labels = getLabels(container)
      // Non-bordered horizontal adds paddingRight:'0.5rem' override → jsdom expands shorthand
      expect(labels[0].style.paddingTop).toBe('0.375rem')
      expect(labels[0].style.paddingLeft).toBe('0.75rem')
      // fontSize is on the table, not individual cells
      expect(getTable(container).style.fontSize).toBe('0.8125rem')
    })

    it('middle size (default) has medium cell padding', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.paddingTop).toBe('0.75rem')
      expect(labels[0].style.paddingLeft).toBe('1rem')
      expect(getTable(container).style.fontSize).toBe('0.875rem')
    })

    it('large size has larger cell padding', () => {
      const { container } = render(<DataDisplay items={defaultItems} size="large" />)
      const labels = getLabels(container)
      expect(labels[0].style.paddingTop).toBe('1rem')
      expect(labels[0].style.paddingLeft).toBe('1.5rem')
      expect(getTable(container).style.fontSize).toBe('1rem')
    })

    it('size affects header font size', () => {
      const { container } = render(<DataDisplay items={defaultItems} title="Title" size="large" />)
      const header = getHeader(container)
      const titleEl = header!.firstElementChild as HTMLElement
      expect(titleEl.style.fontSize).toBe('1.125rem')
    })
  })

  // ============================================================================
  // Span (colSpan)
  // ============================================================================

  describe('span', () => {
    it('item with span=2 gets colSpan on content td (horizontal)', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Full', children: 'Wide', span: 2 },
        { key: '2', label: 'Normal', children: 'Regular' },
      ]
      const { container } = render(<DataDisplay items={items} column={2} />)
      const contents = getContents(container)
      // First td should have colSpan: span*2-1 = 3
      expect(contents[0].getAttribute('colspan')).toBe('3')
    })

    it('item with span=1 has no colSpan attribute', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Normal', children: 'Regular', span: 1 },
      ]
      const { container } = render(<DataDisplay items={items} column={1} />)
      const contents = getContents(container)
      expect(contents[0].getAttribute('colspan')).toBeNull()
    })

    it('vertical layout uses colSpan on both th and td', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Wide', children: 'Content', span: 2 },
        { key: '2', label: 'Normal', children: 'Other' },
      ]
      const { container } = render(<DataDisplay items={items} column={3} layout="vertical" />)
      const labels = getLabels(container)
      expect(labels[0].getAttribute('colspan')).toBe('2')
    })
  })

  // ============================================================================
  // Row distribution / last-item stretch
  // ============================================================================

  describe('row distribution', () => {
    it('last item in a row is stretched to fill remaining columns', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
      ]
      const { container } = render(<DataDisplay items={items} column={3} />)
      // Row has 2 items but 3 columns → last item stretched to span 2
      const contents = getContents(container)
      // Second td: resolvedSpan=2, colSpan = 2*2-1 = 3
      expect(contents[1].getAttribute('colspan')).toBe('3')
    })

    it('item with span > column is clamped to column count', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Huge', children: 'Content', span: 10 },
      ]
      const { container } = render(<DataDisplay items={items} column={3} />)
      // Clamped to 3, then stretched to fill remaining = 3 total
      const rows = getRows(container)
      expect(rows.length).toBe(1)
    })

    it('overflowing item starts a new row', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'a' },
        { key: '2', label: 'B', children: 'b' },
        { key: '3', label: 'Wide', children: 'w', span: 2 },
        { key: '4', label: 'C', children: 'c' },
      ]
      const { container } = render(<DataDisplay items={items} column={3} />)
      // Row 1: A(1) + B(1) + Wide(2) won't fit → B stretched to 2, then Wide starts row 2
      // Actually: A(1)+B(1)=2, Wide(2)→2+2=4>3, so row break. B stretched to fill 3-2=1 extra → B=2
      // Row 2: Wide(2)+C(1)=3 → fits
      const rows = getRows(container)
      expect(rows.length).toBe(2)
    })
  })

  // ============================================================================
  // Global labelStyle / contentStyle
  // ============================================================================

  describe('global labelStyle / contentStyle', () => {
    it('applies global labelStyle to all labels', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} labelStyle={{ color: 'blue' }} />,
      )
      const labels = getLabels(container)
      expect(labels[0].style.color).toBe('blue')
      expect(labels[1].style.color).toBe('blue')
    })

    it('applies global contentStyle to all contents', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} contentStyle={{ fontStyle: 'italic' }} />,
      )
      const contents = getContents(container)
      expect(contents[0].style.fontStyle).toBe('italic')
    })
  })

  // ============================================================================
  // Per-item labelStyle / contentStyle
  // ============================================================================

  describe('per-item labelStyle / contentStyle', () => {
    it('per-item labelStyle overrides global', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Custom', children: 'Value', labelStyle: { color: 'red' } },
        { key: '2', label: 'Default', children: 'Value' },
      ]
      const { container } = render(
        <DataDisplay items={items} labelStyle={{ color: 'blue' }} />,
      )
      const labels = getLabels(container)
      expect(labels[0].style.color).toBe('red')
      expect(labels[1].style.color).toBe('blue')
    })

    it('per-item contentStyle overrides global', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'A', children: 'Custom', contentStyle: { background: 'yellow' } },
        { key: '2', label: 'B', children: 'Default' },
      ]
      const { container } = render(
        <DataDisplay items={items} contentStyle={{ background: 'white' }} />,
      )
      const contents = getContents(container)
      expect(contents[0].style.background).toBe('yellow')
      expect(contents[1].style.background).toBe('white')
    })
  })

  // ============================================================================
  // DataDisplay.Item children API
  // ============================================================================

  describe('DataDisplay.Item children API', () => {
    it('renders items from DataDisplay.Item children', () => {
      render(
        <DataDisplay>
          <DataDisplay.Item itemKey="a" label="Name">John</DataDisplay.Item>
          <DataDisplay.Item itemKey="b" label="Age">30</DataDisplay.Item>
        </DataDisplay>,
      )
      expect(screen.getByText('Name:')).toBeTruthy()
      expect(screen.getByText('John')).toBeTruthy()
      expect(screen.getByText('Age:')).toBeTruthy()
      expect(screen.getByText('30')).toBeTruthy()
    })

    it('items prop takes precedence over children', () => {
      const items: DataDisplayItem[] = [
        { key: 'x', label: 'From Items', children: 'Item Value' },
      ]
      render(
        <DataDisplay items={items}>
          <DataDisplay.Item itemKey="a" label="From Children">Child Value</DataDisplay.Item>
        </DataDisplay>,
      )
      expect(screen.getByText('From Items:')).toBeTruthy()
      expect(screen.queryByText('From Children:')).toBeNull()
    })

    it('DataDisplay.Item compound export exists', () => {
      expect(DataDisplay.Item).toBeTruthy()
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<DataDisplay items={defaultItems} classNames={{ root: 'dd-root' }} />)
      expect(getRoot(container).className).toContain('dd-root')
    })

    it('applies classNames.table', () => {
      const { container } = render(<DataDisplay items={defaultItems} classNames={{ table: 'dd-table' }} />)
      expect(getTable(container).className).toContain('dd-table')
    })

    it('applies classNames.header', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} title="Title" classNames={{ header: 'dd-header' }} />,
      )
      const header = getHeader(container)
      expect(header!.className).toContain('dd-header')
    })

    it('applies classNames.title', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} title="Title" classNames={{ title: 'dd-title' }} />,
      )
      const header = getHeader(container)
      const titleEl = header!.firstElementChild as HTMLElement
      expect(titleEl.className).toContain('dd-title')
    })

    it('applies classNames.extra', () => {
      render(
        <DataDisplay items={defaultItems} extra={<span>X</span>} classNames={{ extra: 'dd-extra' }} />,
      )
      const header = screen.getByText('X').parentElement as HTMLElement
      expect(header.className).toContain('dd-extra')
    })

    it('applies classNames.label to th cells', () => {
      const { container } = render(<DataDisplay items={defaultItems} classNames={{ label: 'dd-label' }} />)
      const labels = getLabels(container)
      labels.forEach((label) => {
        expect(label.className).toContain('dd-label')
      })
    })

    it('applies classNames.content to td cells', () => {
      const { container } = render(<DataDisplay items={defaultItems} classNames={{ content: 'dd-content' }} />)
      const contents = getContents(container)
      contents.forEach((content) => {
        expect(content.className).toContain('dd-content')
      })
    })

    it('applies classNames.row to tr elements', () => {
      const { container } = render(<DataDisplay items={defaultItems} classNames={{ row: 'dd-row' }} />)
      const rows = getRows(container)
      rows.forEach((row) => {
        expect(row.className).toContain('dd-row')
      })
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} styles={{ root: { margin: '10px' } }} />,
      )
      expect(getRoot(container).style.margin).toBe('10px')
    })

    it('applies styles.table', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} styles={{ table: { tableLayout: 'fixed' } }} />,
      )
      expect(getTable(container).style.tableLayout).toBe('fixed')
    })

    it('applies styles.header', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} title="T" styles={{ header: { borderBottom: '2px solid red' } }} />,
      )
      const header = getHeader(container)
      expect(header!.style.borderBottom).toContain('2px solid red')
    })

    it('applies styles.label to th cells', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} styles={{ label: { minWidth: '100px' } }} />,
      )
      const labels = getLabels(container)
      expect(labels[0].style.minWidth).toBe('100px')
    })

    it('applies styles.content to td cells', () => {
      const { container } = render(
        <DataDisplay items={defaultItems} styles={{ content: { wordBreak: 'break-all' } }} />,
      )
      const contents = getContents(container)
      expect(contents[0].style.wordBreak).toBe('break-all')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles empty items array', () => {
      const { container } = render(<DataDisplay items={[]} />)
      const rows = getRows(container)
      expect(rows.length).toBe(0)
    })

    it('handles single item', () => {
      const items: DataDisplayItem[] = [{ key: '1', label: 'Only', children: 'One' }]
      const { container } = render(<DataDisplay items={items} />)
      expect(screen.getByText('Only:')).toBeTruthy()
      expect(screen.getByText('One')).toBeTruthy()
    })

    it('handles item without label', () => {
      const items: DataDisplayItem[] = [{ key: '1', children: 'No label value' }]
      render(<DataDisplay items={items} />)
      expect(screen.getByText('No label value')).toBeTruthy()
    })

    it('handles item without children', () => {
      const items: DataDisplayItem[] = [{ key: '1', label: 'Empty' }]
      const { container } = render(<DataDisplay items={items} />)
      const labels = getLabels(container)
      expect(labels[0].textContent).toBe('Empty:')
    })

    it('renders ReactNode in label', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: <strong>Bold Label</strong>, children: 'Value' },
      ]
      render(<DataDisplay items={items} />)
      expect(screen.getByText('Bold Label')).toBeTruthy()
    })

    it('renders ReactNode in children', () => {
      const items: DataDisplayItem[] = [
        { key: '1', label: 'Link', children: <a href="#">Click</a> },
      ]
      render(<DataDisplay items={items} />)
      expect(screen.getByText('Click')).toBeTruthy()
    })

    it('label cells have verticalAlign top', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const labels = getLabels(container)
      expect(labels[0].style.verticalAlign).toBe('top')
    })

    it('content cells have verticalAlign top', () => {
      const { container } = render(<DataDisplay items={defaultItems} />)
      const contents = getContents(container)
      expect(contents[0].style.verticalAlign).toBe('top')
    })
  })
})
