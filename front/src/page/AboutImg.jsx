import { useEffect, useState } from "react"

import { api } from "../api/config"
import { Loader } from "../components/loader/Loader"
import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { useFetch } from "../components/hook/useFetch"
import { CreateImgList } from "../components/img/CreateImgList"
import { AboutImgCard } from "../components/ui/cards/AboutImgCard"

import "./style/about_img.sass"


export function AboutImg(){
    const [imgInfo, setImgInfo] = useState()
    const uuidImg = window.location.pathname.split("wallpaper/")[1]
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`/wallpaper/${uuidImg}`)
                .then((response) => {
                    setImgInfo([...response.data])
                }
            )
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    return(
        <>
        <Header/>
        <section className="about-img-section">
            <h2 className="hidden">
                Информация о изображении
            </h2>
            <div className="wrapper">
                <div className="about-img__container">
                    {isLoading
                        ? <Loader align={false}/>
                        : <div className="about-img__wrapper">
                            <div className="about__img">
                                <CreateImgList imgList={imgInfo} setImgList={setImgInfo} flag={false}/>
                            </div>
                            <AboutImgCard imgInfo={ imgInfo } uuidImg={ uuidImg }/>
                        </div>
                    }
                </div>
            </div>
        </section>
        <Footer/>
        </>
    )
}
