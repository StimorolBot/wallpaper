import { useEffect } from "react"

export const useClickOutside = (ref, setIsShow) =>{
    
    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setIsShow(false)
        }
      }
    
    useEffect(() => {
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    })
}
