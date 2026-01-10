import { Link } from '@inertiajs/react'
import type { FC } from 'react'
import { DataCard, DataCardContent, DataCardField, DataCardSection } from '@/Components/DataCard'

interface ProjectDetailsSideProps {
  project: App.Data.ProjectData
  showSecondary?: boolean
}

export const ProjectDetailsSide: FC<ProjectDetailsSideProps> = ({
  project
}: ProjectDetailsSideProps) => {
  const contactRoute = (id: number | null) => {
    return id ? route('app.contact.details', { id }) : '#'
  }

  return (
    <DataCard title={project.name}>
      <DataCardContent>
        <DataCardSection>
          <DataCardField
            variant="vertical"
            label="Projektkategorie"
            value={project.category?.name}
          />
          <DataCardField variant="vertical" label="Website" value={project.website}>
            <a
              href={project.website as string}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {project.website}
            </a>
          </DataCardField>
        </DataCardSection>

        <DataCardSection title="Auftraggeber">
          <DataCardField
            variant="vertical"
            label="Kunde"
            value={project.owner_contact_id}
            className="col-span-3"
          >
            <Link
              href={contactRoute(project.owner_contact_id as number)}
              className="hover:underline"
            >
              {project.owner?.full_name}
            </Link>
          </DataCardField>
          <DataCardField
            variant="vertical"
            label="Ansprechperson"
            value={project.manager_contact_id}
            className="col-span-3"
          >
            <Link
              href={contactRoute(project.manager_contact_id as number)}
              className="hover:underline"
            >
              {project.manager?.full_name}
            </Link>
          </DataCardField>
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
