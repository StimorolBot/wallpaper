import { useState } from "react"
import { InputBase } from "./InputBase"


export function InputPassword({register, errors, id="password", lblText="Пароль"}){
    const [isShowPassword, setIsShowPassword] = useState(true)

    return(
        <InputBase id={id} type={isShowPassword ? "password" : "text"} maxLength={32} minLength={8} lblText={lblText} 
            register={ register(id, {
                minLength: {value: 8, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 32, message: "Длинна поля должна быть до 32 символов"},
                pattern: {value: /^([A-Z]\w*)(\d*)$/, message: "Неверный формат пароля"}
            })}
            errorMsg={<p className="input__error-msg">{errors?.[id]?.message}</p>}
        >
            <svg className="input__svg" onClick={() => setIsShowPassword(state => !state)}>
                {
                    isShowPassword
                    ? <use xlinkHref="/static/main.svg#show-psd"></use>
                    : <use xlinkHref="/static/main.svg#hidden-psd"></use>
                }
            </svg>
        </InputBase>
    )
}
