import type React from 'react'
import { Logo } from './logo'

export interface TwicewareSolutionProps {
  hideCopyright?: boolean
  appName?: string
  appWebsite?: string
  copyrightYear?: number
  copyrightHolder?: string
  copyrightHolderWebsite?: string
}

export const TwicewareSolution: React.FC<TwicewareSolutionProps> = ({
  appName = 'App',
  appWebsite = '',
  copyrightYear = new Date().getFullYear(),
  copyrightHolder = '',
  copyrightHolderWebsite = '',
  hideCopyright = false
}) => {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <div className="mx-auto flex w-full max-w-sm items-center justify-center text-foreground text-sm">
        {appWebsite ? (
          <a
            href={appWebsite}
            className="mx-1.5 flex items-center font-medium text-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {appName}
          </a>
        ) : (
          <span className="mx-1.5 font-medium text-foreground">{appName}</span>
        )}
        is a
        <Logo className="mx-1.5 size-5 rounded-md" />
        <a
          href="https://twiceware.de"
          className="flex items-center font-medium text-foreground hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          twiceware solution
        </a>
      </div>
      {!hideCopyright && (
        <div className="mx-auto mt-1 text-center text-foreground/80 text-xs">
          Copyright &copy; {copyrightYear}
          {currentYear !== copyrightYear && `-${currentYear}`}
          {copyrightHolder && (
            <>
              {' by '}
              {copyrightHolderWebsite ? (
                <a
                  href={copyrightHolderWebsite}
                  className="inline-flex items-center text-foreground/80 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copyrightHolder}
                </a>
              ) : (
                <span className="text-foreground/80">{copyrightHolder}</span>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
