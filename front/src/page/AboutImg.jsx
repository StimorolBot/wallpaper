import { useEffect, useState } from "react"

import { api } from "../api/config"
import { useFetch } from "../components/hook/useFetch"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"

import { Loader } from "../components/loader/Loader"
import { CreateItemImg } from "../components/img/CreateItemImg"
import { ImgInfo } from "../components/img/ImgInfo"

import style from "./style/about_img.module.sass"


export function AboutImg(){
    const [response, setResponse] = useState({
        "avatar_user": null, "user_name": null, "uuid_user": null, "img_tag": null, "style": null, 
        "create_date": null, "prompt": null, "negative_prompt": null, "img_base64": null, "uuid_img": null,
        "dislike_count": null, "like_count": null, "is_like": null, "is_dislike": null
    })
    const uuidImg = window.location.pathname.split("wallpaper/")[1]
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`/wallpaper/${uuidImg}`).then((r) => setResponse(...r.data)
            )
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    return(
        <div className="wrapper">
            <Header/>
            <main className="main main_flex">
                <h1 className="title-page">Информация о изображении</h1>
                <div className="container">
                    {isLoading
                        ?<Loader/>
                        :<div className={style.about__inner}>
                            <CreateItemImg item={response} index={1}/>
                            <ImgInfo item={response} />
                        </div>
                    }
                </div>
            </main>
            <Footer/>
        </div>
    )
}
