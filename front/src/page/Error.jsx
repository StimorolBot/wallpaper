import { Link } from "react-router-dom"

import "./style/error.sass"


export function Error({
    errorCode = 404,
    errorMsg=`Не удалось найти страницу: ${window.location.href}`})
{
    return(
        <section className="error__container">
            <h2 className="error__code">
                { errorCode }
            </h2>
            <div className="error__msg">
                { errorMsg }
            </div>
            { errorCode === 404 &&
                <Link className="back-home" to="/">
                    Вернуться на главную страницу 
                </Link>
            }
        </section>
    )
}
