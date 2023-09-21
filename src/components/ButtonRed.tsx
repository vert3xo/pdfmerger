import { ButtonProps } from "../../types/buttonProps"
import Button from "./Button"

const ButtonRed = ({onClick, body, className, disabled}: ButtonProps) => {
  return (
    <Button disabled={disabled} onClick={onClick} className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded " + className} body={body} />
  )
}

export default ButtonRed