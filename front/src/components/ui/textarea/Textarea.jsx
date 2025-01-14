import { useEffect, useRef } from "react"

import "./style.sass"

export function Textarea({placeholder, value, setValue, keyDict, children, isCount=true, ...props}){
    const textAreaRef = useRef(null)

    useEffect(
        () => {
            textAreaRef.current.style.height = "auto"
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
        }, [value]
    )

    return(
        <div className="textarea__inner">
            {isCount && <output className="textarea__count">{`${value[keyDict]?.length ? value[keyDict]?.length : 0}/${props.maxLength}`}</output>}
            <textarea
                className="prompt-textarea"
                placeholder={placeholder} ref={textAreaRef}
                onChange={(event) => setValue({...value, [keyDict]: event.target.value})}
                {...props}/>
            {children}
        </div>
    )
}