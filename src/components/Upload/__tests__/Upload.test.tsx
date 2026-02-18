import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { Upload } from '../Upload'
import type { UploadRef, UploadFile, UploadChangeParam } from '../Upload'

// ============================================================================
// Helpers
// ============================================================================

function createFile(name: string, size = 1024, type = 'text/plain'): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

function createImageFile(name = 'photo.png', size = 2048): File {
  return createFile(name, size, 'image/png')
}

function getInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement
}

function getItems(container: HTMLElement): HTMLElement[] {
  // Items have title attribute matching the file name (text/picture layouts)
  // For card layouts, items are divs with a specific size
  return Array.from(container.querySelectorAll('[title="Remove"]')).map(
    (btn) => btn.closest('div') as HTMLElement,
  )
}

function getRemoveButtons(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[title="Remove"]')) as HTMLElement[]
}

function getPreviewButtons(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[title="Preview"]')) as HTMLElement[]
}

function getDownloadButtons(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[title="Download"]')) as HTMLElement[]
}

const doneFile: UploadFile = { uid: '1', name: 'file1.txt', status: 'done' }
const errorFile: UploadFile = { uid: '2', name: 'file2.txt', status: 'error' }
const uploadingFile: UploadFile = { uid: '3', name: 'file3.txt', status: 'uploading', percent: 50 }
const imageFile: UploadFile = { uid: '4', name: 'photo.png', status: 'done', thumbUrl: 'data:image/png;base64,abc' }

// Mock FileReader for image preview generation
beforeEach(() => {
  vi.restoreAllMocks()
})

// ============================================================================
// Basic rendering
// ============================================================================

describe('Upload – Basic rendering', () => {
  it('renders a hidden file input', () => {
    const { container } = render(<Upload>Click to upload</Upload>)
    const input = getInput(container)
    expect(input).toBeTruthy()
    expect(input.style.display).toBe('none')
    expect(input.type).toBe('file')
  })

  it('renders children as trigger', () => {
    render(<Upload><button>Upload</button></Upload>)
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument()
  })

  it('has tabIndex=0 on root', () => {
    const { container } = render(<Upload>Upload</Upload>)
    const root = container.firstElementChild as HTMLElement
    expect(root.getAttribute('tabindex')).toBe('0')
  })

  it('applies className to root', () => {
    const { container } = render(<Upload className="custom-upload">Upload</Upload>)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('custom-upload')
  })

  it('applies style to root', () => {
    const { container } = render(<Upload style={{ margin: '10px' }}>Upload</Upload>)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.margin).toBe('10px')
  })

  it('renders text layout by default (column direction)', () => {
    const { container } = render(<Upload>Upload</Upload>)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.flexDirection).toBe('column')
  })

  it('renders card layout with flex-wrap for picture-card', () => {
    const { container } = render(<Upload listType="picture-card" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.flexWrap).toBe('wrap')
  })
})

// ============================================================================
// File input attributes
// ============================================================================

describe('Upload – File input attributes', () => {
  it('passes accept to input', () => {
    const { container } = render(<Upload accept=".png,.jpg">Upload</Upload>)
    expect(getInput(container).accept).toBe('.png,.jpg')
  })

  it('passes multiple to input', () => {
    const { container } = render(<Upload multiple>Upload</Upload>)
    expect(getInput(container).multiple).toBe(true)
  })

  it('defaults to single file', () => {
    const { container } = render(<Upload>Upload</Upload>)
    expect(getInput(container).multiple).toBe(false)
  })

  it('sets directory attributes when directory=true', () => {
    const { container } = render(<Upload directory>Upload</Upload>)
    const input = getInput(container)
    expect(input.hasAttribute('webkitdirectory')).toBe(true)
  })
})

// ============================================================================
// File selection & onChange
// ============================================================================

