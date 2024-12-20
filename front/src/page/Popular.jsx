import { useState} from "react"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Pagination } from "../components/pagination/Pagination"
import { CustomSelect } from "../components/ui/select/CustomSelect"


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

    const createEmptyMsg = (time) => {
        if (time === "неделю")
            return `За последнюю ${time} нет новый публикаций :(`
        return `За последний ${time} нет новый публикаций :(`
    }

    return(
        <>
        <Header/>
        <section className="popular flex">
            <h2 className="hidden">Популярное</h2>
            <div className="wrapper">                
                <CustomSelect
                    value={time} setValue={setTime} options={options}
                    placeholder={"Популярное за..."} isSearchable={false}
                />
                <Pagination
                    itemList={imgList}
                    setItemList={setImgList}
                    path={"/popular"}
                    params={{"filter_time": time.value}}
                    emptyListMsg={createEmptyMsg(time.label.toLowerCase())}
                />
            </div>
        </section>
        <Footer/>
    </>
  )
}
