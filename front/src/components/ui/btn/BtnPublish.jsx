import { useRef } from "react"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import { BtnSend } from "./BtnSend"


export function BtnPublish({uuidImg, tagList}){    
    const isPublic = useRef(false)

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/publish", {uuid_img: uuidImg}).then(response => isPublic.current = true)
        }
    )
    return(
        <BtnSend>
            {isPublic.current ? "Изображение опубликовано" : "Опубликовать"}
        </BtnSend>
    ) 
}
