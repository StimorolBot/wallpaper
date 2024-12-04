import "./style/btn_download.sass"

export function BtnDownload({href, name}){
    return(
        <a className="btn-download" download={name} href={href}>
            <img className="btn-download__img" src="/static/download.svg" alt="download" />
        </a>
    )
}
