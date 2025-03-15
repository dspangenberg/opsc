/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { PageProps } from '@/Types'
import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'

const Dashboard: React.FC<PageProps> = ({ auth }) => {
  const headerTitle: string = `Willkommen zurück, ${auth.user.first_name}!`

  return (
    <PageContainer
      title="Dashboard"
      width="7xl"
      header={<div className="font-medium">{headerTitle}</div>}
      breadcrumbs={[]}
      headerClassname="py-6"
    >
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
      </div>
    </PageContainer>
  )
}

export default Dashboard
