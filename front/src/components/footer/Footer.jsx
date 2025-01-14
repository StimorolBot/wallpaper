import { Ws } from "../../api/ws"
import  style from "./footer.module.sass"


export function Footer(){
    return(
        <footer className={style.footer}>
            <Ws/>
            <div className="container">
                <div className={style.footer__info}>
                    <svg>
                        <use xlinkHref="/static/main.svg#git-hub"></use>
                    </svg>
                    <a className={style.footer__infoLink} href="https://github.com/StimorolBot/wallpaper"> 
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
