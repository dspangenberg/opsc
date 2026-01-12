import {
  Archive03Icon,
  ArchiveOff03Icon,
  Edit03Icon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Avatar } from '@/Components/twc-ui/avatar'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Toolbar } from '@/Components/twc-ui/toolbar'

interface Props {
  project: App.Data.ProjectData
  children: React.ReactNode
}

export const ProjectDetailsLayout: React.FC<Props> = ({ children, project }) => {
  const breadcrumbs = useMemo(
    () => [{ title: 'Projekte', url: route('app.project.index') }, { title: project.name }],
    [project.name]
  )

  const handleEdit = () => router.visit(route('app.project.edit', { project: project.id }))
  const handleArchive = () => router.put(route('app.project.archive', { project: project.id }), {})

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Edit03Icon}
          title="Bearbeiten"
          onClick={handleEdit}
        />
        <DropdownButton variant="ghost" icon={MoreVerticalCircle01Icon}>
          <MenuItem icon={Edit03Icon} title="Bearbeiten" onClick={handleEdit} />
          {project.is_archived ? (
            <MenuItem
              icon={ArchiveOff03Icon}
              title="Projekt wiederherstellen"
              onAction={handleArchive}
            />
          ) : (
            <MenuItem icon={Archive03Icon} title="Projekt archivieren" onAction={handleArchive} />
          )}
        </DropdownButton>
      </Toolbar>
    ),
    [project.is_archived]
  )

  const headerContent = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <Avatar fullname={project.name} src={project.avatar_url} size="lg" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="max-w-lg flex-1 truncate font-bold text-xl">{project.name}</div>
        </div>
      </div>
    ),
    [project.name, project.avatar_url]
  )

  return (
    <PageContainer
      header={headerContent}
      toolbar={toolbar}
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PageContainer>
  )
}
