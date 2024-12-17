import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"

import { Copy } from "../copy/Copy"
import { LoaderV2 } from "../../loader/LoaderV2"

import "./style/about_img_card.sass"


export function AboutImgCard({ imgInfo }){
    const [lastVisit, setLastVisit] = useState()
    const tagList = imgInfo?.img_tag?.split(" ")
    
    const [request, isLoading, error] = useFetch(
        async () => {
            if (imgInfo["uuid_user"]){
                await api.post("/user/last-visit", {uuid_user: imgInfo["uuid_user"]})
                .then((r) => {setLastVisit({...r.data})}
                )
            }            
        }
    )

    const convertData = (date) => {
        const now = new Date()
        const currentOffset = new Date().getTimezoneOffset() / 60
        const utcDate = new Date(date)
        
        utcDate.setHours(utcDate.getHours() - currentOffset)
        const localDate = utcDate.toLocaleString().split(", ")
        
        if ((Math.floor((now-utcDate)/3600000)-currentOffset) > 24){
            return localDate[0]
        }
    }

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])
    
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
                <li className="about-img__author-item about-img__author-item_column">
                    {isLoading
                        ? <LoaderV2 /> 
                        : lastVisit?.last_visit === "Online"
                            ? <span className="circle-online"></span>
                            : <span>{convertData(lastVisit?.last_visit)}</span>
                    }
                    <span className="about__username">{imgInfo?.user_name}</span>
                </li>
                <li className="about-img__author-item about-img__author-item_left">
                    <Link className="chat-user-link" to={"/#"}>
                        <svg
                            className="chat__svg"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32" height="32" viewBox="0 0 512 512"
                        >
                            <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12c2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64m16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16z" />
                        </svg>
                    </Link>                 
                    <button className="add-user-btn">
                        <svg
                            className="add-user__svg"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32" height="32" viewBox="0 0 24 24"
                        >
                            <path
                                fill="none" strokeLinejoin="round" strokeWidth="1"
                                d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3zm-9-2q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20z"
                            />
                        </svg>
                    </button>
                </li>                
            </ul>
            { tagList &&
                <ul className="about-img__tag about_bg">
                    { tagList.map((tag, index) => {
                        return(
                            <li className="tag-item" key={index}>
                                <Link className="" to={"#"} >
                                    {tag}
                                </Link>
                            </li>
                        )
                    })}    
                </ul>
            }
            <ul className="about-img__info about_bg">
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Стиль:</dt>
                    <dd className="about-img__dd">{imgInfo?.style}</dd>
                </li>
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Дата создания:</dt>
                    <dd className="about-img__dd">
                        <time dateTime={convertData(imgInfo?.create_date)}>
                            {convertData(imgInfo?.create_date)}
                        </time>
                    </dd>
                </li>
                <li className="about-img__info-item">
                    <dt className="about-img__dt">Промпт:</dt>
                    <dd className="about-img__dd">{imgInfo?.prompt}</dd>
                    <Copy buffer={imgInfo?.prompt}/>
                </li>
            </ul>
            { imgInfo?.negative_prompt &&
                <ul className="negative-prompt__info about_bg">
                    <li className="about-img__info-item">
                        <dt className="negative-prompt__dt">Негативный промпт:</dt>
                        <dd className="negative-prompt__dd">{imgInfo?.negative_prompt}</dd>
                        <Copy buffer={imgInfo?.negative_prompt}/>
                    </li>
                </ul>
            }
        </div>
    )
}
       