import "./style/loader.sass"

export function Loader({align = true}){
    return(
        <div className={align ? "loader loader_align" : "loader"}>
            <img className="loader-img" src="/static/loader.svg" alt="loader" />
            <p className="loader-text">
                Пожалуйста подождите, идет загрузка...
            </p>
        </div>
    );
}