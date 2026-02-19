import { filesize } from 'filesize'
import type * as React from 'react'

interface DocumentIndexFileCardProps {
  document: App.Data.DocumentData
}

export const DocumentIndexFileCard: React.FC<DocumentIndexFileCardProps> = ({ document }) => {
  return (
    <div className="space-y-1 text-sm">
      <ul className="grid grid-cols-3 gap-0.5">
        <li className="col-span-2 grid gap-0.5">
          <span className="text-muted-foreground">Dateiname</span>
          <span className="font-medium">{document.filename}</span>
        </li>
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Label</span>
          <span className="font-medium">{document.label}</span>
        </li>
      </ul>
      <ul className="grid grid-cols-2 gap-0.5">
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Dokumentdatum</span>
          <span className="font-medium">{document.issued_on}</span>
        </li>
      </ul>
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
      <ul>
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Dokumenttyp</span>
          <span className="font-medium">{document.type?.name}</span>
        </li>
      </ul>
      {document.sender_contact_id && (
        <ul>
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Absender</span>
            <span className="font-medium">{document.sender_contact?.full_name}</span>
          </li>
        </ul>
      )}
      {document.receiver_contact_id && (
        <ul>
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Empfänger</span>
            <span className="font-medium">{document.receiver_contact?.full_name}</span>
          </li>
        </ul>
      )}
      {document.project_id && (
        <ul>
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Projekt</span>
            <span className="font-medium">{document.project?.name}</span>
          </li>
        </ul>
      )}
      <ul className="space-y-1">
        <li className="grid gap-0.5">
          <span className="text-muted-foreground">Titel</span>
          <span className="font-medium">{document.title}</span>
        </li>
      </ul>

      {document.summary && (
        <ul>
          <li className="grid gap-0.5">
            <span className="text-muted-foreground">Zusammenfassung</span>
            <span className="line-clamp-2 font-medium">{document.summary}</span>
          </li>
        </ul>
      )}
    </div>
  )
}
