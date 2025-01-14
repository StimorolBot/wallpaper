import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { Footer } from "../../components/footer/Footer"
import { Header } from "../../components/header/Header"
import { InputEmail } from "../../components/ui/input/InputEmail"
import { InputCode } from "../../components/ui/input/InputCode"
import { InputPassword } from "../../components/ui/input/InputPassword"

import { api } from "../../api/config"
import { useFetch } from "../../components/hook/useFetch"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { Loader } from "../../components/loader/Loader"


export function ResetPassword(){
    const navigate = useNavigate("")
    const {register, handleSubmit, formState: {errors}, resetField, setError} = useForm({mode: "onChange"})

    const [request, isLoading, error] = useFetch(
        async (event, authData) => {
            event.preventDefault()
            await api.post("/auth/reset-password", authData)
            navigate("/auth/login")
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

    return(
        <div className="wrapper">
            <Header/>
            <main className="main main_flex">
                <h1 className="title-page">Форма для восстановление пароля</h1>
                <div className="container">
                    {isLoading
                        ?<Loader/>
                        :<form className="form__auth" onSubmit={handleSubmit(validForm)}>
                            <h3 className="form__title"> Восстановление пароля </h3>
                            <div className="form-input__container">
                                <InputEmail register={register} errors={errors}/>
                                <InputCode register={register} errors={errors} emailType={"RESET"} handleSubmit={handleSubmit}/>
                                <InputPassword register={register} errors={errors}/>
                                <InputPassword register={register} errors={errors} lblText="Повторите пароль" id={"password_repeat"}/>
                            </div>
                            <div className="form__btn">
                                <BtnSend> Восстановить </BtnSend>
                            </div>
                        </form>
                    }
                </div>
            </main>
            <Footer/>
        </div>
    )
}
