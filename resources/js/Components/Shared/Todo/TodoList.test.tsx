import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'

vi.mock('./TodoListItem', () => ({
  TodoListItem: ({ todo, user, showTodoAble }: { todo: App.Data.TodoData; user: App.Data.UserData; showTodoAble: boolean }) => (
    <div data-testid="todo-item" data-todo-id={todo.id} data-show-todo-able={showTodoAble}>
      {todo.title}
    </div>
  ),
}))

const user = { id: 1, full_name: 'Max Mustermann', initials: 'MM', email: 'max@test.de', avatar_url: null }

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
