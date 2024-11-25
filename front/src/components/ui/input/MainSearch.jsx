import "./style/main_search.sass"

export function MainSearch() {
    return(        
        <div className="search-input__container">
            <input className="search-input" type="search" placeholder="Поиск" />
            <img className="search-input__img" src="/static/search.svg" alt="search" />
        </div>
    )
}