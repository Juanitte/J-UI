import { useState } from 'react'
import { Text, ThemeProvider, useTheme, tokens } from '../index'
import { NavItem } from './sections/shared'
import { ButtonSection } from './sections/ButtonSection'
import { TooltipSection } from './sections/TooltipSection'
import { BadgeSection } from './sections/BadgeSection'
import { BubbleSection } from './sections/BubbleSection'
import { TextSection } from './sections/TextSection'
import { DividerSection } from './sections/DividerSection'
import { FlexSection } from './sections/FlexSection'
import { GridSection } from './sections/GridSection'
import { LayoutSection } from './sections/LayoutSection'
import { SpaceSection } from './sections/SpaceSection'
import { WaterfallSection } from './sections/WaterfallSection'
import { SplitterSection } from './sections/SplitterSection'
import { AnchorSection } from './sections/AnchorSection'
import { BreadcrumbSection } from './sections/BreadcrumbSection'
import { DropdownSection } from './sections/DropdownSection'
import { MenuSection } from './sections/MenuSection'
import { PaginationSection } from './sections/PaginationSection'
import { StepsSection } from './sections/StepsSection'
import { TabsSection } from './sections/TabsSection'
import { AutoCompleteSection } from './sections/AutoCompleteSection'
import { NestedSelectSection } from './sections/NestedSelectSection'
import { CheckboxSection } from './sections/CheckboxSection'
import { ColorPickerSection } from './sections/ColorPickerSection'
import { DatePickerSection } from './sections/DatePickerSection'
import { FormSection } from './sections/FormSection'
import { InputSection } from './sections/InputSection'
import { ThemeSection } from './sections/ThemeSection'

export function Playground() {
  return (
    <ThemeProvider>
      <PlaygroundContent />
    </ThemeProvider>
  )
}

