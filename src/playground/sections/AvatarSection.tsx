import { Avatar, Badge, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── Shared ─────────────────────────────────────────────────────────────────────

const sampleImg = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix'
const sampleImg2 = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luna'
const sampleImg3 = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bear'
const sampleImg4 = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Coco'
const sampleImg5 = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Max'

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function UserCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}

// ─── 1. Basic ───────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar src={sampleImg} alt="Felix" />
      <Avatar icon={<UserCircleIcon size={18} />} />
      <Avatar>U</Avatar>
      <Avatar style={{ backgroundColor: tokens.colorPrimary as string, color: '#fff' }}>JD</Avatar>
    </div>
  )
}

// ─── 2. Sizes ───────────────────────────────────────────────────────────────────

function SizesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar size="small" src={sampleImg} />
      <Avatar size="default" src={sampleImg} />
      <Avatar size="large" src={sampleImg} />
      <Avatar size={64} src={sampleImg} />

      <Avatar size="small">S</Avatar>
      <Avatar size="default">M</Avatar>
      <Avatar size="large">L</Avatar>
      <Avatar size={64}>XL</Avatar>
    </div>
  )
}

// ─── 3. Shapes ──────────────────────────────────────────────────────────────────

function ShapesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar shape="circle" src={sampleImg} />
      <Avatar shape="square" src={sampleImg} />
      <Avatar shape="circle" icon={<StarIcon size={18} />} />
      <Avatar shape="square" icon={<StarIcon size={18} />} />
      <Avatar shape="circle">A</Avatar>
      <Avatar shape="square">B</Avatar>
    </div>
  )
}

// ─── 4. Auto-Scale Text ─────────────────────────────────────────────────────────

function AutoScaleTextDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar>U</Avatar>
      <Avatar>Tom</Avatar>
      <Avatar>UserName</Avatar>
      <Avatar size="large">AB</Avatar>
      <Avatar size="large">LongName</Avatar>
      <Avatar size="small" gap={2}>Hi</Avatar>
    </div>
  )
}

// ─── 5. Fallback ────────────────────────────────────────────────────────────────

function FallbackDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text size="sm" type="secondary" style={{ width: 200 }}>Broken src + icon fallback:</Text>
        <Avatar src="https://invalid-url.test/nope.png" icon={<UserCircleIcon size={18} />} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text size="sm" type="secondary" style={{ width: 200 }}>Broken src + text fallback:</Text>
        <Avatar src="https://invalid-url.test/nope.png">FB</Avatar>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text size="sm" type="secondary" style={{ width: 200 }}>No src, no icon, no text:</Text>
        <Avatar />
      </div>
    </div>
  )
}

// ─── 6. Avatar.Group ────────────────────────────────────────────────────────────

function GroupDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Basic group
        </Text>
        <Avatar.Group>
          <Avatar src={sampleImg} />
          <Avatar src={sampleImg2} />
          <Avatar src={sampleImg3} />
          <Avatar src={sampleImg4} />
        </Avatar.Group>
      </div>

      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          With max count (3)
        </Text>
        <Avatar.Group max={{ count: 3 }}>
          <Avatar src={sampleImg} />
          <Avatar src={sampleImg2} />
          <Avatar src={sampleImg3} />
          <Avatar src={sampleImg4} />
          <Avatar src={sampleImg5} />
        </Avatar.Group>
      </div>

      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Large size + square shape
        </Text>
        <Avatar.Group size="large" shape="square">
          <Avatar src={sampleImg} />
          <Avatar src={sampleImg2} />
          <Avatar>JD</Avatar>
          <Avatar icon={<StarIcon size={22} />} style={{ backgroundColor: tokens.colorWarning as string, color: '#fff' }} />
        </Avatar.Group>
      </div>

      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Max with custom style
        </Text>
        <Avatar.Group max={{ count: 2, style: { backgroundColor: tokens.colorPrimary as string, color: '#fff' } }}>
          <Avatar src={sampleImg} />
          <Avatar src={sampleImg2} />
          <Avatar src={sampleImg3} />
          <Avatar src={sampleImg4} />
          <Avatar src={sampleImg5} />
        </Avatar.Group>
      </div>
    </div>
  )
}

// ─── 7. With Badge ──────────────────────────────────────────────────────────────

function BadgeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Count badge
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge count={5}>
            <Avatar src={sampleImg} />
          </Badge>
          <Badge count={25}>
            <Avatar src={sampleImg2} size="large" />
          </Badge>
          <Badge count={100}>
            <Avatar icon={<UserCircleIcon size={18} />} />
          </Badge>
          <Badge count={0} showZero>
            <Avatar src={sampleImg3} />
          </Badge>
        </div>
      </div>

      <div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Dot indicator
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge dot>
            <Avatar src={sampleImg} />
          </Badge>
          <Badge dot>
            <Avatar src={sampleImg2} size="large" />
          </Badge>
          <Badge dot>
            <Avatar shape="square" icon={<StarIcon size={18} />} />
          </Badge>
          <Badge dot>
            <Avatar>U</Avatar>
          </Badge>
        </div>
      </div>
    </div>
  )
}

// ─── 8. Responsive Size ─────────────────────────────────────────────────────────

function ResponsiveSizeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text size="sm" type="secondary">
        Resize the window to see the avatar change size (xs: 24, sm: 32, md: 40, lg: 56, xl: 64)
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar
          src={sampleImg}
          size={{ xs: 24, sm: 32, md: 40, lg: 56, xl: 64 }}
        />
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 56, xl: 64 }}
          style={{ backgroundColor: tokens.colorPrimary as string, color: '#fff' }}
        >
          JD
        </Avatar>
        <Avatar
          icon={<StarIcon size={22} />}
          size={{ xs: 24, sm: 32, md: 40, lg: 56, xl: 64 }}
        />
      </div>
    </div>
  )
}

// ─── 9. Semantic Styles ─────────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar
        size="large"
        styles={{
          root: { backgroundColor: tokens.colorPrimary as string, color: '#fff' },
        }}
      >
        AB
      </Avatar>
      <Avatar
        src={sampleImg}
        size="large"
        styles={{
          root: { borderRadius: '0.5rem' },
          image: { filter: 'grayscale(100%)' },
        }}
      />
      <Avatar
        size="large"
        icon={<StarIcon size={22} />}
        styles={{
          root: {
            backgroundColor: 'transparent',
            border: `2px solid ${tokens.colorWarning}`,
            color: tokens.colorWarning as string,
          },
        }}
      />
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export function AvatarSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ marginBottom: 24, display: 'block' }}>
        Avatar
      </Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Sizes">
        <SizesDemo />
      </Section>

      <Section title="Shapes">
        <ShapesDemo />
      </Section>

      <Section title="Auto-Scale Text">
        <AutoScaleTextDemo />
      </Section>

      <Section title="Fallback" align="start">
        <FallbackDemo />
      </Section>

      <Section title="Avatar.Group" align="start">
        <GroupDemo />
      </Section>

      <Section title="With Badge" align="start">
        <BadgeDemo />
      </Section>

      <Section title="Responsive Size" align="start">
        <ResponsiveSizeDemo />
      </Section>

      <Section title="Semantic Styles">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
