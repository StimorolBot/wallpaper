import { useEffect, useRef, useState } from "react"


export const useObserver = async (isLoading, request, lastElementRef, itemList, time) => {
    const observerRef = useRef(null)
    let [prevTimeState, setPrevTimeState] = useState("DAY")

    const [page, setPage] = useState({"currentPage": 1, "totalPage": 1})

    useEffect(() => {
        setPage({"currentPage": 1, "totalPage": 1})
        
        if (isLoading)
            return
    
        if (observerRef.current)
            observerRef.current.disconnect()
        
        if (prevTimeState !== time)
            setPage({"currentPage": 1, "totalPage": 1})
        else
            setPage({...page, currentPage: page.currentPage + 1})

        const callback = async (entries, observer) => {
            if ((itemList.length === 0) || ((entries[0].isIntersecting) || (page.currentPage <= page.totalPage))){
                await request(page, setPage)
                setPrevTimeState(time)
            }
        }

        observerRef.current = new IntersectionObserver(callback)
        observerRef.current.observe(lastElementRef.current)
    }, [itemList.at(-1)?.img_base64, time])
    
}