function PlaygroundContent() {
  const [activeSection, setActiveSection] = useState<string>('button')
  const { mode, toggleMode } = useTheme()

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: tokens.colorBg,
        color: tokens.colorText,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          borderRight: `1px solid ${tokens.colorBorder}`,
          padding: 16,
          backgroundColor: tokens.colorBgSubtle,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text size="lg" weight="semibold">J-UI</Text>
          <button
            onClick={toggleMode}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 4,
              backgroundColor: tokens.colorBgMuted,
              color: tokens.colorText,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <NavItem
              label="Theme"
              active={activeSection === 'theme'}
              onClick={() => setActiveSection('theme')}
            />
            <NavItem
              label="Button"
              active={activeSection === 'button'}
              onClick={() => setActiveSection('button')}
            />
            <NavItem
              label="Tooltip"
              active={activeSection === 'tooltip'}
              onClick={() => setActiveSection('tooltip')}
            />
            <NavItem
              label="Badge"
              active={activeSection === 'badge'}
              onClick={() => setActiveSection('badge')}
            />
            <NavItem
              label="Bubble"
              active={activeSection === 'bubble'}
              onClick={() => setActiveSection('bubble')}
            />
            <NavItem
              label="Text"
              active={activeSection === 'text'}
              onClick={() => setActiveSection('text')}
            />
            <NavItem
              label="Divider"
              active={activeSection === 'divider'}
              onClick={() => setActiveSection('divider')}
            />
            <NavItem
              label="Flex"
              active={activeSection === 'flex'}
              onClick={() => setActiveSection('flex')}
            />
            <NavItem
              label="Grid"
              active={activeSection === 'grid'}
              onClick={() => setActiveSection('grid')}
            />
            <NavItem
              label="Layout"
              active={activeSection === 'layout'}
              onClick={() => setActiveSection('layout')}
            />
            <NavItem
              label="Space"
              active={activeSection === 'space'}
              onClick={() => setActiveSection('space')}
            />
            <NavItem
              label="Splitter"
              active={activeSection === 'splitter'}
              onClick={() => setActiveSection('splitter')}
            />
            <NavItem
              label="Anchor"
              active={activeSection === 'anchor'}
              onClick={() => setActiveSection('anchor')}
            />
            <NavItem
              label="Breadcrumb"
              active={activeSection === 'breadcrumb'}
              onClick={() => setActiveSection('breadcrumb')}
            />
            <NavItem
              label="Dropdown"
              active={activeSection === 'dropdown'}
              onClick={() => setActiveSection('dropdown')}
            />
            <NavItem
              label="Menu"
              active={activeSection === 'menu'}
              onClick={() => setActiveSection('menu')}
            />
            <NavItem
              label="Pagination"
              active={activeSection === 'pagination'}
              onClick={() => setActiveSection('pagination')}
            />
            <NavItem
              label="Steps"
              active={activeSection === 'steps'}
              onClick={() => setActiveSection('steps')}
            />
            <NavItem
              label="Tabs"
              active={activeSection === 'tabs'}
              onClick={() => setActiveSection('tabs')}
            />
            <NavItem
              label="AutoComplete"
              active={activeSection === 'autocomplete'}
              onClick={() => setActiveSection('autocomplete')}
            />
            <NavItem
              label="Waterfall"
              active={activeSection === 'waterfall'}
              onClick={() => setActiveSection('waterfall')}
            />
            <NavItem
              label="NestedSelect"
              active={activeSection === 'nestedselect'}
              onClick={() => setActiveSection('nestedselect')}
            />
            <NavItem
              label="Checkbox"
              active={activeSection === 'checkbox'}
              onClick={() => setActiveSection('checkbox')}
            />
            <NavItem
              label="ColorPicker"
              active={activeSection === 'colorpicker'}
              onClick={() => setActiveSection('colorpicker')}
            />
            <NavItem
              label="DatePicker"
              active={activeSection === 'datepicker'}
              onClick={() => setActiveSection('datepicker')}
            />
            <NavItem
              label="Form"
              active={activeSection === 'form'}
              onClick={() => setActiveSection('form')}
            />
            <NavItem
              label="Input"
              active={activeSection === 'input'}
              onClick={() => setActiveSection('input')}
            />
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 32, minWidth: 0 }}>
        {activeSection === 'button' && <ButtonSection />}
        {activeSection === 'tooltip' && <TooltipSection />}
        {activeSection === 'badge' && <BadgeSection />}
        {activeSection === 'bubble' && <BubbleSection />}
        {activeSection === 'text' && <TextSection />}
        {activeSection === 'divider' && <DividerSection />}
        {activeSection === 'flex' && <FlexSection />}
        {activeSection === 'grid' && <GridSection />}
        {activeSection === 'layout' && <LayoutSection />}
        {activeSection === 'space' && <SpaceSection />}
        {activeSection === 'splitter' && <SplitterSection />}
        {activeSection === 'anchor' && <AnchorSection />}
        {activeSection === 'breadcrumb' && <BreadcrumbSection />}
        {activeSection === 'dropdown' && <DropdownSection />}
        {activeSection === 'menu' && <MenuSection />}
        {activeSection === 'pagination' && <PaginationSection />}
        {activeSection === 'steps' && <StepsSection />}
        {activeSection === 'tabs' && <TabsSection />}
        {activeSection === 'autocomplete' && <AutoCompleteSection />}
        {activeSection === 'waterfall' && <WaterfallSection />}
        {activeSection === 'nestedselect' && <NestedSelectSection />}
        {activeSection === 'checkbox' && <CheckboxSection />}
        {activeSection === 'colorpicker' && <ColorPickerSection />}
        {activeSection === 'datepicker' && <DatePickerSection />}
        {activeSection === 'form' && <FormSection />}
        {activeSection === 'input' && <InputSection />}
        {activeSection === 'theme' && <ThemeSection />}
      </main>
    </div>
  )
}
