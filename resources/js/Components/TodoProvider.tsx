import { TaskAdd01Icon } from '@hugeicons/core-free-icons'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { TodoEditDialog } from '@/Components/Shared/TodoEditDialog'

interface TodoContextType {
  todoableType?: string
  todoableId?: number
  todoableDescription?: string
  setTodoable: (todoableType?: string, todoableId?: number, todoableDescription?: string) => void
  onTodoCreated: (handler: () => void) => () => void
  emitTodoCreated: () => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export const TodoProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [todoableType, setTodoableType] = useState<string>()
  const [todoableId, setTodoableId] = useState<number>()
  const [todoableDescription, setTodoableDescription] = useState<string>()
  const handlersRef = useRef<(() => void)[]>([])

  const onTodoCreated = useCallback((handler: () => void) => {
    handlersRef.current.push(handler)

    return () => {
      handlersRef.current = handlersRef.current.filter(h => h !== handler)
    }
  }, [])

  const emitTodoCreated = useCallback(() => {
    for (const handler of handlersRef.current) {
      handler()
    }
  }, [])

  const value = useMemo(
    () => ({
      todoableType,
      todoableId,
      todoableDescription,
      setTodoable: (todoableType?: string, todoableId?: number, todoableDescription?: string) => {
        setTodoableType(todoableType)
        setTodoableId(todoableId)
        setTodoableDescription(todoableDescription)
      },
      onTodoCreated,
      emitTodoCreated
    }),
    [todoableType, todoableId, todoableDescription, onTodoCreated, emitTodoCreated]
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}

interface TodoButtonProps {
  onClick?: () => void
}

export const TodoButton: React.FC<TodoButtonProps> = ({ onClick }) => {
  const { todoableType, todoableId, todoableDescription, emitTodoCreated } = useTodo()
  const { users, user } = usePage().props.auth

  if (!todoableType || !todoableId || !todoableDescription) {
    return null
  }

  const handleClick = async () => {
    const result = await TodoEditDialog.call({
      todoableType: todoableType,
      todoableId: todoableId,
      todoableDescription: todoableDescription,
      users: users,
      currentUserId: user.id as number
    })

    if (result) {
      onClick?.()
      emitTodoCreated()
    }
  }

  return (
    <span>
      <Button
        variant="toolbar-default"
        icon={TaskAdd01Icon}
        title="Todo hinzufügen"
        onClick={handleClick}
      />
    </span>
  )
}
