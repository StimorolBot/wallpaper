import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { api } from "../../api/config"
import { Loader } from "../../components/loader/Loader"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { useFetch } from "../../components/hook/useFetch"
import { AuthInput } from "../../components/ui/input/AuthInput"
import { CodeInput } from "../../components/ui/input/CodeInput"
import { CheckboxInput } from "../../components/ui/input/CheckboxInput"


export function Register() {
    const navigate = useNavigate()
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
                navigate("/auth/login")
            })
        }
    )
 
    return (
        <section className="auth register">
            <h2 className="hidden">Форма для регистрации</h2>
            { isLoadingDat
                ? <Loader />
                : <form className="auth__form auth__form_big" onSubmit={(event) => sendData(event)}>
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
                        <CodeInput authData={authData} setAuthData={setAuthData} emailType={"CONFIRM"}/>
                        <AuthInput
                            id={"password"}
                            lblTitle={"Пароль"}
                            inputType={"password"}
                            minLength={8}
                            onChange={(event) =>
                                setAuthData({ ...authData, password: event.target.value })
                            }
                        />
                        <AuthInput
                            id="repeat-password"
                            lblTitle="Повторите пароль"
                            inputType={"password"}
                            minLength={8}
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
                    <div className="auth-btn__container hover">
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
