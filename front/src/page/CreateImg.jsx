import { api } from "../api"
import cookies from "../cookie"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "../components/header/Header"
import { BtnSend } from "../components/ui/btn/BtnSend"
import { Textarea } from "../components/ui/input/Textarea"
import { InputRadio } from "../components/ui/input/InputRadio"
import { InputRange } from "../components/ui/input/InputRange"
import { DropDownMenu } from "../components/ui/menu/DropDownMenu"

import "./style/create_img.sass"


export function CreateImg() {
    const navigate = useNavigate()
    const [img, setImg] = useState(null)
    const [isLoad, setIsLoad] = useState(true)
    const [imgParams, setImgParams] = useState({
        "prompt": "", "style": "DEFAULT", "width": 1024, "height": 1024
    })

    const createImg = async (event) => {
        event.preventDefault()
        setIsLoad((state) => !state)
        
        await api.post("/create", imgParams)
            .then((response) => {
                setImg(response.data)
            })
            .catch((error) => {
                console.log(error)
            }
        )

        setIsLoad((state) => !state )
    }

    const callback = (e, value) => {
        const [w, h] = value.split("x")
        setImgParams({...imgParams, width: w, height: h})
    }
    
    useEffect(() => {
        const token = cookies.get("access_token")
        if (token === undefined)
            navigate("/auth/login")
    },[])
    
    return(
        <>
        <Header/>
        <section className="img-create-section">
            <h2 className="hidden">
                Генерация изображения
            </h2>
            <div className="wrapper">
                <div className="img-create__container">
                    {img === null || isLoad === false 
                        ? <div className={
                            isLoad === false 
                                ? "img-wait__container img-wait__container_active"
                                : "img-wait__container"
                            }
                            >
                            <img className="gear-load" src="/static/gear.svg" alt="gear-load"/>
                            <p className="img-wait">
                                Пожалуйста, подождите, это может занять некоторое время...
                            </p>
                        </div>
                        :<div className="img-container">
                            <img className="img-create" src={"data:image/jpeg;base64," + img} alt="img-ai" />
                        </div>
                    }
                    
                    <form className={
                            img !== null || isLoad === false  
                                ? "form__create-img form__create-img_active"
                                : "form__create-img"
                            }
                            onSubmit={(event)=> createImg(event)}
                        >
                        <div className="checkbox-style__container">
                            <InputRadio id="style-default" name="style-img"
                                onChange={()=> setImgParams({...imgParams, style:"DEFAULT"})}
                            >
                                Стандартный
                            </InputRadio>

                            <InputRadio id="style-uhd" name="style-img"
                                onChange={()=> setImgParams({...imgParams, style:"UHD"})}
                            >
                                Детальное фото
                            </InputRadio>
                
                            <InputRadio id="style-anime" name="style-img"
                                onChange={()=> setImgParams({...imgParams, style:"ANIME"})}
                            >
                                Аниме
                            </InputRadio>

                            <InputRadio id="style-kandinsky" name="style-img"
                                onChange={()=> setImgParams({...imgParams, style:"KANDINSKY"})}
                            >
                                Кандинский
                            </InputRadio>
                        </div>

                        <div className="size__container">
                            <div className="size-range__container">
                                <InputRange min="250" max="1024" value={imgParams["width"]}
                                    onChange={(event)=> setImgParams({...imgParams, width: event.target.value})}
                                />
                                <InputRange min="250" max="1024" value={imgParams["height"]}
                                    onChange={(event)=> setImgParams({...imgParams, height: event.target.value})}
                                />
                                <p className="range-size">
                                    {imgParams["width"]}x{imgParams["height"]}
                                </p>
                            </div>
                            <div className="size-menu__container">
                                <DropDownMenu
                                    itemList={["16:9","9:16","3:2","2:3","1:1"]}
                                    valueList={["1024x576","576x1024","1024x680","680x1024", "1024x1024"]}
                                    callback={callback}
                                    title={"Выберите размер..."}
                                />
                            </div>    
                        </div>
                        
                        <div className="prompt__container">
                            <Textarea maxLength="1000" placeholder="Введите промт для генерации изображения" rows="7"
                                onChange={(event)=> setImgParams({...imgParams, prompt: event.target.value})} 
                            />
                        </div>
                        
                        <div className="form__create-btn-container">
                            <BtnSend disabled={isLoad == false ? true : false}>
                                Сгенерировать
                            </BtnSend>
                        </div>
                    </form>
                </div> 
            </div>
        </section>
        </>
    )
}
