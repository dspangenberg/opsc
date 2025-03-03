/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { InitialHookStatus } from '@react-buddy/ide-toolbox'
import { useState } from 'react'

export const useInitial: () => InitialHookStatus = () => {
  const [status, setStatus] = useState<InitialHookStatus>({
    loading: false,
    error: false
  })
  /*
    Implement hook functionality here.
    If you need to execute async operation, set loading to true and when it's over, set loading to false.
    If you caught some errors, set error status to true.
    Initial hook is considered to be successfully completed if it will return {loading: false, error: false}.
  */
  return status
}
