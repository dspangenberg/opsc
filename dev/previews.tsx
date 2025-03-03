/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox'
import { PaletteTree } from './palette'
import { AccommodationCreateEmail } from '../resources/js/Pages/App/Accommodation/AccommodationCreateEmail'
import AccommodationCreateBase from '../resources/js/Pages/App/Accommodation/AccommodationCreateBase'
import { Input } from '../resources/js/Components/ui/input'
import { InertiaDialog } from '../resources/js/Components/InertiaDialog'
import SeasonIndex from '../resources/js/Pages/App/Settings/Booking/Season/SeasonIndex'

const ComponentPreviews = () => {
  return <Previews palette={<PaletteTree />}>
    <ComponentPreview path="/AccommodationCreateEmail"
    >
      <AccommodationCreateEmail />
    </ComponentPreview>
    <ComponentPreview path="/AccommodationCreateBase">
      <AccommodationCreateBase />
    </ComponentPreview>
    <ComponentPreview path="/Input">
      <Input />
    </ComponentPreview>
    <ComponentPreview path="/InertiaDialog">
      <InertiaDialog />
    </ComponentPreview>
    <ComponentPreview path="/SeasonIndex">
      <SeasonIndex />
    </ComponentPreview>
  </Previews>
}

export default ComponentPreviews
