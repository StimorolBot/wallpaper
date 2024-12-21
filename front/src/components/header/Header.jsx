import { Link } from "react-router-dom"
import { useEffect, useState, useRef, useContext } from "react"

import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"
import { useClickOutside } from "../hook/useClickOutside"

import { SubMenu } from "../ui/menu/SubMenu"
import { LoaderV2 } from "../loader/LoaderV2"
import { UserMenu } from "../ui/menu/UserMenu"
import { MainSearch } from "../ui/input/MainSearch"
import { TagContext } from "../../context/tagContext"

import "./header.sass"


export function Header() {
    const clickRef = useRef(null)
    const {tag, setTeg} = useContext(TagContext)
    const [response, setResponse] = useState()
    const [isShowMenu, setIsShowMenu] = useState(false)

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get("/user").then((r) => {
                if (r.data)
                    setResponse(...r.data)
            })
        }
    )

    useEffect(() => {
        (async () => {
            await request()
        })()
    }, [])

    useClickOutside(clickRef, setIsShowMenu)

    return(
        <>
        <header className="header">
            <div className="wrapper wrapper-header">
                <Link className="logo" to="/">
                    Wallpaper
                </Link>
                <div className="header__container">
                    <MainSearch value={tag} setValue={setTeg}/>
                    <ul className="header-menu"> 
                        <li className="header-menu__item">
                            <svg 
                                className="header-menu__svg" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="28" height="32" viewBox="0 0 448 512"
                            >
                                <path d="M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29c0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29c-6 6.45-8.66 14.16-8.61 21.71c.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32c.05-7.55-2.61-15.27-8.61-21.71M67.53 368c21.22-27.97 44.42-74.33 44.53-159.42c0-.2-.06-.38-.06-.58c0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58c.11 85.1 23.31 131.46 44.53 159.42zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64" />
                            </svg>
                        </li>
                        <li className="header-menu__item">
                            <svg
                                className="header-menu__svg"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32" height="32" viewBox="0 0 512 512"
                            >
                                <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12c2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64m16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16z" />
                            </svg>
                        </li>
                    </ul>
                    <span className="line"></span>
                    <div className="header__auth-container">
                        { isLoading
                            ? <LoaderV2/> 
                            : response?.avatar_user 
                                ? <img
                                    className="user-avatar"
                                    src={"data:image/jpeg;base64," + response?.avatar_user} alt="avatar"
                                    onClick={() => setIsShowMenu(s => !s)}
                                    ref={clickRef}

                                />
                                : <Link className="header__auth-link" to="/auth/login">
                                    <svg
                                        className="header__auth-img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32" height="32" viewBox="0 0 512 512"
                                    >
                                        <g>
                                            <path d="m437.019 74.98c-48.352-48.351-112.639-74.98-181.019-74.98s-132.667 26.629-181.02 74.98c-48.351 48.353-74.98 112.64-74.98 181.02s26.628 132.667 74.98 181.02c48.353 48.351 112.64 74.98 181.02 74.98s132.668-26.629 181.02-74.98c48.351-48.353 74.98-112.64 74.98-181.02s-26.629-132.667-74.981-181.02zm-319.202 359.724c19.683-59.009 75.183-99.437 138.183-99.437s118.501 40.43 138.182 99.438c-38.232 29.63-86.18 47.295-138.182 47.295s-99.951-17.665-138.183-47.296zm300.338-21.455c-26.927-64.621-90.521-107.982-162.155-107.982-71.635 0-135.228 43.36-162.156 107.981-39.49-40.711-63.844-96.185-63.844-157.248 0-124.617 101.383-226 226-226s226 101.383 226 226c0 61.063-24.354 116.538-63.845 157.249z" />
                                            <path d="m256 80.334c-52.567 0-95.333 42.767-95.333 95.333s42.766 95.333 95.333 95.333 95.334-42.767 95.334-95.333-42.767-95.333-95.334-95.333zm0 160.666c-36.025 0-65.333-29.309-65.333-65.333s29.308-65.333 65.333-65.333 65.334 29.309 65.334 65.333-29.309 65.333-65.334 65.333z" />
                                        </g>
                                    </svg>
                                </Link>
                        }
                        { isShowMenu &&
                            <UserMenu userAvatar={response?.avatar_user} userName={response?.user_name}/>
                        } 
                    </div>
                </div>
            </div>
        </header>
        <SubMenu />
        </>
    )
}
