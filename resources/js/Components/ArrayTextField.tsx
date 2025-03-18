/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { type FC, Fragment } from 'react'
import type * as React from "react";

interface Props {
  lines: string[]
}

export const ArrayTextField: FC<Props> = ({ lines }) => {
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}
