import { useState } from "react"
import "./style/checkbox_input.sass"


export function CheckboxInput({children}) {
    const [isChecked, setIsChecked] = useState(false)
    
    return (
        <div className="user-manual">
            <input
                type="checkbox"
                id="user-manual-input"
                required
            />
            <label
                className={isChecked ? "user-manual-lbl user-manual-lbl_checked" : "user-manual-lbl"}
                htmlFor="user-manual-input"
                onClick={() => setIsChecked(s => !s)}
            >
                {children}
            </label>
        </div>
    )
}
