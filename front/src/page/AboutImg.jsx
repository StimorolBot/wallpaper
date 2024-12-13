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
    const [response, setResponse] = useState([{}])
    const uuidImg = window.location.pathname.split("wallpaper/")[1]
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`/wallpaper/${uuidImg}`).then((r) => {setResponse([...r.data])}
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
                        ? <Loader/>
                        : <div className="about-img__wrapper">
                            <div className="about__img">
                                <CreateImgList imgList={response} setImgList={setResponse} flag={false}/>
                            </div>
                            <AboutImgCard imgInfo={response[0]} />
                        </div>
                    }
                </div>
            </div>
        </section>
        <Footer/>
        </>
    )
}
