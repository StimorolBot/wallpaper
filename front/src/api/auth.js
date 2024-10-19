import { api } from "./config"
import cookies from "../cookie"


export const refreshToken = async () => {
    await api.post("/auth/jwt/refresh")
        .then((response) => {
            cookies.set(
                "access_token", response.data["access_token"],
                { maxAge: response.data["refresh_max_age"], path: "/" }
            )
        })
        .catch((error) => {
            if (error.response.status === 401){
                window.location.pathname = "auth/login"
            }
        })
}
