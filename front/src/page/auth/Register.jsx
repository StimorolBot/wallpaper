import { useState } from "react"
import { Link } from "react-router-dom"

import { BtnSend } from "../../components/ui/btn/BtnSend"
import { AuthInput } from "../../components/ui/input/AuthInput"


export function Register() {
    const [authData, setAuthData] = useState({
        user_name: null,
        email: null,
        password: null,
    })
    
    const register = async (event) => {
        event.preventDefault();
    }

    return (
        <section className="auth register">
            <h2 className="hidden">Форма для регистраии</h2>
            <div className="wrapper">
                <form
                    className="auth__form auth__form_big"
                    onSubmit={(event) => register(event)}
                >
                    <h2 className="auth-title">Регистрация</h2>
                    <div className="auth-input__container">
                        <AuthInput
                            id={"email-input"}
                            lblTitle={"Электронная почта"}
                            type={"email"}
                            onChange={(event) =>
                                setAuthData({ ...authData, user_name: event.target.value })
                            }
                        />
                        <AuthInput
                            id={"username-input"}
                            lblTitle={"Имя пользователя"}
                            onChange={(event) =>
                                setAuthData({ ...authData, email: event.target.value })
                            }
                        />

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
                
                <div className="userManual">
                    <input
                        className="userManual-input"
                        type="checkbox"
                        id="userManual-input"
                        required
                    />
                    <label className="userManual-checkbox" htmlFor="userManual-input">
                        Мною прочитаны и приняты
                        <Link className="auth__link" to="#">
                            {" "}
                            Пользовательское соглашение{" "}
                        </Link>
                        и
                        <Link className="auth__link" to="#">
                            {" "}
                            Политика конфиденциальности{" "}
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
      </div>
    </section>
  )
}
