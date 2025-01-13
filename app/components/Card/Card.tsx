import {PropsWithChildren} from "react";

function Card({children}: PropsWithChildren) {
  return (
    <div className={"p-3 border border-solid border-gray rounded-lg shadow-xl"}>
      {children}
    </div>
  )
}

export default Card;