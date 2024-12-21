import { useState } from "react"
import { AxiosError } from "axios"

import { refreshToken } from "../../api/auth"


export const useFetch = ( callback ) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState([])

    const request = async (...args) => {
        try {
            setIsLoading(true)
            await callback(...args)
        } catch (e) {
            if ((e.response?.status === 401) && (window.location.pathname !== "/auth/login")){
                await refreshToken()
                await callback(...args)
            }
            else if (e.response?.status === 404) {
                window.location.pathname = window.location.pathname.split("/")[2]
            }
            else if (e?.code === AxiosError.ERR_NETWORK) {
                window.location.pathname = "/error"
            }
            else{
                console.log(e)
                setError(e)
            } 
        } finally {
            setIsLoading(false)
        }
    }

  return [request, isLoading, error]
}
