import { useEffect, useRef, useState } from "react"


export const useObserver = async (isLoading, request, lastElementRef, itemList, time) => {
    const observerRef = useRef(null)
    const [prevTimeState, setPrevTimeState] = useState(null)

    const [page, setPage] = useState({"currentPage": 1, "totalPage": 1})

    useEffect(() => {
        setPage({"currentPage": 1, "totalPage": 1})
        
        if (isLoading)
            return
    
        if (observerRef.current)
            observerRef.current.disconnect()

        if (prevTimeState !== time){
            setPrevTimeState(time)
            setPage({"currentPage": 1, "totalPage": 1})
        }   

        const callback = async (entries, observer) => {
            if (prevTimeState !== time || entries[0].isIntersecting && page.currentPage < page.totalPage){
                await request(page, setPage)
                
                if (time === undefined){
                    setPage({...page, currentPage: page.currentPage + 1})
                }
                else if (time !== undefined && itemList.length > 0){
                    setPage({...page, currentPage: page.currentPage + 1})
                }
            }
        }

        observerRef.current = new IntersectionObserver(callback)
        observerRef.current.observe(lastElementRef.current)
    }, [itemList.at(-1)?.uuid_img, time])
    
}
