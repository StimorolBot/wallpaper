import { useEffect, useRef } from "react"


export const useObserver = async (
    isLoading, pageRef,
    pagesRef, request,
    lastElementRef, itemList
) => {
    const observerRef = useRef(null)

    useEffect(() => {
        if (isLoading)
            return
    
        if (observerRef.current)
            observerRef.current.disconnect()
    
        const callback = async (entries, observer) => {
            if (entries[0].isIntersecting && pageRef.current <= pagesRef.current){
                await request()
            }
        }
    
        observerRef.current = new IntersectionObserver(callback)
        observerRef.current.observe(lastElementRef.current)
        
    }, [itemList])
    
}
