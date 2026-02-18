import { useState, useMemo } from 'react'
import { Select, Text, Form, useForm, tokens, Flex, Divider } from '../../index'
import type { SelectOption, SelectOptionGroup, SelectTagRenderProps } from '../../index'
import { Section } from './shared'

// ============================================================================
// Shared data
// ============================================================================

const plainOptions: SelectOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'swift', label: 'Swift' },
]

const groupedOptions: (SelectOption | SelectOptionGroup)[] = [
  {
    label: 'Frontend',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ],
  },
]

const disabledOptions: SelectOption[] = [
  { value: 'active1', label: 'Active option' },
  { value: 'disabled1', label: 'Disabled option', disabled: true },
  { value: 'active2', label: 'Another active' },
  { value: 'disabled2', label: 'Also disabled', disabled: true },
]

// ============================================================================
// Demo: Basic
// ============================================================================

function BasicDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select options={plainOptions} placeholder="Select a language" />
    </div>
  )
}

// ============================================================================
// Demo: Search
// ============================================================================

function SearchDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select options={plainOptions} showSearch placeholder="Search languages" />
    </div>
  )
}

// ============================================================================
// Demo: Multiple
// ============================================================================

function MultipleDemo() {
  return (
    <div style={{ width: 400 }}>
      <Select
        mode="multiple"
        options={plainOptions}
        defaultValue={['typescript', 'rust']}
        placeholder="Select languages"
      />
    </div>
  )
}

// ============================================================================
// Demo: Tags
// ============================================================================

function TagsDemo() {
  return (
    <div style={{ width: 400 }}>
      <Select
        mode="tags"
        options={plainOptions}
        defaultValue={['typescript', 'vue', 'nextjs']}
        placeholder="Type to create tags"
        tokenSeparators={[',']}
      />
    </div>
  )
}

// ============================================================================
// Demo: Sizes
// ============================================================================

function SizesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Select size="small" options={plainOptions} placeholder="Small" />
      <Select options={plainOptions} placeholder="Middle (default)" />
      <Select size="large" options={plainOptions} placeholder="Large" />
    </div>
  )
}

// ============================================================================
// Demo: Variants
// ============================================================================

function VariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Select variant="outlined" options={plainOptions} placeholder="Outlined (default)" />
      <Select variant="filled" options={plainOptions} placeholder="Filled" />
      <Select variant="borderless" options={plainOptions} placeholder="Borderless" />
    </div>
  )
}

// ============================================================================
// Demo: Disabled
// ============================================================================

function DisabledDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Select disabled options={plainOptions} defaultValue="typescript" placeholder="Disabled select" />
      <Select options={disabledOptions} placeholder="Some disabled options" />
    </div>
  )
}

// ============================================================================
// Demo: Status
// ============================================================================

function StatusDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Select status="error" options={plainOptions} placeholder="Error status" />
      <Select status="warning" options={plainOptions} placeholder="Warning status" />
    </div>
  )
}

// ============================================================================
// Demo: Groups
// ============================================================================

function GroupsDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select options={groupedOptions} showSearch placeholder="Select a language" />
    </div>
  )
}

// ============================================================================
// Demo: Custom Tags + maxTagCount
// ============================================================================

function CustomTagsDemo() {
  const customTagRender = (props: SelectTagRenderProps) => {
    const { label, closable, onClose } = props
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: 12,
          backgroundColor: tokens.colorPrimaryBg,
          color: tokens.colorPrimary,
          fontSize: '0.75rem',
          fontWeight: 600,
          border: `1px solid ${tokens.colorPrimaryBorder}`,
        }}
      >
        {label}
        {closable && (
          <span
            onClick={(e) => { e.stopPropagation(); onClose() }}
            onMouseDown={(e) => e.preventDefault()}
            style={{ cursor: 'pointer', marginLeft: 4 }}
          >
            x
          </span>
        )}
      </span>
    )
  }

  return (
    <div style={{ width: 400 }}>
      <Select
        mode="multiple"
        options={plainOptions}
        defaultValue={['typescript', 'rust', 'go', 'python']}
        tagRender={customTagRender}
        maxTagCount={2}
        maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
        placeholder="Custom tags"
      />
    </div>
  )
}

