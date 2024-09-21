import api from "../api"
import { useEffect, useState } from "react"
import { Header } from "../components/header/Header"
import { CreateImgList } from "../components/img/CreateImgList"

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
        <section className="home">
            <h1 className="hidden">
                Галерея изображений
            </h1>
            <div className="wrapper">
                <CreateImgList imgList={imgList}/>                
            </div>
        </section>
        </>
    )
}
