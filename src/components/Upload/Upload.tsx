import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Fragment,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import { Tooltip } from '../Tooltip'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticStyle, mergeSemanticClassName } from '../../utils/semanticDom'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed'
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle'

export interface UploadFile<T = any> {
  uid: string
  name: string
  status?: UploadFileStatus
  percent?: number
  thumbUrl?: string
  url?: string
  type?: string
  size?: number
  originFileObj?: File
  response?: T
  error?: any
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  preview?: string
}

export interface UploadRequestOption<T = any> {
  action: string
  filename: string
  data?: Record<string, unknown>
  file: File
  headers?: Record<string, string>
  withCredentials?: boolean
  method: string
  onProgress: (event: { percent: number }) => void
  onSuccess: (response: T, file: File) => void
  onError: (error: Error, response?: any) => void
}

export interface UploadChangeParam<T = UploadFile> {
  file: T
  fileList: T[]
  event?: { percent: number }
}

export type ShowUploadListConfig =
  | boolean
  | {
      showPreviewIcon?: boolean
      showRemoveIcon?: boolean
      showDownloadIcon?: boolean
      previewIcon?: ReactNode | ((file: UploadFile) => ReactNode)
      removeIcon?: ReactNode | ((file: UploadFile) => ReactNode)
      downloadIcon?: ReactNode | ((file: UploadFile) => ReactNode)
    }

export type UploadSemanticSlot = 'root' | 'trigger' | 'dragger' | 'list' | 'item' | 'itemActions' | 'thumbnail'
export type UploadClassNames = SemanticClassNames<UploadSemanticSlot>
export type UploadStyles = SemanticStyles<UploadSemanticSlot>

export interface UploadProgressConfig {
  strokeColor?: string
  strokeWidth?: number
  format?: (percent: number, file: UploadFile) => ReactNode
}

export interface UploadRef {
  upload: (file?: UploadFile) => void
  nativeElement: HTMLDivElement | null
}

export interface UploadProps {
  accept?: string
  action?: string | ((file: UploadFile) => Promise<string>)
  beforeUpload?: (file: File, fileList: File[]) => boolean | string | Promise<File | boolean | void> | void
  customRequest?: (options: UploadRequestOption) => { abort: () => void } | void
  data?: Record<string, unknown> | ((file: UploadFile) => Record<string, unknown> | Promise<Record<string, unknown>>)
  defaultFileList?: UploadFile[]
  fileList?: UploadFile[]
  directory?: boolean
  disabled?: boolean
  headers?: Record<string, string>
  listType?: UploadListType
  maxCount?: number
  method?: string
  multiple?: boolean
  name?: string
  openFileDialogOnClick?: boolean
  showUploadList?: ShowUploadListConfig
  withCredentials?: boolean
  progress?: UploadProgressConfig
  itemRender?: (originNode: ReactNode, file: UploadFile, fileList: UploadFile[], actions: { download: () => void; preview: () => void; remove: () => void }) => ReactNode
  onChange?: (info: UploadChangeParam) => void
  onPreview?: (file: UploadFile) => void
  onDownload?: (file: UploadFile) => void
  onRemove?: (file: UploadFile) => boolean | Promise<boolean> | void
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: UploadClassNames
  styles?: UploadStyles
  /** @internal */
  _dragger?: boolean
}

export type UploadDraggerProps = Omit<UploadProps, 'listType' | '_dragger'>

// ─── Icons ──────────────────────────────────────────────────────────────────────

function UploadCloudIcon({ size = 48, color }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}

function FileIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

function ImageIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function ErrorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

function LoadingIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'j-upload-spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function PlusIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function PaperclipIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// ─── Keyframes style tag ────────────────────────────────────────────────────────

const KEYFRAMES_ID = 'j-upload-keyframes'
function ensureKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(KEYFRAMES_ID)) return
  const style = document.createElement('style')
  style.id = KEYFRAMES_ID
  style.textContent = `
    @keyframes j-upload-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes j-upload-progress-active {
      0% { opacity: 0.1; width: 0; }
      20% { opacity: 0.5; width: 0; }
      100% { opacity: 0; width: 100%; }
    }
  `
  document.head.appendChild(style)
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

