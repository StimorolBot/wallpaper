import { Link } from "react-router-dom"
import { Copy } from "../copy/Copy"

import "./style/about_img_card.sass"

export function AboutImgCard({ imgInfo }){

    return(
        <div className="about-img">
            <ul className="about-img__author about_bg">
                <li className="about-img__author-item">
                    <Link className="about-img__link" to={"/user/" + imgInfo?.uuid_user}>
                        <img
                            className="about-img__ava"
                            src={"data:image/jpeg;base64," + imgInfo?.avatar_user} 
                            alt="author-avatar"
                        />
                    </Link>
                </li>
                <li className="about-img__author-item">
                    <span className="about__username">{imgInfo?.user_name}</span>
                </li>
                <li className="about-img__author-item">
                    <img className="chat" src="/static/chat.svg" alt="chat" />
                    <button className="add-user">Подписаться</button>
                </li>                
            </ul>
            <ul className="about-img__tag about_bg">
            </ul>
            <ul className="about-img__info about_bg">
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Стиль</dt>
                    <dd className="about-img__dd">{": " + imgInfo?.style}</dd>
                </li>
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Дата создания</dt>
                    <dd className="about-img__dd">
                        <time dateTime={imgInfo?.create_date}>
                            {": " + imgInfo?.create_date?.split("T")[0]}
                        </time>
                    </dd>
                </li>
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Промпт</dt>
                    <dd className="about-img__dd">{": " + imgInfo?.prompt}</dd>
                    <Copy buffer={imgInfo?.prompt}/>
                </li>
            </ul>
        </div>
    )
}
       