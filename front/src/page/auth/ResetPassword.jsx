import { api } from "../../api"
import { useState } from "react"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { AuthInput } from "../../components/ui/input/AuthInput"
 

export function ResetPassword(){
    const [authData, setAuthData] = useState({"email": null})

    const resetPassword = async () => {

    }

    const emailConfirm = async (event) => {
        event.preventDefault()

        if (authData["email"] !== null){
            await api.post("/auth/get-code", {"email": authData["email"], email_type:"RESET"})
            .then((r) => {
                console.log(r.data)
            }).catch((r) => {console.log(r)})
        }
    }

    return(
        <section className="auth reset-password">
            <h2 className="hidden">
                Восстановление пароля
            </h2>
                <div className="wrapper">
                    <form className="auth__form auth__form_small" onSubmit={(event) => resetPassword(event)}>
                        <h2 className="auth-title">
                            Восстановление пароля
                        </h2>
                        <div className="auth-input__container">
                            <AuthInput
                                id="email-input"
                                lblTitle="Электронная почта"
                                type="email"
                                minLength={ 10 }
                                maxLength={ 40 }
                                onChange={(event) => setAuthData({...authData, "email": event.target.value})}
                            />
                            
                            <AuthInput
                                id="code-confirm-input"
                                lblTitle="Код подтверждения"
                                type="text"
                                minLength={ 6 }
                                maxLength={ 6 }
                                inputType={ "code" }
                                emailConfirm={ emailConfirm }
                                onChange={(event) => setAuthData({...authData, "code_confirm": event.target.value})}
                            />


                            <AuthInput
                                id="password-input"
                                lblTitle="Пароль"
                                inputType={"password"}
                                minLength={ 8 }
                                maxLength={ 32 }
                                onChange={(event) => setAuthData({...authData, "password": event.target.value})}
                            />
                        
                            <AuthInput
                                id="repeat-password-input"
                                lblTitle="Повторите пароль"
                                inputType={"password"}
                                minLength={ 8 }
                                maxLength={ 32 }
                            />
                        </div>
                        
                        <div className="auth-btn__container">
                                <BtnSend> Восстановить </BtnSend>
                        </div>                  
                    </form>
                </div>
        </section>
    )
}