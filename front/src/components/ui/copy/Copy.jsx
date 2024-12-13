import { useState } from "react"
import "./copy.sass"


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
            ? <svg
                className="copy copy_ok"
                xmlns="http://www.w3.org/2000/svg"
                width="32" height="32" viewBox="0 0 20 20"
            >
                <path d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0" />
            </svg>
            : <svg
                className="copy"
                xmlns="http://www.w3.org/2000/svg"
                width="800px" height="800px" viewBox="0 0 24 24"
                onClick={setBuffer}
            >
                <g>
                    <path d="M6.25 5.25C6.25 2.50265 8.43733 0.25 11.1667 0.25H17.8333C20.5627 0.25 22.75 2.50265 22.75 5.25V13.75C22.75 16.4974 20.5627 18.75 17.8333 18.75C17.4191 18.75 17.0833 18.4142 17.0833 18C17.0833 17.5858 17.4191 17.25 17.8333 17.25C19.7064 17.25 21.25 15.6971 21.25 13.75V5.25C21.25 3.30293 19.7064 1.75 17.8333 1.75H11.1667C9.29363 1.75 7.75 3.30293 7.75 5.25C7.75 5.66421 7.41421 6 7 6C6.58579 6 6.25 5.66421 6.25 5.25Z" />
                    <path d="M1.25 10.25C1.25 7.50265 3.43733 5.25 6.16667 5.25H12.8333C15.5627 5.25 17.75 7.50265 17.75 10.25V18.75C17.75 21.4974 15.5627 23.75 12.8333 23.75H6.16667C3.43733 23.75 1.25 21.4974 1.25 18.75V10.25ZM6.16667 6.75C4.29363 6.75 2.75 8.30293 2.75 10.25V18.75C2.75 20.6971 4.29363 22.25 6.16667 22.25H12.8333C14.7064 22.25 16.25 20.6971 16.25 18.75V10.25C16.25 8.30293 14.7064 6.75 12.8333 6.75H6.16667Z" />
                </g>
            </svg>
        }
        </>
    )
}
