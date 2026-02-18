import { useState, useRef } from 'react'
import { Upload, Text, tokens } from '../../index'
import type { UploadFile, UploadChangeParam, UploadRef } from '../../index'
import { Section } from './shared'

// ─── Shared demo data ───────────────────────────────────────────────────────────

const demoAction = '/api/upload'

/** Open preview image in a popup window */
function previewFile(file: UploadFile) {
  const src = file.thumbUrl || file.url
  if (!src || src === '#') return
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(
      `<html><head><title>${file.name}</title></head>` +
      `<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111">` +
      `<img src="${src}" style="max-width:100%;max-height:100vh" alt="${file.name}" />` +
      `</body></html>`,
    )
    win.document.close()
  }
}

const defaultDoneFiles: UploadFile[] = [
  { uid: '1', name: 'document.pdf', status: 'done', url: '#' },
  { uid: '2', name: 'image.png', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/a/200/200' },
  { uid: '3', name: 'spreadsheet.xlsx', status: 'done', url: '#' },
]

// ─── 1. Basic ───────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload action={demoAction}>
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Click to Upload
        </button>
      </Upload>
    </div>
  )
}

// ─── 2. Controlled ──────────────────────────────────────────────────────────────

function ControlledDemo() {
  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: '1', name: 'initial-file.pdf', status: 'done', url: '#' },
  ])

  const handleChange = (info: UploadChangeParam) => {
    setFileList(info.fileList)
  }

  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Files: {fileList.length}
      </Text>
      <Upload action={demoAction} fileList={fileList} onChange={handleChange}>
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload (Controlled)
        </button>
      </Upload>
    </div>
  )
}

// ─── 3. Picture List ────────────────────────────────────────────────────────────

function PictureListDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload
        action={demoAction}
        listType="picture"
        defaultFileList={[
          { uid: '1', name: 'photo.jpg', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/b/200/200' },
          { uid: '2', name: 'avatar.png', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/c/200/200' },
        ]}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload Pictures
        </button>
      </Upload>
    </div>
  )
}

// ─── 4. Picture Card ────────────────────────────────────────────────────────────

function PictureCardDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload
        action={demoAction}
        listType="picture-card"
        defaultFileList={[
          { uid: '1', name: 'image1.png', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/d/200/200' },
          { uid: '2', name: 'image2.jpg', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/e/200/200' },
        ]}
        onPreview={previewFile}
      />
    </div>
  )
}

// ─── 5. Picture Circle ──────────────────────────────────────────────────────────

function PictureCircleDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload
        action={demoAction}
        listType="picture-circle"
        defaultFileList={[
          { uid: '1', name: 'avatar.png', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/f/200/200' },
        ]}
        maxCount={3}
        onPreview={previewFile}
      />
    </div>
  )
}

// ─── 6. Drag & Drop ─────────────────────────────────────────────────────────────

function DraggerDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload.Dragger action={demoAction} multiple>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16 }}>
          <Text size="lg" type="secondary">
            Drag files here or click to upload
          </Text>
          <Text size="sm" type="secondary">
            Supports single or bulk upload
          </Text>
        </div>
      </Upload.Dragger>
    </div>
  )
}

// ─── 7. Max Count ───────────────────────────────────────────────────────────────

function MaxCountDemo() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          maxCount=3 (picture-card)
        </Text>
        <Upload
          action={demoAction}
          listType="picture-card"
          maxCount={3}
          defaultFileList={[
            { uid: '1', name: 'file1.png', status: 'done', thumbUrl: 'https://picsum.photos/seed/g/200/200' },
          ]}
        />
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          maxCount=1 (replaces existing)
        </Text>
        <Upload action={demoAction} maxCount={1}>
          <button
            style={{
              padding: '6px 16px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 6,
              backgroundColor: tokens.colorBg,
              color: tokens.colorText,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Upload (max 1)
          </button>
        </Upload>
      </div>
    </div>
  )
}

// ─── 8. Before Upload ───────────────────────────────────────────────────────────

