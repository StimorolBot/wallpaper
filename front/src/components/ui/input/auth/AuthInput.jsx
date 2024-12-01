import { useState } from "react"

import "./../style/auth_input.sass"


export function AuthInput({id, lblTitle, register, maxLength, errorMsg=null, isSendCode=false, ...codeConfProps}){
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isActive, setIsActive] = useState(false)
    if (errorMsg)
        lblTitle = <p className="error-msg">{errorMsg}</p>

    return(
        <div className="auth-input__item">
            <input className={isActive ? "auth-input auth-input_active" : "auth-input"} maxLength={maxLength}
                id={id} type={isShowPassword ? "password" : "text"} autoComplete="off" required {...register}
            />
            <label
                className={isActive ? "auth-lbl auth-lbl_active" : "auth-lbl"}
                onClick={() => setIsActive(state => !state)}
                htmlFor={ id }
            >
                { lblTitle }
            </label>

            {(id === "password_repeat" || id === "password") &&
                <img
                    className={isActive ? "password-show password-show_active" : "password-show"} 
                    src={isShowPassword ? "/static/psd-hidden.svg" : "/static/psd-show.svg"} 
                    alt="password-show"
                    onClick={() => setIsShowPassword((state) => !state)}                        
                />
            }

            {id === "code" &&
                <img className={isActive ? "code-input-img code-input-img_active" : "code-input-img"}
                    src={isSendCode ? "/static/ok.svg" : "/static/enter.svg"} 
                    alt="enter" title="Отправить код подтверждения на почту"
                    {...codeConfProps}
                />
            }
        </div>
    )
}
