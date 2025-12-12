import type { SVGAttributes } from 'react'

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 184 180"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2
      }}
      {...props}
      data-testid="logo"
    >
      <title id="logoTitle">twiceware-Logo</title>
      <g transform="matrix(0.984065,0,0,1.00108,0,0)">
        <rect className="fill-background" x="0" y="0" width="186.048" height="179.533" />
      </g>
      <g
        className="fill-foreground"
        id="ArtBoard1"
        transform="matrix(0.789261,0,0,0.823414,-212.777,-73.6031)"
      >
        <rect x="269.59" y="89.388" width="235.725" height="218.035" style={{ fill: 'none' }} />
        <clipPath id="_clip1">
          <rect x="269.59" y="89.388" width="235.725" height="218.035" />
        </clipPath>
        <g clipPath="url(#_clip1)">
          <g transform="matrix(1.26701,0,0,1.21446,53.383,11.1005)">
            <g transform="matrix(1,0,0,1,-120.14,-44.4366)">
              <path
                className="fill-background"
                d="M440.971,231.502C432.583,231.502 425.971,225.323 425.971,215.834C425.971,206.12 433.928,198.299 442.945,198.299C451.346,198.299 457.954,204.473 457.954,213.723C457.954,223.429 450.005,231.502 440.971,231.502Z"
              />
            </g>
            <g transform="matrix(1,0,0,1,80.5005,-24.7649)">
              <g id="path174" transform="matrix(1.25,0,0,-1.25,240.331,211.83)">
                <g>
                  <path
                    className="fill-foreground"
                    d="M0,0C-6.711,0 -12,4.943 -12,12.534C-12,20.305 -5.635,26.562 1.579,26.562C8.3,26.562 13.586,21.623 13.586,14.223C13.586,6.458 7.227,0 0,0M-120.152,42.23C-107.742,50.081 -91.347,54.541 -77.659,54.541C-50.848,54.541 -28.348,42.43 -28.348,13.707C-28.348,-10.337 -53.066,-32.524 -71.964,-45.486L28.096,-45.486L28.096,98.64L-120.152,98.64L-120.152,42.23Z"
                    style={{
                      fillRule: 'nonzero'
                    }}
                  />
                  <g transform="matrix(1,0,0,1,-120.152,9.136)">
                    <path
                      className="fill-foreground"
                      d="M0,0L0,-54.622L2.298,-54.622C22.423,-39.906 52.258,-13.935 52.258,3.774C52.258,10.627 45.461,12.986 39.507,12.986C26.481,12.986 10.522,6.407 0.486,-1.521L0,0Z"
                      style={{
                        fillRule: 'nonzero'
                      }}
                    />
                  </g>
                </g>
              </g>
              <g id="path178" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
