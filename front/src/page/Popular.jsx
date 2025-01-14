import { useState} from "react"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"
import { CustomSelect } from "../components/ui/input/CustomSelect"


export function Popular() {
    const [time, setTime] = useState({value: "DAY", label: "День"})
    const [imgList, setImgList] = useState([])
    
    const options = [
        {value: "HOUR", label: "Час"},
        {value: "DAY", label: "День"},
        {value: "WEEK", label: "Неделю"},
        {value: "MONTH", label: "Месяц"},
        {value: "YEAR", label: "Год"},
        {value: "ALL", label: "Все время"}
    ]

    const emptyImgListMsg = (time) => {
        if (time === "неделю")
            return `За последнюю ${time} нет новый публикаций :(`
        return `За последний ${time} нет новый публикаций :(`
    }
    
    return(
        <div className="wrapper">
            <Header/>
            <main className="main">
                <h1 className="title-page">Популярное</h1>
                <div className="container">
                    <CustomSelect
                        value={time} setValue={setTime} options={options} placeholder={"Популярное за..."}  
                    />
                    <Pagination
                        path={"/popular"} itemList={imgList}
                        setItemList={setImgList} params={{"filter_time": time.value}}
                        emptyImgListMsg={emptyImgListMsg(time.label.toLowerCase())}
                    />
                </div>
            </main>
            <Footer/>
    </div>
  )
}
