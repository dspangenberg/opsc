import type * as React from 'react'
import type { PageProps } from '@/Types'
import { ProjectDetailsLayout } from './ProjectDetailsLayout'
import { ProjectDetailsSide } from './ProjectDetailsSide'
import { TodoList } from '@/Components/Shared/Todo/TodoList'
import { usePage } from '@inertiajs/react'

interface Props extends PageProps {
  project: App.Data.ProjectData,
  todos: App.Data.TodoData[]
}

const ProjectDetails: React.FC<Props> = ({ project, todos }) => {
  const { auth } = usePage().props

  return (
    <ProjectDetailsLayout project={project}>
      <div className="flex-1">
        <TodoList todos={todos} user={auth.user}/>
      </div>
      <div className="h-fit w-full max-w-sm flex-none space-y-6 px-1">
        <ProjectDetailsSide project={project} />
      </div>
    </ProjectDetailsLayout>
  )
}

export default ProjectDetails
