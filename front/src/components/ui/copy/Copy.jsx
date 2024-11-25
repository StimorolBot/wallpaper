import { useState } from "react"
import "./copy.sass"


export function Copy({buffer}){
    const [isCopy, setIsCopy] = useState(false)

    const setBuffer = () => {
        try{
            navigator.clipboard.writeText(buffer)
            setIsCopy(s => s = true)
        }
        catch{
            setIsCopy(s => s = false)
        }
    }
    return(
        <img
            className="copy"
            src={isCopy ? "/static/ok.svg" : "/static/copy.svg" } alt="copy"
            onClick={setBuffer}
        />  
    )
}
