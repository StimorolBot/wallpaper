import axios from "axios"
import cookies from "./cookie"


const api = axios.create({baseURL:"http://localhost:8000", 
    withCredentials: true,
    crossDomain: true
})

const refreshToken = async () => {
    await api.post("/auth/jwt/refresh")
        .then((response) => {
            console.log(response.data)
            cookies.set(
                "access_token", response.data["access_token"],
                { maxAge: response.data["refresh_max_age"], path: "/" }
            )
        })
        .catch((error) => {
            console.log(error)
        })
    }

export {api, refreshToken}