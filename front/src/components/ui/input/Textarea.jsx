import "./style/textarea.sass"


export function Textarea({placeholder, ...props}){
    return(
        <textarea className="prompt-textarea" placeholder={placeholder} required {...props}></textarea>
    )
}