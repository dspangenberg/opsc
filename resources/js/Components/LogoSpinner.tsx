/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Logo } from '@/Components/Logo'
import type React from 'react'

interface LogoSpinnerProps {
  color?: 'red' | 'green' | 'yellow' | 'orange' | 'blue' | 'black' | 'white'
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({ color = 'white' }) => {
  const colorClass = {
    red: 'fill-red-500 text-red-500',
    green: 'fill-green-500 text-green-500',
    yellow: 'fill-yellow-500 text-yellow-500',
    orange: 'fill-[rgb(249,179,60)] text-[rgb(249,179,60)]',
    blue: 'fill-blue-500 text-blue-500',
    black: 'fill-black text-black',
    white: 'fill-white text-white'
  }[color]

  return (
    <div className="rounded-full bg-white">
      <div className="relative flex justify-center items-center rounded-full bg-[rgb(249,179,60)]">
        <span className="absolute">
          <Logo className="size-12 rounded-full border border-white" />
        </span>
        <svg
          aria-hidden="true"
          className={`absolute animate animate-spin size-12 bg-[transparent] rounded-full ${colorClass}`}
          viewBox="0 0 100 101"
          fill="rgb(249,179,60)"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="white"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="rgb(249,179,60)"
          />
        </svg>
      </div>
    </div>
  )
}
