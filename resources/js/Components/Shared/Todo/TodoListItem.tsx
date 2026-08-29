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

export const TodoListItem: FC<Props> = ({ showTodoAble = false, user, todo }) => {
  const isAssignedToUser = todo.assigned_to_user_id === user.id

  const handleCompleteTodo = () => {
    router.put(route('app.todo.complete', {todo}))
  }

  const handleUncompleteTodo = () => {
    router.put(route('app.todo.uncomplete', {todo}))
  }

  return (
    <div className="bg-background rounded-md border w-full px-2.5 py-2.5 gap-2 flex items-center">
      <div className={cn('w-8 flex-none', isAssignedToUser ? 'group cursor-pointer' : 'cursor-not-allowed')}>
        {todo.completed_at ? (
          <Icon onClick={handleUncompleteTodo} icon={CircleCheckIcon} className="size-5  mx-auto rounded-full bg-blue-600 hover:bg-blue-500 text-white" />
        ) : (
          <>
            <Icon onClick={handleCompleteTodo} icon={CircleCheckIcon} className={cn('mx-auto hidden size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:block')} />
            <Icon icon={CircleIcon} className={cn('mx-auto block size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:hidden')} />
          </>
        )}
      </div>
      <div className="flex-1 text-sm truncate flex flex-col">
        <div className={cn(todo.completed_at ? 'line-through' : '')}>{todo.title}</div>
        <div className="text-xxs text-foreground/60">
          erstellt von {todo.created_by?.full_name}
          {' | '} Projekt: {todo.todobable_description}
        </div>
      </div>
      <div className={cn(todo.is_overdue ? 'text-red-500' : '', 'flex-none text-xxs')}>
        {todo.completed_at ? '' : todo.due_at}
      </div>
      <div className="flex-none">
        <Avatar fullname={todo.assigned_to?.full_name} initials={todo.assigned_to?.initials} src={todo.assigned_to?.avatar_url} size="xs" />
      </div>
    </div>
  )
}
