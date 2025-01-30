import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import "./style/notification_menu.sass"


export function NotificationMenu({response}){
    let operation  = null

    switch (response?.operation){
        case "FRIEND_REQUEST":
            operation = "Заявка в друзья"
            break       
    }
    
    const [request, isLoading, error] = useFetch(
        async (isAdd) => {
            await api.patch("/user/add-friend", {"is_add": isAdd, "subscriber_uuid": response.user_uuid})
        }
    )
    
    return(
        <menu className="notification-menu">  
            {operation === null 
                ? <p className="notification__empty">
                    У вас нет новых уведомлений
                </p>
                : <ul className="notification__list">
                    <li className="notification__item">
                        <div className="notification__info">
                            <p className="notification__title">
                                {operation}
                            </p>
                            <p className="notification__text">
                                {response.user_name}
                            </p>
                        </div>
                        <div className="notification__action">
                            <svg className="notification__svg" 
                                onClick={async () => await request(true)}
                            >
                                <use xlinkHref="/static/main.svg#ok-svg"></use>    
                            </svg>
                            <svg className="notification__svg notification__svg_cancel"
                                onClick={async () => await request(false)}
                            >
                                <use xlinkHref="/static/main.svg#cancel-svg"></use>    
                            </svg>
                        </div>
                    </li>
                </ul>
            }
        </menu>
    )
}