import { useState } from "react"

import { api } from "../api/config"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Loader } from "../components/loader/Loader"
import { BtnSend } from "../components/ui/btn/BtnSend"
import { useFetch } from "../components/hook/useFetch"
import { Textarea } from "../components/ui/input/Textarea"
import { InputRadio } from "../components/ui/input/InputRadio"
import { DropDownMenu } from "../components/ui/menu/DropDownMenu"

import "./style/create_img.sass"


export function CreateImg() {
    const [img, setImg] = useState(null)
    
    const [imgParams, setImgParams] = useState({
        "prompt": "", "style": "DEFAULT", "width": 1024, "height": 1024
    })

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/create", imgParams).then((response) => {setImg(response.data)})
        }
    )
    
    const setSize = (value) => {
        const [w, h] = value["back"].split("x")
        setImgParams({...imgParams, width: w, height: h})
    }

    return(
        <>
        <Header/>
        <section className="img-create-section">
            <h2 className="hidden">
                Генерация изображения
            </h2>
            <div className="wrapper">
                <div className="img-create__container">
                    <div className="img-generate__container">
                        { isLoading 
                            ? <Loader align={false}/> 
                            : <div className={img ? "img-container" : "img-container img-container_empty"}>
                                <img className="img-create"
                                    src={`data:image/jpeg;base64,${img}`} alt="img-ai"
                                />
                            </div>
                        }
                    </div>
                    <form className={
                            isLoading
                            ? "form__create-img form__create-img_active"
                            : "form__create-img"
                        }
                        onSubmit={async (event)=> await request(event)}
                    >
                        <div className="checkbox-style__container">
                            <InputRadio id={"style-default"} name={"style-img"} text={"Стандартный"}
                                onChange={()=> setImgParams({...imgParams, style:"DEFAULT"})}
                            />
                                
                            <InputRadio id={"style-uhd"} name={"style-img"} text={"Детальное фото"}
                                onChange={()=> setImgParams({...imgParams, style:"UHD"})}
                            />
                                
                            <InputRadio id={"style-anime"} name={"style-img"} text={"Аниме"}
                                onChange={()=> setImgParams({...imgParams, style:"ANIME"})}
                            />
                                
                            <InputRadio id={"style-kandinsky"} name={"style-img"} text={"Кандинский"}
                                onChange={()=> setImgParams({...imgParams, style:"KANDINSKY"})}
                            />
                        </div>
                        <div className="size__container">
                            <p className="range-size">
                                {imgParams["width"]}x{imgParams["height"]}
                            </p>
                            <DropDownMenu
                                itemList={[
                                    {"front": "16:9", "back": "1024x576"},
                                    {"front": "9:16", "back": "576x1024"},
                                    {"front": "3:2", "back": "1024x680"},
                                    {"front": "2:3", "back": "680x1024"},
                                    {"front": "1:1", "back": "1024x1024"}
                                ]}
                                title={"Соотношение..."}
                                setFilter={setSize}    
                            />
                        </div>    
                        <div className="prompt__container">
                            <Textarea maxLength="1000" placeholder="Введите промт для генерации изображения"
                                value={imgParams} setValue={setImgParams} 
                            />
                        </div>
                        <div className="form__create-btn-container">
                            <BtnSend> Сгенерировать </BtnSend> 
                            {/* disabled={isLoading ? true : false} */}
                        </div>
                    </form>
                </div>    
            </div>
        </section>
        <Footer/>
        </>
    )
}
