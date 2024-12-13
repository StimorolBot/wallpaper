import { useRef } from "react"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"
import { LoaderV2 } from "../../loader/LoaderV2"

import "./style/btn_publish.sass"


export function BtnPublish({uuidImg}){
    const isPublic = useRef(false)
    
    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/publish", {uuid_img: uuidImg}).then(response => isPublic.current = true)
        }
    )
    return(
        <button className="btn-publish hover" onClick={async (event) => await request(event)}> 
            { isLoading
                ? <LoaderV2/>
                : isPublic.current ? "Изображение опубликовано" : "Опубликовать"
            }            
        </button>
    )
}