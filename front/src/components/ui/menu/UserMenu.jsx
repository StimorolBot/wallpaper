import { Link } from "react-router-dom"

import cookies from "../../../cookie"
import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import "./style/user_menu.sass"


export function UserMenu({userAvatar, userName}){

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.patch("/auth/logout")
                .then(() => {
                    cookies.remove("access_token")
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
            <li className="user-menu__item">
                <svg
                    className="user-menu__svg" 
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 24 24"
                >
                    <g>
                        <path
                            fill="none" stroke="#2A52BE" strokeDasharray="28"
                            d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"
                        />
                        <path
                            fill="none" stroke="#2A52BE" strokeDasharray="28"
                            d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"
                        />
                    </g>
                </svg>
                <Link className="user-menu__link">Профиль</Link>
            </li>
            <li className="user-menu__item">
                <svg
                    className="user-menu__svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 48 48"
                >
                    <path
                        fill="none" stroke="#1E5945" strokeLinejoin="round" strokeWidth="2"
                        d="M27.6 18.6v-7.2A5.4 5.4 0 0 0 22.2 6L15 22.2V42h20.916a3.6 3.6 0 0 0 3.6-3.06L42 22.74a3.6 3.6 0 0 0-3.6-4.14zM15 22h-4.806C8.085 21.963 6.283 23.71 6 25.8v12.6a4.16 4.16 0 0 0 4.194 3.6H15z"
                    />
                </svg>
                <Link className="user-menu__link">Понравившиеся</Link>
            </li>
            <li className="user-menu__item">
                <svg
                    className="user-menu__svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 24 24"
                >
                    <path
                        fill="none" stroke="#9B2D30" strokeLinejoin="round" strokeWidth="1"
                        d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3zm-9-2q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20z"
                    />
                </svg>
                <Link className="user-menu__link">Подписки</Link>
            </li>
            <li className="user-menu__item">
                <svg
                    className="user-menu__svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 24 24"
                >
                    <path
                        fill="none" stroke="#9B2D30" strokeLinejoin="round" strokeWidth="1"
                        d="M17 15q-1.05 0-1.775-.725T14.5 12.5t.725-1.775T17 10t1.775.725t.725 1.775t-.725 1.775T17 15m-4 5q-.425 0-.712-.288T12 19v-.4q0-.6.313-1.112t.887-.738q.9-.375 1.863-.562T17 16t1.938.188t1.862.562q.575.225.888.738T22 18.6v.4q0 .425-.288.713T21 20zm-3-8q-1.65 0-2.825-1.175T6 8t1.175-2.825T10 4t2.825 1.175T14 8t-1.175 2.825T10 12m-8 5.2q0-.85.425-1.562T3.6 14.55q1.5-.75 3.113-1.15T10 13q.875 0 1.75.15t1.75.35l-1.7 1.7q-.625.625-1.213 1.275T10 18v.975q0 .3.113.563t.362.462H4q-.825 0-1.412-.587T2 18z"
                    />
                </svg>
                <Link className="user-menu__link">Подписчики</Link>
            </li>
            <footer className="user-menu__footer">
                <li className="user-menu__footer-item">
                    <img className="user-menu__footer-svg" src="/static/sunny.svg" alt="switch-theme" />
                </li>
                <li className="user-menu__footer-item">
                    <Link className="user-menu__link">
                        <svg
                            className="user-menu__footer-svg"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32" height="32" viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6"
                            />
                        </svg>
                    </Link>
                </li>
                <li className="user-menu__footer-item" onClick={async () => await request()}>
                    <svg
                        className="user-menu__footer-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32" height="32" viewBox="0 0 24 24"
                    >
                        <g stroke="#F8173E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                            <path d="M12 4h-7c-0.55 0 -1 0.45 -1 1v14c0 0.55 0.45 1 1 1h7" />
                            <path d="M9 12h11.5"/>
                            <path d="M20.5 12l-3.5 -3.5M20.5 12l-3.5 3.5"/>
                        </g>
                    </svg>
                </li>
            </footer>
        </menu>
    )
}
