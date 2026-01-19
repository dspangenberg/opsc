import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps as AriaFileTriggerProps
} from 'react-aria-components'

export interface FileTriggerProps extends AriaFileTriggerProps {}

export const FileTrigger = ({ ...props }: FileTriggerProps) => {
  return <AriaFileTrigger {...(props as AriaFileTriggerProps)} />
}
