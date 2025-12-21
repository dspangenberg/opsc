# Form Array Support Documentation

Die `useForm` Hook unterstützt jetzt Array-Syntax für verschachtelte Felder.

## Verwendung

### Einfache Felder (wie bisher)
```tsx
const form = useForm('contact-form', 'put', `/contacts/${id}`, {
  name: contact.name,
  email: contact.email
})

// Verwendung
<FormTextField {...form.register('name')} />
<FormTextField {...form.register('email')} />
```

### Array-Felder (NEU)
```tsx
const form = useForm('contact-form', 'put', `/contacts/${id}`, {
  name: contact.name,
  phones: contact.phones // Array von Phone-Objekten
})

// Verwendung mit Array-Index-Syntax
phones.map((phone, index) => (
  <FormTextField
    {...form.register(`phones[${index}].phone`)}
    aria-label="Telefonnummer"
  />
  <FormSelect
    {...form.register(`phones[${index}].phone_category_id`)}
    items={phoneCategories}
    aria-label="Kategorie"
  />
))
```

## Unterstützte Formate

Die folgenden Pfad-Formate werden unterstützt:

- **Einfache Felder**: `name`, `email`
- **Verschachtelte Objekte**: `address.street`, `user.profile.bio`
- **Array-Felder**: `phones[0].number`, `emails[1].address`
- **Gemischt**: `users[0].address.street`

## Error-Handling

Laravel gibt Errors im Format `phones.0.number` zurück, aber die Form-Hook konvertiert automatisch:
- `phones.0.number` → `phones[0].number`
- `users.1.address.street` → `users[1].address.street`

Beide Formate werden beim Error-Lookup unterstützt.

## Beispiel: ContactEditPhoneSection mit form.register()

### Vorher (manuelle Callbacks)

```tsx
<FormTextField
  name={`phones.${index}.phone`}
  value={phone.phone}
  onChange={(value: string) => onUpdatePhone(index, 'phone', value)}
/>
```

### Nachher (mit form.register)

```tsx
<FormTextField
  {...form.register(`phones[${index}].phone`)}
  aria-label="Telefonnummer"
/>
```

### Vollständiges Beispiel

```tsx
import { useFormContext } from '@/Components/twc-ui/form'

export const ContactEditPhoneSection = () => {
  const form = useFormContext<ContactFormData>()

  // Array-Manipulation bleibt gleich
  const addPhone = () => {
    const updatedPhones = [...form.data.phones, newPhone]
    form.setData('phones', updatedPhones)
  }

  const removePhone = (index: number) => {
    const updatedPhones = form.data.phones.filter((_, i) => i !== index)
    form.setData('phones', updatedPhones)
  }

  return (
    <FormGrid>
      {form.data.phones.map((phone, index) => (
        <div key={phone.id || `new-${index}`}>
          {/* Kategorie-Select */}
          <FormSelect
            {...form.register(`phones[${index}].phone_category_id`)}
            items={phoneCategories}
            aria-label="Kategorie"
          />

          {/* Telefonnummer */}
          <FormTextField
            {...form.register(`phones[${index}].phone`)}
            aria-label="Telefonnummer"
          />

          {/* Hidden Fields für ID und Position */}
          <input type="hidden" {...form.registerEvent(`phones[${index}].id`)} />
          <input type="hidden" {...form.registerEvent(`phones[${index}].pos`)} />

          {/* Delete Button */}
          <Button onClick={() => removePhone(index)}>
            <Trash2 />
          </Button>
        </div>
      ))}

      <Button onClick={addPhone}>
        <Plus /> Telefonnummer hinzufügen
      </Button>
    </FormGrid>
  )
}
```

## Vorteile

✅ **Weniger Boilerplate**: Keine manuellen onChange-Handler mehr
✅ **Automatische Validierung**: Laravel Precognition funktioniert out-of-the-box
✅ **Type-Safety**: TypeScript unterstützt die Pfade
✅ **Einheitliche API**: Gleiche API für einfache und Array-Felder
✅ **Error-Handling**: Errors werden automatisch zugeordnet

## Kompatibilität

Die Änderung ist **vollständig rückwärtskompatibel**:
- Bestehende Forms funktionieren weiterhin
- Einfache Felder verwenden den gleichen Code-Pfad wie vorher
- Nur verschachtelte Pfade (mit `.` oder `[`) verwenden die neue Logik

## Interne Implementierung

### Helper-Funktionen

```typescript
// Wert aus verschachteltem Objekt holen
getNestedValue(data, 'phones[0].number')
// → data.phones[0].number

// Wert in verschachteltes Objekt setzen
setNestedValue(data, 'phones[0].number', '123')
// → data.phones[0].number = '123'

// Laravel error key zu Array-Notation konvertieren
convertErrorKey('phones.0.number')
// → 'phones[0].number'
```

### Validierung

Beim Validieren wird der Array-Pfad zu Laravel-Notation konvertiert:
- `phones[0].number` → `phones.0.number`

Dies ermöglicht die korrekte Kommunikation mit dem Laravel-Backend.
