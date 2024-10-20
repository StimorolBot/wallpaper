import { useState } from "react"
import { Link } from "react-router-dom"

import { api } from "../../api/config"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { useFetch } from "../../components/hook/useFetch"
import { AuthInput } from "../../components/ui/input/AuthInput"
import { CodeInput } from "../../components/ui/input/CodeInput"

export function Register() {
    const [authData, setAuthData] = useState({
        user_name: null,
        email: null,
        password: null,
        code_confirm: null
    })

    const [sendData, isLoadingDat, errorData] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/auth/register", authData)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    )
    
    return (
        <section className="auth register">
            <h2 className="hidden">Форма для регистраии</h2>
            <form
                className="auth__form auth__form_big"
                onSubmit={(event) => sendData(event)}
            >
                <h2 className="auth-title">Регистрация</h2>
                <div className="auth-input__container">
                    <AuthInput
                        id={"username-input"}
                        type={"text"}
                        lblTitle={"Имя пользователя"}
                        onChange={(event) =>
                            setAuthData({ ...authData, user_name: event.target.value })
                        }
                    />
                    <AuthInput
                        id={"email-input"}
                        lblTitle={"Электронная почта"}
                        type={"email"}
                        onChange={(event) =>
                            setAuthData({ ...authData, email: event.target.value })
                        }
                    />
                    <CodeInput authData={authData}/>
                    <AuthInput
                        id={"password"}
                        lblTitle={"Пароль"}
                        inputType={"password"}
                        onChange={(event) =>
                            setAuthData({ ...authData, password: event.target.value })
                        }
                    />
                    <AuthInput
                        id="repeat-password"
                        lblTitle="Повторите пароль"
                        inputType={"password"}
                />
            </div>
                
            <div className="user-manual">
                <input
                    className="user-manual-input"
                    type="checkbox"
                    id="user-manual-input"
                    required
                />
                <label className="user-manual-lbl" htmlFor="user-manual-input">
                    {"Мною прочитаны и приняты "}
                    <Link className="auth__user-manual-link" to="#">
                        {"Пользовательское соглашение "}
                    </Link>
                    и
                    <Link className="auth__user-manual-link" to="#">
                        {" Политика конфиденциальности"}
                    </Link>
                </label>
            </div>            
            <div className="auth-btn__container">
                <BtnSend> Регистрация </BtnSend>
            </div>

            <div className="auth__login">
                <Link className="auth__link" to="/auth/login">
                Уже есть учетная запись?
                </Link>
            </div>
        </form>
    </section>
  )
}
