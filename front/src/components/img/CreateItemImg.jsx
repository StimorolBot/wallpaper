import { Link } from "react-router-dom"

import { BtnDownload } from "../ui/btn/BtnDownload"
import { Reaction } from "../reaction/Reaction"

import "./style/create_item_img.sass"


export function CreateItemImg({item, index}){

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
        <li className="create-img__item" key={index}>
            {
                convertReaction(item)
            }
            <BtnDownload
                href={`data:image/jpeg;base64,${item["img_base64"]}`}
                name={item["uuid_img"]}
            />
            <Link className="create-img__link" to={`/wallpaper/${item["uuid_img"]}`}>
                <img 
                    className="create-img__img" 
                    alt="img-ai"
                    name={item["uuid_img"]}
                    loading="lazy"
                    src={"data:image/jpeg;base64," + item["img_base64"]}
                />
            </Link>
            <Reaction item={item}/>
        </li>
    )
}
