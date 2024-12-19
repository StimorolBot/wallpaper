import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { api } from "../../api/config"
import { Loader } from "../../components/loader/Loader"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { useFetch } from "../../components/hook/useFetch"

import { CodeInput } from "../../components/ui/input/CodeInput"
import { EmailInput } from "../../components/ui/input/auth/EmailInput"
import { CheckboxInput } from "../../components/ui/input/CheckboxInput"
import { UserNameInput } from "../../components/ui/input/auth/UserNameInput"
import { PasswordInput } from "../../components/ui/input/auth/PasswordInput"


export function Register() {
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}, resetField, setError} = useForm({mode: "onChange"})

    const [request, isLoading, error] = useFetch(
        async (event, authData) => {
            event.preventDefault()
            await api.post("/auth/register", authData)
            .then((response) => {
                navigate("/auth/login")
            })
        }
    )

    const validForm = async (data, event) => {
        if (data.password !== data.password_repeat){
            setError("password", { type: "custom", message: "Пароли не совпадают" })
            setError("password_repeat", { type: "custom", message: "Пароли не совпадают" })
        }
        else if (data.password === data.password_repeat ){
            await request(event, data)
            resetField("code_confirm")
        }
    }
 
    return (
        <section className="auth register">
            <h2 className="hidden">Форма для регистрации</h2>
            { isLoading
                ? <Loader />
                : <form className="auth__form auth__form_big" onSubmit={handleSubmit(validForm)}>
                    <h2 className="auth-title">Регистрация</h2>
                    <div className="auth-input__container">
                        <UserNameInput register={register} errors={errors}/>
                        <EmailInput register={register} errors={errors}/>                             
                        <CodeInput register={register} errors={errors} emailType={"CONFIRM"} handleSubmit={handleSubmit}/>
                        <PasswordInput register={register} errors={errors}/>
                        <PasswordInput register={register} errors={errors} 
                            lblTitle="Повторите пароль" id={"password_repeat"}
                        />
                    </div>
                    <CheckboxInput>
                        {"Мною приняты: "}
                        <Link className="auth__user-manual-link" to="#">
                            {" пользовательское соглашение "}
                        </Link>
                        и
                        <Link className="auth__user-manual-link" to="#">
                            {" политика конфиденциальности"}
                        </Link>
                    </CheckboxInput>
                    <div className="auth-btn__container">
                        <BtnSend> Зарегистрироваться </BtnSend>
                    </div>
                    <Link className="auth__link" to="/auth/login">
                        Уже есть учетная запись?
                    </Link>
                </form>
            }
        </section>
    )
}
