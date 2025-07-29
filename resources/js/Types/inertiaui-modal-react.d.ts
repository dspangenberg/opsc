declare module '@inertiaui/modal-react' {
  import type { ReactNode, FC, ForwardRefExoticComponent, RefAttributes } from 'react'
  import type { BaseInertiaLinkProps, VisitOptions, PageProps } from '@inertiajs/core'
  import type { AppType } from '@inertiajs/react'

  export interface HeadlessModalProps {
    isOpen: boolean
    close: () => void
    reload: () => void
    setOpen: (isOpen: boolean) => void
    afterLeave?: () => void
  }

  export const renderApp = (App: AppType<PageProps>, props: AppType<PageProps>): ReactNode => {}

  export interface HeadlessModalComponentProps {
    isOpen?: boolean
    onClose?: () => void
    onOpenChange?: (open: boolean) => void
    children: (props: HeadlessModalProps) => ReactNode
  }

  export interface ModalStack {
    visitModal(
      url: string,
      options?: Partial<VisitOptions> & { modal?: boolean; navigate?: boolean }
    ): Promise<void>
  }

  export interface ModalStackProviderProps {
    children: ReactNode
  }

  export interface UseModalProps {
    props: PageProps
    close: () => void
    afterLeave: () => void
  }

  export const HeadlessModal: ForwardRefExoticComponent<
    HeadlessModalComponentProps & RefAttributes<unknown>
  >
  export function visitModal(
    url: string,
    options?: Partial<VisitOptions> & { modal?: boolean }
  ): Promise<void>

  export function useModalStack(): ModalStack
  export function useModal(): UseModalProps
  export function putConfig({ navigate: boolean }): void

  export const ModalStackProvider: FC<ModalStackProviderProps>

  export type ModalLinkProps = BaseInertiaLinkProps &
    Omit<React.HTMLAttributes<HTMLElement>, keyof BaseInertiaLinkProps> &
    Omit<React.AllHTMLAttributes<HTMLElement>, keyof BaseInertiaLinkProps>

  export const ModalLink: ForwardRefExoticComponent<ModalLinkProps & RefAttributes<unknown>>
}
