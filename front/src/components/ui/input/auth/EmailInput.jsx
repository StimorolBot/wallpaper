import { AuthInput } from "./AuthInput"


export function EmailInput({register, errors}){
    return(
        <AuthInput id="email" lblTitle="Почта" errorMsg={errors?.email?.message} maxLength={24}
            register={register("email", {
                minLength: {value: 8, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 24, message: "Длинна поля должна быть до 24 символов"},
                pattern: {value: /(^[a-zA-Z0-9_-]+@[mail|gmail|]+\.[ru|com]+)/, message: "Неверный формат почты"}
            }
        )}/>
    )
}
