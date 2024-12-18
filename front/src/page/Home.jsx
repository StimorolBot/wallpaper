import { useState } from "react"
import { Link } from "react-router-dom"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"


export function Home(){
    const [imgList, setImgList] = useState([])

    return(
        <>
        <Header/>
        <section className="home flex">
            <h1 className="hidden">
                Галерея изображений
            </h1>
            <div className="wrapper">
                <Pagination
                    path={"/"}
                    itemList={imgList}
                    setItemList={setImgList}  
                    emptyListMsg={
                        <p className="empty-list__msg">
                            На данный момент на сайте отсутствуют сгенерированные изображения. <br/>
                            Для их генерации перейдите в раздел 
                            <Link className="create-link" to={"/create"}>
                                {` "Создать"`}
                            </Link> 
                        </p>
                    }  
                />
            </div>
        </section>
        <Footer/>
        </>
    )
}
