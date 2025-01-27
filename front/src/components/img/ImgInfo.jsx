import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"
import { Copy } from "../ui/copy/Copy"
import { convertData } from "../../func_tools/funcTools"

import style from"./style/img_info.module.sass"


export function ImgInfo({ item }){
    const [lastVisit, setLastVisit] = useState({"status": null})

    const [getLastVisit, isLoadingLastVisit, errorLastVisit] = useFetch(
        async () => {
            if (item.uuid_user){
                await api.get("/user/last-visit", {params: {uuid_user: item.uuid_user}})
                .then((r) => setLastVisit(r.data)
                )
            }            
        }
    )

    const [submitUser, isLoadingUser, errorUser] = useFetch(
        async () => {
            await api.post("/user/subscribe", 
                {uuid_user: item.uuid_user, user_name: item.user_name, operation: "FRIEND_REQUEST"}
            )
            .then((r) => {
            })
        }
    )

    const lastVisitDate = convertData(lastVisit.status)
    const imgCreateDate = convertData(item?.create_date)

    useEffect(() => {(
        async () => {
            await getLastVisit()
        })()
    }, [])
    
    return(
        <div className={style.imgInfo}>
            <ul className={style.imgAuthor__list}>
                <li className={style.imgAuthor__item}>
                    <Link to={`/user/${item.uuid_user}`}>
                        <img
                            className={style.authorAvatar}
                            src={`data:image/jpeg;base64,${item.avatar_user}`} 
                            alt="author-avatar"
                        />
                    </Link>
                    <div className={style.imgAuthor__info}>
                        <time dateTime={lastVisitDate}>
                            {lastVisitDate}
                        </time>
                        <p className={style.imgAuthor__name}>{item.user_name}</p>
                    </div>
                </li>
                <li className={style.imgAuthor__item}>
                    <Link to={"/#"}>
                        <svg className={style.imgInfo__chat}>
                            <use xlinkHref="/static/main.svg#chat"></use>    
                        </svg>
                    </Link>
                    <button>
                        <svg className={style.imgInfo__addUser} onClick={async () => await submitUser()}>
                            <use xlinkHref="/static/main.svg#addUser-svg"></use>    
                        </svg>
                    </button>
                </li>
            </ul>
            <dl className={style.imgInfo__list}>
                <div className={style.imgInfo__item}>
                    <dt className={style.imgInfo__dt}>Стиль:</dt>
                    <dd className={style.imgInfo__dd}>{item.style}</dd>
                </div>
                <div className={style.imgInfo__item}>
                    <dt className={style.imgInfo__dt}>Дата создания:</dt>
                    <dd className={style.imgInfo__dd}>
                        <time dateTime={"imgCreateDate"}>
                            {imgCreateDate}
                        </time>
                    </dd>
                </div>
                <div className={style.imgInfo__item}>
                    <dt className={style.imgInfo__dt}>Промпт:</dt>
                    <dd className={style.imgInfo__dd}>{item.prompt}</dd>
                    <div className={style.copy__container}>
                        <Copy buffer={item.prompt}/>
                    </div>
                </div>
            </dl>
            <ul className={style.tag__list}>
                {item.img_tag?.map((tag, index) => {
                    return(
                        <li className={style.tag__item} key={index}> {tag.replace(",", "")} </li>
                    )
                })}
            </ul>
        </div>
    )
}
