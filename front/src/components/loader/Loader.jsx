import "./style/loader.sass"

export function Loader({loaderMsg=null}){
    return(
        <div className="loader">
            <img className="loader-img" src="/static/loader.svg" alt="loader" />
            <p className="loader-text">
                {loaderMsg}
            </p>
        </div>
    )
}