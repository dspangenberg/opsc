import type { ChangeEvent } from 'react'
import { useCallback } from 'react'
import type { Key } from '@react-types/shared'

type UseFormChangeProps = {
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useFormChange = ({ name, onChange }: UseFormChangeProps) => {
  return useCallback((selected: Key | string | number | boolean | null) => {
    const syntheticEvent = {
      target: {
        name,
        value: selected,
        type: 'select'
      },
      currentTarget: {
        name,
        value: selected,
        type: 'select'
      }
    } as ChangeEvent<HTMLInputElement>;

    if (onChange) {
      onChange(syntheticEvent);
    }
  }, [name, onChange]);
};
