import { useRef, useState } from "react"
import { useClickOutside } from "../../hook/useClickOutside"

import "./style/drop_down_menu.sass"


export function DropDownMenu({itemList, setFilterTime, title}){
    const clikRef = useRef(null)
    const [isShow, setIsShow] = useState(false)

    useClickOutside(clikRef, setIsShow)

    return(
        <div className="dropdown" ref={clikRef}>
            <div className="dropdown-btn__container">
                <p className="dropdown-btn">
                    {title}
                </p>
                <img
                    className="dropdown-arrow"
                    src={isShow ? "/static/arrow-up.svg" : "/static/arrow-down.svg"}
                    alt="arrow-down"
                    onClick={() => setIsShow((state) => !state)}
                />
            </div>
            
            <ul className={
                isShow ? 
                    "dropdown__container dropdown__container_active"
                    : "dropdown__container"
                } 
                ref={clikRef}
            >
                {itemList?.map((item, index) => {
                    return(
                        <li
                            className="dropdown__item"
                            key={index}
                            value={item["en"]}
                            onClick={(e) => setFilterTime(e.target.getAttribute("value"))}
                        >
                            {item["ru"]}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