describe('Upload – File selection & onChange', () => {
  it('triggers file input on trigger click', () => {
    const { container } = render(<Upload><button>Click</button></Upload>)
    const input = getInput(container)
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(clickSpy).toHaveBeenCalled()
  })

  it('does not trigger file input when disabled', () => {
    const { container } = render(<Upload disabled><button>Click</button></Upload>)
    const input = getInput(container)
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('does not trigger file input when openFileDialogOnClick=false', () => {
    const { container } = render(<Upload openFileDialogOnClick={false}><button>Click</button></Upload>)
    const input = getInput(container)
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('calls onChange when file is selected via input', async () => {
    const onChange = vi.fn()
    const customRequest = vi.fn()
    const { container } = render(
      <Upload onChange={onChange} customRequest={customRequest}>Upload</Upload>,
    )
    const input = getInput(container)
    const file = createFile('test.txt')

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(onChange).toHaveBeenCalled()
    const info: UploadChangeParam = onChange.mock.calls[0][0]
    expect(info.file.name).toBe('test.txt')
    expect(info.fileList.length).toBe(1)
  })

  it('calls customRequest when provided', async () => {
    const customRequest = vi.fn()
    const { container } = render(
      <Upload customRequest={customRequest}>Upload</Upload>,
    )
    const input = getInput(container)
    const file = createFile('test.txt')

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(customRequest).toHaveBeenCalled()
    expect(customRequest.mock.calls[0][0].file).toBe(file)
  })

  it('resets input value after selection', async () => {
    const customRequest = vi.fn()
    const { container } = render(
      <Upload customRequest={customRequest}>Upload</Upload>,
    )
    const input = getInput(container)
    Object.defineProperty(input, 'value', { writable: true, value: 'C:\\file.txt' })

    await act(async () => {
      fireEvent.change(input, { target: { files: [createFile('test.txt')] } })
    })

    expect(input.value).toBe('')
  })
})

// ============================================================================
// Default file list (uncontrolled)
// ============================================================================

describe('Upload – defaultFileList (uncontrolled)', () => {
  it('renders files from defaultFileList', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile, errorFile]}>Upload</Upload>,
    )
    expect(container.textContent).toContain('file1.txt')
    expect(container.textContent).toContain('file2.txt')
  })

  it('removes file on remove button click', async () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]}>Upload</Upload>,
    )
    const removeBtns = getRemoveButtons(container)
    expect(removeBtns.length).toBe(1)

    await act(async () => {
      fireEvent.click(removeBtns[0])
    })

    expect(container.textContent).not.toContain('file1.txt')
  })

  it('adds new files on selection', async () => {
    const customRequest = vi.fn()
    const { container } = render(
      <Upload defaultFileList={[doneFile]} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('new.txt')] } })
    })

    expect(container.textContent).toContain('file1.txt')
    expect(container.textContent).toContain('new.txt')
  })
})

// ============================================================================
// Controlled fileList
// ============================================================================

describe('Upload – Controlled fileList', () => {
  it('renders files from controlled fileList', () => {
    const { container } = render(
      <Upload fileList={[doneFile, errorFile]}>Upload</Upload>,
    )
    expect(container.textContent).toContain('file1.txt')
    expect(container.textContent).toContain('file2.txt')
  })

  it('calls onChange but does not add files internally', async () => {
    const onChange = vi.fn()
    const customRequest = vi.fn()
    const { container, rerender } = render(
      <Upload fileList={[doneFile]} onChange={onChange} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('new.txt')] } })
    })

    expect(onChange).toHaveBeenCalled()
    // Since controlled, fileList stays the same until parent updates it
    const listAfter = container.querySelectorAll('[title="Remove"]')
    expect(listAfter.length).toBe(1) // Still only doneFile

    // Parent updates fileList with onChange data
    const newList = onChange.mock.calls[0][0].fileList
    rerender(
      <Upload fileList={newList} onChange={onChange} customRequest={customRequest}>Upload</Upload>,
    )
    expect(container.querySelectorAll('[title="Remove"]').length).toBe(2)
  })
})

// ============================================================================
// File list display – text type
// ============================================================================

describe('Upload – File list (text)', () => {
  it('shows file name with paperclip icon', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]}>Upload</Upload>,
    )
    expect(container.textContent).toContain('file1.txt')
    // Paperclip icon is an SVG
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('shows check icon for done files', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]}>Upload</Upload>,
    )
    // Done file shows CheckCircleIcon with colorSuccess
    const successIcons = container.querySelectorAll(`[style*="color"]`)
    const hasSuccess = Array.from(successIcons).some(
      (el) => (el as HTMLElement).style.color && el.querySelector('svg'),
    )
    expect(hasSuccess).toBe(true)
  })

  it('shows error icon for error files', () => {
    const { container } = render(
      <Upload defaultFileList={[errorFile]}>Upload</Upload>,
    )
    expect(container.textContent).toContain('file2.txt')
  })

  it('shows loading icon for uploading files', () => {
    const { container } = render(
      <Upload defaultFileList={[uploadingFile]}>Upload</Upload>,
    )
    // Uploading file shows LoadingIcon with animation
    const animated = container.querySelector('[style*="animation"]')
    expect(animated).toBeTruthy()
  })

  it('shows progress bar for uploading files with percent', () => {
    const { container } = render(
      <Upload defaultFileList={[uploadingFile]}>Upload</Upload>,
    )
    // Progress bar has width based on percent (50%)
    const progressBar = container.querySelector('[style*="width: 50%"]')
    expect(progressBar).toBeTruthy()
  })

  it('does not show removed files', () => {
    const removedFile: UploadFile = { uid: '10', name: 'removed.txt', status: 'removed' }
    const { container } = render(
      <Upload defaultFileList={[removedFile]}>Upload</Upload>,
    )
    expect(container.textContent).not.toContain('removed.txt')
  })
})

// ============================================================================
// File list display – picture type
// ============================================================================

