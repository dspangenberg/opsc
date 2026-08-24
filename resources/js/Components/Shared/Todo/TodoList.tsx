/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { type FormDataConvertible, router } from '@inertiajs/core'
import { type FC, Fragment } from 'react'
import type { RouteUrl } from 'ziggy-js'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { Icon } from '@/Components/twc-ui/icon'
import { CircleIcon, CircleCheckIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/Lib/utils'
import { Avatar } from '@/Components/twc-ui/avatar'

interface Props {
  todos: App.Data.TodoData[]
  showTodoAble?: boolean
  user: App.Data.UserData
}

interface FormData extends Record<string, FormDataConvertible> {
  todo: App.Data.TodoData
}

export const TodoList: FC<Props> = ({ showTodoAble = false, user, todos }) => {

  return (
    <div className="mt-8 space-y-4">

      <div className="mt-6 flex flex-1 flex-col items-start">
        <div className="flex w-full flex-col space-y-3">
          {todos.map((item, index) => {
            const isAssignedToUser = item.assigned_to_user_id === user.id
            return (
              <div className="bg-background rounded-md border w-full px-2.5 py-1 gap-2 flex items-center" key={index}>
                <div className={cn('w-6 flex-none', isAssignedToUser ? 'group cursor-pointer' : 'cursor-not-allowed')}>
                  {item.completed_at ? (
                    <Icon icon={CircleCheckIcon} className="size-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white" />
                  ) : (
                    <>
                      <Icon icon={CircleCheckIcon} className={cn('hidden size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:block')} />
                      <Icon icon={CircleIcon} className={cn('block size-5 rounded-full text-blue-600', isAssignedToUser && 'group-hover:hidden')} />
                    </>
                  )}
                </div>
                <div className={cn(item.completed_at ? 'line-through' : '', 'flex-1 text-sm truncate')}>
                  {item.title}
                </div>
                <div className={cn(item.is_overdue ? 'text-red-500' : '', 'flex-none text-xs')}>
                  {item.completed_at ? '' : item.due_at}
                </div>
                <div className="flex-none">
                  <Avatar fullname={item.assigned_to?.full_name} initials={item.assigned_to?.initials} src={item.assigned_to?.avatar_url} size="xs" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
