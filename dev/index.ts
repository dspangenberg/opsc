/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import React from 'react'
import { useInitial } from './useInitial'

const ComponentPreviews = React.lazy(() => import('./previews'))

export { ComponentPreviews, useInitial }
