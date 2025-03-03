/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormInput } from '@/Components/FormInput'
import { FormLabel } from '@/Components/FormLabel'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import type * as React from 'react'

interface Props {
  onValueChange: (value: string) => void
}

export const AccommodationCreateEmail: React.FC<Props> = ({ onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState('cloud')
  const [emailValue, setEmailValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const tenant: App.Data.TenantData = usePage().props.auth.tenant

  useEffect(() => {
    if (selectedValue === 'other' && inputRef.current) {
      inputRef.current.focus()
    }
    onValueChange(selectedValue === 'other' ? emailValue : '')
  }, [selectedValue, emailValue])

  return (
    <RadioGroup
      className="gap-2"
      value={selectedValue}
      onValueChange={setSelectedValue}
      defaultValue="cloud"
    >
      <div className="flex gap-2 justify-center">
        <RadioGroupItem
          value="cloud"
          id="radio-05-without-expansion"
          aria-describedby="radio-05-without-expansion-description"
        />
        <div className="grid grow gap-2">
          <FormLabel htmlFor="radio-05-without-expansion">
            E-Mail-Adresse des Cloudaccounts ({tenant.email}) verwenden
          </FormLabel>
        </div>
      </div>
      <div>
        <div className="flex items-start gap-2 justify-center">
          <RadioGroupItem
            value="other"
            id="radio-05-with-expansion"
            aria-describedby="radio-05-with-expansion-description"
            aria-controls="radio-input-05"
          />
          <div className="grow text-sm">
            <div className="grid grow gap-2">
              <FormLabel htmlFor="radio-05-with-expansion">
                Andere E-Mail-Adresse verwenden
              </FormLabel>
            </div>
            <div
              id="radio-input-05"
              aria-labelledby="radio-05-with-expansion"
              className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=expanded]:grid-rows-[1fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:opacity-100"
              data-state={selectedValue === 'other' ? 'expanded' : 'collapsed'}
            >
              <div className="pointer-events-none -m-2 overflow-hidden p-2">
                <div className="pointer-events-auto mt-3">
                  <FormInput
                    ref={inputRef}
                    value={emailValue}
                    onChange={e => { setEmailValue(e.target.value); }}
                    onBlur={e => setEmailValue(e.target.value)}
                    type="text"
                    id="radio-05-additional-info"
                    placeholder="Enter details"
                    aria-label="Additional Information"
                    disabled={selectedValue !== 'other'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RadioGroup>
  )
}
