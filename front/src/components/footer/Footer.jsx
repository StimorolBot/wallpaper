import "./style/footer.sass"

export function Footer(){
    return(
        <footer className="footer">
            <div className="wrapper">
                <div className="footer-info-_container">
                    <img className="footer-info__img" src="/static/github.svg" alt="github-icon" />
                    <a className="footer-info__link hover" href="https://github.com/StimorolBot/wallpaper">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
