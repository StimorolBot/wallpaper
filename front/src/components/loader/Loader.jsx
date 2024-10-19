import "./style/loader.sass"

export function Loader(){
    return(
        <div className="loader">
            <img className="loader-img" src="/static/loader.svg" alt="loader" />
            <p className="loader-text">
                Пожалуйста подождите, идет загрузка...
            </p>
        </div>
    );
}