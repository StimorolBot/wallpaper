import "./style/btn-send.sass"


export function BtnSend({ children, ...props }) {
    return(
        <button className="btn-send" {...props}>
            { children }
        </button> 
    )
}