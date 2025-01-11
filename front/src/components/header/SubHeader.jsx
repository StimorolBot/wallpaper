import { Link } from "react-router-dom"

import style from "./style/sub_header.module.sass"


export function SubHeader() {
    return(
        <nav className={style.subheader}>
            <div className="container">
                <ul className={style.subheader__list}>
                    <li className={style.subheader__item}>
                        <Link className={style.subheader__link} to="/">
                            <svg className={style.subheader__svg}>
                                <use xlinkHref="/static/main.svg#main-page"></use>    
                            </svg>
                            <p>Главная</p>
                        </Link>
                    </li>
                    <li className={style.subheader__item}>
                        <Link className={style.subheader__link} to="/create">
                            <svg className={style.subheader__svg}>
                                <use xlinkHref="/static/main.svg#create-page"></use>    
                            </svg>
                            <p>Создать</p>
                        </Link>
                    </li>
                    <li className={style.subheader__item}>
                        <Link className={style.subheader__link} to="/popular">
                            <svg>
                                <use xlinkHref="/static/main.svg#popular-page"></use>    
                            </svg>
                            <p>Популярное </p>
                        </Link>
                    </li>
                    <li className={style.subheader__item}>
                        <Link className={style.subheader__link} to="/category">
                            <svg className={style.subheader__svg}>
                                <use xlinkHref="/static/main.svg#categories-page"></use>    
                            </svg>
                            <p>Категории</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
