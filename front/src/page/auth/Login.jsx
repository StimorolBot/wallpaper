import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import cookies from "../../cookie"
import { api } from "../../api/config"
import { BtnSend } from "../../components/ui/btn/BtnSend"
import { AuthInput } from "../../components/ui/input/AuthInput"


export function Login(){
    const navigate = useNavigate()
    const [authData, setAuthData] = useState({"email": null, "password" : null})
   
    const login = async (event) => {
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
            .catch((error) => {
                console.log(error)
            }
        )
    }
        
    return (
        <section className="auth login">
            <h2 className="hidden">
                Форма для входа
            </h2>
            <form className="auth__form" onSubmit={(event) => login(event)}>
                <h2 className="auth-title">
                    Вход
                </h2>

                <div className="auth-input__container">
                    <AuthInput
                        id="email"
                        lblTitle="Почта"
                        type="email"
                        onChange={(event) => setAuthData({...authData, "email": event.target.value})}
                    />

                    <AuthInput
                        id="password"
                        lblTitle="Пароль"
                        inputType={"password"}
                        onChange={(event) => setAuthData({...authData, "password": event.target.value})}
                        />
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

                <div className="auth-btn__container">
                    <BtnSend> Войти </BtnSend>
                </div>               
            </form>
        </section>         
    )
}
