import "./style/notification_menu.sass"


export function NotificationMenu({wsRef}){
    return(
        <menu className="notification-menu">  
        {/* // передать сюда ref */}
            <ul className="notification__list">
                <li className="notification__item">
                    <div className="notification__info">
                        <p className="notification__title">
                            Заявка в друзья
                        </p>
                        <p className="notification__text">
                            Робот_123
                        </p>
                    </div>
                    <div className="notification__action">
                        <svg className="notification__svg" 
                            onClick={() => wsRef.current.send(JSON.stringify({"operation": "FRIEND_REQUEST", "is_add": true}))}
                        >
                            <use xlinkHref="/static/main.svg#ok-svg"></use>    
                        </svg>
                        <svg className="notification__svg notification__svg_cancel"
                            onClick={() =>wsRef.current.send(JSON.stringify({"operation": "FRIEND_REQUEST", "is_add": false}))}
                        >
                            <use xlinkHref="/static/main.svg#cancel-svg"></use>    
                        </svg>
                    </div>
                </li>
            </ul>
        </menu>
    )
}