import { InputHTMLAttributes } from 'react'

export default function Checkbox({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="checkbox"
      className={
        'rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:ring-indigo-500 ' + className
      }
    />
  )
}
