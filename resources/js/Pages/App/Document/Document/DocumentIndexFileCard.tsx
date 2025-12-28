import { filesize } from 'filesize'
import type * as React from 'react'

interface DocumentIndexFileCardProps {
  document: App.Data.DocumentData
}

export const DocumentIndexFileCard: React.FC<DocumentIndexFileCardProps> = ({ document }) => {
  return (
    <div className="text-sm">
      <ul className="grid gap-3 text-xs">
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Dateiname</span>
          <span className="font-medium">{document.filename}</span>
        </li>
        <ul className="grid grid-cols-2 gap-0.5">
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Dokumentdatum</span>
            <span className="font-medium">{document.issued_on}</span>
          </li>
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Label</span>
            <span className="font-medium">{document.label}</span>
          </li>
        </ul>
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Titel</span>
          <span className="font-medium">{document.title}</span>
        </li>
        <ul className="grid grid-cols-2 gap-0.5">
          <li className="grid">
            <span className="text-muted-foreground">Seiten</span>
            <span className="font-medium">{document.pages}</span>
          </li>
          <li className="grid">
            <span className="text-muted-foreground">Dateigröße</span>
            <span className="font-medium">{filesize(document.file_size)}</span>
          </li>
        </ul>
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Dokumenttyp</span>
          <span className="font-medium">{document.type?.name}</span>
        </li>
        {document.contact_id && (
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Kontakt</span>
            <span className="font-medium">{document.contact?.full_name}</span>
          </li>
        )}
        {document.project_id && (
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Projekt</span>
            <span className="font-medium">{document.project?.name}</span>
          </li>
        )}
      </ul>
    </div>
  )
}
