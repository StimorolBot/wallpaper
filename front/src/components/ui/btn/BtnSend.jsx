import "./style/btn_send.sass"


export function BtnSend({ children, ...props }) {
    return(
        <button className="btn-send hover" {...props}>
            { children }
        </button> 
    )
}