import { Link } from "react-router-dom"

import "./header.sass"


export function Header() {

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
                            <Link className="header__create-link" to="/create">
                                Создать
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="header__auth-container">
                    <Link className="header__auth" to="/auth/login">
                        <img className="header__auth-link" src="/static/auth.svg" alt="auth" />
                    </Link>
                </div>
            </div>
        </header>
    )
}