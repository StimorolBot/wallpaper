import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Header } from "../../components/header/Header"
import { Footer } from "../../components/footer/Footer"

import { InputUserName } from "../../components/ui/input/InputUserName"
import { InputEmail } from "../../components/ui/input/InputEmail"
import { InputPassword } from "../../components/ui/input/InputPassword"
import { InputCode } from "../../components/ui/input/InputCode"
import { InputCheckbox } from "../../components/ui/input/InputCheckbox"

import { BtnSend } from "../../components/ui/btn/BtnSend"

import { api } from "../../api/config"
import { Loader } from "../../components/loader/Loader"
import { useFetch } from "../../components/hook/useFetch"


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
        <div className="wrapper">
            <Header/>
            <main className="main main_flex">
                <h1 className="title-page">Форма регистрации</h1>
                <div className="container">
                    {isLoading
                        ? <Loader/>
                        :<form className="form__auth" onSubmit={handleSubmit(validForm)}>
                            <h3 className="form__title">Регистрация</h3>
                            <div className="form-input__container">
                                <InputUserName register={register} errors={errors}/>
                                <InputEmail register={register} errors={errors}/>
                                <InputCode register={register} errors={errors} handleSubmit={handleSubmit} setError={setError}/>
                                <InputPassword register={register} errors={errors}/>
                                <InputPassword id={"password_repeat"} lblText={"Повторите пароль"} register={register} errors={errors}/>
                            </div>
                            <InputCheckbox>
                                Мною приняты:
                                <Link className="form__manual-link" to="#"> пользовательское соглашение </Link>
                                и
                                <Link className="form__manual-link" to="#"> политика конфиденциальности</Link>
                            </InputCheckbox>
                            <div className="form__btn">
                                <BtnSend type="submit"> Зарегистрироваться </BtnSend>
                            </div>
                            <Link className="form__link" to="/auth/login">
                                Уже есть учетная запись?
                            </Link>
                        </form>
                    }
                </div>
            </main>
            <Footer/>
        </div>
    )
}
