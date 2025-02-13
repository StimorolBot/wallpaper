import { useState } from "react"

import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import { Textarea } from "../textarea/Textarea"
import { BtnCreate } from "../btn/BtnCreate"

import style from"./style/create_tag_fom.module.sass"


export function CreateTagForm({response, setResponse, tagList, setTagList}){
    const [errorMsg, setErrorMsg] = useState("")
    const regex = new RegExp("^#([A-Za-z]+)(?:\\s#[A-Za-z]+\\b)*$", "g")
    
    const [request, isLoading, error] = useFetch(
        async (isAutomatic) => {
            await api.post("/tag/create", 
                {
                    uuid_img: response.uuid_img, is_automatically: isAutomatic, 
                    tag_list: isAutomatic && errorMsg === "" ? null : tagList.tags.split(" ")
                }
            )
            .then((r) => {
                setResponse(() => ({...response, "tag": r.data}))
            })           
        }
    )

    const validTag = (data) => {
        setTagList(data)
        const matching = tagList.tags.match(regex) 

        if (!matching)
            setErrorMsg("Указан неверный формат тега")
        else
            setErrorMsg("")
    }

    return(
        <>
        <form className={style.form__tag}>
            <Textarea maxLength="200" placeholder="#Укажите #Теги" value={tagList} setValue={validTag} isTag={false} keyDict={"tags"}>
                <button className={style.form__svgContainer} type="button" title="Добавить теги" onClick={async () => await request(false)}> 
                    <svg className={style.form__svg}>
                        <use xlinkHref="/static/main.svg#enter-svg"></use>
                    </svg>
                </button>
            </Textarea>
            <div className={style.form__btn} onClick={async () => await request(true)}>
                <BtnCreate type="button">Сгенерировать теги</BtnCreate>
            </div>            
        </form>
        <p className={style.error__msg}>{errorMsg}</p>
        </>
    )
}
