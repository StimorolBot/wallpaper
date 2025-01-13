import "./style/btn_download.sass"


export function BtnDownload({href, name}){
    return(
        <a className="btn-download" download={name} href={href}>
            <svg>
                <use xlinkHref="/static/main.svg#download-btn"></use>    
            </svg> 
        </a>
    )
}
