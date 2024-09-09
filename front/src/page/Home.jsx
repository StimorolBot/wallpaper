import api from "../api"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "../components/header/Header"

import "./style/home.sass"


export function Home(){
    const [imgList, setImgList] = useState([])
    
    useEffect(() => {(
        async () => {
            await api.get("/").then((response) => {            
                setImgList([...response.data])
            }).catch((error) =>{
                console.log(error)
            })
        })()
    }, [])

    return(
        <>
        <Header/>
        <section className="img__section">
            <h1 className="hidden">
                Галерея изображений
            </h1>
            <div className="wrapper">
                <div className="img__container">
                    {imgList.map(item => {
                        return(
                            <div className="img__wrapper" key={item["uuid_img"]}>
                                <Link className="img__link" to={`/wallpaper/${item["uuid_img"]}`}>
                                    <img
                                        className="img__item" alt="img-ai"    
                                        src={"data:image/jpeg;base64," + item["img_base64"]}
                                    />
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
        </>
    )
}
