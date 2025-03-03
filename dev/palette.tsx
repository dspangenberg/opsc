/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Fragment } from "react"
import {
  Category,
  Component,
  Variant,
  Palette,
} from "@react-buddy/ide-toolbox"

export const PaletteTree = () => (
  <Palette>
    <Category name="App">
      <Component name="Loader">
        <Variant>
          <ExampleLoaderComponent/>
        </Variant>
      </Component>
    </Category>
  </Palette>
)

export function ExampleLoaderComponent() {
  return (
    <Fragment>Loading...</Fragment>
  )
}
