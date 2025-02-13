import { Link } from "react-router-dom"

import cookies from "../../../cookie"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import "./style/user_menu.sass"


export function UserMenu({userAvatar, userName, uuidUser}){

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.patch("/auth/logout")
                .then(() => {
                    cookies.remove("access_token")
                    cookies.remove("refresh_token")
                    location.reload()
                }
            )
        }
    )

    return(
        <menu className="user-menu">
            <header className="user-menu__header">
                <img className="user-menu-avatar" src={"data:image/jpeg;base64," + userAvatar} alt="avatar" />
                <Link className="user-menu__link">{userName}</Link>
            </header>
            <ul className="user-menu__list">
                <li className="user-menu__item">
                    <svg className="user-menu__svg" >
                        <use xlinkHref="/static/main.svg#profile-svg"></use>    
                    </svg>
                    <Link className="user-menu__link" to={`/profile/${uuidUser}`}>Профиль</Link>
                </li>
                <li className="user-menu__item">
                    <svg className="user-menu__svg" >
                        <use xlinkHref="/static/main.svg#liked-svg"></use>    
                    </svg>
                    <Link className="user-menu__link" to={`/profile/${uuidUser}/reaction`}>Понравившиеся</Link>
                </li>
                <li className="user-menu__item">
                    <svg className="user-menu__svg user-menu__svg_stroke" >
                        <use xlinkHref="/static/main.svg#addUser-svg"></use>    
                    </svg>
                    <Link className="user-menu__link" to={`/profile/${uuidUser}/subscriptions`}>Подписки</Link>
                </li>
                <li className="user-menu__item">
                    <svg className="user-menu__svg" >
                        <use xlinkHref="/static/main.svg#subscriber-svg"></use>    
                    </svg>
                    <Link className="user-menu__link" to={`/profile/${uuidUser}/subscribers`}>Подписчики</Link>
                </li>
            </ul>
            <footer className="user-menu__footer">
                <li className="user-menu__footer-item"> 
                    <svg className="user-menu__svg" >
                        <use xlinkHref="/static/main.svg#sun-svg"></use>    
                    </svg>
                </li>
                <li className="user-menu__footer-item">
                    <Link className="user-menu__link" to={`/profile/${uuidUser}/settings`}>
                        <svg className="user-menu__svg">
                            <use xlinkHref="/static/main.svg#setting-svg"></use>    
                        </svg>
                    </Link>
                </li>
                <li className="user-menu__footer-item" onClick={async () => await request()}>
                    <svg className="user-menu__svg" >
                        <use xlinkHref="/static/main.svg#logout-svg"></use>    
                    </svg>
                </li>
            </footer>
        </menu>
    )
}