function BeforeUploadDemo() {
  const [messages, setMessages] = useState<string[]>([])

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      setMessages((prev) => [...prev, `${file.name} is not an image file.`])
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      setMessages((prev) => [...prev, `${file.name} must be smaller than 2MB.`])
      return false
    }
    setMessages((prev) => [...prev, `${file.name} accepted.`])
    return true
  }

  return (
    <div style={{ width: '100%' }}>
      <Upload action={demoAction} beforeUpload={beforeUpload} accept="image/*">
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload Image (max 2MB)
        </button>
      </Upload>
      {messages.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {messages.map((msg, i) => (
            <Text key={i} size="sm" type="secondary" style={{ display: 'block' }}>
              {msg}
            </Text>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 9. Custom Icons ────────────────────────────────────────────────────────────

function CustomIconsDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Upload
        action={demoAction}
        listType="picture-card"
        defaultFileList={[
          { uid: '1', name: 'photo.jpg', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/h/200/200' },
          { uid: '2', name: 'doc.pdf', status: 'done', url: '#' },
        ]}
        showUploadList={{
          showPreviewIcon: true,
          showDownloadIcon: true,
          showRemoveIcon: true,
          previewIcon: <span style={{ fontSize: 16 }}>👁</span>,
          downloadIcon: <span style={{ fontSize: 16 }}>⬇</span>,
          removeIcon: <span style={{ fontSize: 16 }}>🗑</span>,
        }}
        onPreview={(file) => alert(`Preview: ${file.name}`)}
        onDownload={(file) => alert(`Download: ${file.name}`)}
      />
    </div>
  )
}

// ─── 10. File Statuses ──────────────────────────────────────────────────────────

function FileStatusesDemo() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Text list
        </Text>
        <Upload
          defaultFileList={[
            { uid: '1', name: 'uploading-file.doc', status: 'uploading', percent: 45 },
            { uid: '2', name: 'completed-file.pdf', status: 'done', url: '#' },
            { uid: '3', name: 'failed-file.xlsx', status: 'error', error: 'Network error' },
          ]}
          showUploadList
        />
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Picture list
        </Text>
        <Upload
          listType="picture"
          defaultFileList={[
            { uid: '4', name: 'uploading.png', status: 'uploading', percent: 70, thumbUrl: 'https://picsum.photos/seed/i/200/200' },
            { uid: '5', name: 'success.jpg', status: 'done', url: '#', thumbUrl: 'https://picsum.photos/seed/j/200/200' },
            { uid: '6', name: 'error.gif', status: 'error' },
          ]}
          showUploadList
        />
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Picture card
        </Text>
        <Upload
          listType="picture-card"
          defaultFileList={[
            { uid: '7', name: 'uploading.png', status: 'uploading', percent: 30 },
            { uid: '8', name: 'done.jpg', status: 'done', thumbUrl: 'https://picsum.photos/seed/k/200/200' },
            { uid: '9', name: 'error.png', status: 'error' },
          ]}
          showUploadList
        />
      </div>
    </div>
  )
}

// ─── 11. Disabled ───────────────────────────────────────────────────────────────

function DisabledDemo() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Disabled button
        </Text>
        <Upload action={demoAction} disabled defaultFileList={defaultDoneFiles.slice(0, 1)}>
          <button
            style={{
              padding: '6px 16px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 6,
              backgroundColor: tokens.colorBgMuted,
              color: tokens.colorTextMuted,
              cursor: 'not-allowed',
              fontSize: 14,
            }}
          >
            Upload (Disabled)
          </button>
        </Upload>
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Disabled dragger
        </Text>
        <Upload.Dragger action={demoAction} disabled />
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Disabled picture-card
        </Text>
        <Upload
          action={demoAction}
          listType="picture-card"
          disabled
          defaultFileList={[
            { uid: '1', name: 'image.png', status: 'done', thumbUrl: 'https://picsum.photos/seed/l/200/200' },
          ]}
        />
      </div>
    </div>
  )
}

