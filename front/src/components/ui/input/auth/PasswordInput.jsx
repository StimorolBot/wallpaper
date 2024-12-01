import { AuthInput } from "./AuthInput"


export function PasswordInput({register, errors, lblTitle="Пароль", id="password"}) {
    return(
        <AuthInput id={id} lblTitle={lblTitle} errorMsg={errors?.[id]?.message} maxLength={32}
            register={ register(id, {
                minLength: {value: 8, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 32, message: "Длинна поля должна быть до 32 символов"},
                pattern: {value: /^([A-Z]\w*)(\d*)$/, message: "Неверный формат пароля"}
            }
        )}/>
    )
}
