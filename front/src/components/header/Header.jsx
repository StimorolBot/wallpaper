import { Link } from "react-router-dom"
import { useEffect, useState, useRef, useContext } from "react"

import { api } from "../../api/config"
import { Ws } from "../../api/ws"
import { useFetch } from "../hook/useFetch"
import { TagContext } from "../../context/tagContext"
import { useClickOutside } from "../hook/useClickOutside"

import { SubHeader } from "./SubHeader"
import { UserMenu } from "../ui/menu/UserMenu"
import { NotificationMenu } from "../ui/menu/NotificationMenu"
import { CustomSearch } from "../ui/search/CustomSearch"

// import { LoaderV2 } from "../loader/LoaderV2"

import style from "./style/header.module.sass"


export function Header() {
    const {tag, setTeg} = useContext(TagContext)
    const [response, setResponse] = useState({"user_name": null, "avatar_user": null, "uuid_user": null, "notification": null})
    
    const [isShowMenu, setIsShowMenu] = useState(false)
    const [isShowNotification, setIsShowNotification] = useState(false)

    const wsRef = useRef(null)
    const [clickMenu, setClickMenu] = useState({})
    
    const clickUserMenuRef = useRef(null)
    const clickNotificationMenuRef = useRef(null)

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get("/user/info").then((r) => {
                if (r.data){
                    setResponse(...r.data)
                }
            })
        }
    )

    useClickOutside(clickUserMenuRef, setIsShowMenu)
    useClickOutside(clickNotificationMenuRef, setIsShowNotification)

    useEffect(() => {
        (async () => {
            await request()
        })()
    }, [])

    return(
        <>
        <header className={style.header}>
            <div className="container">
                { response.user_name && 
                    <Ws response={response} setResponse={setResponse} wsRef={wsRef}/>
                }
                <div className={style.header__inner}>
                    <Link className={style.logo} to="/">
                        Wallpaper
                    </Link>
                    <nav className={style.header__nav}>
                        <ul className={style.header__list}>
                            <li className={style.header__item}>
                                <CustomSearch 
                                    value={tag} setValue={setTeg} isMulti={true}
                                    isSearchable={true}    
                                />
                            </li>
                            <li className={style.header__item} ref={clickNotificationMenuRef}>
                                <div 
                                    className={style.notification__container} 
                                    onClick={() => setIsShowNotification(s => !s)} 
                                >
                                    { isShowNotification && 
                                        <NotificationMenu wsRef={wsRef}/>
                                    }
                                    <div className={response.notification 
                                        ? `${style.header__notification} ${style.header__notification_active}`
                                        : style.header__notification} 
                                    >
                                        <svg>
                                            <use xlinkHref="/static/main.svg#notifications"></use>    
                                        </svg>
                                    </div>
                                </div>
                            </li>
                            <li className={style.header__item}>
                                <svg className={style.header__svg}>
                                    <use xlinkHref="/static/main.svg#chat"></use>    
                                </svg>
                            </li>
                            <li className={style.header__item}>
                                <span className={style.header__separation}></span>
                            </li>
                            <li className={style.header__item} ref={clickUserMenuRef}>
                                {response.avatar_user
                                    ?<>
                                    <img
                                        className={style.header__avatar}
                                        src={`data:image/jpeg;base64,${response.avatar_user}`} alt="avatar"
                                        onClick={() => setIsShowMenu(s => !s)}
                                    />
                                    { isShowMenu &&
                                        <UserMenu userAvatar={response.avatar_user} userName={response.user_name} uuidUser={response.uuid_user}/>
                                    }
                                    </>
                                    :<Link to="/auth/login">
                                        <svg className={style.header__svg}>
                                            <use xlinkHref="/static/main.svg#auth"></use>
                                        </svg> 
                                    </Link>
                                }                                 
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
        <SubHeader />
        </>
    )
}
