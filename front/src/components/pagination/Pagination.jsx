import { useRef } from "react"

import { api } from "../../api/config"
import { Loader } from "../loader/Loader"
import { useFetch } from "../hook/useFetch"
import { useObserver } from "../hook/useObserver"
import { CreateImgList } from "../img/CreateImgList"


export function Pagination({path, itemList, setItemList, ...props}){

    const pageRef = useRef(1)    
    const pagesRef = useRef(1)

    const lastElementRef = useRef(null)
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(path, { params: { size: 20, page: pageRef.current, ...props["params"]}})
                .then((response) => {
                    setItemList([...itemList, ...response.data["items"]])
                    pageRef.current += 1
                    pagesRef.current = response.data["pages"]                    
                }
            )
        }
    )
    
    useObserver(isLoading, pageRef, pagesRef, request, lastElementRef, itemList)

    return(
        <>
        <CreateImgList
            imgList={itemList}
            setImgList={setItemList}
            lastElementRef={lastElementRef}
        />
        {isLoading && <Loader/> }
        </>                        
    )
}
