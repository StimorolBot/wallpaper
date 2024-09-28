import "./style/btn-download.sass"

export function BtnDownload({href, name}){
    return(
        <a className="btn-download" download={name} href={href}>
            Скачать
        </a>
    )
}