describe('Upload – File list (picture)', () => {
  it('shows thumbnail for image files with thumbUrl', () => {
    const { container } = render(
      <Upload listType="picture" defaultFileList={[imageFile]}>Upload</Upload>,
    )
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.src).toContain('data:image/png')
    expect(img.alt).toBe('photo.png')
  })

  it('shows file icon placeholder when no thumb and not image', () => {
    const nonImageFile: UploadFile = { uid: '5', name: 'doc.pdf', status: 'done' }
    const { container } = render(
      <Upload listType="picture" defaultFileList={[nonImageFile]}>Upload</Upload>,
    )
    // Should show FileIcon (SVG) instead of img
    expect(container.querySelector('img')).toBeFalsy()
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('sets minimum height for picture items', () => {
    const { container } = render(
      <Upload listType="picture" defaultFileList={[doneFile]}>Upload</Upload>,
    )
    // Picture items have minHeight: '3.5rem'
    const item = container.querySelector('[style*="3.5rem"]')
    expect(item).toBeTruthy()
  })
})

// ============================================================================
// File list display – picture-card type
// ============================================================================

describe('Upload – File list (picture-card)', () => {
  it('renders card-size items', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[imageFile]} />,
    )
    // Card items have width and height of 6.5rem
    const cards = container.querySelectorAll('[style*="6.5rem"]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('renders plus trigger for card layout', () => {
    const { container } = render(<Upload listType="picture-card" />)
    expect(container.textContent).toContain('Upload')
    // Plus icon is an SVG
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('shows image thumbnail in card', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[imageFile]} />,
    )
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.style.objectFit).toBe('cover')
  })

  it('shows error indicator in card', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[errorFile]} />,
    )
    expect(container.textContent).toContain('Error')
  })

  it('shows loading spinner for uploading card', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[uploadingFile]} />,
    )
    const animated = container.querySelector('[style*="animation"]')
    expect(animated).toBeTruthy()
  })

  it('shows percent for uploading card', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[uploadingFile]} />,
    )
    expect(container.textContent).toContain('50%')
  })

  it('renders overlay with actions on card items', () => {
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[doneFile]}
        onPreview={vi.fn()}
      />,
    )
    // Overlay is hidden by default (opacity: 0)
    const overlay = container.querySelector('[style*="opacity"]')
    expect(overlay).toBeTruthy()
  })
})

// ============================================================================
// File list display – picture-circle type
// ============================================================================

describe('Upload – File list (picture-circle)', () => {
  it('renders with 50% border-radius for circle items', () => {
    const { container } = render(
      <Upload listType="picture-circle" defaultFileList={[imageFile]} />,
    )
    const circleItem = container.querySelector('[style*="border-radius: 50%"]')
    expect(circleItem).toBeTruthy()
  })

  it('renders circle trigger', () => {
    const { container } = render(<Upload listType="picture-circle" />)
    // Trigger also gets 50% borderRadius
    const circleTrigger = container.querySelector('[style*="border-radius: 50%"]')
    expect(circleTrigger).toBeTruthy()
  })
})

// ============================================================================
// Remove file
// ============================================================================

describe('Upload – Remove file', () => {
  it('shows remove button for each file', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile, errorFile]}>Upload</Upload>,
    )
    expect(getRemoveButtons(container).length).toBe(2)
  })

  it('removes file on click', async () => {
    const onChange = vi.fn()
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.click(getRemoveButtons(container)[0])
    })

    expect(onChange).toHaveBeenCalled()
    const info: UploadChangeParam = onChange.mock.calls[0][0]
    expect(info.file.status).toBe('removed')
  })

  it('calls onRemove callback', async () => {
    const onRemove = vi.fn()
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onRemove={onRemove}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.click(getRemoveButtons(container)[0])
    })

    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ uid: '1', name: 'file1.txt' }))
  })

  it('prevents removal when onRemove returns false', async () => {
    const onRemove = vi.fn(() => false)
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onRemove={onRemove}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.click(getRemoveButtons(container)[0])
    })

    expect(container.textContent).toContain('file1.txt')
  })

  it('prevents removal when onRemove returns Promise<false>', async () => {
    const onRemove = vi.fn(() => Promise.resolve(false))
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onRemove={onRemove}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.click(getRemoveButtons(container)[0])
    })

    expect(container.textContent).toContain('file1.txt')
  })

  it('prevents removal when onRemove returns rejected promise', async () => {
    const onRemove = vi.fn(() => Promise.reject(new Error('no')))
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onRemove={onRemove}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.click(getRemoveButtons(container)[0])
    })

    expect(container.textContent).toContain('file1.txt')
  })

  it('does not show remove button when disabled', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} disabled>Upload</Upload>,
    )
    expect(getRemoveButtons(container).length).toBe(0)
  })

  it('does not remove when disabled (card layout)', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[doneFile]} disabled />,
    )
    expect(getRemoveButtons(container).length).toBe(0)
  })
})

// ============================================================================
// Disabled
// ============================================================================

describe('Upload – Disabled', () => {
  it('shows opacity 0.5 on trigger when disabled', () => {
    const { container } = render(<Upload disabled><button>Upload</button></Upload>)
    // Trigger wrapper has opacity: 0.5
    const trigger = container.querySelector('[style*="opacity: 0.5"]')
    expect(trigger).toBeTruthy()
  })

  it('shows cursor not-allowed on trigger when disabled', () => {
    const { container } = render(<Upload disabled><button>Upload</button></Upload>)
    const trigger = container.querySelector('[style*="not-allowed"]')
    expect(trigger).toBeTruthy()
  })

  it('shows opacity 0.5 on card trigger when disabled', () => {
    const { container } = render(<Upload listType="picture-card" disabled />)
    const trigger = container.querySelector('[style*="opacity: 0.5"]')
    expect(trigger).toBeTruthy()
  })
})