// ============================================================================
// Demo: Remote Search
// ============================================================================

function RemoteSearchDemo() {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = (value: string) => {
    if (!value) {
      setOptions([])
      return
    }
    setLoading(true)
    setTimeout(() => {
      setOptions([
        { value: `${value}-1`, label: `${value} result 1` },
        { value: `${value}-2`, label: `${value} result 2` },
        { value: `${value}-3`, label: `${value} result 3` },
      ])
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ width: 300 }}>
      <Select
        showSearch
        options={options}
        loading={loading}
        filterOption={false}
        onSearch={handleSearch}
        placeholder="Type to search..."
        notFoundContent={loading ? 'Loading...' : 'No results'}
      />
    </div>
  )
}

// ============================================================================
// Demo: Semantic styles
// ============================================================================

function SemanticDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select
        options={plainOptions}
        defaultValue="typescript"
        styles={{
          selector: {
            borderRadius: 12,
            border: `2px solid ${tokens.colorPrimary}`,
            backgroundColor: tokens.colorPrimaryBg,
          },
          dropdown: {
            borderRadius: 12,
            border: `2px solid ${tokens.colorPrimary}`,
          },
        }}
      />
    </div>
  )
}

// ============================================================================
// Demo: Form integration
// ============================================================================

function FormIntegrationDemo() {
  const [form] = useForm()

  return (
    <div style={{ width: 400 }}>
      <Form form={form} layout="vertical" onFinish={(v) => alert(JSON.stringify(v, null, 2))}>
        <Form.Item name="language" label="Favorite language" rules={[{ required: true }]}>
          <Select options={plainOptions} placeholder="Pick one" />
        </Form.Item>
        <Form.Item name="skills" label="Skills" rules={[{ required: true }]}>
          <Select mode="multiple" options={plainOptions} placeholder="Pick multiple" />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            style={{
              padding: '8px 24px', border: 'none', borderRadius: 6,
              backgroundColor: tokens.colorPrimary, color: tokens.colorPrimaryContrast,
              cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
            }}
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </div>
  )
}

// ============================================================================
// Demo: Multi-field search
// ============================================================================

const multiFieldOptions: SelectOption[] = [
  { value: 'jack', label: 'Jack', desc: 'Frontend developer' } as SelectOption & { desc: string },
  { value: 'lucy', label: 'Lucy', desc: 'Backend engineer' } as SelectOption & { desc: string },
  { value: 'tom', label: 'Tom', desc: 'Full-stack developer' } as SelectOption & { desc: string },
  { value: 'jerry', label: 'Jerry', desc: 'DevOps engineer' } as SelectOption & { desc: string },
]

function MultiFieldSearchDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select
        showSearch
        options={multiFieldOptions}
        placeholder="Search by name or role"
        filterOption={(input, option) => {
          const search = input.toLowerCase()
          const opt = option as SelectOption & { desc?: string }
          return (
            String(opt.label).toLowerCase().includes(search) ||
            (opt.desc?.toLowerCase().includes(search) ?? false)
          )
        }}
        optionRender={(option) => {
          const opt = option as SelectOption & { desc?: string }
          return (
            <div>
              <div>{opt.label}</div>
              <div style={{ fontSize: '0.75rem', color: tokens.colorTextSubtle }}>{opt.desc}</div>
            </div>
          )
        }}
      />
    </div>
  )
}

// ============================================================================
// Demo: Custom option render
// ============================================================================

const emojiOptions: SelectOption[] = [
  { value: 'react', label: 'React', emoji: '⚛️', desc: 'A JavaScript library for building UIs' } as SelectOption & { emoji: string; desc: string },
  { value: 'vue', label: 'Vue', emoji: '🟢', desc: 'The progressive JavaScript framework' } as SelectOption & { emoji: string; desc: string },
  { value: 'angular', label: 'Angular', emoji: '🅰️', desc: 'Platform for building web apps' } as SelectOption & { emoji: string; desc: string },
  { value: 'svelte', label: 'Svelte', emoji: '🔥', desc: 'Cybernetically enhanced web apps' } as SelectOption & { emoji: string; desc: string },
]

