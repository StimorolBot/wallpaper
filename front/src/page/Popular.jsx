import api from "../api"
import { useEffect, useState } from "react"
import { Header } from "/src/components/header/Header"


import "./style/popular.sass"
import { DropDownMenu } from "../components/ui/menu/DropDownMenu"


export function Popular(){
    const [imgList, setImgList] = useState([])
    
    useEffect(() => {(
        async () => {
            await api.get("/popular").then((response) => {            
                setImgList([...response.data])
            }).catch((error) =>{
                console.log(error)
            })
        })()
    }, [])

    return(
        <>
        <Header/>
        <section className="popular">
            <h2 className="hidden">
                Популярное
            </h2>
            <div className="wrapper">
                <DropDownMenu/>
            </div>
        </section>
        </>  
    )
}
