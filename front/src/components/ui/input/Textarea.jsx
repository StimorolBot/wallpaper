import { useEffect, useRef } from "react"

import "./style/textarea.sass"


export function Textarea({placeholder, value, setValue, ...props}){
    const textAreaRef = useRef(null)

    useEffect(
        () => {
            textAreaRef.current.style.height = "auto"
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
        }, [value]
    )

    return(
        <textarea
            className="prompt-textarea"
            placeholder={placeholder}
            ref={textAreaRef}
            required
            onChange={(event) => setValue({...value, prompt: event.target.value})}
            {...props}>
        </textarea>
    )
}