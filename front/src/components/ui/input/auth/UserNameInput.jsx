import { AuthInput } from "./AuthInput"


export function UserNameInput({register, errors}){
    return(
        <AuthInput id={"username-input"} lblTitle={"Имя пользователя"} errorMsg={errors?.user_name?.message} maxLength={20} 
            register={ register("user_name", {
                minLength: {value: 4, message: "Длинна поля должна быть от 4 символов"},
                maxLength: {value: 20, message: "Длинна поля должна быть до 20 символов"},
                pattern: {value: /^[a-zA-Z0-9_\-]+$/, message: "Неверный формат имени"}
            }
        )}/>
    )
}
