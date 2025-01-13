import { useState } from "react"

import "./style/input_base.sass"


export function InputBase({id, register, lblText, children, errorMsg, type="text", ...props}){
    const [isFocus, setIsFocus] = useState(false)
    
    return(
        <div className="input__container">
            <label className={isFocus ? "input__lbl input__lbl_focus" : "input__lbl"}
                htmlFor={id} onClick={() => setIsFocus(s => !s)}
            >
                {lblText}
            </label>
            { children }
            <input 
                className="input-base"
                id={id} autoComplete="off" type={type}
                required {...register} {...props}
            />
            { errorMsg }
        </div>
    )
}
