import { useContext } from "react"
import { TagContext } from "../../context/tagContext"
import { CreateItemImg } from "./CreateItemImg"


export function IsFilterImg({imgList, lastElementRef, isFilter=true}){
    const {tag, setTag} = useContext(TagContext)
    return(
        <>
        {isFilter
            ? imgList.filter(i => i.img_tag.join(" ").includes(tag)).map((item, index) => {
                return <CreateItemImg key={index} item={item}/>    
            })
            : imgList.map((item, index) => {
                return <CreateItemImg key={index} item={item}/>
            })
        }
        {isFilter && <span className="last-element" ref={lastElementRef}></span>}
        </>
    )
}