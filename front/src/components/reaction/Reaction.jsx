import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"

import "./style.sass"


export function Reaction({item}) {

    const createReaction = (reaction) => {
        if (reaction === true)
            item.like_count += 1
        else
            item.dislike_count += 1
    }

    const deleteReaction = (reaction) => {
        if (reaction === true)
            item.like_count -= 1
        else
            item.dislike_count -= 1
    }

    const updateReaction = (reaction) => {
        if (reaction === true){
            item.like_count += 1
            item.dislike_count -= 1
        }
        else{
            item.like_count -= 1
            item.dislike_count += 1
        }
    }
    
    const setOperationType = (reaction) => {
        let operationType = ""
        
        if (item.reaction == undefined){
            item.reaction = reaction
            operationType = "CREATE"
            createReaction(reaction)
        }
        else if (item.reaction == reaction){
            item.reaction = undefined
            operationType = "DELETE"
            deleteReaction(reaction)
        }
        else if (item.reaction != reaction){
            item.reaction = reaction
            operationType = "UPDATE"
            updateReaction(reaction)
        }
        return operationType
    }

    const [request, isLoading, error] = useFetch(
        async (event, reaction) => {
            event.preventDefault()
            const operationType = setOperationType(reaction)
            await api.post("/set-reaction", {"reaction": reaction, "img_uuid": item.uuid_img, "operation_type": operationType})
        }
    )

    return(
        <dl className="reaction-list">
            <dt className="reaction__item-img">
                <svg className={item.reaction ? "like like_active": "like"} onClick={async (event) => await request(event, true)}>
                    <use xlinkHref="/static/main.svg#like"></use>
                </svg>
            </dt>
            <dd className="reaction__item-count">
                {item.like_count > 0 && item.like_count}
            </dd>
            <dt className={item.reaction === false ? "dislike dislike_active": "dislike"}> 
                <svg className="reaction__svg reaction_dislike" onClick={async (event) => await request(event, false)}>
                    <use xlinkHref="/static/main.svg#dislike"></use>
                </svg>
            </dt>
            <dd className="reaction__item-count">
                {item.dislike_count > 0 && item.dislike_count}
            </dd>
        </dl>                     
    )
}
