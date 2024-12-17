import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import "./style/reaction_menu.sass"


export function ReactionMenu({item}) {

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
        <dl className="reaction-container">
            <dt className="reaction_item-dt">
                <svg
                    className={item.reaction ? "like like_active": "like"}
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 32 32"
                    onClick={async (event) => await request(event, true)}
                >
                    <path
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M6 6c4.665-2.332 8.5.5 10 2.5c1.5-2 5.335-4.832 10-2.5c6 3 4.5 10.5 0 15c-2.196 2.196-6.063 6.063-8.891 8.214a1.76 1.76 0 0 1-2.186-.041C12.33 27.08 8.165 23.165 6 21C1.5 16.5 0 9 6 6"
                    /> 
                </svg>
            </dt>
            <dd className="reaction_item-dd">
                {item.like_count > 0 && item.like_count}
            </dd>
            <dt className="reaction_item-dt">
                <svg
                    className={item.reaction === false ? "dislike dislike_active": "dislike"}
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 32 32"
                    onClick={async (event) => await request(event, false)}
                >
                    <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.391 25.744a1 1 0 0 0-.203.607l-.02 3.075a.577.577 0 0 1-.914.465C10.79 27.453 3.83 21.9 2.256 15.77c-1.188-4.633 1.758-10.844 8.859-9.61c1.737.303 3.403 1.528 4.144 2.68c.092.132.264.598.264.598q.007.014.01.025l.01.025l1.393 3.723c.121.334.07.708-.153.981l-.63.8l-.03.035l-.03.035l-1.707 1.78c-.305.324-.366.8-.153 1.184l2.631 4.795a1 1 0 0 1-.08 1.093z"/>
                        <path d="M16.929 8.32c.935-.979 2.188-1.876 3.821-2.159c7.201-1.241 10.18 4.954 8.999 9.575c-1.603 6.175-8.752 11.754-12.224 14.156a.585.585 0 0 1-.925-.474l.02-2.432c0-.222.073-.434.206-.605l1.798-2.331a.98.98 0 0 0 .082-1.09l-2.578-4.641a.99.99 0 0 1 .154-1.18l.75-.777q.015-.016.03-.036l.031-.035l1.418-1.756c.216-.272.277-.645.154-.978l-1.828-4.833a.4.4 0 0 1-.031-.152c0-.15.123-.252.123-.252"/>
                    </g>
                </svg>
            </dt>
            <dd className="reaction_item-dd">
                {item.dislike_count > 0 && item.dislike_count}
            </dd>
        </dl>                     
    )
}
