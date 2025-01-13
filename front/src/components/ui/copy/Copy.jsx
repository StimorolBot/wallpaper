import { useState } from "react"

import "./style.sass"


export function Copy({buffer}){
    const [isCopy, setIsCopy] = useState(false)

    const setBuffer = () => {
        try{
            navigator.clipboard.writeText(buffer)
            setIsCopy(s => s = true)
            setTimeout(() => setIsCopy(s => s = false), 6000)
        }
        catch{
            setIsCopy(s => s = false)
        }
    }
    return(
        <>
            { isCopy
                ? <svg className="copy__svg ok_svg">
                    <use xlinkHref="/static/main.svg#ok-svg"></use>    
                </svg>
                :<svg className="copy__svg copy_svg" onClick={setBuffer}>
                    <use xlinkHref="/static/main.svg#copy-svg"></use>    
                </svg>
            }
        </>
    )
}
