import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { Pressable } from 'react-aria-components'
import { Avatar } from '@/Components/twc-ui/avatar'
import { FileTrigger } from '@/Components/twc-ui/FileTrigger'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormSelect } from '@/Components/twc-ui/form-select'

interface Props extends PageProps {
  project: App.Data.ProjectData
  categories: App.Data.ProjectCategoryData[]
  contacts: App.Data.ContactData[]
}

type ProjectFormData = App.Data.ProjectData & {
  avatar: File | null
}

const ProjectEdit: React.FC<Props> = ({ categories, contacts, project }) => {
  const title = project.id ? 'Projekt bearbeiten' : 'Projekt hinzufügen'
  const [droppedImage, setDroppedImage] = useState<string | undefined>(
    project.avatar_url as string | undefined
  )

  useEffect(() => {
    return () => {
      if (droppedImage && droppedImage.startsWith('blob:')) {
        URL.revokeObjectURL(droppedImage)
      }
    }
  }, [droppedImage])

  const form = useForm<ProjectFormData>(
    'form-project-edit',
    project.id ? 'put' : 'post',
    route(project.id ? 'app.project.update' : 'app.project.store', {
      project: project.id,
      _method: project.id ? 'put' : 'post'
    }),
    {
      ...project,
      avatar: null
    }
  )

  useEffect(() => {
    return () => {
      if (droppedImage) {
        URL.revokeObjectURL(droppedImage)
      }
    }
  }, [droppedImage])

  const breadcrumbs = useMemo(
    () => [
      { title: 'Projekte', url: route('app.project.index') },
      { title: project.name || 'Neues Projekt' }
    ],
    [project.name]
  )

  const handleClose = () => {
    if (project.id) {
      router.visit(route('app.project.details', { project: project.id }))
    } else {
      router.visit(route('app.project.index'))
    }
  }

  async function onSelectHandler(e: FileList | null) {
    if (!e || e.length === 0) return
    
    try {
      const item = e[0]

      if (item) {
        // Revoke previous blob URL before creating new one
        if (droppedImage && droppedImage.startsWith('blob:')) {
          URL.revokeObjectURL(droppedImage)
        }
        
        setDroppedImage(URL.createObjectURL(item))
        form.setData('avatar', item)
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Bildes:', error)
      // Optional: Benutzer-Feedback anzeigen
    }
  }

  return (
    <PageContainer
      title={title}
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="flex w-4xl flex-1 overflow-y-hidden"
        innerClassName="bg-white"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button variant="default" form={form.id} type="submit">
              Speichern
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          onSubmitted={handleClose}
          className="max-w-4xl"
          errorClassName="w-auto m-3"
        >
          <FormGrid>
            <div className="col-span-2 inline-flex items-center justify-center">
              <div>
                <FileTrigger
                  acceptedFileTypes={['image/png', 'image/jpeg']}
                  onSelect={onSelectHandler}
                >
                  <Pressable>
                    <Avatar
                      role="button"
                      fullname={project.name}
                      src={droppedImage}
                      size="lg"
                      className="cursor-pointer"
                    />
                  </Pressable>
                </FileTrigger>
              </div>
            </div>
            <div className="col-span-12">
              <FormTextField label="Bezeichnung" isRequired {...form.register('name')} />
            </div>
            <div className="col-span-10">
              <FormSelect
                isRequired
                label="Kategorie"
                items={categories}
                {...form.register('project_category_id')}
              />
            </div>
          </FormGrid>
          <FormGrid title="Kunde">
            <div className="col-span-8">
              <FormComboBox
                label="Kunde"
                itemName="reverse_full_name"
                items={contacts}
                {...form.register('owner_contact_id')}
              />
            </div>
            <div className="col-span-8">
              <FormComboBox
                isOptional
                label="Projektverantwortlicher"
                items={contacts}
                itemName="reverse_full_name"
                {...form.register('manager_contact_id')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ProjectEdit
