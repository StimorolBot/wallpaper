import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import cookies from "../../cookie"
import { api } from "../../api/config"
import { useFetch } from "../../components/hook/useFetch"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { Loader } from "../../components/loader/Loader"

import { EmailInput } from "../../components/ui/input/auth/EmailInput"
import { PasswordInput } from "../../components/ui/input/auth/PasswordInput"


export function Login(){
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}, reset} = useForm({mode: "onChange"})

    const [request, isLoading, error] = useFetch(
        async (event, authData) => {
            event.preventDefault()
            await api.post("/auth/login", authData)
            .then((response) => {
                cookies.set(
                    "access_token", response.data["access_token"],
                    { maxAge: response.data["refresh_max_age"], path: "/" }
                )
                cookies.set(
                    "refresh_token", response.data["refresh_token"],
                    { maxAge: response.data["refresh_max_age"], path: "/auth" }
                )
                navigate("/")
            })
        }
    )
                 
    const validForm = async (data, event) => {
        await request(event, data)
        reset()
    }

    return (
        <section className="auth login">
            <h2 className="hidden">Форма для входа</h2>
            {isLoading
                ? <Loader/>
                : <form className="auth__form" onSubmit={handleSubmit(validForm)}>
                    <h2 className="auth-title"> Вход </h2>
                    <div className="auth-input__container">
                        <EmailInput register={register} errors={errors}/>
                        <PasswordInput register={register} errors={errors}/>  
                    </div>
                    <ul className="login__info">
                        <li className="auth__reset-password">
                            <Link className="auth__link" to="/auth/reset-password">
                                Восстановить пароль
                            </Link>
                        </li>
                        <li className="auth__register">
                            <Link className="auth__link" to="/auth/register">
                                Зарегистрироваться
                            </Link>
                        </li>
                    </ul>
                    <div className="auth-btn__container hover">
                        <BtnSend> Войти </BtnSend>
                    </div>               
                </form>
            }
        </section>         
    )
}
