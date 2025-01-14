import {PropsWithChildren} from "react";

interface GenericErrorProps extends PropsWithChildren {}

function GenericError({ children }: GenericErrorProps) {
  return (
    <div className="bg-red-700 text-white p-4 rounded-lg">
      {children}
    </div>
  )
}

export default GenericError