import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle
} from '@/Components/ui/credenza'
import type * as React from 'react'

interface OnboardingProps {
  body: React.ReactNode
  footer: React.ReactNode
  isOpen: boolean
  title: React.ReactNode
  description: React.ReactNode
  className?: string
  onClose: () => void
}

interface DialogTitleProps {
  title: string
}

function DialogTitle({ title }: DialogTitleProps) {
  return <h1>{title}</h1>
}

export default function Onboarding<OnboardingProps>({ ...props }) {
  const handleInteractOutside = (event: Event) => {
    // Prevent the default behavior
    event.preventDefault()
  }

  return (
    <Credenza open={props.isOpen} dismissible={false}>
      <CredenzaContent onInteractOutside={handleInteractOutside} className={props.className}>
        <CredenzaHeader>
          <CredenzaTitle>{props.title}</CredenzaTitle>
          <CredenzaDescription>{props.description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>{props.body}</CredenzaBody>
        <CredenzaFooter>{props.footer}</CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}