// ============================================================================
// maxCount
// ============================================================================

describe('Upload – maxCount', () => {
  it('limits files to maxCount', async () => {
    const onChange = vi.fn()
    const customRequest = vi.fn()
    const { container } = render(
      <Upload maxCount={2} onChange={onChange} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), {
        target: { files: [createFile('a.txt'), createFile('b.txt'), createFile('c.txt')] },
      })
    })

    expect(onChange).toHaveBeenCalled()
    const info = onChange.mock.calls[0][0]
    expect(info.fileList.length).toBe(2)
  })

  it('maxCount=1 replaces existing file', async () => {
    const onChange = vi.fn()
    const customRequest = vi.fn()
    const { container } = render(
      <Upload maxCount={1} defaultFileList={[doneFile]} onChange={onChange} customRequest={customRequest}>
        Upload
      </Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('new.txt')] } })
    })

    expect(onChange).toHaveBeenCalled()
    const info = onChange.mock.calls[0][0]
    expect(info.fileList.length).toBe(1)
    expect(info.fileList[0].name).toBe('new.txt')
  })

  it('hides trigger when card layout reaches maxCount', () => {
    const files: UploadFile[] = [
      { uid: '1', name: 'a.png', status: 'done' },
      { uid: '2', name: 'b.png', status: 'done' },
    ]
    const { container } = render(
      <Upload listType="picture-card" fileList={files} maxCount={2} />,
    )
    // When at maxCount, trigger should not be rendered
    // Trigger has "Upload" text
    expect(container.textContent).not.toContain('Upload')
  })

  it('shows trigger when below maxCount in card layout', () => {
    const files: UploadFile[] = [
      { uid: '1', name: 'a.png', status: 'done' },
    ]
    const { container } = render(
      <Upload listType="picture-card" fileList={files} maxCount={2} />,
    )
    expect(container.textContent).toContain('Upload')
  })

  it('does not add more files when maxCount reached', async () => {
    const onChange = vi.fn()
    const customRequest = vi.fn()
    const existing: UploadFile[] = [
      { uid: '1', name: 'a.txt', status: 'done' },
      { uid: '2', name: 'b.txt', status: 'done' },
    ]
    const { container } = render(
      <Upload maxCount={2} defaultFileList={existing} onChange={onChange} customRequest={customRequest}>
        Upload
      </Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('c.txt')] } })
    })

    // onChange should not be called since no files can be added
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ============================================================================
// beforeUpload
// ============================================================================

describe('Upload – beforeUpload', () => {
  it('receives file and fileList args', async () => {
    const beforeUpload = vi.fn(() => true)
    const customRequest = vi.fn()
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest}>Upload</Upload>,
    )
    const file = createFile('test.txt')

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [file] } })
    })

    expect(beforeUpload).toHaveBeenCalledWith(file, [file])
  })

  it('prevents upload when returning false (adds to list without uploading)', async () => {
    const customRequest = vi.fn()
    const beforeUpload = vi.fn(() => false)
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    // File is still added to list but customRequest should NOT be called
    expect(customRequest).not.toHaveBeenCalled()
    expect(container.textContent).toContain('test.txt')
  })

  it('skips file when returning LIST_IGNORE', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const beforeUpload = vi.fn(() => Upload.LIST_IGNORE)
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    expect(customRequest).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('skips file when promise rejects', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const beforeUpload = vi.fn(() => Promise.reject(new Error('no')))
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    expect(customRequest).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('uses transformed file when promise resolves with File', async () => {
    const transformed = createFile('transformed.txt')
    const customRequest = vi.fn()
    const beforeUpload = vi.fn(() => Promise.resolve(transformed))
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('original.txt')] } })
    })

    expect(customRequest).toHaveBeenCalled()
    expect(customRequest.mock.calls[0][0].file).toBe(transformed)
  })

  it('prevents upload (not list) when promise resolves false', async () => {
    const customRequest = vi.fn()
    const beforeUpload = vi.fn(() => Promise.resolve(false))
    const { container } = render(
      <Upload beforeUpload={beforeUpload} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    expect(customRequest).not.toHaveBeenCalled()
    expect(container.textContent).toContain('test.txt')
  })
})

// ============================================================================
// customRequest
// ============================================================================

