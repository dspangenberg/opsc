import * as React from "react"
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

function Tabs({ className, ...props }: AriaTabsProps) {
  return (
    <AriaTabs
      className={composeRenderProps(className, (className) =>
        cn(
          "group flex flex-col relative",
          /* Orientation */
          "data-[orientation=vertical]:flex-row",
          className
        )
      )}
      {...props}
    />
  )
}

const TabList = <T extends object>({
  className,
  ...props
}: AriaTabListProps<T>) => (
  <AriaTabList
    className={composeRenderProps(className, (className) =>
      cn(
        "w-full px-6 inline-flex items-center justify-start rounded-none bg-page-content gap-2",
        /* Orientation */
        "data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col",
        className
      )
    )}
    {...props}
  />
)

const Tab = ({ className, ...props }: AriaTabProps) => (
  <AriaTab
    className={composeRenderProps(className, (className) =>
      cn(
        "flex z-50  bg-transparent border-transparent border items-center font-normal rounded-none px-4 py-0 select-none text-base h-9 flex-none !rounded-t-md text-foreground hover:underline cursor-pointer shadow-none transition-all",
        /* Focus Visible */
        "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/20  data-[focus-visible]:border-primary",
        /* Disabled */
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        /* Selected */
        "data-[selected]:border data-[selected]:bg-background data-[selected]:border-border data-[selected]:border-b-background data-[selected]:-mb-[4px] data-[selected]:text-foreground data-[selected]:font-medium ",
        /* Orientation */
        "group-data-[orientation=vertical]:w-full",
        className
      )
    )}
    {...props}
  />
)

const TabPanel = ({ className, ...props }: AriaTabPanelProps) => (
  <AriaTabPanel
    className={composeRenderProps(className, (className) =>
      cn(
        "p-6 ring-offset-background",
        /* Focus Visible */
        "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
        className
      )
    )}
    {...props}
  />
)

export { Tabs, TabList, TabPanel, Tab }
