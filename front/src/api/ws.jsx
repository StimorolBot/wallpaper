import cookies from "../cookie"
import { useEffect } from "react"


export const Ws = () => {
    useEffect(() => {
        const token = cookies.get("access_token")
        if (token){
            const ws = new WebSocket("ws://localhost:8000/user/last-visit")
            return () => ws.close()
        }
    }, [])

}
