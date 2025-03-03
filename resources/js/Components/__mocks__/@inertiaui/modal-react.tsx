import React from 'react'

export const ModalStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="modal-stack-provider">{children}</div>
)

export const HeadlessModal: React.FC<{ children: (props: any) => React.ReactNode }> = ({ children }) => (
  <div data-testid="headless-modal">
    {children({
      isOpen: true,
      setOpen: () => {},
      close: () => {},
      reload: () => {},
    })}
  </div>
)

export const useModalStack = vi.fn(() => ({
  visitModal: vi.fn(),
}))

export const useModal = vi.fn(() => ({
  props: {},
  close: vi.fn(),
}))
