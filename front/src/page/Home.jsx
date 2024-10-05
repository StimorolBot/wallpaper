import { useState } from "react"
import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"

import "./style/home.sass"


export function Home(){
    const [imgList, setImgList] = useState([])

    return(
        <>
        <Header/>
        <section className="home">
            <h1 className="hidden">
                Галерея изображений
            </h1>
            <div className="wrapper">
                <Pagination
                    path={"/"}
                    itemList={imgList}
                    setItemList={setImgList}    
                />
            </div>
        </section>
        <Footer/>
        </>
    )
}
