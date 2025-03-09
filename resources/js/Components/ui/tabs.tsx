/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/Lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    ref: React.RefObject<React.ElementRef<typeof TabsPrimitive.List>>;
  }
) => (<TabsPrimitive.List
  ref={ref}
  className={cn(
    'inline-flex items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground/70',
    className
  )}
  {...props}
/>)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    ref: React.RefObject<React.ElementRef<typeof TabsPrimitive.Trigger>>;
  }
) => (<TabsPrimitive.Trigger ref={ref} className={cn(className)} {...props} />)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof TabsPrimitive.Content>>;
  }
) => (<TabsPrimitive.Content
  ref={ref}
  className={cn(
    'mt-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70',
    className
  )}
  {...props}
/>)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
