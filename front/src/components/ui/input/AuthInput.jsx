import { useState } from "react"

import "./style/auth_input.sass"


export function AuthInput({id, lblTitle, inputType, getCode, ...props}){
    const [isShow, setIsShow] = useState(false)
    const [isActive, setIsActive] = useState(false)

    return(
        <div className="auth-input__item">
            <input className={isActive ? "auth-input auth-input_active" : "auth-input"}
                id={ id }
                autoComplete="off"
                type={isShow === false ? "password" : "text"}
                required
                { ...props }
            />

            {
                inputType == "password" &&
                    <img
                        className={isActive === true ? "password-show password-show_active" : "password-show"} 
                        src={isShow === false ? "/static/psd-show.svg" : "/static/psd-hidden.svg"} 
                        alt="password-show"
                        onClick={() => setIsShow((state) => !state)}                        
                    />
            }

            {
                inputType == "code" &&
                    <img
                        className={isActive === true ? "code-input-img code-input-img_active" : "code-input-img"}
                        src="/static/enter.svg" 
                        alt="enter"
                        onClick={(event) => getCode(event)}
                        title="Отправить код подтверждения на почту"
                    />
            }

            <label
                className={isActive ? "auth-lbl auth-lbl_active" : "auth-lbl"}
                onClick={() => setIsActive(state => !state)}
                htmlFor={ id }
            >
                { lblTitle }
            </label>
        </div>
    )
}