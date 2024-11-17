import { AuthInput } from "./AuthInput"
import { useFetch } from "../../hook/useFetch"


export function CodeInput({authData, setAuthData}){
    
    const [getCode, isLoadingCode, errorCode] = useFetch(
        async (event) => {
            event.preventDefault()
            if (authData["email"] !== null){
                await api.post("/auth/get-code",
                    {"email_type": "CONFIRM", "email": authData["email"]},
                    {headers:{}}
                )
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    )

    return(
        <AuthInput
            id={"code-confirm-input"}
            lblTitle={"Код подтверждения"}
            type={"text"}
            minLength={6}
            maxLength={6}
            inputType={"code"}
            getCode={getCode}
            onChange={(event) => setAuthData({...authData, "code_confirm": event.target.value})}
        />
    )
}