// ─── 12. Semantic Styles ────────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Custom styled text list
        </Text>
        <Upload
          action={demoAction}
          defaultFileList={defaultDoneFiles}
          styles={{
            root: { maxWidth: 400 },
            item: { backgroundColor: 'rgba(22, 119, 255, 0.08)', borderColor: tokens.colorPrimary200 },
          }}
        >
          <button
            style={{
              padding: '6px 16px',
              border: `1px solid ${tokens.colorPrimary}`,
              borderRadius: 6,
              backgroundColor: tokens.colorPrimary,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Styled Upload
          </button>
        </Upload>
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Custom styled dragger
        </Text>
        <Upload.Dragger
          action={demoAction}
          styles={{
            dragger: {
              borderColor: tokens.colorSuccess,
              backgroundColor: 'rgba(82,196,26,0.04)',
            },
            item: { borderColor: tokens.colorSuccess200 },
          }}
        />
      </div>
      <div>
        <Text size="sm" weight="semibold" style={{ display: 'block', marginBottom: 8 }}>
          Custom styled picture-card
        </Text>
        <Upload
          action={demoAction}
          listType="picture-card"
          defaultFileList={[
            { uid: '1', name: 'img.png', status: 'done', thumbUrl: 'https://picsum.photos/seed/m/200/200' },
          ]}
          styles={{
            trigger: { borderColor: tokens.colorWarning, borderStyle: 'solid' },
            item: { borderColor: tokens.colorWarning },
          }}
        />
      </div>
    </div>
  )
}

// ─── 13. Paste Upload ──────────────────────────────────────────────────────────

function PasteUploadDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Click the area below to focus it, then paste an image from your clipboard (Ctrl+V / Cmd+V).
      </Text>
      <Upload.Dragger action={demoAction} accept="image/*" multiple>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16 }}>
          <Text size="lg" type="secondary">Drag, click, or paste an image here</Text>
          <Text size="sm" type="secondary">Supports clipboard paste</Text>
        </div>
      </Upload.Dragger>
    </div>
  )
}

// ─── 14. Directory Upload ──────────────────────────────────────────────────────

function DirectoryUploadDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Select and upload an entire directory.
      </Text>
      <Upload action={demoAction} directory>
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload Directory
        </button>
      </Upload>
    </div>
  )
}

// ─── 15. Upload Manually ───────────────────────────────────────────────────────

function ManualUploadDemo() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const uploadRef = useRef<UploadRef>(null)

  const handleChange = (info: UploadChangeParam) => {
    setFileList(info.fileList)
  }

  const pendingCount = fileList.filter((f) => !f.status).length

  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Files are added to the list but not uploaded until you click "Start Upload".
      </Text>
      <Upload
        ref={uploadRef}
        action={demoAction}
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Select File
        </button>
      </Upload>
      <button
        onClick={() => uploadRef.current?.upload()}
        disabled={pendingCount === 0}
        style={{
          marginTop: 8,
          padding: '6px 16px',
          border: 'none',
          borderRadius: 6,
          backgroundColor: pendingCount > 0 ? (tokens.colorPrimary as string) : (tokens.colorBgMuted as string),
          color: pendingCount > 0 ? '#fff' : (tokens.colorTextMuted as string),
          cursor: pendingCount > 0 ? 'pointer' : 'not-allowed',
          fontSize: 14,
        }}
      >
        Start Upload{pendingCount > 0 ? ` (${pendingCount})` : ''}
      </button>
    </div>
  )
}

// ─── 16. PNG Only (LIST_IGNORE) ────────────────────────────────────────────────

function ListIgnoreDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Only PNG files appear in the list. Other file types are silently ignored via Upload.LIST_IGNORE.
      </Text>
      <Upload
        action={demoAction}
        beforeUpload={(file) => {
          if (file.type !== 'image/png') return Upload.LIST_IGNORE
          return true
        }}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload PNG Only
        </button>
      </Upload>
    </div>
  )
}

// ─── 17. Transform File Before Upload ──────────────────────────────────────────

function TransformFileDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Images are resized to max 200x200px before upload using beforeUpload + Canvas.
      </Text>
      <Upload
        action={demoAction}
        listType="picture"
        accept="image/*"
        beforeUpload={(file) => {
          return new Promise<File>((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
              const img = document.createElement('img')
              img.src = reader.result as string
              img.onload = () => {
                const canvas = document.createElement('canvas')
                const maxSize = 200
                let w = img.width
                let h = img.height
                if (w > maxSize || h > maxSize) {
                  const ratio = Math.min(maxSize / w, maxSize / h)
                  w = Math.round(w * ratio)
                  h = Math.round(h * ratio)
                }
                canvas.width = w
                canvas.height = h
                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0, w, h)
                canvas.toBlob((blob) => {
                  if (blob) resolve(new File([blob], file.name, { type: file.type }))
                }, file.type)
              }
            }
          })
        }}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload & Resize
        </button>
      </Upload>
    </div>
  )
}

// ─── 18. Custom itemRender ─────────────────────────────────────────────────────

function ItemRenderDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Custom file list rendering using the itemRender prop.
      </Text>
      <Upload
        action={demoAction}
        defaultFileList={defaultDoneFiles}
        itemRender={(_originNode, file, _fileList, actions) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 6,
              border: `1px solid ${tokens.colorBorder}`,
              marginBottom: 4,
              backgroundColor: tokens.colorBgSubtle,
            }}
          >
            <span style={{ flex: 1, fontSize: 14, color: tokens.colorText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {file.name}
            </span>
            <span style={{ fontSize: 12, color: tokens.colorTextMuted }}>
              {file.status === 'done' ? 'Completed' : file.status}
            </span>
            <button
              onClick={actions.remove}
              style={{
                border: 'none',
                background: 'none',
                color: tokens.colorError,
                cursor: 'pointer',
                fontSize: 12,
                padding: '2px 4px',
              }}
            >
              Delete
            </button>
          </div>
        )}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload
        </button>
      </Upload>
    </div>
  )
}

// ─── 19. Custom Progress Bar ───────────────────────────────────────────────────

function CustomProgressDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Text size="sm" type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Custom progress bar with green color, 4px height, and percent format.
      </Text>
      <Upload
        action={demoAction}
        progress={{
          strokeColor: tokens.colorSuccess as string,
          strokeWidth: 4,
          format: (percent) => `${Math.round(percent)}%`,
        }}
        defaultFileList={[
          { uid: '1', name: 'uploading-file.doc', status: 'uploading', percent: 65 },
          { uid: '2', name: 'almost-done.pdf', status: 'uploading', percent: 92 },
          { uid: '3', name: 'completed.pdf', status: 'done', url: '#' },
        ]}
      >
        <button
          style={{
            padding: '6px 16px',
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: 6,
            backgroundColor: tokens.colorBg,
            color: tokens.colorText,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Upload
        </button>
      </Upload>
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export function UploadSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ marginBottom: 24, display: 'block' }}>
        Upload
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Controlled" align="start">
        <ControlledDemo />
      </Section>

      <Section title="Picture List" align="start">
        <PictureListDemo />
      </Section>

      <Section title="Picture Card" align="start">
        <PictureCardDemo />
      </Section>

      <Section title="Picture Circle" align="start">
        <PictureCircleDemo />
      </Section>

      <Section title="Drag & Drop" align="start">
        <DraggerDemo />
      </Section>

      <Section title="Max Count" align="start">
        <MaxCountDemo />
      </Section>

      <Section title="Before Upload (Validation)" align="start">
        <BeforeUploadDemo />
      </Section>

      <Section title="Custom Icons" align="start">
        <CustomIconsDemo />
      </Section>

      <Section title="File Statuses" align="start">
        <FileStatusesDemo />
      </Section>

      <Section title="Disabled" align="start">
        <DisabledDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>

      <Section title="Paste Upload" align="start">
        <PasteUploadDemo />
      </Section>

      <Section title="Directory Upload" align="start">
        <DirectoryUploadDemo />
      </Section>

      <Section title="Upload Manually" align="start">
        <ManualUploadDemo />
      </Section>

      <Section title="PNG Only (LIST_IGNORE)" align="start">
        <ListIgnoreDemo />
      </Section>

      <Section title="Transform File Before Upload" align="start">
        <TransformFileDemo />
      </Section>

      <Section title="Custom itemRender" align="start">
        <ItemRenderDemo />
      </Section>

      <Section title="Custom Progress Bar" align="start">
        <CustomProgressDemo />
      </Section>
    </div>
  )
}
