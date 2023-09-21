import { ButtonProps } from "../../types/buttonProps"
import Button from "./Button"

const ButtonBlue = ({onClick, body, className, disabled}: ButtonProps) => {
  return (
    <Button disabled={disabled} onClick={onClick} className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed " + className} body={body} />
  )
}

export default ButtonBlue