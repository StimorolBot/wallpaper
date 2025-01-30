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

import style from "./style/header.module.sass"


export function Header() {
    const {tag, setTeg} = useContext(TagContext)
    const [userInfoResponse, setUserInfoResponse] = useState({"user_name": null, "avatar_user": null, "user_uuid": null})
    const [notificationResponse, setNotificationResponse] = useState({"user_uuid": null, "user_name": null, "subscriber_uuid": null, "operation": null})

    const [isShowMenu, setIsShowMenu] = useState(false)
    const [isShowNotification, setIsShowNotification] = useState(false)

    const wsRef = useRef(null)

    const clickUserMenuRef = useRef(null)
    const clickNotificationMenuRef = useRef(null)

    const [getInfoUserRequest, isLoadingGetInfoUser, errorGetInfoUser] = useFetch(
        async () => {
            await api.get("/user/info").then((r) => {
                if (r.data){
                    setUserInfoResponse(...r.data)
                }
            })
        }
    )

    const [getNotificationRequest, isLoadingNotification, errorNotification] = useFetch(
        async () => {
            await api.get("/user/get-notification").then((r) => setNotificationResponse(r.data))
        }
    )

    useClickOutside(clickUserMenuRef, setIsShowMenu)
    useClickOutside(clickNotificationMenuRef, setIsShowNotification)

    useEffect(() => {
        (async () => {
            await getInfoUserRequest()
            await getNotificationRequest()
        })()
    }, [])

    return(
        <>
        <header className={style.header}>
            <div className="container">
                { userInfoResponse.user_name && 
                    <Ws response={userInfoResponse} setResponse={setUserInfoResponse} wsRef={wsRef}/>
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
                                <div className={style.notification__container}>
                                    { isShowNotification && 
                                        <NotificationMenu response={notificationResponse} />
                                    } 
                                    <div className={notificationResponse?.user_name
                                        ? `${style.header__notification} ${style.header__notification_active}`
                                        : style.header__notification} 
                                    >
                                        <svg onClick={() => setIsShowNotification(s => !s)}>
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
                                {userInfoResponse.avatar_user
                                    ?<>
                                    <img
                                        className={style.header__avatar}
                                        src={`data:image/jpeg;base64,${userInfoResponse.avatar_user}`} alt="avatar"
                                        onClick={() => setIsShowMenu(s => !s)}
                                    />
                                    { isShowMenu &&
                                        <UserMenu 
                                            userAvatar={userInfoResponse.avatar_user}
                                            userName={userInfoResponse.user_name} 
                                            uuidUser={userInfoResponse.user_uuid}
                                        />
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
