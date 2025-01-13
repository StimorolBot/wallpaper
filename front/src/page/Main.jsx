import { useState } from "react"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"


export function Main(){
    const [imgList, setImgList] = useState([])

    return(        
        <div className="wrapper">
            <Header/>
            <main className="main">
                <h1 className="title-page"> Главная страница </h1>
                <div className="container">
                    <Pagination path={"/"} itemList={imgList} setItemList={setImgList}/>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
