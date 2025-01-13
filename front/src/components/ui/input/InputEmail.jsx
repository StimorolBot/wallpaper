import { InputBase } from "./InputBase"

export function InputEmail({register, errors}) {
    return(
        <InputBase id="email" type="email" lblText={"Email"} maxLength={24} minLength={8}
            register={register("email", {
                minLength: {value: 8, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 24, message: "Длинна поля должна быть до 24 символов"},
                pattern: {value: /(^[a-zA-Z0-9_-]+@[mail|gmail|]+\.[ru|com]+)/, message: "Неверный формат почты"}
            })} errorMsg={<p className="input__error-msg">{errors?.email?.message}</p>}
        />
    )
}
