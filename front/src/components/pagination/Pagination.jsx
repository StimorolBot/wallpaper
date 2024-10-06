import { api, refreshToken } from "../../api"
import { Loader } from "../loader/Loader"
import { useFetch } from "../hook/useFetch"
import { useEffect, useRef, useState } from "react"
import { CreateImgList } from "../img/CreateImgList"


export function Pagination({path, itemList, setItemList, ...props}){

    const page = useRef(1)    
    const pages = useRef(1)

    const observerRef = useRef(null)
    const lastElementRef = useRef(null)
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(path, { params: { size: 20, page: page.current, ...props["params"]}})
                .then((response) => {
                    setItemList([...itemList, ...response.data["items"]])
                    page.current += 1
                    pages.current = response.data["pages"]                    
                }
            )
        }
    )

    if (error){
        if (error.status === 400)
            refreshToken() // перенести в api
    }
    
    useEffect( () => {(
         async () => {
            if (isLoading)
                return

            if (observerRef.current)
                observerRef.current.disconnect()

            const callback = async (entries, observer) => {
                if (entries[0].isIntersecting && page.current <= pages.current){
                    console.log("Загрузка страницы")
                    await request()
                }
            }
            
            observerRef.current = new IntersectionObserver(callback)
            observerRef.current.observe(lastElementRef.current)
    
        })()
    }, [itemList])

    return(
        <>
        <CreateImgList
            imgList={itemList}
            setImgList={setItemList}
            isLoading={isLoading}
            myRef={lastElementRef}
        />
        {isLoading && <Loader/> }
        </>                        
    )
}
