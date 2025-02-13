import "./style/loader.sass"

export function Loader({loaderMsg=null}){
    return(
        <div className="loader">
            <svg className="loader-img">
                <use xlinkHref="/static/main.svg#loader-svg"></use>    
            </svg>
            <p className="loader-text">
                {loaderMsg}
            </p>
        </div>
    )
}