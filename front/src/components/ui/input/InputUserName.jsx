import { InputBase } from "./InputBase"


export function InputUserName({register, errors}){
    return(
        <InputBase
            id={"username-input"} lblText={"Имя"} maxLength={20} minLength={4}
                register={register("user_name", {
                    minLength: {value: 4, message: "Длинна поля должна быть от 4 символов"},
                    maxLength: {value: 20, message: "Длинна поля должна быть до 20 символов"},
                    pattern: {value: /^[a-zA-Z0-9_\-]+$/, message: "Неверный формат имени"}
                })}
                errorMsg={<p className="input__error-msg">{errors?.user_name?.message}</p>}
        />
    )
}