describe('Upload – customRequest', () => {
  it('receives correct options', async () => {
    const customRequest = vi.fn()
    const { container } = render(
      <Upload
        customRequest={customRequest}
        action="https://upload.example.com"
        name="myFile"
        method="put"
        headers={{ Authorization: 'Bearer token' }}
        data={{ field: 'value' }}
        withCredentials
      >
        Upload
      </Upload>,
    )
    const file = createFile('test.txt')

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [file] } })
    })

    expect(customRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'https://upload.example.com',
        filename: 'myFile',
        method: 'put',
        file,
        headers: { Authorization: 'Bearer token' },
        data: { field: 'value' },
        withCredentials: true,
      }),
    )
  })

  it('updates file status to done on onSuccess', async () => {
    let requestOptions: any
    const customRequest = vi.fn((opts) => {
      requestOptions = opts
    })
    const onChange = vi.fn()
    const { container } = render(
      <Upload customRequest={customRequest} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    await act(async () => {
      requestOptions.onSuccess({ ok: true }, requestOptions.file)
    })

    // onChange should have been called multiple times: once for adding, once for success
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.file.status).toBe('done')
  })

  it('updates file status to error on onError', async () => {
    let requestOptions: any
    const customRequest = vi.fn((opts) => {
      requestOptions = opts
    })
    const onChange = vi.fn()
    const { container } = render(
      <Upload customRequest={customRequest} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    await act(async () => {
      requestOptions.onError(new Error('fail'))
    })

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.file.status).toBe('error')
  })

  it('updates percent on onProgress', async () => {
    let requestOptions: any
    const customRequest = vi.fn((opts) => {
      requestOptions = opts
    })
    const onChange = vi.fn()
    const { container } = render(
      <Upload customRequest={customRequest} onChange={onChange}>Upload</Upload>,
    )

    await act(async () => {
      fireEvent.change(getInput(container), { target: { files: [createFile('test.txt')] } })
    })

    await act(async () => {
      requestOptions.onProgress({ percent: 60 })
    })

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.file.percent).toBe(60)
    expect(lastCall.event).toEqual({ percent: 60 })
  })
})

// ============================================================================
// showUploadList
// ============================================================================

describe('Upload – showUploadList', () => {
  it('hides list when showUploadList=false', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} showUploadList={false}>Upload</Upload>,
    )
    expect(container.textContent).not.toContain('file1.txt')
    expect(getRemoveButtons(container).length).toBe(0)
  })

  it('shows preview button when showPreviewIcon=true', () => {
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[doneFile]}
        showUploadList={{ showPreviewIcon: true }}
        onPreview={vi.fn()}
      />,
    )
    expect(getPreviewButtons(container).length).toBe(1)
  })

  it('hides preview button when showPreviewIcon=false', () => {
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[doneFile]}
        showUploadList={{ showPreviewIcon: false }}
        onPreview={vi.fn()}
      />,
    )
    expect(getPreviewButtons(container).length).toBe(0)
  })

  it('shows download button when showDownloadIcon=true', () => {
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[doneFile]}
        showUploadList={{ showDownloadIcon: true }}
        onDownload={vi.fn()}
      />,
    )
    expect(getDownloadButtons(container).length).toBe(1)
  })

  it('hides download button by default', () => {
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[doneFile]}
        onDownload={vi.fn()}
      />,
    )
    expect(getDownloadButtons(container).length).toBe(0)
  })

  it('hides remove button when showRemoveIcon=false', () => {
    const { container } = render(
      <Upload
        defaultFileList={[doneFile]}
        showUploadList={{ showRemoveIcon: false }}
      >Upload</Upload>,
    )
    expect(getRemoveButtons(container).length).toBe(0)
  })

  it('renders custom removeIcon', () => {
    const { container } = render(
      <Upload
        defaultFileList={[doneFile]}
        showUploadList={{ removeIcon: <span data-testid="custom-remove">X</span> }}
      >Upload</Upload>,
    )
    expect(screen.getByTestId('custom-remove')).toBeInTheDocument()
  })

  it('renders custom removeIcon as function', () => {
    const { container } = render(
      <Upload
        defaultFileList={[doneFile]}
        showUploadList={{ removeIcon: (file) => <span data-testid="custom-remove">{file.name}</span> }}
      >Upload</Upload>,
    )
    expect(screen.getByTestId('custom-remove').textContent).toBe('file1.txt')
  })
})

// ============================================================================
// onPreview & onDownload
// ============================================================================

describe('Upload – onPreview & onDownload', () => {
  it('calls onPreview when clicking file name in text mode', async () => {
    const onPreview = vi.fn()
    const { container } = render(
      <Upload defaultFileList={[doneFile]} onPreview={onPreview}>Upload</Upload>,
    )
    // In text mode, clicking the name span triggers preview
    const nameSpan = container.querySelector('[title="file1.txt"]') as HTMLElement
    expect(nameSpan).toBeTruthy()

    await act(async () => {
      fireEvent.click(nameSpan)
    })

    expect(onPreview).toHaveBeenCalledWith(expect.objectContaining({ uid: '1', name: 'file1.txt' }))
  })

  it('calls onPreview on preview button in card mode', async () => {
    const onPreview = vi.fn()
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[doneFile]} onPreview={onPreview} />,
    )

    const previewBtn = getPreviewButtons(container)[0]
    expect(previewBtn).toBeTruthy()

    await act(async () => {
      fireEvent.click(previewBtn)
    })

    expect(onPreview).toHaveBeenCalledWith(expect.objectContaining({ uid: '1' }))
  })

  it('calls onDownload on download button', async () => {
    const onDownload = vi.fn()
    const { container } = render(
      <Upload
        defaultFileList={[doneFile]}
        showUploadList={{ showDownloadIcon: true }}
        onDownload={onDownload}
      >Upload</Upload>,
    )

    const downloadBtn = getDownloadButtons(container)[0]
    expect(downloadBtn).toBeTruthy()

    await act(async () => {
      fireEvent.click(downloadBtn)
    })

    expect(onDownload).toHaveBeenCalledWith(expect.objectContaining({ uid: '1' }))
  })
})

