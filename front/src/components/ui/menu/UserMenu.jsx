import { Link } from "react-router-dom"

import "./style/user_menu.sass"


export function UserMenu({userAvatar}){
    return(
        <menu className="user-menu">
            <header className="user-menu__header">
                <img className="user-menu-avatar" src={"data:image/jpeg;base64," + userAvatar} alt="avatar" />
                <Link>username</Link>
            </header>
            <li className="user-menu__item">
                <img className="" src="/static/login.svg" alt="profile" />
                <Link>Профиль</Link>
            </li>
            <li className="user-menu__item">
                <img className="" src="" alt="" />
                <Link>Понравившиеся</Link>
            </li>
            <li className="user-menu__item">
                <img className="" src="" alt="" />
                <Link>Подписки</Link>
            </li>
            <li className="user-menu__item">
                <img className="" src="" alt="" />
                <Link>Подписчики</Link>
            </li>
            <footer className="user-menu__footer">
                <li className="">
                    <img className="" src="/static/sunny.svg" alt="switch-theme" />
                </li>
                <li className="">
                    <Link>
                        <img className="" src="/static/setting.svg" alt="account-settings" />
                    </Link>
                </li>
                <li className="">
                    <Link>
                        <img className="" src="/static/logout.svg" alt="logout" />
                    </Link>
                </li>
            </footer>
        </menu>
    )
}