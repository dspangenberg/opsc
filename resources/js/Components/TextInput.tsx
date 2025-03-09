import { type InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react';

export default function TextInput(
  {
    ref,
    type = 'text',
    className = '',
    autoFocus = false,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean }
) {
  const localRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus()
  }))

  return (
    <input
      {...props}
      type={type}
      className={
        'rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 ' +
        className
      }
      ref={localRef}
    />
  )
};
