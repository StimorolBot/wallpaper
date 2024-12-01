import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { api } from "../../api/config"
import { useFetch } from "../../components/hook/useFetch"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { Loader } from "../../components/loader/Loader"

import { CodeInput } from "../../components/ui/input/CodeInput"
import { EmailInput } from "../../components/ui/input/auth/EmailInput"
import { PasswordInput } from "../../components/ui/input/auth/PasswordInput"


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
        <section className="auth reset-password">
            <h2 className="hidden">Восстановление пароля</h2>
            <div className="wrapper">
                { isLoading
                    ? <Loader/>
                    : <form className="auth__form auth__form_small" onSubmit={handleSubmit(validForm)}>
                        <h2 className="auth-title"> Восстановление пароля </h2>
                        <div className="auth-input__container">
                            <EmailInput register={register} errors={errors}/>
                            <CodeInput register={register} errors={errors} emailType={"RESET"} handleSubmit={handleSubmit}/>
                            <PasswordInput register={register} errors={errors}/>
                            <PasswordInput register={register} errors={errors} 
                                lblTitle="Повторите пароль" id={"password_repeat"}
                            />                        
                        </div>    
                        <div className="auth-btn__container hover">
                            <BtnSend> Восстановить </BtnSend>
                        </div>                  
                    </form>
                }
            </div>
        </section>
    )
}
