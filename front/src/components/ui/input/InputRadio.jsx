import "./style/input_radio.sass"

export function InputRadio({id, name, children, ...props}){
    return(
        <div className="radio-input__container">
            <input className="radio-input" id={id} type="radio" name={name} {...props}/>
            <label className="radio-lbl" htmlFor={id}>{children}</label>
        </div>
    )
}