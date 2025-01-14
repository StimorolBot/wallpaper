import "./style/input_checkbox.sass"


export function InputCheckbox({children}) {
    
    return (
        <div className="checkbox__container">
            <input type="checkbox" id="checkbox" required />
            <label className="checkbox-lbl" htmlFor="checkbox">   
                {children}
            </label>
        </div>
    )
}
