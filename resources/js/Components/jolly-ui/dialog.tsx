import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

const Dialog = AriaDialog

const sheetVariants = cva(
  [
    "fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out",
    /* Entering */
    "data-[entering]:duration-500 data-[entering]:animate-in",
    /* Exiting */
    "data-[exiting]:duration-300  data-[exiting]:animate-out",
  ],
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[entering]:slide-in-from-top data-[exiting]:slide-out-to-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[entering]:slide-in-from-bottom data-[exiting]:slide-out-to-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[entering]:slide-in-from-right data-[exiting]:slide-out-to-right sm:max-w-sm",
      },
    },
  }
)

const DialogTrigger = AriaDialogTrigger

const DialogOverlay = ({
  className,
  isDismissable = true,
  ...props
}: AriaModalOverlayProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, (className) =>
      cn(
        "fixed inset-0 z-50 bg-black/80",
        /* Exiting */
        "data-[exiting]:duration-300 data-[exiting]:animate-out data-[exiting]:fade-out-0",
        /* Entering */
        "data-[entering]:animate-in data-[entering]:fade-in-0",
        className
      )
    )}
    {...props}
  />
)

interface DialogContentProps
  extends Omit<React.ComponentProps<typeof AriaModal>, "children">,
    VariantProps<typeof sheetVariants> {
  children?: AriaDialogProps["children"]
  role?: AriaDialogProps["role"]
  bgColor?: string
  title?: string
  closeButton?: boolean
  onCloseClick?: () => void
  onOpenChange?: (open: boolean) => void
  /**
   * Ref object to expose the close method to parent components.
   * Parent components can use this ref to programmatically close the dialog.
   *
   * @example
   * ```tsx
   * const closeRef = useRef<() => void>(null);
   *
   * // Later in your component
   * <button onClick={() => closeRef.current?.()}>Close Dialog</button>
   *
   * <DialogContent closeRef={closeRef}>
   *   Dialog content
   * </DialogContent>
   * ```
   */
  closeRef?: React.MutableRefObject<(() => void) | null>
}

const DialogContent = ({
  className,
  children,
  title,
  bgColor,
  side,
  role,
  closeButton = true,
  onCloseClick,
  closeRef,
  onOpenChange,
  ...props
}: DialogContentProps) => {
  // Create a ref to store the close function
  const closeFunction = React.useRef<(() => void) | null>(null);

  // Use useEffect to set closeRef.current
  React.useEffect(() => {
    if (closeRef && closeRef.current === null && closeFunction.current) {
      // Make the closeRef.current function async to ensure it properly waits for any confirmation dialogs
      closeRef.current = async () => {
        // Add a small delay before closing the dialog
        // This ensures that any confirmation dialogs have time to be shown
        await new Promise(resolve => setTimeout(resolve, 50));
        // Call the close function if available
        if (closeFunction.current) {
          // The close function might trigger a confirmation dialog in the parent component
          // By awaiting it, we ensure the dialog doesn't close until the confirmation is handled
          await closeFunction.current();
        }
        // Also call onOpenChange to ensure the dialog state is updated
        if (onOpenChange) {
          onOpenChange(false);
        }
      };
    }
  }, [closeRef, onOpenChange, closeFunction]);

  return (
    <AriaModal
      className={composeRenderProps(className, (className) =>
        cn(
          side
            ? sheetVariants({ side, className: "h-full" })
            : "fixed left-[50vw] my-0 border-4 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2  bg-background shadow-lg duration-200 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 sm:rounded-lg md:w-full",
          className
        )
      )}
      onOpenChange={onOpenChange}
      {...props}
    >
      <AriaDialog
        role={role}
        aria-label={title}
        className={cn(bgColor, !side && "grid h-full", "h-full outline-none")}
      >
        {composeRenderProps(children, (children, renderProps) => {
          // Store the close function in the ref
          // We need to make sure this is properly awaited when called
          closeFunction.current = async () => {
            // Add a small delay before closing the dialog
            // This ensures that any confirmation dialogs have time to be shown
            await new Promise(resolve => setTimeout(resolve, 50));
            // This will be awaited by the closeRef.current function
            await renderProps.close();
          };
          return (
            <>
              {children}
              {closeButton && (
                <AriaButton
                  onPress={async () => {
                    // Add a small delay before closing the dialog
                    // This ensures that any confirmation dialogs have time to be shown
                    await new Promise(resolve => setTimeout(resolve, 50));
                    if (onCloseClick) {
                      // If onCloseClick is provided, call it
                      await onCloseClick();
                    } else {
                      // Otherwise, call the close function directly
                      await renderProps.close();
                    }
                  }}
                  className={cn(bgColor,'absolute  right-4 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity data-[disabled]:pointer-events-none data-[entering]:bg-accent data-[entering]:text-muted-foreground data-[hovered]:opacity-100 data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2 backdrop-blur-lg')}
                >
                  <Cross2Icon className="size-4" />
                  <span className="sr-only">Close</span>
                </AriaButton>
              )}
            </>
          );
        })}
      </AriaDialog>
    </AriaModal>
  );
}

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 px-6 w-full py-3 gap-0 text-center sm:text-left bg-sidebar rounded-t-lg",
      className
    )}
    {...props}
  />
)

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse px-4 py-3 sm:flex-row sm:justify-end sm:space-x-2 bg-sidebar rounded-b-lg",
      className
    )}
    {...props}
  />
)

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse px-0 py-3 sm:flex-row sm:space-x-2 w-full",
      className
    )}
    {...props}
  />
)

const DialogTitle = ({ className, ...props }: AriaHeadingProps) => (
  <AriaHeading
    slot="title"
    className={cn(
      "text-lg font-medium leading-none tracking-tight text-center ",
      className
    )}
    {...props}
  />
)

const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)

export {
  Dialog,
  DialogOverlay,
  DialogBody,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
}
export type { DialogContentProps }
