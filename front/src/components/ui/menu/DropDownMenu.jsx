import { useRef, useState } from "react"

import "./style/drop_down_menu.sass"


export function DropDownMenu({itemList, valueList, callback, title}){
    const clikRef = useRef(null)
    const [isShow, setIsShow] = useState(false)

    return(
        <div className="dropdown">
            <div className="dropdown-btn__container">
                <p className="dropdown-btn">
                    {title}
                </p>
                <img
                    className="dropdown-arrow"
                    src={isShow ? "/static/arrow-up.svg" : "/static/arrow-down.svg"} // анимаи
                    alt="arrow-down"
                    onClick={() => setIsShow((state) => !state)}
                />
            </div>
            
            <ul className={isShow ? "dropdown__container dropdown__container_active" : "dropdown__container"} ref={clikRef}>
                {itemList?.map((item, index) => {
                    return(
                        <li className="dropdown__item" key={index} onClick={(e) => collback(e, valueList[index])}>
                            {item}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
