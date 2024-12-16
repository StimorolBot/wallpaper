import { useRef } from "react"

import { api } from "../../api/config"
import { Loader } from "../loader/Loader"
import { useFetch } from "../hook/useFetch"
import { useObserver } from "../hook/useObserver"
import { CreateImgList } from "../img/CreateImgList"

import "./style.sass"


export function Pagination({path, itemList, setItemList, emptyListMsg, ...props}){

    const lastElementRef = useRef(null)
        
    const [request, isLoading, error] = useFetch(
        async (currentPage, setCurrentPage, setTotalPage) => {
            await api.get(path, { params: { size: 20, page: currentPage, ...props["params"]}})
                .then((response) => {
                    if (currentPage === 1){
                        setItemList((s) => s =[...response.data["items"]])
                    }
                    else{
                        setItemList([...itemList, ...response.data["items"]])
                    }    
                    setCurrentPage(currentPage + 1)
                    setTotalPage(response.data["pages"])                 
                }
            )
        }
    )

    useObserver(isLoading, request, lastElementRef, itemList, props["params"]?.filter_time)

    return(
        <>
        { itemList.length === 0 && isLoading == false &&
            <div className="empty-list">
                {emptyListMsg}
            </div>
        }
        <div className="img__container">
            <CreateImgList
                imgList={itemList}
                setImgList={setItemList}
                lastElementRef={lastElementRef}
            />
        </div>
        {isLoading && <Loader loaderMsg={"Пожалуйста подождите, идет загрузка..."}/>}
        </>                        
    )
}
