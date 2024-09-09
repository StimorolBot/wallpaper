import api from "../api"
import { useEffect, useState } from "react"
import { Header } from "../components/header/Header"
import { InputReaction } from "../components/ui/input/InputReaction"

import "./style/about_img.sass"


export function AboutImg(){
    const [imgInfo, setImgInfo] = useState("")
    const uuidImg = window.location.pathname.split("wallpaper/")[1]     

    useEffect(() => {(
        async () => {
            await api.get(`/wallpaper/${uuidImg}`).then((response) => {            
                setImgInfo(response.data)
            }).catch((error) =>{
                console.log(error)
            })
        })()
    }, [])

    return(
        <>
        <Header/>
        <div className="wrapper">
            <div className="about-img__container">
                <img className="about__img"
                    src={"data:image/jpeg;base64," + imgInfo["img_base64"]} alt="img"
                />

                <dl className="about__list">
                    <dt className="about__list-item"> Автор </dt>
                    <dd>Ник</dd>

                    <dt>Дата создания</dt>
                    <dd className="about__list-item">
                        <time dateTime={imgInfo["create_date"]}>
                            Время
                        </time>
                    </dd>

                    <dt>Промт</dt>
                    <dd className="about__list-item">
                        {imgInfo["prompt"]}
                    </dd>
                </dl>
                
                <div className="reaction__container">
                    <InputReaction>
                        <img className="reaction-img" src="/static/like.svg" alt="like" />
                    </InputReaction>
                    
                    <InputReaction>
                        <img className="reaction-img" src="/static/dislike.svg" alt="dislike" />
                    </InputReaction>
                </div>
            </div>
            
            <a className="download-img-link" download={`${uuidImg}.png`}
                href={"data:image/jpeg;base64," + imgInfo["img_base64"]}>
                    Скачать
            </a>
        </div>
        </>
    )
}