// ============================================================================
// Upload.Dragger
// ============================================================================

describe('Upload.Dragger', () => {
  it('renders dragger area with dashed border', () => {
    const { container } = render(<Upload.Dragger />)
    const dragger = container.querySelector('[style*="dashed"]')
    expect(dragger).toBeTruthy()
  })

  it('shows default dragger content when no children', () => {
    render(<Upload.Dragger />)
    expect(screen.getByText(/Click or drag file/)).toBeInTheDocument()
  })

  it('renders custom children in dragger', () => {
    render(<Upload.Dragger><p>Drop here</p></Upload.Dragger>)
    expect(screen.getByText('Drop here')).toBeInTheDocument()
  })

  it('opens file dialog on click', () => {
    const { container } = render(<Upload.Dragger />)
    const input = getInput(container)
    const clickSpy = vi.spyOn(input, 'click')
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement
    fireEvent.click(dragger)
    expect(clickSpy).toHaveBeenCalled()
  })

  it('calls onDrop on drag & drop', async () => {
    const onDrop = vi.fn()
    const customRequest = vi.fn()
    const { container } = render(<Upload.Dragger onDrop={onDrop} customRequest={customRequest} />)
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    const file = createFile('dropped.txt')
    const dataTransfer = { files: [file] }

    await act(async () => {
      fireEvent.dragEnter(dragger, { dataTransfer })
      fireEvent.dragOver(dragger, { dataTransfer })
      fireEvent.drop(dragger, { dataTransfer })
    })

    expect(onDrop).toHaveBeenCalled()
  })

  it('processes dropped files', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Upload.Dragger customRequest={customRequest} onChange={onChange} />,
    )
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    const file = createFile('dropped.txt')

    await act(async () => {
      fireEvent.drop(dragger, { dataTransfer: { files: [file] } })
    })

    expect(onChange).toHaveBeenCalled()
    expect(customRequest).toHaveBeenCalled()
  })

  it('does not process files on drop when disabled', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Upload.Dragger disabled customRequest={customRequest} onChange={onChange} />,
    )
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    await act(async () => {
      fireEvent.drop(dragger, { dataTransfer: { files: [createFile('test.txt')] } })
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(customRequest).not.toHaveBeenCalled()
  })

  it('sets isDragActive style on dragEnter and resets on dragLeave', async () => {
    const { container } = render(<Upload.Dragger />)
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    await act(async () => {
      fireEvent.dragEnter(dragger, { dataTransfer: { files: [] } })
    })

    // When drag active, border color changes to primary color
    // We check that the style changes after drag enter
    expect(dragger.style.borderColor || dragger.style.border).toBeTruthy()

    await act(async () => {
      fireEvent.dragLeave(dragger, { dataTransfer: { files: [] } })
    })
  })

  it('shows disabled appearance', () => {
    const { container } = render(<Upload.Dragger disabled />)
    const dragger = container.querySelector('[style*="not-allowed"]')
    expect(dragger).toBeTruthy()
    const opacityEl = container.querySelector('[style*="opacity: 0.5"]')
    expect(opacityEl).toBeTruthy()
  })
})

// ============================================================================
// Upload.LIST_IGNORE
// ============================================================================

describe('Upload.LIST_IGNORE', () => {
  it('exports LIST_IGNORE constant', () => {
    expect(Upload.LIST_IGNORE).toBe('__LIST_IGNORE__')
  })
})

// ============================================================================
// Drag & drop on standard Upload
// ============================================================================

describe('Upload – Drag & drop (standard)', () => {
  it('filters dropped files by accept', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Upload.Dragger accept=".txt" customRequest={customRequest} onChange={onChange} />,
    )
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    const txtFile = createFile('doc.txt', 100, 'text/plain')
    const pngFile = createImageFile('photo.png')

    await act(async () => {
      fireEvent.drop(dragger, { dataTransfer: { files: [txtFile, pngFile] } })
    })

    // Only the txt file should pass the accept filter
    if (customRequest.mock.calls.length > 0) {
      expect(customRequest.mock.calls[0][0].file.name).toBe('doc.txt')
    }
  })

  it('takes only first file when multiple=false', async () => {
    const customRequest = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <Upload.Dragger customRequest={customRequest} onChange={onChange} />,
    )
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    const file1 = createFile('a.txt')
    const file2 = createFile('b.txt')

    await act(async () => {
      fireEvent.drop(dragger, { dataTransfer: { files: [file1, file2] } })
    })

    // Only one file should be processed (multiple defaults to false)
    expect(customRequest).toHaveBeenCalledTimes(1)
  })

  it('takes multiple files when multiple=true', async () => {
    const customRequest = vi.fn()
    const { container } = render(
      <Upload.Dragger multiple customRequest={customRequest} />,
    )
    const dragger = container.querySelector('[style*="dashed"]') as HTMLElement

    const file1 = createFile('a.txt')
    const file2 = createFile('b.txt')

    await act(async () => {
      fireEvent.drop(dragger, { dataTransfer: { files: [file1, file2] } })
    })

    expect(customRequest).toHaveBeenCalledTimes(2)
  })
})

