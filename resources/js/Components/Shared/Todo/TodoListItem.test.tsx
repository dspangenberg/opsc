import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { router } from '@inertiajs/core'
import { TodoListItem } from './TodoListItem'

vi.mock('@inertiajs/core', () => ({
  router: { put: vi.fn() },
}))

vi.mock('@hugeicons/react', () => ({
  HugeiconsIcon: ({ icon, onClick, className, ...props }: Record<string, unknown>) => (
    <span data-testid="hugeicon" data-icon={JSON.stringify(icon)} className={className as string} onClick={onClick as React.MouseEventHandler} {...props} />
  ),
}))

vi.mock('@/Components/twc-ui/icon', () => ({
  Icon: ({ icon, onClick, className, ...props }: Record<string, unknown>) => (
    <span data-testid="icon" className={className as string} onClick={onClick as React.MouseEventHandler} {...props} />
  ),
}))

vi.mock('@/Components/twc-ui/avatar', () => ({
  Avatar: ({ fullname, initials }: { fullname?: string; initials?: string }) => (
    <div data-testid="avatar">{initials ?? fullname}</div>
  ),
}))

const user = { id: 1, full_name: 'Max Mustermann', initials: 'MM', email: 'max@test.de', avatar_url: null }
const otherUser = { id: 2, full_name: 'Anna Schmidt', initials: 'AS', email: 'anna@test.de', avatar_url: null }

function makeTodo(overrides: Partial<App.Data.TodoData> = {}): App.Data.TodoData {
  return {
    id: 10,
    title: 'Test Todo',
    todoable_type: 'Project',
    todoable_id: 1,
    due_at: '2026-09-01',
    completed_at: null,
    created_by_user_id: 1,
    assigned_to_user_id: 1,
    assigned_to: user,
    created_by: user,
    todobable_description: 'Projekt: Testprojekt',
    is_overdue: false,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  ;(globalThis as Record<string, unknown>).route = (name: string, params?: Record<string, unknown>) => {
    const id = (params?.todo as { id: number })?.id ?? 0
    const suffix = name.includes('complete') && !name.includes('uncomplete') ? '/complete' : '/uncomplete'
    return `/app/todos/${id}${suffix}`
  }
})

describe('TodoListItem', () => {
  it('rendert Titel, Ersteller und Description', () => {
    render(<TodoListItem todo={makeTodo()} user={user} />)

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText(/erstellt von Max Mustermann/)).toBeInTheDocument()
    expect(screen.getByText(/Projekt: Testprojekt/)).toBeInTheDocument()
  })

  it('zeigt Due-Datum wenn nicht abgeschlossen', () => {
    render(<TodoListItem todo={makeTodo({ completed_at: null, due_at: '2026-09-01' })} user={user} />)

    expect(screen.getByText('2026-09-01')).toBeInTheDocument()
  })

  it('versteckt Due-Datum wenn abgeschlossen', () => {
    render(<TodoListItem todo={makeTodo({ completed_at: '2026-08-27', due_at: '2026-09-01' })} user={user} />)

    expect(screen.queryByText('2026-09-01')).not.toBeInTheDocument()
  })

  it('zeigt line-through am Titel wenn abgeschlossen', () => {
    render(<TodoListItem todo={makeTodo({ completed_at: '2026-08-27' })} user={user} />)

    const title = screen.getByText('Test Todo')
    expect(title.className).toContain('line-through')
  })

  it('ruft router.put mit app.todo.complete beim Klick auf Icon (nicht abgeschlossen)', () => {
    render(<TodoListItem todo={makeTodo({ completed_at: null })} user={user} />)

    const icons = screen.getAllByTestId('icon')
    const clickableIcon = icons.find(icon => icon.className.includes('group-hover:block'))
    expect(clickableIcon).toBeDefined()

    fireEvent.click(clickableIcon!)
    expect(vi.mocked(router.put)).toHaveBeenCalledWith('/app/todos/10/complete')
  })

  it('ruft router.put mit app.todo.uncomplete beim Klick auf Icon (abgeschlossen)', () => {
    render(<TodoListItem todo={makeTodo({ completed_at: '2026-08-27' })} user={user} />)

    const icons = screen.getAllByTestId('icon')
    const clickableIcon = icons.find(icon => icon.className.includes('bg-blue-600'))
    expect(clickableIcon).toBeDefined()

    fireEvent.click(clickableIcon!)
    expect(vi.mocked(router.put)).toHaveBeenCalledWith('/app/todos/10/uncomplete')
  })

  it('setzt group cursor-pointer wenn zugewiesen', () => {
    render(<TodoListItem todo={makeTodo({ assigned_to_user_id: 1 })} user={user} />)

    const wrapper = screen.getByText('Test Todo').closest('.bg-background')!
    const iconContainer = wrapper.querySelector('.w-8')!
    expect(iconContainer.className).toContain('group')
    expect(iconContainer.className).toContain('cursor-pointer')
  })

  it('setzt cursor-not-allowed wenn nicht zugewiesen', () => {
    render(<TodoListItem todo={makeTodo({ assigned_to_user_id: 2 })} user={user} />)

    const wrapper = screen.getByText('Test Todo').closest('.bg-background')!
    const iconContainer = wrapper.querySelector('.w-8')!
    expect(iconContainer.className).toContain('cursor-not-allowed')
  })

  it('zeigt Avatar mit zugewiesenem User', () => {
    render(<TodoListItem todo={makeTodo({ assigned_to: otherUser })} user={user} />)

    expect(screen.getByTestId('avatar')).toHaveTextContent('AS')
  })

  it('zeigt text-red-500 bei is_overdue', () => {
    render(<TodoListItem todo={makeTodo({ is_overdue: true })} user={user} />)

    const wrapper = screen.getByText('Test Todo').closest('.bg-background')!
    const dueDateEl = wrapper.querySelector('.text-red-500')
    expect(dueDateEl).not.toBeNull()
  })
})
