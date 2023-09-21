import {ButtonProps} from "../../types/buttonProps";

const Button = ({onClick, body, className, disabled}: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>{body}</button>
  )
}

export default Button