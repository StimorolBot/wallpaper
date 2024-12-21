import { useRef } from "react"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"
import { LoaderV2 } from "../../loader/LoaderV2"

import "./style/btn_publish.sass"


export function BtnPublish({uuidImg, tagList}){
    const isPublic = useRef(false)

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/publish", {uuid_img: uuidImg}).then(response => isPublic.current = true)
        }
    )
    return(
        <>
        { isLoading
            ? <LoaderV2/>
            : isPublic.current
                ?<p className="btn-publish btn-publish_pub">Изображение опубликовано</p>
                :<button 
                    className="btn-publish" onClick={async (event) => await request(event)}
                    disabled={tagList ? false : true}
                >
                    Опубликовать
                </button> 
        }
        </>
    )
}