function CustomOptionRenderDemo() {
  return (
    <div style={{ width: 320 }}>
      <Select
        options={emojiOptions}
        placeholder="Choose a framework"
        optionRender={(option) => {
          const opt = option as SelectOption & { emoji?: string; desc?: string }
          return (
            <Flex align="center" gap={10}>
              <span style={{ fontSize: '1.25rem' }}>{opt.emoji}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{opt.label}</div>
                <div style={{ fontSize: '0.75rem', color: tokens.colorTextSubtle }}>{opt.desc}</div>
              </div>
            </Flex>
          )
        }}
      />
    </div>
  )
}

// ============================================================================
// Demo: Search with sort
// ============================================================================

function SearchWithSortDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select
        showSearch
        options={plainOptions}
        placeholder="Search & sort alphabetically"
        filterSort={(a, b) =>
          String(a.label).toLowerCase().localeCompare(String(b.label).toLowerCase())
        }
      />
    </div>
  )
}

// ============================================================================
// Demo: Coordinate (cascading selects)
// ============================================================================

const provinceData: Record<string, string[]> = {
  Andalucía: ['Sevilla', 'Málaga', 'Córdoba'],
  Cataluña: ['Barcelona', 'Girona', 'Tarragona'],
}
const provinces = Object.keys(provinceData)

function CoordinateDemo() {
  const [cities, setCities] = useState<string[]>(provinceData[provinces[0]])
  const [selectedCity, setSelectedCity] = useState<string>(provinceData[provinces[0]][0])

  const handleProvinceChange = (value: string | number) => {
    const newCities = provinceData[value as string]
    setCities(newCities)
    setSelectedCity(newCities[0])
  }

  return (
    <Flex gap={12}>
      <Select
        defaultValue={provinces[0]}
        options={provinces.map((p) => ({ value: p, label: p }))}
        onChange={handleProvinceChange}
        style={{ width: 160 }}
      />
      <Select
        value={selectedCity}
        options={cities.map((c) => ({ value: c, label: c }))}
        onChange={(v) => setSelectedCity(v as string)}
        style={{ width: 160 }}
      />
    </Flex>
  )
}

// ============================================================================
// Demo: labelInValue
// ============================================================================

function LabelInValueDemo() {
  const [output, setOutput] = useState<string>('')

  return (
    <div style={{ width: 300 }}>
      <Select
        labelInValue
        options={plainOptions}
        placeholder="Select a language"
        onChange={(val) => setOutput(JSON.stringify(val, null, 2))}
      />
      {output && (
        <pre style={{
          marginTop: 8, padding: 8, borderRadius: 6,
          backgroundColor: tokens.colorBgSubtle, fontSize: '0.75rem',
          border: `1px solid ${tokens.colorBorder}`,
        }}>
          {output}
        </pre>
      )}
    </div>
  )
}

// ============================================================================
// Demo: Automatic tokenization
// ============================================================================

function TokenizationDemo() {
  return (
    <div style={{ width: 400 }}>
      <Select
        mode="tags"
        options={plainOptions}
        tokenSeparators={[',']}
        placeholder="Try pasting: React,Vue,Angular"
      />
    </div>
  )
}

// ============================================================================
// Demo: Custom dropdown (dropdownRender)
// ============================================================================

function CustomDropdownDemo() {
  const [items, setItems] = useState<SelectOption[]>([...plainOptions])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (!newItem.trim()) return
    const val = newItem.toLowerCase().replace(/\s+/g, '-')
    setItems((prev) => [...prev, { value: val, label: newItem.trim() }])
    setNewItem('')
  }

  return (
    <div style={{ width: 300 }}>
      <Select
        options={items}
        placeholder="Select or add item"
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', gap: 8, padding: '4px 8px' }}>
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="New item"
                style={{
                  flex: 1, padding: '4px 8px', border: `1px solid ${tokens.colorBorder}`,
                  borderRadius: 4, fontSize: '0.875rem', outline: 'none',
                  backgroundColor: tokens.colorBg, color: tokens.colorText,
                }}
              />
              <button
                onClick={addItem}
                style={{
                  padding: '4px 12px', border: 'none', borderRadius: 4,
                  backgroundColor: tokens.colorPrimary, color: tokens.colorPrimaryContrast,
                  cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap',
                }}
              >
                + Add
              </button>
            </div>
          </>
        )}
      />
    </div>
  )
}

