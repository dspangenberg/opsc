'use client'

import { Button } from '@/Components/Button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/Components/ui/alert-dialog'
import { Input } from '@/Components/ui/input'
import * as React from 'react'

type AlertDialogContextType = (
  params: AlertAction
) => Promise<AlertAction['type'] extends 'alert' | 'confirm' ? boolean : null | string>;

export const AlertDialogContext = React.createContext<AlertDialogContextType | undefined>(undefined);

type ButtonVariant = 'link' | 'primary' | 'danger' | 'default' | 'dark' | 'danger-ghost' | undefined

const defaultCancelButtonText = 'Cancel'
const defaultActionButtonText = 'Okay'

export type AlertAction =
  | {
      type: 'alert'
      title: string
      body?: string
      cancelButton?: string
      cancelButtonVariant?: ButtonVariant
    }
  | {
      type: 'confirm'
      title: string
      body?: string
      cancelButton?: string
      actionButton?: string
      cancelButtonVariant?: ButtonVariant
      actionButtonVariant?: ButtonVariant
    }
  | {
      type: 'prompt'
      title: string
      body?: string
      cancelButton?: string
      actionButton?: string
      defaultValue?: string
      cancelButtonVariant?: ButtonVariant
      actionButtonVariant?: ButtonVariant
      inputProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
    }
  | { type: 'close' }

interface AlertDialogState {
  open: boolean
  title: string
  body: string
  type: 'alert' | 'confirm' | 'prompt'
  cancelButton: string
  actionButton: string | boolean
  cancelButtonVariant: ButtonVariant
  actionButtonVariant: ButtonVariant
  defaultValue?: string
  inputProps?: React.PropsWithoutRef<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >
}

export function alertDialogReducer(state: AlertDialogState, action: AlertAction): AlertDialogState {
  switch (action.type) {
    case 'close':
      return { ...state, open: false }
    case 'alert':
    case 'confirm':
    case 'prompt':
      return {
        ...state,
        open: true,
        ...action,
        cancelButton:
          action.cancelButton ||
          (action.type === 'alert' ? defaultActionButtonText : defaultCancelButtonText),
        actionButton: ('actionButton' in action && action.actionButton) ?? defaultActionButtonText,
        cancelButtonVariant: action.cancelButtonVariant || 'default', // Changed from '' to 'default'
        actionButtonVariant:
          ('actionButtonVariant' in action && action.actionButtonVariant) || 'primary' // Changed from '' to 'primary'
      }
    default:
      return state
  }
}

export function AlertDialogProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = React.useReducer(alertDialogReducer, {
    open: false,
    title: '',
    body: '',
    type: 'alert',
    cancelButton: defaultCancelButtonText,
    actionButton: defaultActionButtonText,
    cancelButtonVariant: 'default',
    actionButtonVariant: 'primary'
  })

  const resolveRef = React.useRef<((value: boolean | string | null) => void) | null>(null)

  function close() {
    dispatch({ type: 'close' })
    if (resolveRef.current) {
      resolveRef.current(false)
    }
  }

  function confirm(value?: string) {
    dispatch({ type: 'close' })
    if (resolveRef.current) {
      resolveRef.current(value ?? true)
    }
  }

  const dialog: AlertDialogContextType = React.useCallback(async (params: AlertAction) => {
    dispatch(params)

    return new Promise<AlertAction['type'] extends 'alert' | 'confirm' ? boolean : null | string>((resolve) => {
      resolveRef.current = (value: boolean | string | null) => {
        resolve(value as any);
      };
    })
  }, [])

  return (
    <AlertDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={open => {
          if (!open) close()
          return
        }}
      >
        <AlertDialogContent asChild>
          <form
            id="alert-dialog-form"
            onSubmit={event => {
              event.preventDefault()
              confirm(event.currentTarget.prompt?.value)
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{state.title}</AlertDialogTitle>
              {state.body ? <AlertDialogDescription>{state.body}</AlertDialogDescription> : null}
            </AlertDialogHeader>
            {state.type === 'prompt' && (
              <Input name="prompt" defaultValue={state.defaultValue} {...state.inputProps} />
            )}
            <AlertDialogFooter>
              <Button autoFocus type="button" onClick={close} variant={state.cancelButtonVariant}>
                {state.cancelButton}
              </Button>
              {state.type === 'alert' ? null : (
                <Button type="submit" variant={state.actionButtonVariant} form="alert-dialog-form">
                  {state.actionButton}
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

type Params<T extends 'alert' | 'confirm' | 'prompt'> =
  | Omit<Extract<AlertAction, { type: T }>, 'type'>
  | string

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error('useAlertDialogContext must be used within an AlertDialogProvider');
  }
  return context;
}

export function useConfirm() {
  const dialog = useAlertDialogContext();
  return React.useCallback(
    (params: Params<'confirm'>) => {
      return dialog({
        ...(typeof params === 'string' ? { title: params } : params),
        type: 'confirm'
      })
    },
    [dialog]
  )
}

export function usePrompt() {
  const dialog = useAlertDialogContext();
  return React.useCallback(
    (params: Params<'prompt'>) =>
      dialog({
        ...(typeof params === 'string' ? { title: params } : params),
        type: 'prompt'
      }),
    [dialog]
  )
}

export function useAlert() {
  const dialog = useAlertDialogContext();
  return React.useCallback(
    (params: Params<'alert'>) =>
      dialog({
        ...(typeof params === 'string' ? { title: params } : params),
        type: 'alert'
      }),
    [dialog]
  )
}
