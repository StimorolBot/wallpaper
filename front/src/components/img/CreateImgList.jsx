import { Link } from "react-router-dom"

import { BtnDownload } from "../ui/btn/BtnDownload"
import { ReactionMenu } from "../ui/menu/ReactionMenu"

import "./style/create_img_list.sass"


export function CreateImgList({imgList, setImgList, lastElementRef, flag=true}){
    const convertReaction = (item) => {
        if (item.is_like === 1){
            item.reaction = true
            delete item.is_like
        }
        else if (item.is_dislike === 1){
            item.reaction = false
            delete item.is_dislike
        }            
    }

    return(
        <>
        { imgList?.map((item, index) => {
            return(
                <div className="img__wrapper" key={index}>
                    {convertReaction(item)}
                    <BtnDownload
                        href={`data:image/jpeg;base64,${item["img_base64"]}`}
                        name={item["uuid_img"]}
                    />
                    <Link className="img__link" to={`/wallpaper/${item["uuid_img"]}`}>
                        <img 
                            className={flag ? "img__item" : "img__item img__item_solo"}
                            alt="img-ai"
                            name={item["uuid_img"]}
                            loading="lazy"
                            src={"data:image/jpeg;base64," + item["img_base64"]}
                        />
                    </Link>
                    <ReactionMenu item={item}/> 
                </div>
            )})}
        { flag && <span className="last-element" ref={lastElementRef}></span> }
        </>
    )
}