// ============================================================================
// Demo: Hide already selected
// ============================================================================

function HideSelectedDemo() {
  const [selected, setSelected] = useState<(string | number)[]>(['typescript'])

  const filteredOptions = plainOptions.filter((o) => !selected.includes(o.value))

  return (
    <div style={{ width: 400 }}>
      <Select
        mode="multiple"
        value={selected}
        options={filteredOptions}
        placeholder="Selected items are hidden from list"
        onChange={(val) => setSelected(val as (string | number)[])}
      />
    </div>
  )
}

// ============================================================================
// Demo: Custom selected label render (labelRender)
// ============================================================================

const colorOptions: SelectOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
]

const colorMap: Record<string, string> = {
  red: '#ef4444', green: '#22c55e', blue: '#3b82f6', orange: '#f97316', purple: '#a855f7',
}

function LabelRenderDemo() {
  return (
    <div style={{ width: 300 }}>
      <Select
        options={colorOptions}
        defaultValue="blue"
        labelRender={({ label, value }) => (
          <Flex align="center" gap={8}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              backgroundColor: colorMap[value as string] ?? tokens.colorBorder,
              display: 'inline-block', flexShrink: 0,
            }} />
            {label}
          </Flex>
        )}
      />
    </div>
  )
}

// ============================================================================
// Demo: Big Data (virtual scroll)
// ============================================================================

function BigDataDemo() {
  const bigOptions = useMemo<SelectOption[]>(() =>
    Array.from({ length: 100_000 }, (_, i) => ({
      value: `opt-${i}`,
      label: `Option ${i + 1}`,
    })), [])

  const smallOptions = useMemo<SelectOption[]>(() =>
    bigOptions.slice(0, 1000), [bigOptions])

  return (
    <Flex vertical gap={12} style={{ width: 300 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 4 }}>
          Virtual scroll (100,000 items)
        </Text>
        <Select
          showSearch
          options={bigOptions}
          placeholder="Scroll through 100k items"
        />
      </div>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 4 }}>
          No virtual scroll (1,000 items)
        </Text>
        <Select
          showSearch
          virtual={false}
          options={smallOptions}
          placeholder="Non-virtual (1k items)"
        />
      </div>
    </Flex>
  )
}

// ============================================================================
// Demo: Max count
// ============================================================================

function MaxCountDemo() {
  return (
    <div style={{ width: 400 }}>
      <Select
        mode="multiple"
        maxCount={3}
        options={plainOptions}
        placeholder="Select up to 3 languages"
      />
    </div>
  )
}

// ============================================================================
// Demo: Placement
// ============================================================================

function PlacementDemo() {
  return (
    <Flex wrap gap={24}>
      <Select options={plainOptions} placement="bottomLeft" popupMatchSelectWidth={false} placeholder="bottomLeft" style={{ width: 140 }} />
      <Select options={plainOptions} placement="bottomRight" popupMatchSelectWidth={false} placeholder="bottomRight" style={{ width: 140 }} />
      <Select options={plainOptions} placement="topLeft" popupMatchSelectWidth={false} placeholder="topLeft" style={{ width: 140 }} />
      <Select options={plainOptions} placement="topRight" popupMatchSelectWidth={false} placeholder="topRight" style={{ width: 140 }} />
    </Flex>
  )
}

// ============================================================================
// Demo: Prefix and Suffix
// ============================================================================

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

