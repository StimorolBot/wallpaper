import { api } from "../../../api/config"
import { AuthInput } from "./auth/AuthInput"
import { useFetch } from "../../hook/useFetch"
import { useState } from "react"

import "./style/code_input.sass"


export function CodeInput({register, errors, emailType, handleSubmit}){
    const [isSendCode, setIsSendCode] = useState(false)
    
    const [request, isLoading, error] = useFetch(
        async (event, data) => {
            event.preventDefault()
            setIsSendCode(true)
            setTimeout(() => { setIsSendCode(false) }, 40000)
            await api.post("/auth/get-code", {"email_type": emailType, "email": data})
        }
    )

    const validForm = async (data, event) => {
        if (data.email)
            await request(event, data.email)
    }

    return(
        <div className="code-input">
            <AuthInput id={"code"} lblTitle={"Код подтверждения"} errorMsg={errors?.code_confirm?.message}
                maxLength={6} isSendCode={isSendCode} onClick={handleSubmit(validForm)}
                register={register("code_confirm", {
                    minLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                    maxLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                    pattern: {value: /^[a-zA-Z0-9]*$/, message: "Некорректный код подтверждения"}
                }
            )}/>
            
        </div>        
    )
}
