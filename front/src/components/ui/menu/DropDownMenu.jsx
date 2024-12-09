import { useRef, useState } from "react"
import { useClickOutside } from "../../hook/useClickOutside"

import "./style/drop_down_menu.sass"


export function DropDownMenu({itemList, setFilter, title}){
    const clickRef = useRef(null)
    const [isShow, setIsShow] = useState(false)

    useClickOutside(clickRef, setIsShow)

    const setValue = (e) => {
        setFilter({"front": e.target.innerHTML , "back": e.target.getAttribute("value")})
        setIsShow(false)
    }

    return(
        <div className="dropdown" ref={clickRef}>
            <div className="dropdown-btn__container"
                onClick={() => setIsShow((state) => !state)}
            >
                <p className="dropdown-btn">
                    {title}
                </p>
                <img
                    className="dropdown-arrow"
                    src={isShow ? "/static/arrow-up.svg" : "/static/arrow-down.svg"}
                    alt="arrow-down"        
                />
            </div>
            
            <ul className={
                isShow ? 
                    "dropdown__container dropdown__container_active"
                    : "dropdown__container"
                } 
                ref={clickRef}
            >
                {itemList?.map((item, index) => {
                    return(
                        <li
                            className="dropdown__item"
                            key={index}
                            value={item["back"]}
                            onClick={(e) => setValue(e)}
                        >
                            {item["front"]}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
