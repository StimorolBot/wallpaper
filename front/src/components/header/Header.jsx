import cookies from "../../cookie"
import { Link } from "react-router-dom"

import "./header.sass"


export function Header() {
    const token = cookies.get("access_token")

    return(
        <header className="header">
            <div className="wrapper wrapper-header">
                <div className="header__logo-container">
                    <Link className="header__logo-link" to="/">
                        <img className="header__logo" src="/static/logo.svg" alt="logo" />
                    </Link>
                </div>
                <nav className="header__nav">
                    <ul className="header__nav-container">
                        <li className="header__nav-item">
                            <Link className="header__item-link hover" to="/create">
                                Создать
                            </Link>
                        </li>
                        <li className="header__nav-item">
                            <Link className="header__item-link hover" to="/popular">
                                Популярные
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="header__auth-container">
                    <Link className="header__auth-link" to="/auth/login">
                        <img className={token === undefined ? "header__auth-img" : "header__auth-img header__auth-img_big" }
                            src={token === undefined ? "/static/auth.svg" : "/static/user.svg" } alt="auth" />
                    </Link>
                </div>
            </div>
        </header>
    )
}