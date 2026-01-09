import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormSelect } from '@/Components/twc-ui/form-select'

interface Props extends PageProps {
  project: App.Data.ProjectData
  categories: App.Data.ProjectCategoryData[]
  contacts: App.Data.ContactData[]
}

const ProjectEdit: React.FC<Props> = ({ categories, contacts, project }) => {
  const title = project.id ? 'Projekt bearbeiten' : 'Projekt hinzufügen'

  const form = useForm<App.Data.ProjectData>(
    'form-project-edit',
    project.id ? 'put' : 'post',
    route(project.id ? 'app.project.update' : 'app.project.store', {
      project: project.id
    }),
    project
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Projekte', url: route('app.project.index') },
      { title: project.name || 'Neuer Textbaustein' }
    ],
    [project.name]
  )

  const handleClose = () => {
    router.get(route('app.project.index'))
  }

  return (
    <PageContainer
      title={title}
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <Form form={form} onSubmitted={handleClose}>
        <FormGrid>
          <div className="col-span-12">
            <FormTextField label="Bezeichnung" {...form.register('name')} />
          </div>
          <div className="col-span-12">
            <FormSelect
              label="Kategorie"
              items={categories}
              {...form.register('project_category_id')}
            />
          </div>
          <div className="col-span-12">
            <FormComboBox label="Kunde" items={contacts} {...form.register('owner_contact_id')} />
          </div>
          <div className="col-span-24 flex justify-end">
            <Button variant="default" form={form.id} type="submit">
              Speichern
            </Button>
          </div>
        </FormGrid>
      </Form>
    </PageContainer>
  )
}

export default ProjectEdit