function PrefixSuffixDemo() {
  return (
    <Flex vertical gap={12} style={{ width: 300 }}>
      <Select
        showSearch
        options={plainOptions}
        prefix={<SearchIcon />}
        placeholder="With prefix icon"
      />
      <Select
        options={plainOptions}
        prefix={<GlobeIcon />}
        suffix={<span style={{ fontSize: '0.75rem', color: tokens.colorTextSubtle }}>Lang</span>}
        placeholder="Custom suffix"
      />
    </Flex>
  )
}

// ============================================================================
// Main Section
// ============================================================================

export function SelectSection() {
  return (
    <div>
      <Text size="xl" weight="bold">Select</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        A dropdown selector component for choosing from a list of options.
      </Text>

      <Section title="Basic usage">
        <BasicDemo />
      </Section>

      <Section title="Search" align="start">
        <SearchDemo />
      </Section>

      <Section title="Multiple" align="start">
        <MultipleDemo />
      </Section>

      <Section title="Tags mode" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Unlike multiple mode, tags mode allows creating new options by typing free text.
            "vue" and "nextjs" below are custom tags not in the original options.
          </Text>
          <TagsDemo />
        </Flex>
      </Section>

      <Section title="Sizes" align="start">
        <SizesDemo />
      </Section>

      <Section title="Variants" align="start">
        <VariantsDemo />
      </Section>

      <Section title="Disabled" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Status" align="start">
        <StatusDemo />
      </Section>

      <Section title="Placement" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Control which direction the dropdown opens.
          </Text>
          <PlacementDemo />
        </Flex>
      </Section>

      <Section title="Groups" align="start">
        <GroupsDemo />
      </Section>

      <Section title="Custom tags + maxTagCount" align="start">
        <CustomTagsDemo />
      </Section>

      <Section title="Remote search" align="start">
        <RemoteSearchDemo />
      </Section>

      <Section title="Semantic styles" align="start">
        <SemanticDemo />
      </Section>

      <Section title="Form integration" align="start">
        <FormIntegrationDemo />
      </Section>

      <Section title="Multi-field search" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Custom filterOption searches across both label and description fields.
          </Text>
          <MultiFieldSearchDemo />
        </Flex>
      </Section>

      <Section title="Custom option render" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Use optionRender to customize how options appear in the dropdown.
          </Text>
          <CustomOptionRenderDemo />
        </Flex>
      </Section>

      <Section title="Search with sort" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            filterSort reorders matching options alphabetically while searching.
          </Text>
          <SearchWithSortDemo />
        </Flex>
      </Section>

      <Section title="Coordinate" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Two linked selects: changing the community updates the available cities.
          </Text>
          <CoordinateDemo />
        </Flex>
      </Section>

      <Section title="labelInValue" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            When labelInValue is enabled, onChange receives {'{value, label}'} instead of just the value.
          </Text>
          <LabelInValueDemo />
        </Flex>
      </Section>

      <Section title="Automatic tokenization" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Tags mode with tokenSeparators. Try pasting: React,Vue,Angular
          </Text>
          <TokenizationDemo />
        </Flex>
      </Section>

      <Section title="Custom dropdown" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            dropdownRender adds a custom footer with an "Add item" button.
          </Text>
          <CustomDropdownDemo />
        </Flex>
      </Section>

      <Section title="Hide already selected" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Selected options are filtered out of the dropdown list.
          </Text>
          <HideSelectedDemo />
        </Flex>
      </Section>

      <Section title="Custom label render" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            labelRender customizes how the selected value is displayed in the selector.
          </Text>
          <LabelRenderDemo />
        </Flex>
      </Section>

      <Section title="Big data (virtual scroll)" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Virtual scroll renders only visible items for smooth performance with large datasets.
          </Text>
          <BigDataDemo />
        </Flex>
      </Section>

      <Section title="Max count" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Limits the number of selections. Unselected options become disabled once the limit is reached.
          </Text>
          <MaxCountDemo />
        </Flex>
      </Section>

      <Section title="Prefix & Suffix" align="start">
        <Flex vertical>
          <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            prefix adds an icon before the value. suffix replaces the default chevron.
          </Text>
          <PrefixSuffixDemo />
        </Flex>
      </Section>
    </div>
  )
}