let uidCounter = 0
function generateUid(): string {
  uidCounter += 1
  return `j-upload-${Date.now()}-${uidCounter}`
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|bmp|webp|svg|ico|avif|tiff?)$/i
const IMAGE_MIME = /^image\//i

function isImageFile(file: UploadFile | File): boolean {
  if ('type' in file && file.type) return IMAGE_MIME.test(file.type)
  if ('name' in file && file.name) return IMAGE_EXTENSIONS.test(file.name)
  return false
}

function getFilePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (!isImageFile(file)) {
      resolve('')
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

function defaultUploadRequest(options: UploadRequestOption): { abort: () => void } {
  const xhr = new XMLHttpRequest()

  const formData = new FormData()
  if (options.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
  }
  formData.append(options.filename, options.file)

  xhr.open(options.method, options.action, true)

  if (options.withCredentials) {
    xhr.withCredentials = true
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
  }

  // Register upload progress AFTER open() for better browser compat.
  // Note: for cross-origin requests, registering listeners on xhr.upload
  // forces a CORS preflight. Use a same-origin proxy to avoid this.
  if (xhr.upload) {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && e.total > 0) {
        options.onProgress({ percent: (e.loaded / e.total) * 100 })
      }
    })
  }

  xhr.addEventListener('error', () => {
    options.onError(new Error('Upload error'))
  })

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      options.onError(new Error(`Upload failed with status ${xhr.status}`), xhr.response)
      return
    }
    let response: any
    try {
      response = JSON.parse(xhr.responseText)
    } catch {
      response = xhr.responseText
    }
    options.onSuccess(response, options.file)
  })

  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    },
  }
}

function fileToUploadFile(file: File): UploadFile {
  return {
    uid: generateUid(),
    name: file.name,
    type: file.type,
    size: file.size,
    originFileObj: file,
  }
}

interface ResolvedShowUploadList {
  showPreviewIcon: boolean
  showRemoveIcon: boolean
  showDownloadIcon: boolean
  previewIcon?: ReactNode | ((file: UploadFile) => ReactNode)
  removeIcon?: ReactNode | ((file: UploadFile) => ReactNode)
  downloadIcon?: ReactNode | ((file: UploadFile) => ReactNode)
}

function resolveShowUploadList(config: ShowUploadListConfig | undefined): ResolvedShowUploadList | false {
  if (config === false) return false
  if (config === undefined || config === true) {
    return { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }
  }
  return {
    showPreviewIcon: config.showPreviewIcon !== false,
    showRemoveIcon: config.showRemoveIcon !== false,
    showDownloadIcon: config.showDownloadIcon ?? false,
    previewIcon: config.previewIcon,
    removeIcon: config.removeIcon,
    downloadIcon: config.downloadIcon,
  }
}

const LIST_IGNORE = '__LIST_IGNORE__' as const

// ─── UploadListItem ─────────────────────────────────────────────────────────────

interface UploadListItemProps {
  file: UploadFile
  listType: UploadListType
  showConfig: ResolvedShowUploadList
  disabled?: boolean
  progress?: UploadProgressConfig
  onRemove: (file: UploadFile) => void
  onPreview?: (file: UploadFile) => void
  onDownload?: (file: UploadFile) => void
  itemStyle?: CSSProperties
  itemClassName?: string
  actionsStyle?: CSSProperties
  actionsClassName?: string
  thumbnailStyle?: CSSProperties
  thumbnailClassName?: string
}