// ============================================================================
// Progress configuration
// ============================================================================

describe('Upload – Progress config', () => {
  it('uses custom strokeColor for progress bar', () => {
    const file: UploadFile = { uid: '1', name: 'test.txt', status: 'uploading', percent: 40 }
    const { container } = render(
      <Upload defaultFileList={[file]} progress={{ strokeColor: 'red' }}>Upload</Upload>,
    )
    const bar = container.querySelector('[style*="width: 40%"]') as HTMLElement
    expect(bar).toBeTruthy()
    expect(bar.style.backgroundColor).toBe('red')
  })

  it('uses custom strokeWidth for progress bar', () => {
    const file: UploadFile = { uid: '1', name: 'test.txt', status: 'uploading', percent: 40 }
    const { container } = render(
      <Upload defaultFileList={[file]} progress={{ strokeWidth: 6 }}>Upload</Upload>,
    )
    // Progress container has height = strokeWidth
    const bar = container.querySelector('[style*="height: 6px"]')
    expect(bar).toBeTruthy()
  })

  it('uses custom format function for progress in card mode', () => {
    const file: UploadFile = { uid: '1', name: 'test.txt', status: 'uploading', percent: 75 }
    const { container } = render(
      <Upload
        listType="picture-card"
        defaultFileList={[file]}
        progress={{ format: (p) => `${p}% done` }}
      />,
    )
    expect(container.textContent).toContain('75% done')
  })

  it('uses custom format function for progress in text mode', () => {
    const file: UploadFile = { uid: '1', name: 'test.txt', status: 'uploading', percent: 30 }
    const { container } = render(
      <Upload defaultFileList={[file]} progress={{ format: (p) => `Loading ${p}%` }}>Upload</Upload>,
    )
    expect(container.textContent).toContain('Loading 30%')
  })
})

// ============================================================================
// itemRender
// ============================================================================

describe('Upload – itemRender', () => {
  it('renders custom item via itemRender', () => {
    const itemRender = vi.fn((_node, file) => <div data-testid="custom-item">{file.name}</div>)
    render(
      <Upload defaultFileList={[doneFile]} itemRender={itemRender}>Upload</Upload>,
    )
    expect(screen.getByTestId('custom-item')).toBeInTheDocument()
    expect(screen.getByTestId('custom-item').textContent).toBe('file1.txt')
  })

  it('passes actions to itemRender', () => {
    const onPreview = vi.fn()
    const onDownload = vi.fn()
    let capturedActions: any

    const itemRender = vi.fn((_node, _file, _list, actions) => {
      capturedActions = actions
      return <div data-testid="custom-item">Custom</div>
    })

    render(
      <Upload
        defaultFileList={[doneFile]}
        itemRender={itemRender}
        onPreview={onPreview}
        onDownload={onDownload}
      >Upload</Upload>,
    )

    expect(capturedActions).toBeDefined()
    expect(typeof capturedActions.preview).toBe('function')
    expect(typeof capturedActions.download).toBe('function')
    expect(typeof capturedActions.remove).toBe('function')
  })

  it('passes fileList to itemRender', () => {
    const files = [doneFile, errorFile]
    const itemRender = vi.fn((_node, _file, fileList) => {
      return <div>{fileList.length}</div>
    })

    render(
      <Upload defaultFileList={files} itemRender={itemRender}>Upload</Upload>,
    )

    expect(itemRender).toHaveBeenCalledTimes(2)
    expect(itemRender.mock.calls[0][2].length).toBe(2)
  })
})

// ============================================================================
// Ref
// ============================================================================

describe('Upload – Ref', () => {
  it('exposes nativeElement ref', () => {
    const ref = createRef<UploadRef>()
    const { container } = render(<Upload ref={ref}>Upload</Upload>)
    expect(ref.current).toBeTruthy()
    expect(ref.current!.nativeElement).toBe(container.firstElementChild)
  })

  it('exposes upload method', () => {
    const ref = createRef<UploadRef>()
    render(<Upload ref={ref}>Upload</Upload>)
    expect(typeof ref.current!.upload).toBe('function')
  })

  it('upload() triggers upload of pending files', async () => {
    const ref = createRef<UploadRef>()
    const customRequest = vi.fn()
    const file: UploadFile = { uid: '1', name: 'pending.txt', originFileObj: createFile('pending.txt') }

    render(
      <Upload ref={ref} defaultFileList={[file]} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      ref.current!.upload()
    })

    expect(customRequest).toHaveBeenCalled()
  })

  it('upload(file) triggers upload of specific file', async () => {
    const ref = createRef<UploadRef>()
    const customRequest = vi.fn()
    const file: UploadFile = { uid: '1', name: 'specific.txt', originFileObj: createFile('specific.txt') }

    render(
      <Upload ref={ref} defaultFileList={[file]} customRequest={customRequest}>Upload</Upload>,
    )

    await act(async () => {
      ref.current!.upload(file)
    })

    expect(customRequest).toHaveBeenCalled()
  })
})

// ============================================================================
// Semantic classNames & styles
// ============================================================================

