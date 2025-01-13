import {ComponentProps} from "react";

function TrendDown({ ...props }: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
         width={24} height={24} {...props}>
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"/>
    </svg>
  )
}

export {TrendDown}
