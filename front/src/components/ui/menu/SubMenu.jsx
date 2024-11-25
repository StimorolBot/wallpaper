import { Link } from "react-router-dom"

import "./style/sub_menu.sass"


export function SubMenu() {
    return(
        <nav className="submenu">
            <div className="wrapper">
                <ul className="submenu__nav">
                    <li className="submenu__nav-item ">
                        <Link className="submenu__nav-link hover" to="/">
                            <img className="submenu__nav-img" src="/static/home.svg" alt="home" />
                            Главная
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link hover" to="/create">
                            <img className="submenu__nav-img" src="/static/generate.svg" alt="create" />
                            Создать
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link hover" to="/popular">
                            <img className="submenu__nav-img" src="/static/lightning.svg" alt="popular" />
                            Популярное
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link hover" to="/popular">
                            <img className="submenu__nav-img" src="/static/category.svg" alt="category" />
                            Категории
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
