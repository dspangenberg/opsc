import type * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDateTimePicker } from '@/Components/twc-ui/form-date-time-picker'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'

interface TodoEditDialogComponentProps {
  todoableType: string
  todoableId: number
  todoableDescription: string
  users: App.Data.SimpleUserData[]
  currentUserId: number
  onConfirm: () => void
  onCancel: () => void
}

const TodoEditDialogComponent: React.FC<TodoEditDialogComponentProps> = ({
  todoableType,
  todoableId,
  todoableDescription,
  users,
  currentUserId,
  onCancel,
  onConfirm
}) => {
  const form = useForm('form-todo-edit', 'post', route('app.todo.store'), {
    todoable_type: todoableType,
    todoable_id: todoableId,
    title: '',
    assigned_to_user_id: currentUserId,
    due_at: ''
  }, {
    onSuccess: () => {
      setTimeout(() => {
        onConfirm()
      }, 50)
    }
  })

  const title = 'Todo zu ' + todoableDescription

  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 bg-white"
      confirmClose={false}
      width="lg"
      bodyPadding
      isDismissible={true}
      title={title}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button
            title="Abbrechen"
            variant="outline"
            onClick={() => {
              setTimeout(() => {
                onCancel()
              }, 50)
            }}
          />
          <Button
            variant="default"
            title="Speichern"
            type="submit"
            form={form.id}
          />
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <Form form={form}>
          <FormGrid>
            <div className="col-span-24">
              <FormTextField label="Bezeichnung" autoFocus {...form.register('title')} />
            </div>
            <div className="col-span-24">
              <FormComboBox
                label="Zuständig"
                items={users}
                itemName="full_name"
                itemValue="id"
                {...form.register('assigned_to_user_id')}
              />
            </div>
            <div className="col-span-24">
              <FormDateTimePicker label="Fällig am" {...form.register('due_at')} />
            </div>
          </FormGrid>
        </Form>
      </div>
    </Dialog>
  )
}

interface TodoEditDialogCallParams {
  todoableType: string
  todoableId: number
  todoableDescription: string
  users: App.Data.SimpleUserData[]
  currentUserId: number
}

export const TodoEditDialog = {
  call: (params: TodoEditDialogCallParams): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <TodoEditDialogComponent
          {...params}
          onConfirm={() => {
            cleanup()
            resolve(true)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )

      setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)
    })
  },

  Root: () => null
}
