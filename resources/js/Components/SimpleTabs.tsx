/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn } from '@/Lib/utils'
import type { HugeiconsProps } from '@hugeicons/react'

import type { TabsProps, TabsTriggerProps } from '@radix-ui/react-tabs'
import type React from 'react'
import type { ReactNode } from 'react'

type ReactNodeOrString = ReactNode | string

interface SimpleTabsProps extends TabsProps {
  children: ReactNode
}

interface SimpleTabsTriggerProps extends TabsTriggerProps {
  children: ReactNode
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({ children, ...props }: SimpleTabsProps) => {
  return (
    <Tabs {...props} className="w-full flex flex-full">
      <TabsList className="relative h-auto w-full  bg-transparent border-0 shadow-none p-0 before:absolute before:inset-x-0 before:bottom-0  before:h-px before:bg-border justify-start">
        {children}
      </TabsList>
    </Tabs>
  )
}

export const SimpleTabsTab: React.FC<SimpleTabsTriggerProps> = ({
  children,
  ...props
}: SimpleTabsTriggerProps) => {
  return (
    <TabsTrigger
      {...props}
      className={cn(
        'flex  first:ml-2 border-0 bg-transparent items-center font-normal shadow-none rounded-none px-4 py-0  select-none  text-base! h-9 flex-none data-[state=active]:rounded-t-md text-foreground hover:text-blue-500 cursor-pointer',
        'data-[state=active]:border data-[state=active]:border-b-0  data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:shadow-none data-[state=active]:border-b-border data-[state=active]:bg-background border-b-transparent   data-[state=active]:z-10 ',
        'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:text-muted-foreground'
      )}
    >
      {children}
    </TabsTrigger>
  )
}
