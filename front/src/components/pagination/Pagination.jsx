import { useRef } from "react"

import { api } from "../../api/config"
import { Loader } from "../loader/Loader"
import { useFetch } from "../hook/useFetch"
import { useObserver } from "../hook/useObserver"
import { IsFilterImg } from "../img/isFilterImg"

import "./style.sass"


export function Pagination({path, itemList, setItemList, emptyListMsg, ...props}){

    const lastElementRef = useRef(null)
        
    const [request, isLoading, error] = useFetch(
        async (page, setPage) => {
            await api.get(path, { params: { size: 20, page: page.currentPage, ...props["params"]}})
                .then((response) => {
                    if (page.currentPage === 1)
                        setItemList(response.data["items"])
                    else{
                        setItemList([...itemList, ...response.data["items"]])
                    }
                    setPage({...page, totalPage: response.data["pages"]})
                }
            )
        }
    )

    useObserver(isLoading, request, lastElementRef, itemList, props["params"]?.filter_time)

    return(
        <>
        { itemList.length === 0 && isLoading == false && 
            <div className="empty-list">{emptyListMsg}</div>
        }
        <div className="img__container">
            <IsFilterImg imgList={itemList} lastElementRef={lastElementRef}/>
        </div>
        {isLoading && <Loader loaderMsg={"Пожалуйста подождите, идет загрузка..."}/>}
        </>                        
    )
}
