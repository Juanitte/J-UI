import { useState, useEffect } from 'react'
import { Text, ThemeProvider, useTheme, tokens } from '../index'
import { NavItem } from './sections/shared'
import { ButtonSection } from './sections/ButtonSection'
import { TooltipSection } from './sections/TooltipSection'
import { PopoverSection } from './sections/PopoverSection'
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
import { CalendarSection } from './sections/CalendarSection'
import { CardSection } from './sections/CardSection'
import { CarouselSection } from './sections/CarouselSection'
import { CollapseSection } from './sections/CollapseSection'
import { EmptySection } from './sections/EmptySection'
import { ImageSection } from './sections/ImageSection'
import { QRCodeSection } from './sections/QRCodeSection'
import { StatisticSection } from './sections/StatisticSection'
import { TableSection } from './sections/TableSection'
import { DataDisplaySection } from './sections/DataDisplaySection'
import { DatePickerSection } from './sections/DatePickerSection'
import { FormSection } from './sections/FormSection'
import { InputSection } from './sections/InputSection'
import { InputNumberSection } from './sections/InputNumberSection'
import { MentionSection } from './sections/MentionSection'
import { RadioSection } from './sections/RadioSection'
import { RateSection } from './sections/RateSection'
import { SelectSection } from './sections/SelectSection'
import { SliderSection } from './sections/SliderSection'
import { SpinnerSection } from './sections/SpinnerSection'
import { SwitchSection } from './sections/SwitchSection'
import { TimePickerSection } from './sections/TimePickerSection'
import { ToggleSection } from './sections/ToggleSection'
import { TransferSection } from './sections/TransferSection'
import { TreeSelectSection } from './sections/TreeSelectSection'
import { TreeSection } from './sections/TreeSection'
import { UploadSection } from './sections/UploadSection'
import { AvatarSection } from './sections/AvatarSection'
import { TagSection } from './sections/TagSection'
import { TimelineSection } from './sections/TimelineSection'
import { TourSection } from './sections/TourSection'
import { AlertSection } from './sections/AlertSection'
import { DrawerSection } from './sections/DrawerSection'
import { ModalSection } from './sections/ModalSection'
import { PopAlertSection } from './sections/PopAlertSection'
import { PopConfirmSection } from './sections/PopConfirmSection'
import { PlaceholderSection } from './sections/PlaceholderSection'
import { ProgressSection } from './sections/ProgressSection'
import { ResultSection } from './sections/ResultSection'
import { WatermarkSection } from './sections/WatermarkSection'
import { ThemeSection } from './sections/ThemeSection'

export function Playground() {
  return (
    <ThemeProvider>
      <PlaygroundContent />
    </ThemeProvider>
  )
}

const MOBILE_BREAKPOINT = 768

