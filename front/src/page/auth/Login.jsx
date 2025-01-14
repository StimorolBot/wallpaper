import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Footer } from "../../components/footer/Footer"
import { Header } from "../../components/header/Header"

import cookies from "../../cookie"
import { api } from "../../api/config"
import { useFetch } from "../../components/hook/useFetch"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { Loader } from "../../components/loader/Loader"

import { InputEmail } from "../../components/ui/input/InputEmail"
import { InputPassword } from "../../components/ui/input/InputPassword"


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
        <div className="wrapper">
            <Header/>
            <main className="main main_flex">
                <h1 className="title-page">Форма входа</h1>
                <div className="container">
                { isLoading 
                    ?<Loader/>
                    :<form className="form__auth" onSubmit={handleSubmit(validForm)}>
                        <h3 className="form__title"> Вход </h3>
                        <div className="form-input__container">
                            <InputEmail register={register} errors={errors}/>
                            <InputPassword register={register} errors={errors}/>
                        </div>
                        <ul className="form__list">
                            <li className="form__item">
                                <Link className="form__link" to="/auth/reset-password">
                                    Восстановить пароль
                                </Link>
                            </li>
                            <li className="form__item">
                                <Link className="form__link" to="/auth/register">
                                    Зарегистрироваться
                                </Link>
                            </li>
                        </ul>
                        <div className="form__btn">
                            <BtnSend> Войти </BtnSend>
                        </div> 
                    </form>
                }
                </div>
                </main>
            <Footer/>
        </div>
    )
}
