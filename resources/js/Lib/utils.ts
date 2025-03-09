import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

export const focusInput = [
  // base
  'focus:ring-3 focus:ring-opacity-50 focus:border-blue-400 focus:ring-blue-200 focus-visible:outline-0'
]

export const focusWithinInput = [
  // base
  'focus-within:ring-3 focus:ring-offset-2 focus-within:ring-opacity-50 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within-visible:outline-0'
]

export const hasErrorInput = [
  // base
  'focus:ring-3 focus:ring-opacity-50 focus:border-red-400 focus:ring-red-200',
  // border color
  'border-red-300! dark:border-red-700 bg-red-50'
  // ring color
]

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500'
]
