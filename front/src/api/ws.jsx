import { useEffect } from "react"


export const Ws = ({response, setResponse}) => {
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/user/ws")
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setResponse({...response, notification: data.subscriber})
            return () => ws.close()
        }

    }, [])
}
