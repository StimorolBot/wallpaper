import { Link } from "react-router-dom"

import { api } from "../../api/config"
import { useFetch } from "../hook/useFetch"
import { BtnDownload } from "../ui/btn/BtnDownload"

import "./style/create_img_list.sass"


export function CreateImgList({imgList, setImgList, lastElementRef}){

    const [setReaction, isLoading, error] = useFetch(
        async (event, reaction, item, index) => {
            event.preventDefault()

            if (imgList[index].reaction == reaction){
                imgList[index].reaction = null  
            }
            else{
                imgList[index].reaction = reaction
                
            }
            setImgList([...imgList])         
            await api.post("/set-reaction", {"reaction": reaction, "img_uuid": item.uuid_img})
        }
    )
        
    return(
        <div className="img__container">
            { imgList.map(
                (item, index) => {
                    return(
                        <div className="img__wrapper" key={item["uuid_img"]}>
                            <BtnDownload
                                href={"data:image/jpeg;base64," + item["img_base64"]}
                                name={item["uuid_img"]}
                            />
                            <Link className="img__link" to={`/wallpaper/${item["uuid_img"]}`}>
                                <img 
                                    className="img__item"
                                    alt="img-ai"
                                    name={item["uuid_img"]}
                                    loading="lazy"
                                    src={"data:image/jpeg;base64," + item["img_base64"]}
                                />
                            </Link>
                            <div className="reaction-img__hov">
                                <img 
                                    className={item.reaction == true ? "like like_active": "like"}
                                    src="/static/like.svg" alt="like"
                                    onClick={(event) => setReaction(event, true, item, index)}
                                />
                                
                                <img
                                    className={item.reaction == false ? "dislike dislike_active": "dislike"}
                                    src="/static/dislike.svg" alt="dislike"
                                    onClick={(event) => setReaction(event, false, item, index)}
                                />
                            </div>
                        </div>
                    )
                }
            )}
        <span ref={lastElementRef}></span>
        </div>
    )
}
