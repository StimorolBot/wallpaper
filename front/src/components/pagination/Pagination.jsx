import { useContext, useRef } from "react"

import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"
import { useObserver } from "../hook/useObserver"
import { TagContext } from "../../context/tagContext"

import { CreateItemImg } from "../img/CreateItemImg"
import { Loader } from "../loader/Loader"

import style from "./style.module.sass"


export function Pagination({path, itemList, setItemList, emptyImgListMsg=null, ...props}){
    const lastElementRef = useRef(null)
    const {tag, setTag} = useContext(TagContext)

    const [request, isLoading, error] = useFetch(
        async (page, setPage) => {
            await api.get(path, { params: { size: 20, page: page.currentPage, ...props["params"]}})
                .then((response) => {
                    if (page.currentPage === 1)
                        setItemList(response.data["items"])
                    else
                        setItemList([...itemList, ...response.data["items"]])
                    setPage({...page, totalPage: response.data["pages"]})
                }
            )
        }
    )
   
    useObserver(isLoading, request, lastElementRef, itemList, props["params"]?.filter_time)

    return(
        <>
        { isLoading == false && itemList.length === 0 &&  
            <div className={style.emptyImgListMsg}>{emptyImgListMsg}</div>
        }
        <ul className={style.createImg__list}>
            { itemList.filter(i => i.img_tag.join(" ").includes(tag)).map((item, index) => {
                return <CreateItemImg key={index} item={item}/>    
            })}
            <li ref={lastElementRef}></li>
        </ul>
        {isLoading && <Loader loaderMsg={"Пожалуйста подождите, идет загрузка..."}/>}        
    </>                        
    )
}
