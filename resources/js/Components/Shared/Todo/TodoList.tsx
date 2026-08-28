/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { FC } from 'react'
import { TodoListItem } from '@/Components/Shared/Todo/TodoListItem'

interface Props {
  todos: App.Data.TodoData[]
  showTodoAble?: boolean
  user: App.Data.UserData
}

export const TodoList: FC<Props> = ({ showTodoAble = false, user, todos }) => {
  return (
    <div className="mt-8 space-y-4 w-full">
      <div className="mt-6 flex flex-1 flex-col items-start">
        <div className="flex w-full flex-col space-y-3">
          {todos.map((todo, index) => (
            <TodoListItem key={index} todo={todo} user={user} showTodoAble={showTodoAble} />
          ))}
        </div>
      </div>
    </div>
  )
}
