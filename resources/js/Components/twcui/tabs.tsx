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

// Varianten für Tabs definieren
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
      underlined: 'flex gap-4',
      default: 'flex bg-muted rounded-lg p-1 w-fit',
      classic: 'w-full p-0 justify-start rounded-none border-b'
    }
  }
})

const tabVariants = cva(
  'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:text-muted-foreground data-[selected]:font-medium text-sm',
  {
    variants: {
      variant: {
        underlined:
          'border-b-2 py-1 border-transparent data-[selected]:border-primary data-[selected]:text-foreground data-[hovered]:text-foreground',
        default:
          'rounded-md px-3 py-1 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow',
        classic:
          'px-4 py-1.5 rounded-none border border-transparent border-b-border data-[selected]:border-border data-[selected]:bg-background  data-[selected]:border-b-transparent  data-[selected]:rounded-t-md'
      }
    }
  }
)

// Context für die Variant - erweitert um null und undefined
type TabsContextType = {
  variant: 'underlined' | 'classic' | 'default' | null | undefined,
  tabClassName?: string
}

const TabsContext = createContext<TabsContextType>({ variant: 'default', tabClassName: '' })

// Hook für den Context
const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

// Tabs Props Interface - Custom onSelectionChange erlauben
export interface TabsProps
  extends Omit<AriaTabsProps, 'onSelectionChange'>,
    VariantProps<typeof tabsVariants> {
  className?: string
  tabClassName?: string
  onSelectionChange?: (key: Key) => void
}

// Hauptkomponente Tabs
export const Tabs = ({
  className,
  variant = 'default',
  onSelectionChange,
  tabClassName = '',
  children,
  ...props
}: TabsProps) => {
  return (
    <TabsContext.Provider value={{ variant, tabClassName }}>
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

// TabList Komponente
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

// Tab Komponente
export interface TabProps extends AriaTabProps {
  className?: string
  href?: string // href als optional hinzugefügt
}

export const Tab = ({ className, ...props }: TabProps) => {
  const { variant, tabClassName } = useTabsContext()

  return (
    <AriaTab className={cn(tabVariants({ variant: variant ?? 'default' }), className, tabClassName)} {...props} />
  )
}

// TabPanel Komponente
export interface TabPanelProps extends AriaTabPanelProps {
  className?: string
}

export const TabPanel = ({ className, ...props }: TabPanelProps) => {
  return <AriaTabPanel className={cn('my-2', className)} {...props} />
}
