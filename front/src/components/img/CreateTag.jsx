import { useState } from "react"
import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"
import { Textarea } from "../ui/textarea/Textarea"

import style from"./style/create_tag.module.sass"
import { BtnCreate } from "../ui/btn/BtnCreate"


export function CreateTag({response, setResponse}){
    const [tagList, setTagList] = useState([""])
    
    const [request, isLoading, error] = useFetch(
        async (event, isAutomatic) => {
            await api.post("/tag/create", {uuid_img: response.uuid_img, is_automatically: isAutomatic, tag_list: tagList})
            .then((r) => {
                setResponse(() => ({...response, tag: r.data}))
            })
        }
    )

    return(
        <form className={style.form__tag}>
            <Textarea placeholder={"#ВведитеТэги"} value={tagList} setValue={setTagList} isCount={false}>
                <svg className={style.form__svg}>
                    <use xlinkHref="/static/main.svg#enter-svg"></use>
                </svg>
            </Textarea>
            <div className={style.form__btn} onClick={ async () => await request(true)}>
                <BtnCreate>Создать автоматически</BtnCreate>
            </div>           
        </form>
    )
}
