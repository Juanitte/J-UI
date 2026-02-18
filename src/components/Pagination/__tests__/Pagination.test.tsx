import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  // ---------- Basic rendering ----------

  it('renders a nav with aria-label="pagination"', () => {
    render(<Pagination total={100} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'pagination')
  })

  it('renders page buttons', () => {
    render(<Pagination total={50} />)
    // 50 items / 10 per page = 5 pages
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  it('renders prev and next buttons', () => {
    render(<Pagination total={50} />)
    expect(screen.getByLabelText('Previous')).toBeInTheDocument()
    expect(screen.getByLabelText('Next')).toBeInTheDocument()
  })

  it('marks current page with aria-current="page"', () => {
    render(<Pagination total={50} defaultCurrent={3} />)
    const btn = screen.getByText('3').closest('button')
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  // ---------- Page navigation ----------

  it('navigates to clicked page and calls onChange', () => {
    const onChange = vi.fn()
    render(<Pagination total={50} onChange={onChange} />)

    fireEvent.click(screen.getByText('3'))

    expect(onChange).toHaveBeenCalledWith(3, 10)
    // Page 3 should now be active
    expect(screen.getByText('3').closest('button')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates with prev button', () => {
    const onChange = vi.fn()
    render(<Pagination total={50} defaultCurrent={3} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Previous').closest('li')!)

    expect(onChange).toHaveBeenCalledWith(2, 10)
  })

  it('navigates with next button', () => {
    const onChange = vi.fn()
    render(<Pagination total={50} defaultCurrent={3} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Next').closest('li')!)

    expect(onChange).toHaveBeenCalledWith(4, 10)
  })

  it('disables prev button on first page', () => {
    render(<Pagination total={50} defaultCurrent={1} />)
    expect(screen.getByLabelText('Previous')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination total={50} defaultCurrent={5} />)
    expect(screen.getByLabelText('Next')).toBeDisabled()
  })

  // ---------- Ellipsis / jump pages ----------

  it('renders ellipsis for many pages', () => {
    render(<Pagination total={200} defaultCurrent={10} />)
    // With 200 / 10 = 20 pages, ellipsis should appear
    const ellipses = screen.getAllByText('•••')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('jumps 5 pages forward on jump-next click', () => {
    const onChange = vi.fn()
    render(<Pagination total={200} defaultCurrent={10} onChange={onChange} />)

    // Find jump-next ellipsis (second one)
    const ellipses = screen.getAllByText('•••')
    // Click the last ellipsis (jump-next)
    fireEvent.click(ellipses[ellipses.length - 1].closest('li')!)

    expect(onChange).toHaveBeenCalledWith(15, 10)
  })

  it('jumps 5 pages backward on jump-prev click', () => {
    const onChange = vi.fn()
    render(<Pagination total={200} defaultCurrent={10} onChange={onChange} />)

    const ellipses = screen.getAllByText('•••')
    // Click the first ellipsis (jump-prev)
    fireEvent.click(ellipses[0].closest('li')!)

    expect(onChange).toHaveBeenCalledWith(5, 10)
  })

  // ---------- Controlled state ----------

  it('respects controlled current prop', () => {
    const { rerender } = render(<Pagination total={50} current={2} />)
    expect(screen.getByText('2').closest('button')).toHaveAttribute('aria-current', 'page')

    rerender(<Pagination total={50} current={4} />)
    expect(screen.getByText('4').closest('button')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('2').closest('button')).not.toHaveAttribute('aria-current')
  })

  it('respects controlled pageSize prop', () => {
    render(<Pagination total={100} pageSize={25} />)
    // 100 / 25 = 4 pages
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })

  // ---------- Disabled ----------

  it('disables all buttons when disabled', () => {
    render(<Pagination total={50} disabled />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  // ---------- hideOnSinglePage ----------

  it('hides when only 1 page and hideOnSinglePage=true', () => {
    const { container } = render(<Pagination total={5} hideOnSinglePage />)
    expect(container.firstChild).toBeNull()
  })

  it('shows when only 1 page and hideOnSinglePage=false', () => {
    render(<Pagination total={5} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  // ---------- Simple mode ----------

  it('renders simple mode with input and page count', () => {
    render(<Pagination total={50} simple />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('1')
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('navigates in simple mode on Enter', () => {
    const onChange = vi.fn()
    render(<Pagination total={50} simple onChange={onChange} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    input.focus()
    fireEvent.change(input, { target: { value: '3' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith(3, 10)
  })

  it('navigates in simple mode on blur', () => {
    const onChange = vi.fn()
    render(<Pagination total={50} simple onChange={onChange} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    input.focus()
    fireEvent.change(input, { target: { value: '4' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith(4, 10)
  })

  // ---------- showTotal ----------

  it('renders showTotal callback result', () => {
    render(
      <Pagination
        total={85}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    )
    expect(screen.getByText('1-10 of 85 items')).toBeInTheDocument()
  })

  it('shows correct range on page 2', () => {
    render(
      <Pagination
        total={85}
        defaultCurrent={2}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    )
    expect(screen.getByText('11-20 of 85 items')).toBeInTheDocument()
  })

  // ---------- showSizeChanger ----------

  it('shows size changer when total > 50', () => {
    render(<Pagination total={100} />)
    expect(screen.getByText('10 / page')).toBeInTheDocument()
  })

  it('hides size changer when total <= 50', () => {
    render(<Pagination total={30} />)
    expect(screen.queryByText('10 / page')).not.toBeInTheDocument()
  })

  it('forces size changer with showSizeChanger=true', () => {
    render(<Pagination total={30} showSizeChanger />)
    expect(screen.getByText('10 / page')).toBeInTheDocument()
  })

  it('opens size changer dropdown and changes page size', () => {
    const onShowSizeChange = vi.fn()
    const onChange = vi.fn()
    render(
      <Pagination total={100} showSizeChanger onShowSizeChange={onShowSizeChange} onChange={onChange} />
    )

    // Open the dropdown
    fireEvent.click(screen.getByText('10 / page'))

    // Select 20 per page
    fireEvent.click(screen.getByText('20 / page'))

    expect(onShowSizeChange).toHaveBeenCalledWith(1, 20)
    expect(onChange).toHaveBeenCalledWith(1, 20)
  })

  // ---------- showQuickJumper ----------

  it('renders quick jumper input', () => {
    render(<Pagination total={100} showQuickJumper />)
    expect(screen.getByText('Go to')).toBeInTheDocument()
  })

  it('navigates via quick jumper on Enter', () => {
    const onChange = vi.fn()
    render(<Pagination total={100} showQuickJumper onChange={onChange} />)

    // The quick jumper input is the one inside the "Go to" span
    const inputs = screen.getAllByRole('textbox')
    const jumperInput = inputs[inputs.length - 1]

    fireEvent.change(jumperInput, { target: { value: '7' } })
    fireEvent.keyDown(jumperInput, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith(7, 10)
  })

  // ---------- Size ----------

  it('renders small buttons when size="small"', () => {
    render(<Pagination total={50} size="small" />)
    const pageBtn = screen.getByText('1').closest('button') as HTMLElement
    expect(pageBtn.style.height).toBe('1.5rem')
  })

  it('renders default size buttons', () => {
    render(<Pagination total={50} />)
    const pageBtn = screen.getByText('1').closest('button') as HTMLElement
    expect(pageBtn.style.height).toBe('2rem')
  })

  // ---------- showTitle ----------

  it('shows title attributes by default', () => {
    render(<Pagination total={50} />)
    expect(screen.getByLabelText('Previous')).toHaveAttribute('title', 'Previous Page')
    expect(screen.getByLabelText('Next')).toHaveAttribute('title', 'Next Page')
    expect(screen.getByText('1').closest('button')).toHaveAttribute('title', '1')
  })

  it('hides title attributes when showTitle=false', () => {
    render(<Pagination total={50} showTitle={false} />)
    expect(screen.getByLabelText('Previous')).not.toHaveAttribute('title')
    expect(screen.getByText('1').closest('button')).not.toHaveAttribute('title')
  })

  // ---------- itemRender ----------

  it('uses custom itemRender for page items', () => {
    const itemRender = vi.fn((_page, _type, original) => original)
    render(<Pagination total={50} itemRender={itemRender} />)

    // Called for prev + 5 pages + next = 7 times
    expect(itemRender).toHaveBeenCalledTimes(7)
    // Verify it receives correct params for page 1
    expect(itemRender).toHaveBeenCalledWith(1, 'page', expect.anything())
    expect(itemRender).toHaveBeenCalledWith(
      expect.any(Number),
      'prev',
      expect.anything(),
    )
    expect(itemRender).toHaveBeenCalledWith(
      expect.any(Number),
      'next',
      expect.anything(),
    )
  })

  // ---------- className & style ----------

  it('applies custom className to nav', () => {
    render(<Pagination total={50} className="my-pagination" />)
    expect(screen.getByRole('navigation')).toHaveClass('my-pagination')
  })

  it('applies custom style to nav', () => {
    render(<Pagination total={50} style={{ margin: 10 }} />)
    expect(screen.getByRole('navigation').style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.root', () => {
    render(<Pagination total={50} classNames={{ root: 'custom-root' }} />)
    expect(screen.getByRole('navigation')).toHaveClass('custom-root')
  })

  it('applies classNames.item to page buttons', () => {
    const { container } = render(
      <Pagination total={30} classNames={{ item: 'custom-item' }} />
    )
    const items = container.querySelectorAll('.custom-item')
    // prev + 3 pages + next = 5
    expect(items).toHaveLength(5)
  })

  it('applies classNames.options to the options container', () => {
    const { container } = render(
      <Pagination total={100} showSizeChanger showQuickJumper classNames={{ options: 'custom-opts' }} />
    )
    expect(container.querySelector('.custom-opts')).toBeInTheDocument()
  })

  // ---------- Edge cases ----------

  it('renders with total=0', () => {
    render(<Pagination total={0} />)
    // Should still render nav with page 1
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('clamps page when pageSize changes to fewer total pages', () => {
    const onChange = vi.fn()
    render(
      <Pagination total={100} defaultCurrent={10} showSizeChanger onChange={onChange} />
    )

    // Open the dropdown and select 50/page → only 2 pages, current (10) should clamp to 2
    fireEvent.click(screen.getByText('10 / page'))
    fireEvent.click(screen.getByText('50 / page'))

    expect(onChange).toHaveBeenCalledWith(2, 50)
  })
})
