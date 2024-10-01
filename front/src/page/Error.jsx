import { Link } from "react-router-dom"

import "./style/error.sass"


export function Error({errorCode, errorMsg}) {
    const url = window.location.href

    return(
        <section className="error__container">
            <h2 className="error__code">
            { errorCode == undefined
                ? "404"
                : errorCode
                }
                
            </h2>
            <div className="error__msg">
                { errorMsg == undefined
                ? `Не удалось найти страницу: ${url}`
                : errorMsg
                }
            </div>
            <Link className="back-home" to="/">
                Вернуться на главную страницу 
            </Link>
        </section>
    )
}