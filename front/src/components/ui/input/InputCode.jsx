import { useState } from "react"

import { api } from "../../../api/config"
import { useFetch } from "../../hook/useFetch"
import { InputBase } from "./InputBase"


export function InputCode({register, errors, handleSubmit, setError, emailType="CONFIRM"}){
    const [isSendCode, setIsSendCode] = useState(false)
    
    const [request, isLoading, error] = useFetch(
        async (event, data) => {
            event.preventDefault()
            setIsSendCode(s => !s)
            setTimeout(() => { setIsSendCode(s => !s) }, 40000)
            await api.post("/auth/get-code", {"email_type": emailType, "email": data})
        }
    )

    const validForm = async (data, event) => {
        if (data.email)
            await request(event, data.email)
        else
            setError("code_confirm", { type: "custom", message: "Пожалуйста, укажите почту" })
    }

    return(
        <InputBase id={"code"} maxLength={6} minLength={6} lblText={"Код подтверждения"}
            register={register("code_confirm", {
                minLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                maxLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                pattern: {value: /^[a-zA-Z0-9]*$/, message: "Некорректный код подтверждения"}
            })} errorMsg={<p className="input__error-msg">{errors?.code_confirm?.message}</p>}
        >
            <svg className="input__svg" onClick={handleSubmit(validForm)}>
                { isSendCode
                    ? <use xlinkHref="/static/main.svg#ok-svg"></use>
                    : <use xlinkHref="/static/main.svg#enter-svg"></use>
                }
            </svg>
        </InputBase>
    )
}
