import Select from "react-select"
import "./style/custom_select.sass"


export function CustomSelect({value, setValue, options, isMulti=false, ...props}){    
    const getValue = () => {
        if (value){
            return isMulti 
                ? options.filter(v => value.indexOf(v.value) >= 0) 
                : options.find(v => v.value == value)
        }
        else
            return isMulti ? [] : ""
    }

    const onChange = (newValue) => {
        setValue(isMulti ? newValue.map(v => v.value) : newValue)
    }

    return(
        <Select
            classNamePrefix={isMulti ? "custom-select_multi": "custom-select"}
            value={getValue()} onChange={onChange} options={options}
            isMulti={isMulti}
            {...props}
        />
    )
}