function UploadListItem({
  file,
  listType,
  showConfig,
  disabled,
  progress: progressConfig,
  onRemove,
  onPreview,
  onDownload,
  itemStyle,
  itemClassName,
  actionsStyle,
  actionsClassName,
  thumbnailStyle,
  thumbnailClassName,
}: UploadListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const isCard = listType === 'picture-card' || listType === 'picture-circle'
  const isError = file.status === 'error'
  const isDone = file.status === 'done'
  const isUploading = file.status === 'uploading'
  const thumbSrc = file.thumbUrl || file.url || file.preview || ''
  const isImage = isImageFile(file) || !!thumbSrc

  const renderIcon = useCallback(
    (iconConfig: ReactNode | ((f: UploadFile) => ReactNode) | undefined, fallback: ReactNode) => {
      if (!iconConfig) return fallback
      if (typeof iconConfig === 'function') return iconConfig(file)
      return iconConfig
    },
    [file],
  )

  const handlePreview = () => onPreview?.(file)
  const handleDownload = () => onDownload?.(file)
  const handleRemove = () => {
    if (!disabled) onRemove(file)
  }

  // ─── Card / Circle layout ─────────────────────────────────────────
  if (isCard) {
    const cardSize = '6.5rem'
    const borderRadius = listType === 'picture-circle' ? '50%' : '0.5rem'

    return (
      <div
        ref={itemRef}
        className={itemClassName}
        style={mergeSemanticStyle(
          {
            position: 'relative',
            width: cardSize,
            height: cardSize,
            border: `1px solid ${isError ? tokens.colorError : tokens.colorBorder}`,
            borderRadius,
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.colorBgMuted,
            verticalAlign: 'top',
          },
          itemStyle,
        )}
        onMouseEnter={() => {
          if (overlayRef.current) overlayRef.current.style.opacity = '1'
        }}
        onMouseLeave={() => {
          if (overlayRef.current) overlayRef.current.style.opacity = '0'
        }}
      >
        {/* Thumbnail */}
        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <LoadingIcon size={24} />
            {file.percent !== undefined && (
              <span style={{ fontSize: '0.75rem', color: tokens.colorTextMuted }}>
                {progressConfig?.format ? progressConfig.format(file.percent, file) : `${Math.round(file.percent)}%`}
              </span>
            )}
          </div>
        ) : thumbSrc ? (
          <img
            src={thumbSrc}
            alt={file.name}
            className={thumbnailClassName}
            style={mergeSemanticStyle(
              {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
              thumbnailStyle,
            )}
            crossOrigin={file.crossOrigin}
          />
        ) : (
          <div
            className={thumbnailClassName}
            style={mergeSemanticStyle(
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                color: tokens.colorTextMuted,
              },
              thumbnailStyle,
            )}
          >
            {isImage ? <ImageIcon size={24} /> : <FileIcon size={24} />}
            <span
              style={{
                fontSize: '0.6875rem',
                maxWidth: '5.5rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </span>
          </div>
        )}

        {/* Error indicator */}
        {isError && !isUploading && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: '0.6875rem',
              padding: '0.125rem 0.25rem',
              backgroundColor: 'rgba(255,77,79,0.1)',
              color: tokens.colorError,
            }}
          >
            Error
          </div>
        )}

        {/* Hover overlay with actions */}
        {!isUploading && (
          <div
            ref={overlayRef}
            className={actionsClassName}
            style={mergeSemanticStyle(
              {
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.45)',
                opacity: 0,
                transition: 'opacity 0.2s',
                borderRadius,
              },
              actionsStyle,
            )}
          >
            {showConfig.showPreviewIcon && (isDone || file.url || file.thumbUrl) && (
              <Tooltip content="Preview">
                <button
                  type="button"
                  onClick={handlePreview}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    lineHeight: 1,
                  }}
                >
                  {renderIcon(showConfig.previewIcon, <EyeIcon />)}
                </button>
              </Tooltip>
            )}
            {showConfig.showDownloadIcon && isDone && (
              <Tooltip content="Download">
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    lineHeight: 1,
                  }}
                >
                  {renderIcon(showConfig.downloadIcon, <DownloadIcon />)}
                </button>
              </Tooltip>
            )}
            {showConfig.showRemoveIcon && !disabled && (
              <Tooltip content="Remove">
                <button
                  type="button"
                  onClick={handleRemove}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    lineHeight: 1,
                  }}
                >
                  {renderIcon(showConfig.removeIcon, <CloseIcon />)}
                </button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    )
  }

  // ─── Text / Picture layout ────────────────────────────────────────
  const showThumb = listType === 'picture'
  const hasCustomItemBg = !!itemStyle?.backgroundColor

  return (
    <div
      ref={itemRef}
      className={itemClassName}
      style={mergeSemanticStyle(
        {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          border: `1px solid ${isError ? tokens.colorError : tokens.colorBorder}`,
          backgroundColor: isError ? 'rgba(255,77,79,0.04)' : tokens.colorBgSubtle,
          transition: 'background-color 0.2s, filter 0.2s',
          minHeight: showThumb ? '3.5rem' : '2.25rem',
        },
        itemStyle,
      )}
      onMouseEnter={() => {
        if (itemRef.current && !isError) {
          if (hasCustomItemBg) {
            itemRef.current.style.filter = 'brightness(1.15)'
          } else {
            itemRef.current.style.backgroundColor = tokens.colorBgMuted as string
          }
        }
      }}
      onMouseLeave={() => {
        if (itemRef.current && !isError) {
          if (hasCustomItemBg) {
            itemRef.current.style.filter = 'none'
          } else {
            itemRef.current.style.backgroundColor = (isError ? 'rgba(255,77,79,0.04)' : tokens.colorBgSubtle) as string
          }
        }
      }}
    >
      {/* Thumbnail / icon */}
      {showThumb ? (
        thumbSrc ? (
          <img
            src={thumbSrc}
            alt={file.name}
            className={thumbnailClassName}
            style={mergeSemanticStyle(
              {
                width: '3rem',
                height: '3rem',
                objectFit: 'cover',
                borderRadius: '0.25rem',
                flexShrink: 0,
              },
              thumbnailStyle,
            )}
            crossOrigin={file.crossOrigin}
          />
        ) : (
          <div
            className={thumbnailClassName}
            style={mergeSemanticStyle(
              {
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.25rem',
                backgroundColor: tokens.colorBgMuted,
                flexShrink: 0,
                color: tokens.colorTextMuted,
              },
              thumbnailStyle,
            )}
          >
            {isImage ? <ImageIcon size={20} /> : <FileIcon size={20} />}
          </div>
        )
      ) : (
        <span style={{ flexShrink: 0, display: 'flex', color: isError ? tokens.colorError : tokens.colorTextMuted }}>
          <PaperclipIcon />
        </span>
      )}

      {/* Name + progress */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Tooltip content={file.name}>
          <span
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
              color: isError ? tokens.colorError : tokens.colorText,
              cursor: onPreview ? 'pointer' : undefined,
            }}
            onClick={onPreview ? handlePreview : undefined}
          >
            {file.name}
          </span>
        </Tooltip>
        {isUploading && file.percent !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <div
              style={{
                flex: 1,
                height: progressConfig?.strokeWidth ?? 2,
                borderRadius: (progressConfig?.strokeWidth ?? 2) / 2,
                backgroundColor: tokens.colorBorder,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(file.percent, 100)}%`,
                  backgroundColor: progressConfig?.strokeColor ?? (tokens.colorPrimary as string),
                  borderRadius: (progressConfig?.strokeWidth ?? 2) / 2,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            {progressConfig?.format && (
              <span style={{ fontSize: '0.75rem', flexShrink: 0, color: tokens.colorTextMuted }}>
                {progressConfig.format(file.percent, file)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Status icon */}
      {isUploading && (
        <span style={{ flexShrink: 0, display: 'flex', color: tokens.colorPrimary }}>
          <LoadingIcon />
        </span>
      )}
      {isDone && (
        <span style={{ flexShrink: 0, display: 'flex', color: tokens.colorSuccess }}>
          <CheckCircleIcon />
        </span>
      )}
      {isError && (
        <span style={{ flexShrink: 0, display: 'flex', color: tokens.colorError }}>
          <ErrorIcon />
        </span>
      )}

      {/* Actions */}
      <div
        className={actionsClassName}
        style={mergeSemanticStyle(
          { display: 'flex', gap: '0.25rem', flexShrink: 0 },
          actionsStyle,
        )}
      >
        {showConfig.showDownloadIcon && isDone && (
          <Tooltip content="Download">
            <button
              type="button"
              onClick={handleDownload}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.colorTextMuted,
                cursor: 'pointer',
                padding: '0.125rem',
                display: 'flex',
                lineHeight: 1,
              }}
            >
              {renderIcon(showConfig.downloadIcon, <DownloadIcon />)}
            </button>
          </Tooltip>
        )}
        {showConfig.showRemoveIcon && !disabled && (
          <Tooltip content="Remove">
            <button
              type="button"
              onClick={handleRemove}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.colorTextMuted,
                cursor: 'pointer',
                padding: '0.125rem',
                display: 'flex',
                lineHeight: 1,
              }}
            >
              {renderIcon(showConfig.removeIcon, <CloseIcon />)}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

// ─── UploadList ─────────────────────────────────────────────────────────────────

interface UploadListProps {
  files: UploadFile[]
  listType: UploadListType
  showConfig: ResolvedShowUploadList
  disabled?: boolean
  progress?: UploadProgressConfig
  itemRender?: UploadProps['itemRender']
  fullFileList: UploadFile[]
  onRemove: (file: UploadFile) => void
  onPreview?: (file: UploadFile) => void
  onDownload?: (file: UploadFile) => void
  listStyle?: CSSProperties
  listClassName?: string
  itemStyle?: CSSProperties
  itemClassName?: string
  actionsStyle?: CSSProperties
  actionsClassName?: string
  thumbnailStyle?: CSSProperties
  thumbnailClassName?: string
}

function UploadList({
  files,
  listType,
  showConfig,
  disabled,
  progress,
  itemRender,
  fullFileList,
  onRemove,
  onPreview,
  onDownload,
  listStyle,
  listClassName,
  itemStyle,
  itemClassName,
  actionsStyle,
  actionsClassName,
  thumbnailStyle,
  thumbnailClassName,
}: UploadListProps) {
  const isCard = listType === 'picture-card' || listType === 'picture-circle'
  const visibleFiles = files.filter((f) => f.status !== 'removed')

  if (visibleFiles.length === 0) return null

  return (
    <div
      className={listClassName}
      style={mergeSemanticStyle(
        isCard
          ? { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
          : { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
        listStyle,
      )}
    >
      {visibleFiles.map((file) => {
        const originNode = (
          <UploadListItem
            key={file.uid}
            file={file}
            listType={listType}
            showConfig={showConfig}
            disabled={disabled}
            progress={progress}
            onRemove={onRemove}
            onPreview={onPreview}
            onDownload={onDownload}
            itemStyle={itemStyle}
            itemClassName={itemClassName}
            actionsStyle={actionsStyle}
            actionsClassName={actionsClassName}
            thumbnailStyle={thumbnailStyle}
            thumbnailClassName={thumbnailClassName}
          />
        )
        if (itemRender) {
          return (
            <Fragment key={file.uid}>
              {itemRender(originNode, file, fullFileList, {
                download: () => onDownload?.(file),
                preview: () => onPreview?.(file),
                remove: () => onRemove(file),
              })}
            </Fragment>
          )
        }
        return originNode
      })}
    </div>
  )
}

// ─── Upload Component ───────────────────────────────────────────────────────────

const UploadComponent = forwardRef<UploadRef, UploadProps>(function UploadInner(props, ref) {
  const {
    accept,
    action,
    beforeUpload,
    customRequest,
    data,
    defaultFileList,
    fileList: controlledFileList,
    directory = false,
    disabled = false,
    headers,
    listType = 'text',
    maxCount,
    method = 'post',
    multiple = false,
    name: fileName = 'file',
    openFileDialogOnClick = true,
    showUploadList,
    withCredentials = false,
    progress,
    itemRender,
    onChange,
    onPreview,
    onDownload,
    onRemove,
    onDrop,
    children,
    className,
    style,
    classNames: semanticClassNames,
    styles: semanticStyles,
    _dragger = false,
  } = props

  const [internalFileList, setInternalFileList] = useState<UploadFile[]>(defaultFileList || [])
  const fileList = controlledFileList !== undefined ? controlledFileList : internalFileList
  const isControlled = controlledFileList !== undefined

  // Refs to avoid stale closures in async XHR callbacks
  const fileListRef = useRef(fileList)
  fileListRef.current = fileList
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const uploadRequests = useRef<Map<string, { abort: () => void }>>(new Map())
  const dragCounter = useRef(0)
  const [isDragActive, setIsDragActive] = useState(false)

  const showConfig = resolveShowUploadList(showUploadList)

  useEffect(() => {
    ensureKeyframes()
  }, [])

  const updateFileList = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[], triggerFile?: UploadFile, event?: { percent: number }) => {
      if (isControlled) {
        const newList = updater(fileListRef.current)
        const file = triggerFile
          ? newList.find((f) => f.uid === triggerFile.uid) || triggerFile
          : newList[newList.length - 1]
        onChangeRef.current?.({ file, fileList: newList, event })
      } else {
        setInternalFileList((prev) => {
          const newList = updater(prev)
          const file = triggerFile
            ? newList.find((f) => f.uid === triggerFile.uid) || triggerFile
            : newList[newList.length - 1]
          onChangeRef.current?.({ file, fileList: newList, event })
          return newList
        })
      }
    },
    [isControlled],
  )

  const uploadFile = useCallback(
    async (uploadFile: UploadFile) => {
      const file = uploadFile.originFileObj
      if (!file) return

      let resolvedAction = ''
      if (typeof action === 'function') {
        resolvedAction = await action(uploadFile)
      } else if (action) {
        resolvedAction = action
      }

      let resolvedData: Record<string, unknown> | undefined
      if (typeof data === 'function') {
        resolvedData = await data(uploadFile)
      } else {
        resolvedData = data
      }

      const requestFn = customRequest || defaultUploadRequest
      const result = requestFn({
        action: resolvedAction,
        filename: fileName,
        data: resolvedData,
        file,
        headers: headers,
        withCredentials,
        method,
        onProgress: (event) => {
          updateFileList(
            (prev) =>
              prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'uploading' as const, percent: event.percent } : f,
              ),
            { ...uploadFile, status: 'uploading', percent: event.percent },
            event,
          )
        },
        onSuccess: (response) => {
          uploadRequests.current.delete(uploadFile.uid)
          updateFileList(
            (prev) =>
              prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'done' as const, percent: 100, response } : f,
              ),
            { ...uploadFile, status: 'done', percent: 100, response },
          )
        },
        onError: (error, response) => {
          uploadRequests.current.delete(uploadFile.uid)
          updateFileList(
            (prev) =>
              prev.map((f) =>
                f.uid === uploadFile.uid ? { ...f, status: 'error' as const, error, response } : f,
              ),
            { ...uploadFile, status: 'error', error, response },
          )
        },
      })

      if (result) {
        uploadRequests.current.set(uploadFile.uid, result)
      }
    },
    [action, customRequest, data, fileName, headers, method, updateFileList, withCredentials],
  )

  const processFiles = useCallback(
    async (nativeFiles: File[]) => {
      let filesToProcess = nativeFiles

      // Apply maxCount
      if (maxCount !== undefined) {
        const currentCount = fileList.length
        const remaining = maxCount - currentCount
        if (maxCount === 1) {
          filesToProcess = filesToProcess.slice(0, 1)
        } else if (remaining <= 0) {
          return
        } else {
          filesToProcess = filesToProcess.slice(0, remaining)
        }
      }

      const uploadFiles: UploadFile[] = []
      const filesToUpload: UploadFile[] = []

      for (const nativeFile of filesToProcess) {
        let shouldUpload = true
        let processedFile: File = nativeFile

        if (beforeUpload) {
          const result = beforeUpload(nativeFile, filesToProcess)

          if (result === LIST_IGNORE) {
            continue
          } else if (result === false) {
            shouldUpload = false
          } else if (result && typeof result === 'object' && typeof (result as Promise<any>).then === 'function') {
            try {
              const resolved = await (result as Promise<File | boolean | void>)
              if (resolved === false) {
                shouldUpload = false
              } else if (resolved instanceof File) {
                processedFile = resolved
              }
            } catch {
              // rejected = skip file entirely
              continue
            }
          }
        }

        const uf = fileToUploadFile(processedFile)

        // Generate preview for images
        if (isImageFile(processedFile) && (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle')) {
          const preview = await getFilePreview(processedFile)
          uf.thumbUrl = preview
        }

        if (shouldUpload) {
          uf.status = 'uploading'
          uf.percent = 0
          filesToUpload.push(uf)
        }

        uploadFiles.push(uf)
      }

      if (uploadFiles.length === 0) return

      // For maxCount=1, replace existing files
      if (maxCount === 1) {
        // Abort existing uploads
        uploadRequests.current.forEach((req) => req.abort())
        uploadRequests.current.clear()
        updateFileList(() => uploadFiles)
      } else {
        updateFileList((prev) => [...prev, ...uploadFiles])
      }

      // Start uploading
      for (const uf of filesToUpload) {
        uploadFile(uf)
      }
    },
    [beforeUpload, fileList.length, listType, maxCount, updateFileList, uploadFile],
  )

  // Paste upload
  useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl || disabled) return

    const handlePaste = (e: globalThis.ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files || [])
      if (files.length === 0) return
      e.preventDefault()
      processFiles(multiple ? files : [files[0]])
    }

    rootEl.addEventListener('paste', handlePaste)
    return () => rootEl.removeEventListener('paste', handlePaste)
  }, [disabled, multiple, processFiles])

  // Expose ref methods for manual upload
  useImperativeHandle(ref, () => ({
    upload: (file?: UploadFile) => {
      if (file) {
        if (!file.status && file.originFileObj) {
          const withStatus: UploadFile = { ...file, status: 'uploading', percent: 0 }
          updateFileList(
            (prev) => prev.map((f) => (f.uid === file.uid ? withStatus : f)),
            withStatus,
          )
          uploadFile(withStatus)
        }
      } else {
        const pending = fileListRef.current.filter((f) => !f.status && f.originFileObj)
        if (pending.length === 0) return
        updateFileList((prev) =>
          prev.map((f) => (!f.status && f.originFileObj ? { ...f, status: 'uploading' as const, percent: 0 } : f)),
        )
        for (const f of pending) {
          uploadFile({ ...f, status: 'uploading', percent: 0 })
        }
      }
    },
    nativeElement: rootRef.current,
  }))

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        processFiles(files)
      }
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = ''
    },
    [processFiles],
  )

  const handleTriggerClick = useCallback(() => {
    if (disabled || !openFileDialogOnClick) return
    inputRef.current?.click()
  }, [disabled, openFileDialogOnClick])

  const handleRemove = useCallback(
    async (file: UploadFile) => {
      if (onRemove) {
        const result = onRemove(file)
        if (result === false) return
        if (result && typeof result === 'object' && typeof (result as Promise<boolean>).then === 'function') {
          try {
            const resolved = await (result as Promise<boolean>)
            if (resolved === false) return
          } catch {
            return
          }
        }
      }

      // Abort ongoing upload
      const req = uploadRequests.current.get(file.uid)
      if (req) {
        req.abort()
        uploadRequests.current.delete(file.uid)
      }

      updateFileList(
        (prev) => prev.filter((f) => f.uid !== file.uid),
        { ...file, status: 'removed' },
      )
    },
    [onRemove, updateFileList],
  )

  // Drag handlers
  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      dragCounter.current += 1
      if (dragCounter.current === 1) {
        setIsDragActive(true)
      }
    },
    [disabled],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    [],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current -= 1
      if (dragCounter.current === 0) {
        setIsDragActive(false)
      }
    },
    [],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current = 0
      setIsDragActive(false)
      if (disabled) return
      onDrop?.(e)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        // Filter by accept if provided
        const filtered = accept
          ? files.filter((f) => {
              const acceptTypes = accept.split(',').map((a) => a.trim())
              return acceptTypes.some((type) => {
                if (type.startsWith('.')) {
                  return f.name.toLowerCase().endsWith(type.toLowerCase())
                }
                if (type.endsWith('/*')) {
                  return f.type.startsWith(type.replace('/*', '/'))
                }
                return f.type === type
              })
            })
          : files
        if (filtered.length > 0) {
          processFiles(multiple ? filtered : [filtered[0]])
        }
      }
    },
    [accept, disabled, multiple, onDrop, processFiles],
  )

  // ─── Render ───────────────────────────────────────────────────────
  const isCard = listType === 'picture-card' || listType === 'picture-circle'
  const hideTrigger = isCard && maxCount !== undefined && fileList.filter((f) => f.status !== 'removed').length >= maxCount

  // Hidden file input
  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      style={{ display: 'none' }}
      onChange={handleInputChange}
      {...(directory ? { webkitdirectory: '', mozdirectory: '', directory: '' } as any : {})}
    />
  )

  // Trigger element
  const renderTrigger = () => {
    if (hideTrigger) return null

    if (_dragger) {
      return (
        <div
          className={mergeSemanticClassName(semanticClassNames?.dragger, semanticClassNames?.trigger)}
          style={mergeSemanticStyle(
            {
              border: `1px dashed ${isDragActive ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: '0.5rem',
              padding: '1.25rem 0',
              textAlign: 'center',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isDragActive ? 'rgba(22,119,255,0.04)' : tokens.colorBgSubtle,
              transition: 'border-color 0.2s, background-color 0.2s',
              opacity: disabled ? 0.5 : 1,
            },
            semanticStyles?.dragger,
            semanticStyles?.trigger,
          )}
          onClick={handleTriggerClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {children || (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloudIcon size={48} color={tokens.colorPrimary as string} />
              <span style={{ fontSize: '1rem', color: tokens.colorText }}>Click or drag file to this area to upload</span>
              <span style={{ fontSize: '0.875rem', color: tokens.colorTextMuted }}>
                Support for a single or bulk upload.
              </span>
            </div>
          )}
        </div>
      )
    }

    if (isCard) {
      const cardSize = '6.5rem'
      const borderRadius = listType === 'picture-circle' ? '50%' : '0.5rem'

      return (
        <div
          className={semanticClassNames?.trigger}
          style={mergeSemanticStyle(
            {
              width: cardSize,
              height: cardSize,
              border: `1px dashed ${tokens.colorBorder}`,
              borderRadius,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: tokens.colorBgSubtle,
              transition: 'border-color 0.2s',
              verticalAlign: 'top',
              gap: '0.25rem',
              opacity: disabled ? 0.5 : 1,
              color: tokens.colorTextMuted,
            },
            semanticStyles?.trigger,
          )}
          onClick={handleTriggerClick}
          onMouseEnter={(e) => {
            if (!disabled) (e.currentTarget as HTMLDivElement).style.borderColor = tokens.colorPrimary as string
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = tokens.colorBorder as string
          }}
        >
          {children || (
            <>
              <PlusIcon />
              <span style={{ fontSize: '0.875rem' }}>Upload</span>
            </>
          )}
        </div>
      )
    }

    // text / picture — children or nothing
    if (children) {
      return (
        <div
          className={semanticClassNames?.trigger}
          style={mergeSemanticStyle(
            {
              display: 'inline-block',
              alignSelf: 'flex-start',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            },
            semanticStyles?.trigger,
          )}
          onClick={handleTriggerClick}
        >
          {children}
        </div>
      )
    }

    return null
  }

  // File list
  const renderList = () => {
    if (showConfig === false) return null
    return (
      <UploadList
        files={fileList}
        listType={listType}
        showConfig={showConfig}
        disabled={disabled}
        progress={progress}
        itemRender={itemRender}
        fullFileList={fileList}
        onRemove={handleRemove}
        onPreview={onPreview}
        onDownload={onDownload}
        listStyle={semanticStyles?.list}
        listClassName={semanticClassNames?.list}
        itemStyle={semanticStyles?.item}
        itemClassName={semanticClassNames?.item}
        actionsStyle={semanticStyles?.itemActions}
        actionsClassName={semanticClassNames?.itemActions}
        thumbnailStyle={semanticStyles?.thumbnail}
        thumbnailClassName={semanticClassNames?.thumbnail}
      />
    )
  }

  // For card/circle layouts, list comes first (flex-wrap), then trigger
  if (isCard) {
    return (
      <div
        ref={rootRef}
        tabIndex={0}
        className={mergeSemanticClassName(className, semanticClassNames?.root)}
        style={mergeSemanticStyle(
          { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', outline: 'none' },
          semanticStyles?.root,
          style,
        )}
      >
        {fileInput}
        {renderList()}
        {renderTrigger()}
      </div>
    )
  }

  // For text/picture or dragger
  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className={mergeSemanticClassName(className, semanticClassNames?.root)}
      style={mergeSemanticStyle(
        { display: 'flex', flexDirection: 'column', gap: '0.5rem', outline: 'none' },
        semanticStyles?.root,
        style,
      )}
    >
      {fileInput}
      {renderTrigger()}
      {renderList()}
    </div>
  )
})

// ─── Dragger ────────────────────────────────────────────────────────────────────

const DraggerComponent = forwardRef<UploadRef, UploadDraggerProps>(
  function DraggerInner(props, ref) {
    return <UploadComponent {...props} listType="text" _dragger ref={ref} />
  },
)

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Upload = Object.assign(UploadComponent, {
  Dragger: DraggerComponent,
  LIST_IGNORE,
})
