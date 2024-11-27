import { useEffect, useRef, useState } from "react"


export const useObserver = async (isLoading, request, lastElementRef, itemList, filter) => {
    const observerRef = useRef(null)
    const prevFilterState = useRef(undefined)
    
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        setTotalPage((state) => state = 1)
        setCurrentPage((state) => state = 1)

        if (isLoading)
            return
    
        if (observerRef.current)
            observerRef.current.disconnect()

        const callback = async (entries, observer) => {
            if (prevFilterState.current !== filter || entries[0].isIntersecting && currentPage <= totalPage){
                await request(currentPage, setCurrentPage, setTotalPage)
                prevFilterState.current = filter
            }
        }
        
        observerRef.current = new IntersectionObserver(callback)
        observerRef.current.observe(lastElementRef.current)
    }, [itemList.at(-1)?.img_base64, filter])
    
}
