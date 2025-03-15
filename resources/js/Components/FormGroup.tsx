import type React from 'react'

interface FormGroupProps {
  border?: boolean
  cols?: 6 | 12 | 24
  fullWidth?: boolean
  grid?: boolean
  margin?: boolean
  title?: string
  className?: string
  titleClass?: string
  children?: React.ReactNode
}

export const FormGroup: React.FC<FormGroupProps> = ({
  border = false,
  cols = 24,
  fullWidth = true,
  grid = true,
  margin = true,
  title = '',
  className = '',
  titleClass = 'font-medium text-base text-black mt-4 pb-3 border-b',
  children
}) => {
  const gridCols = {
    6: 'grid-cols-6',
    12: 'grid-cols-12',
    24: 'grid-cols-24'
  }[cols]

  return (
    <div className="flex-1 border-stone-100 p-1">
      {title !== '' && <div className={`px-4 pb-1.5 ${titleClass}`}>{title}</div>}
      <div
        className={`
          px-0 mb-1 last:mb-3 flex-1
          ${border || title !== '' ? 'border-stone-100' : ''}
          ${grid ? 'px-0 grid gap-x-3 gap-y-3 m-0 p-0' : ''}
          ${margin ? 'mt-3' : 'not-first:mt-2'}
          ${grid ? gridCols : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  )
}
