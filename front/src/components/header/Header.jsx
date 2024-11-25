import cookies from "../../cookie"
import { Link } from "react-router-dom"
import { SubMenu } from "../ui/menu/SubMenu"
import { MainSearch } from "../ui/input/MainSearch"

import "./header.sass"


export function Header() {
    const token = cookies.get("access_token")

    return(
        <>
        <header className="header">
            <div className="wrapper wrapper-header">
                <Link className="logo" to="/">
                    Wallpaper
                </Link>
                <div className="header__container">
                    <MainSearch/>
                    <ul className="header-menu"> 
                        <li className="header-menu__item">
                            <img className="header-menu__img" src="/static/notifications.svg" alt="notifications" />  
                        </li>
                        <li className="header-menu__item">
                            <img className="header-menu__img" src="/static/chat.svg" alt="chat" />
                        </li>
                    </ul>
                    <span className="line"></span>
                    <div className="header__auth-container">
                        {token === undefined
                            ? <Link className="header__auth-link" to="/auth/login">
                                <img className="header__auth-img" src="/static/user.svg" alt="auth" />
                            </Link> 
                            : "Вывести аву"
                        }
                    </div>
                </div>
            </div>
        </header>
        <SubMenu />
        </>
    )
}