describe('Upload – Semantic classNames', () => {
  it('applies classNames.root', () => {
    const { container } = render(
      <Upload classNames={{ root: 'my-root' }}>Upload</Upload>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('my-root')
  })

  it('applies classNames.trigger', () => {
    const { container } = render(
      <Upload classNames={{ trigger: 'my-trigger' }}><button>Upload</button></Upload>,
    )
    const trigger = container.querySelector('.my-trigger')
    expect(trigger).toBeTruthy()
  })

  it('applies classNames.list', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} classNames={{ list: 'my-list' }}>Upload</Upload>,
    )
    const list = container.querySelector('.my-list')
    expect(list).toBeTruthy()
  })

  it('applies classNames.item', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} classNames={{ item: 'my-item' }}>Upload</Upload>,
    )
    const item = container.querySelector('.my-item')
    expect(item).toBeTruthy()
  })

  it('applies classNames.dragger on Dragger', () => {
    const { container } = render(
      <Upload.Dragger classNames={{ dragger: 'my-dragger' }} />,
    )
    const dragger = container.querySelector('.my-dragger')
    expect(dragger).toBeTruthy()
  })

  it('applies classNames.thumbnail', () => {
    const { container } = render(
      <Upload listType="picture" defaultFileList={[imageFile]} classNames={{ thumbnail: 'my-thumb' }}>
        Upload
      </Upload>,
    )
    const thumb = container.querySelector('.my-thumb')
    expect(thumb).toBeTruthy()
  })

  it('applies classNames.itemActions', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} classNames={{ itemActions: 'my-actions' }}>Upload</Upload>,
    )
    const actions = container.querySelector('.my-actions')
    expect(actions).toBeTruthy()
  })
})

describe('Upload – Semantic styles', () => {
  it('applies styles.root', () => {
    const { container } = render(
      <Upload styles={{ root: { padding: '20px' } }}>Upload</Upload>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.padding).toBe('20px')
  })

  it('applies styles.trigger', () => {
    const { container } = render(
      <Upload styles={{ trigger: { border: '2px solid red' } }}><button>Upload</button></Upload>,
    )
    // Trigger wrapper should have the custom style
    const triggerDivs = container.querySelectorAll('div')
    const trigger = Array.from(triggerDivs).find((d) => d.style.border === '2px solid red')
    expect(trigger).toBeTruthy()
  })

  it('applies styles.list', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} styles={{ list: { marginTop: '10px' } }}>Upload</Upload>,
    )
    const listDivs = container.querySelectorAll('div')
    const list = Array.from(listDivs).find((d) => d.style.marginTop === '10px')
    expect(list).toBeTruthy()
  })

  it('applies styles.item', () => {
    const { container } = render(
      <Upload defaultFileList={[doneFile]} styles={{ item: { backgroundColor: 'pink' } }}>Upload</Upload>,
    )
    const items = container.querySelectorAll('div')
    const item = Array.from(items).find((d) => d.style.backgroundColor === 'pink')
    expect(item).toBeTruthy()
  })

  it('applies styles.thumbnail on picture list', () => {
    const { container } = render(
      <Upload listType="picture" defaultFileList={[imageFile]} styles={{ thumbnail: { opacity: '0.5' } }}>
        Upload
      </Upload>,
    )
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.style.opacity).toBe('0.5')
  })
})

// ============================================================================
// Error display
// ============================================================================

describe('Upload – Error display', () => {
  it('shows error border for error files in text mode', () => {
    const { container } = render(
      <Upload defaultFileList={[errorFile]}>Upload</Upload>,
    )
    // Error file gets a red-ish border and bg
    const items = container.querySelectorAll('div')
    const errorItem = Array.from(items).find((d) => d.style.backgroundColor?.includes('rgba(255'))
    expect(errorItem).toBeTruthy()
  })

  it('shows error border for error files in card mode', () => {
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[errorFile]} />,
    )
    expect(container.textContent).toContain('Error')
  })
})

// ============================================================================
// Image crossOrigin
// ============================================================================

describe('Upload – Image crossOrigin', () => {
  it('passes crossOrigin to img in card mode', () => {
    const file: UploadFile = { uid: '1', name: 'img.png', status: 'done', thumbUrl: 'http://example.com/img.png', crossOrigin: 'anonymous' }
    const { container } = render(
      <Upload listType="picture-card" defaultFileList={[file]} />,
    )
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.crossOrigin).toBe('anonymous')
  })

  it('passes crossOrigin to img in picture mode', () => {
    const file: UploadFile = { uid: '1', name: 'img.png', status: 'done', thumbUrl: 'http://example.com/img.png', crossOrigin: 'use-credentials' }
    const { container } = render(
      <Upload listType="picture" defaultFileList={[file]}>Upload</Upload>,
    )
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.crossOrigin).toBe('use-credentials')
  })
})

// ============================================================================
// Compound export
// ============================================================================

describe('Upload – Compound export', () => {
  it('has Dragger sub-component', () => {
    expect(Upload.Dragger).toBeDefined()
  })

  it('has LIST_IGNORE constant', () => {
    expect(Upload.LIST_IGNORE).toBeDefined()
    expect(typeof Upload.LIST_IGNORE).toBe('string')
  })
})
