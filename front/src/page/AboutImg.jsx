import { api } from "../api"
import { useEffect, useState } from "react"
import { Header } from "../components/header/Header"

import "./style/about_img.sass"


export function AboutImg(){
    const [imgInfo, setImgInfo] = useState("")
    const uuidImg = window.location.pathname.split("wallpaper/")[1]
    
    const setReaction = async (event) => {
        event.preventDefault()
    // вынести в отдельную ф. 
    }
  
    
    useEffect(() => {(
        async () => {
            await api.get(`/wallpaper/${uuidImg}`).then((response) => {
                setImgInfo({...response.data})
            }).catch((error) =>{
                console.log(error)
            })
        })()
    }, [])

    return(
        <>
        <Header/>
        <section className="about-img section_flex">
            <h2 className="hidden">
                Информация о изображении
            </h2>
            <div className="wrapper">
                <div className="about-img__container">
                    <div className="about__img-container">
                        <img className="about__img"
                            src={"data:image/jpeg;base64," + imgInfo["img_base64"]} alt="img"
                        />
                    </div>
                    <div className="about__list">
                        <div className="about__list-container">
                            <dt className="about__list-dt">Автор:</dt>
                            <dd className="about__list-dd">{imgInfo["user_name"]}</dd>
                        </div>

                        <div className="about__list-container">
                            <dt className="about__list-dt">Стиль:</dt>
                            <dd className="about__list-dd">
                                {imgInfo["style"]}
                            </dd>
                        </div>

                        <div className="about__list-container">
                            <dt className="about__list-dt">Дата создания:</dt>
                            <dd className="about__list-dd">
                                <time dateTime={imgInfo["create_date"]}>
                                    {imgInfo["create_date"]?.split("T")[0]}
                                </time>
                            </dd>
                        </div>

                        <div className="about__list-container">
                            <dt className="about__list-dt">Промт:</dt>
                            <dd className="about__list-dd about__list-promt">
                                {imgInfo["prompt"]}
                            </dd>
                        </div>

                        <div className="reaction__container">
                            <div className="reaction__item">
                                <img className="reaction-img" src="/static/like.svg" alt="like" />
                                <p className="reaction-count">{imgInfo["like"]}</p>
                            </div>

                            <div className="reaction__item">
                                <img className="reaction-img" src="/static/dislike.svg" alt="dislike" />
                                <p className="reaction-count">{imgInfo["dislike"]}</p>
                            </div>        
                        </div>
                        <div className="download-img__container">
                            <a className="download-img-link hover" download={`${uuidImg}.png`}
                                href={"data:image/jpeg;base64," + imgInfo["img_base64"]}>
                                Скачать
                            </a>
                        </div> 
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}
