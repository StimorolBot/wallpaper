import { useState } from "react"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"
import { DropDownMenu } from "../components/ui/menu/DropDownMenu"


export function Popular() {
    const [filterTime, setFilterTime] = useState("DAY")
    const [imgList, setImgList] = useState([])
    
    return(
        <>
        <Header/>
        <section className="popular flex">
            <h2 className="hidden">Популярное</h2>
            <div className="wrapper">                
                <DropDownMenu
                    title={"Популярное за..."}
                    setFilter={setFilterTime}
                    itemList={[
                        {"front": "Час", "back": "HOUR"},
                        {"front": "День", "back": "DAY"},
                        {"front": "Неделю", "back": "WEEK"},
                        {"front": "Месяц", "back": "MONTH"},
                        {"front": "Год", "back": "YEAR"},
                        {"front": "Все время", "back": "ALL"}
                    ]}
                />
                <Pagination
                    itemList={imgList}
                    setItemList={setImgList}
                    path={"/popular"}
                    params={{"filter_time": filterTime}}
                />
            </div>
        </section>
        <Footer/>
    </>
  )
}
