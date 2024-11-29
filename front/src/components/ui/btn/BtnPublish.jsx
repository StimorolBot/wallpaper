import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import "./style/btn_publish.sass"


export function BtnPublish({uuidImg}){
    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/publish", {uuid_img: uuidImg})
        }
    )
    return(
        <button className="btn-publish hover" onClick={async (event) => await request(event)}> 
            Опубликовать
        </button>
    )
}