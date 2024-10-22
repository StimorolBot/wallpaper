import "./style/input-radio.sass"

export function InputRadio({id, name, text, ...props}){
    return(
        <div>
            <input className="radio-input" id={id} type="radio" name={name} {...props}/>
            <label className="radio-lbl" htmlFor={id}>{text}</label>
        </div>
    )
}