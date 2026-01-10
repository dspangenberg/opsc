import type * as React from 'react'
import type { PageProps } from '@/Types'
import { ProjectDetailsLayout } from './ProjectDetailsLayout'
import { ProjectDetailsSide } from './ProjectDetailsSide'

interface Props extends PageProps {
  project: App.Data.ProjectData
}

const ProjectDetails: React.FC<Props> = ({ project }) => {
  return (
    <ProjectDetailsLayout project={project}>
      <div className="flex-1">Details</div>
      <div className="h-fit w-full max-w-sm flex-none space-y-6 px-1">
        <ProjectDetailsSide project={project} />
      </div>
    </ProjectDetailsLayout>
  )
}

export default ProjectDetails
