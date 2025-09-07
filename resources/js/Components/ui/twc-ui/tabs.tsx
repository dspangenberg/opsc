import { cva, type VariantProps } from 'class-variance-authority'
import React, { createContext, useContext } from 'react'
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  type Key
} from 'react-aria-components'
import { cn } from '@/Lib/utils'

const tabsVariants = cva('', {
  variants: {
    variant: {
      classic: '',
      underlined: '',
      default: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const tabListVariants = cva('flex', {
  variants: {
    variant: {
      underlined: 'flex gap-4 h-fit flex items-center',
      default: 'flex bg-muted rounded-lg p-1 w-fit',
      classic: 'w-full p-0 justify-start rounded-none border-b'
    }
  }
})

const tabVariants = cva(
  'cursor-pointer data-[disabled]:opacity-50 data-[disabled]:text-muted-foreground data-[disabled]:cursor-not-allowed' +
    'data-[selected]:font-medium text-sm',
  {
    variants: {
      variant: {
        underlined:
          'border-b-2 py-1 border-transparent  data-[selected]:font-medium data-[selected]:border-primary data-[selected]:text-foreground data-[hovered]:text-foreground',
        default:
          'rounded-md px-3 py-1 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow',
        classic:
          'px-4 py-2 z-50 -mb-px rounded-none border border-transparent data-[selected]:border-border  data-[selected]:border-b-white  data-[selected]:rounded-t-md'
      }
    }
  }
)

type TabsContextType = {
  variant: 'underlined' | 'classic' | 'default' | null | undefined
  tabClassName?: string
  panelClassName?: string
}

const TabsContext = createContext<TabsContextType>({
  variant: 'default',
  tabClassName: '',
  panelClassName: ''
})

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

export interface TabsProps
  extends Omit<AriaTabsProps, 'onSelectionChange'>,
    VariantProps<typeof tabsVariants> {
  className?: string
  tabClassName?: string
  panelClassName?: string
  onSelectionChange?: (key: Key) => void
}

export const Tabs = ({
  className,
  variant = 'default',
  onSelectionChange,
  tabClassName = '',
  panelClassName = '',
  children,
  ...props
}: TabsProps) => {
  return (
    <TabsContext.Provider value={{ variant, tabClassName, panelClassName }}>
      <AriaTabs
        className={cn(tabsVariants({ variant }), className)}
        onSelectionChange={onSelectionChange}
        {...props}
      >
        {children}
      </AriaTabs>
    </TabsContext.Provider>
  )
}

export interface TabListProps<T extends object = object> extends AriaTabListProps<T> {
  className?: string
}

export function TabList<T extends object = object>({ className, ...props }: TabListProps<T>) {
  const { variant } = useTabsContext()

  return (
    <AriaTabList<T>
      className={cn(tabListVariants({ variant: variant ?? 'default' }), className)}
      {...props}
    />
  )
}

export interface TabProps extends AriaTabProps {
  className?: string
  href?: string
}

export const Tab = ({ className, ...props }: TabProps) => {
  const { variant, tabClassName } = useTabsContext()

  return (
    <AriaTab
      className={cn(tabVariants({ variant: variant ?? 'default' }), tabClassName, className)}
      {...props}
    />
  )
}

export interface TabPanelProps extends AriaTabPanelProps {
  className?: string
}

export const TabPanel = ({ className, ...props }: TabPanelProps) => {
  const { panelClassName } = useTabsContext()
  return <AriaTabPanel className={cn('', panelClassName, className)} {...props} />
}