function PlaygroundContent() {
  const [activeSection, setActiveSection] = useState<string>('button')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )
  const { mode, toggleMode } = useTheme()

  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const handleNavClick = (section: string) => {
    setActiveSection(section)
    if (isMobile) setSidebarOpen(false)
  }

  const sidebarContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text size="lg" weight="semibold">J-UI</Text>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '4px 8px',
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: 4,
                backgroundColor: tokens.colorBgMuted,
                color: tokens.colorText,
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <NavItem
              label="Theme"
              active={activeSection === 'theme'}
              onClick={() => handleNavClick('theme')}
            />
            <NavItem
              label="Button"
              active={activeSection === 'button'}
              onClick={() => handleNavClick('button')}
            />
            <NavItem
              label="Tooltip"
              active={activeSection === 'tooltip'}
              onClick={() => handleNavClick('tooltip')}
            />
            <NavItem
              label="Popover"
              active={activeSection === 'popover'}
              onClick={() => handleNavClick('popover')}
            />
            <NavItem
              label="Badge"
              active={activeSection === 'badge'}
              onClick={() => handleNavClick('badge')}
            />
            <NavItem
              label="Bubble"
              active={activeSection === 'bubble'}
              onClick={() => handleNavClick('bubble')}
            />
            <NavItem
              label="Text"
              active={activeSection === 'text'}
              onClick={() => handleNavClick('text')}
            />
            <NavItem
              label="Divider"
              active={activeSection === 'divider'}
              onClick={() => handleNavClick('divider')}
            />
            <NavItem
              label="Flex"
              active={activeSection === 'flex'}
              onClick={() => handleNavClick('flex')}
            />
            <NavItem
              label="Grid"
              active={activeSection === 'grid'}
              onClick={() => handleNavClick('grid')}
            />
            <NavItem
              label="Layout"
              active={activeSection === 'layout'}
              onClick={() => handleNavClick('layout')}
            />
            <NavItem
              label="Space"
              active={activeSection === 'space'}
              onClick={() => handleNavClick('space')}
            />
            <NavItem
              label="Splitter"
              active={activeSection === 'splitter'}
              onClick={() => handleNavClick('splitter')}
            />
            <NavItem
              label="Anchor"
              active={activeSection === 'anchor'}
              onClick={() => handleNavClick('anchor')}
            />
            <NavItem
              label="Breadcrumb"
              active={activeSection === 'breadcrumb'}
              onClick={() => handleNavClick('breadcrumb')}
            />
            <NavItem
              label="Dropdown"
              active={activeSection === 'dropdown'}
              onClick={() => handleNavClick('dropdown')}
            />
            <NavItem
              label="Menu"
              active={activeSection === 'menu'}
              onClick={() => handleNavClick('menu')}
            />
            <NavItem
              label="Pagination"
              active={activeSection === 'pagination'}
              onClick={() => handleNavClick('pagination')}
            />
            <NavItem
              label="Steps"
              active={activeSection === 'steps'}
              onClick={() => handleNavClick('steps')}
            />
            <NavItem
              label="Tabs"
              active={activeSection === 'tabs'}
              onClick={() => handleNavClick('tabs')}
            />
            <NavItem
              label="AutoComplete"
              active={activeSection === 'autocomplete'}
              onClick={() => handleNavClick('autocomplete')}
            />
            <NavItem
              label="Waterfall"
              active={activeSection === 'waterfall'}
              onClick={() => handleNavClick('waterfall')}
            />
            <NavItem
              label="NestedSelect"
              active={activeSection === 'nestedselect'}
              onClick={() => handleNavClick('nestedselect')}
            />
            <NavItem
              label="Checkbox"
              active={activeSection === 'checkbox'}
              onClick={() => handleNavClick('checkbox')}
            />
            <NavItem
              label="ColorPicker"
              active={activeSection === 'colorpicker'}
              onClick={() => handleNavClick('colorpicker')}
            />
            <NavItem
              label="Calendar"
              active={activeSection === 'calendar'}
              onClick={() => handleNavClick('calendar')}
            />
            <NavItem
              label="Card"
              active={activeSection === 'card'}
              onClick={() => handleNavClick('card')}
            />
            <NavItem
              label="Carousel"
              active={activeSection === 'carousel'}
              onClick={() => handleNavClick('carousel')}
            />
            <NavItem
              label="Collapse"
              active={activeSection === 'collapse'}
              onClick={() => handleNavClick('collapse')}
            />
            <NavItem
              label="DataDisplay"
              active={activeSection === 'datadisplay'}
              onClick={() => handleNavClick('datadisplay')}
            />
            <NavItem
              label="Empty"
              active={activeSection === 'empty'}
              onClick={() => handleNavClick('empty')}
            />
            <NavItem
              label="Image"
              active={activeSection === 'image'}
              onClick={() => handleNavClick('image')}
            />
            <NavItem
              label="QRCode"
              active={activeSection === 'qrcode'}
              onClick={() => handleNavClick('qrcode')}
            />
            <NavItem
              label="Statistic"
              active={activeSection === 'statistic'}
              onClick={() => handleNavClick('statistic')}
            />
            <NavItem
              label="Table"
              active={activeSection === 'table'}
              onClick={() => handleNavClick('table')}
            />
            <NavItem
              label="DatePicker"
              active={activeSection === 'datepicker'}
              onClick={() => handleNavClick('datepicker')}
            />
            <NavItem
              label="Form"
              active={activeSection === 'form'}
              onClick={() => handleNavClick('form')}
            />
            <NavItem
              label="Input"
              active={activeSection === 'input'}
              onClick={() => handleNavClick('input')}
            />
            <NavItem
              label="InputNumber"
              active={activeSection === 'inputnumber'}
              onClick={() => handleNavClick('inputnumber')}
            />
            <NavItem
              label="Mention"
              active={activeSection === 'mention'}
              onClick={() => handleNavClick('mention')}
            />
            <NavItem
              label="Radio"
              active={activeSection === 'radio'}
              onClick={() => handleNavClick('radio')}
            />
            <NavItem
              label="Rate"
              active={activeSection === 'rate'}
              onClick={() => handleNavClick('rate')}
            />
            <NavItem
              label="Select"
              active={activeSection === 'select'}
              onClick={() => handleNavClick('select')}
            />
            <NavItem
              label="Slider"
              active={activeSection === 'slider'}
              onClick={() => handleNavClick('slider')}
            />
            <NavItem
              label="Spinner"
              active={activeSection === 'spinner'}
              onClick={() => handleNavClick('spinner')}
            />
            <NavItem
              label="Switch"
              active={activeSection === 'switch'}
              onClick={() => handleNavClick('switch')}
            />
            <NavItem
              label="TimePicker"
              active={activeSection === 'timepicker'}
              onClick={() => handleNavClick('timepicker')}
            />
            <NavItem
              label="Toggle"
              active={activeSection === 'toggle'}
              onClick={() => handleNavClick('toggle')}
            />
            <NavItem
              label="Transfer"
              active={activeSection === 'transfer'}
              onClick={() => handleNavClick('transfer')}
            />
            <NavItem
              label="Tree"
              active={activeSection === 'tree'}
              onClick={() => handleNavClick('tree')}
            />
            <NavItem
              label="TreeSelect"
              active={activeSection === 'treeselect'}
              onClick={() => handleNavClick('treeselect')}
            />
            <NavItem
              label="Upload"
              active={activeSection === 'upload'}
              onClick={() => handleNavClick('upload')}
            />
            <NavItem
              label="Tag"
              active={activeSection === 'tag'}
              onClick={() => handleNavClick('tag')}
            />
            <NavItem
              label="Timeline"
              active={activeSection === 'timeline'}
              onClick={() => handleNavClick('timeline')}
            />
            <NavItem
              label="Tour"
              active={activeSection === 'tour'}
              onClick={() => handleNavClick('tour')}
            />
            <NavItem
              label="Alert"
              active={activeSection === 'alert'}
              onClick={() => handleNavClick('alert')}
            />
            <NavItem
              label="Drawer"
              active={activeSection === 'drawer'}
              onClick={() => handleNavClick('drawer')}
            />
            <NavItem
              label="Modal"
              active={activeSection === 'modal'}
              onClick={() => handleNavClick('modal')}
            />
            <NavItem
              label="PopAlert"
              active={activeSection === 'popalert'}
              onClick={() => handleNavClick('popalert')}
            />
            <NavItem
              label="PopConfirm"
              active={activeSection === 'popconfirm'}
              onClick={() => handleNavClick('popconfirm')}
            />
            <NavItem
              label="Placeholder"
              active={activeSection === 'placeholder'}
              onClick={() => handleNavClick('placeholder')}
            />
            <NavItem
              label="Progress"
              active={activeSection === 'progress'}
              onClick={() => handleNavClick('progress')}
            />
            <NavItem
              label="Result"
              active={activeSection === 'result'}
              onClick={() => handleNavClick('result')}
            />
            <NavItem
              label="Watermark"
              active={activeSection === 'watermark'}
              onClick={() => handleNavClick('watermark')}
            />
            <NavItem
              label="Avatar"
              active={activeSection === 'avatar'}
              onClick={() => handleNavClick('avatar')}
            />
          </ul>
        </nav>
    </>
  )

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: tokens.colorBg,
        color: tokens.colorText,
        overflowX: 'hidden' as const,
      }}
    >
      {/* Mobile top bar */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
            backgroundColor: tokens.colorBgSubtle,
            borderBottom: `1px solid ${tokens.colorBorder}`,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 4,
              backgroundColor: tokens.colorBgMuted,
              color: tokens.colorText,
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <Text size="md" weight="semibold">J-UI</Text>
        </div>
      )}

      {/* Sidebar overlay backdrop (mobile) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1001,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          borderRight: `1px solid ${tokens.colorBorder}`,
          padding: 16,
          backgroundColor: tokens.colorBgSubtle,
          scrollbarColor: `${tokens.colorSecondaryHover} transparent`,
          position: 'fixed',
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          ...(isMobile ? {
            left: sidebarOpen ? 0 : -260,
            zIndex: 1002,
            transition: 'left 200ms ease',
          } : {
            left: 0,
          }),
        }}
      >
        {sidebarContent}
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: isMobile ? '64px 16px 16px' : 32, minWidth: 0, marginLeft: isMobile ? 0 : 240 }}>
        {activeSection === 'button' && <ButtonSection />}
        {activeSection === 'tooltip' && <TooltipSection />}
        {activeSection === 'popover' && <PopoverSection />}
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
        {activeSection === 'calendar' && <CalendarSection />}
        {activeSection === 'card' && <CardSection />}
        {activeSection === 'carousel' && <CarouselSection />}
        {activeSection === 'collapse' && <CollapseSection />}
        {activeSection === 'datadisplay' && <DataDisplaySection />}
        {activeSection === 'empty' && <EmptySection />}
        {activeSection === 'image' && <ImageSection />}
        {activeSection === 'qrcode' && <QRCodeSection />}
        {activeSection === 'statistic' && <StatisticSection />}
        {activeSection === 'table' && <TableSection />}
        {activeSection === 'datepicker' && <DatePickerSection />}
        {activeSection === 'form' && <FormSection />}
        {activeSection === 'input' && <InputSection />}
        {activeSection === 'inputnumber' && <InputNumberSection />}
        {activeSection === 'mention' && <MentionSection />}
        {activeSection === 'radio' && <RadioSection />}
        {activeSection === 'rate' && <RateSection />}
        {activeSection === 'select' && <SelectSection />}
        {activeSection === 'slider' && <SliderSection />}
        {activeSection === 'spinner' && <SpinnerSection />}
        {activeSection === 'switch' && <SwitchSection />}
        {activeSection === 'timepicker' && <TimePickerSection />}
        {activeSection === 'toggle' && <ToggleSection />}
        {activeSection === 'transfer' && <TransferSection />}
        {activeSection === 'tree' && <TreeSection />}
        {activeSection === 'treeselect' && <TreeSelectSection />}
        {activeSection === 'upload' && <UploadSection />}
        {activeSection === 'tag' && <TagSection />}
        {activeSection === 'timeline' && <TimelineSection />}
        {activeSection === 'tour' && <TourSection />}
        {activeSection === 'alert' && <AlertSection />}
        {activeSection === 'drawer' && <DrawerSection />}
        {activeSection === 'modal' && <ModalSection />}
        {activeSection === 'popalert' && <PopAlertSection />}
        {activeSection === 'popconfirm' && <PopConfirmSection />}
        {activeSection === 'placeholder' && <PlaceholderSection />}
        {activeSection === 'progress' && <ProgressSection />}
        {activeSection === 'result' && <ResultSection />}
        {activeSection === 'watermark' && <WatermarkSection />}
        {activeSection === 'avatar' && <AvatarSection />}
        {activeSection === 'theme' && <ThemeSection />}
      </main>
    </div>
  )
}
