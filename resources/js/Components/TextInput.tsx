import { type InputHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export default forwardRef(function TextInput(
  {
    type = 'text',
    className = '',
    autoFocus = false,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
  ref
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
        'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
        className
      }
      ref={localRef}
    />
  )
})
