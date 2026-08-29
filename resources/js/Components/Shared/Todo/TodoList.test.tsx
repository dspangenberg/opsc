import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'

vi.mock('./TodoListItem', () => ({
  TodoListItem: ({ todo, showTodoAble }: { todo: App.Data.TodoData; showTodoAble: boolean }) => (
    <div data-testid="todo-item" data-todo-id={todo.id} data-show-todo-able={showTodoAble}>
      {todo.title}
    </div>
  ),
}))

function makeUser(): App.Data.UserData {
  return {
    id: 1,
    first_name: 'Max',
    last_name: 'Mustermann',
    avatar_url: null,
    is_admin: false,
    is_locked: false,
    email: 'max@test.de',
    full_name: 'Max Mustermann',
    reverse_full_name: 'Mustermann, Max',
    initials: 'MM',
    user_agent: null,
    pending_email: null,
    is_impersonating: null,
    impersonator: null,
    email_account_id: null,
    contact_id: null,
    email_account: null,
    contact: null,
    last_login_at: null,
    email_verified_at: null,
  }
}

const user = makeUser()

const todos: App.Data.TodoData[] = [
  { id: 1, title: 'Erste Aufgabe', todoable_type: 'Project', todoable_id: 1, due_at: null, completed_at: null, created_by_user_id: 1, assigned_to_user_id: 1, assigned_to: null, created_by: null, todobable_description: null, is_overdue: false },
  { id: 2, title: 'Zweite Aufgabe', todoable_type: 'Project', todoable_id: 1, due_at: null, completed_at: null, created_by_user_id: 1, assigned_to_user_id: 1, assigned_to: null, created_by: null, todobable_description: null, is_overdue: false },
  { id: 3, title: 'Dritte Aufgabe', todoable_type: 'Project', todoable_id: 1, due_at: null, completed_at: null, created_by_user_id: 1, assigned_to_user_id: 1, assigned_to: null, created_by: null, todobable_description: null, is_overdue: false },
]

describe('TodoList', () => {
  it('rendert alle Todos', () => {
    render(<TodoList todos={todos} user={user} />)

    const items = screen.getAllByTestId('todo-item')
    expect(items).toHaveLength(3)
    expect(screen.getByText('Erste Aufgabe')).toBeInTheDocument()
    expect(screen.getByText('Zweite Aufgabe')).toBeInTheDocument()
    expect(screen.getByText('Dritte Aufgabe')).toBeInTheDocument()
  })

  it('rendert nichts bei leerem Array', () => {
    const { container } = render(<TodoList todos={[]} user={user} />)

    expect(screen.queryAllByTestId('todo-item')).toHaveLength(0)
    expect(container.querySelector('.space-y-4')).not.toBeNull()
  })

  it('übergibt showTodoAble an jedes TodoListItem', () => {
    render(<TodoList todos={todos} user={user} showTodoAble />)

    const items = screen.getAllByTestId('todo-item')
    items.forEach(item => {
      expect(item).toHaveAttribute('data-show-todo-able', 'true')
    })
  })
})
