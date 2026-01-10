import { SidebarLeftIcon } from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import type React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'
import { AppProvider } from '@/Components/AppProvider'
import { AppSidebar } from '@/Components/AppSidebar'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { Modal } from '@/Components/momentum-modal-react'
import { NavUser } from '@/Components/NavUser'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { useThemeContainer } from '@/Components/theme-container-provider'
import { Button } from '@/Components/twc-ui/button'
import { Toaster, toast } from '@/Components/twc-ui/sonner'
import { SidebarInset, SidebarProvider, useSidebar } from '@/Components/ui/sidebar'
import { useAppInitializer } from '@/Hooks/useAppInitializer'
import { cn } from '@/Lib/utils'

const SidebarContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { toggleSidebar } = useSidebar()

  const user: App.Data.UserData = usePage().props.auth.user
  const isDev = import.meta.env.MODE === 'development'
  const { backgroundClass } = useThemeContainer()

  return (
    <>
      <AppSidebar />
      {isDev && (
        <div className="fixed top-0 right-0 z-50 rounded-bl bg-blue-500 px-2 font-mono text-white text-xs">
          <span className="sm:hidden">xs</span>
          <span className="hidden sm:inline md:hidden">sm</span>
          <span className="hidden md:inline lg:hidden">md</span>
          <span className="hidden lg:inline xl:hidden">lg</span>
          <span className="hidden xl:inline 2xl:hidden">xl</span>
          <span className="3xl:hidden hidden 2xl:inline">2xl</span>
          <span className="3xl:inline hidden">3xl</span>
        </div>
      )}
      <SidebarInset className="relative border-0">
        <div className="z-20 flex h-10 items-center">
          <LayoutContainer className="flex w-full flex-1 items-center px-4 py-1">
            <div className="flex flex-1 items-center justify-between space-x-2">
              <Button
                variant="outline"
                icon={SidebarLeftIcon}
                onClick={toggleSidebar}
                title="Sidebar umschalten"
                aria-label="Sidebar umschalten"
                size="icon-sm"
              />
              <PageBreadcrumbs className="hidden flex-1 items-center md:flex" />
              <div className="flex-none">
                <NavUser user={user} />
              </div>
            </div>
          </LayoutContainer>
        </div>
        <div
          className={cn(
            'absolute top-12 right-0 bottom-0 left-0 overflow-hidden rounded-lg shadow-sm',
            backgroundClass
          )}
        >
          <div className="mt-6">{children}</div>
        </div>
        <Toaster position="top-right" />
      </SidebarInset>
    </>
  )
}

const AppLayout = ({ children }: PropsWithChildren<{ header?: ReactNode }>) => {
  useAppInitializer()

  useEffect(() => {
    const unsubscribe = router.on('flash', event => {
      if (event.detail.flash.toast) {
        const toastData = event.detail.flash.toast
        toast(toastData.message, toastData.type)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AppProvider>
      <SidebarProvider>
        <SidebarContent>
          {children}
          <Modal resolver={globalThis.resolveMomentumModal} />
        </SidebarContent>
      </SidebarProvider>
    </AppProvider>
  )
}

export default AppLayout
