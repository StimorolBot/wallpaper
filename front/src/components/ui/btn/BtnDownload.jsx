import "./style/btn_download.sass"

export function BtnDownload({href, name}){
    return(
        <a className="btn-download" download={name} href={href}>
            <svg
                className="btn-download__img"
                xmlns="http://www.w3.org/2000/svg"
                width="32" height="32" viewBox="0 0 24 24"
            >
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
            </svg>
        </a>
    )
}
