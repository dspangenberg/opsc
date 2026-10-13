/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { router } from '@inertiajs/core'
import { type FC } from 'react'
import { Icon } from '@/Components/twc-ui/icon'
import { CircleIcon, CircleCheckIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/Lib/utils'
import { Avatar } from '@/Components/twc-ui/avatar'

interface Props {
  todo: App.Data.TodoData
  showTodoAble?: boolean
  user: App.Data.UserData
}

export const TodoListItem: FC<Props> = ({
  showTodoAble = false,
  user,
  todo
}) => {
  const isAssignedToUser = todo.assigned_to_user_id === user.id

  const handleCompleteTodo = () => {
    router.put(route('app.todo.complete', { todo }))
  }

  const handleUncompleteTodo = () => {
    router.put(route('app.todo.uncomplete', { todo }))
  }

  return (
    <div className="bg-background first:rounded-t-md last:rounded-b border w-full px-2.5 py-2.5 gap-1 flex items-start">
      <div className={cn('w-8 flex-none', isAssignedToUser ? 'group cursor-pointer' : 'cursor-not-allowed')}>
        {todo.completed_at ? (
          <Icon onClick={handleUncompleteTodo} icon={CircleCheckIcon}
                className="size-5  mx-auto rounded-full bg-blue-600 hover:bg-blue-500 text-white"
          />
        ) : (
          <>
            <Icon onClick={handleCompleteTodo} icon={CircleCheckIcon}
                  className={cn('mx-auto hidden size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:block')}
            />
            <Icon icon={CircleIcon}
                  className={cn('mx-auto block size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:hidden')}
            />
          </>
        )}
      </div>
      <div className="flex-1 text-sm truncate flex flex-col gap-2">
        <div className={cn(todo.completed_at ? 'line-through' : '')}>{todo.title}</div>
        <span className={cn(todo.is_overdue ? 'text-red-500' : '', 'flex-none text-xxs')}>
          {todo.completed_at ? '' : 'Fällig ' + todo.due_at}
          <span className="text-xxs text-foreground/60">
          Projekt: {todo.todobable_description}
        </span>
        </span>
      </div>
    </div>
  )
}
