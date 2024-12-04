import { useState } from "react"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"
import { InputRadio } from "../input/InputRadio"
import { Textarea } from "../input/Textarea"


import "./style/create_tag_menu.sass"


export function CreateTagMenu({uuidImg, response, setResponse}){
    const [isHidden, setIsHidden] = useState(false)
    const [isAuto, setIsAuto] = useState(false)

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            setIsAuto(false)
            await api.post("/tag/create", {uuid_img: uuidImg, is_automatically: true})
            .then((r) => {
                setResponse(() => ({...response, tag: r.data}))
            })
        }
    )

    return(
        <menu className="tag-menu">
            <button className="add-tag-btn" type="button" onClick={() => setIsHidden(s => !s)}>Добавить теги</button>
            <div className={isHidden ? "add-tag__container" : "add-tag__container add-tag__container_hidden"}>
                {isLoading
                    ? <p>LOADER</p>
                    : <InputRadio id={"add-tag-automatic"} name={"add-tag"}
                    text={"Автоматически"} onClick={async (event) => request(event)}
                />
                }
                
                <InputRadio id={"add-tag"} name={"add-tag"} text={"Вручную"} onClick={() => setIsAuto(s => !s)}/>
            </div>
            <Textarea value={""} setValue={""}
                placeholder={"#Tags"}
                isHidden={isHidden && isAuto}
            />
        </menu>
    )
}
