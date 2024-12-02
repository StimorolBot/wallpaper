import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import cookies from "../../cookie"
import { api } from "../../api/config"
import { SubMenu } from "../ui/menu/SubMenu"
import { MainSearch } from "../ui/input/MainSearch"
import { useFetch } from "../hook/useFetch"

import "./header.sass"


export function Header() {
    const token = cookies.get("access_token")
    const [userinfo, setUserInfo] = useState()

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.get("/user").then((response) => {setUserInfo({...response.data})})
        }
    )
    
    useEffect(() => {
        (async () => {
            await request(event)
        })()
    }, [])

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
                            : <img
                                className="user-avatar"
                                src={"data:image/jpeg;base64," + userinfo?.avatar_user} alt="avatar"
                            />
                        }
                    </div>
                </div>
            </div>
        </header>
        <SubMenu />
        </>
    )
}
