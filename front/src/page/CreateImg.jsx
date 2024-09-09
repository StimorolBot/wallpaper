import api from "../api"

import { useState } from "react"
import { Header } from "../components/header/Header"
import { BtnSend } from "../components/ui/btn/BtnSend"
import { Textarea } from "../components/ui/input/Textarea"
import { InputRadio } from "../components/ui/input/InputRadio"
import { InputRange } from "../components/ui/input/InputRange"

import "./style/create_img.sass"



export function CreateImg() {
    const [img, setImg] = useState(null)
    const [imgParams, setImgParams] = useState({
        "prompt": "", "style": "DEFAULT", "width": 1024, "height": 1024
    })

    const createImg = async (event) => {
        event.preventDefault()
        
        await api.post("/create", imgParams)
            .then((response) => {
                setImg(response.data)
            })
            .catch((error) => {
                console.log(error)
            }
        )
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
                    
                    <div className="create-img__result">
                        {img != null
                            ? <img className="img-generated"
                                src={"data:image/jpeg;base64," + img}
                                alt="img-generated"
                            /> 
                            : <img className="gear-load" src="/static/gear.svg" alt="gear-load"/>
                        }
                    </div>

                    <form className="form__create-img" onSubmit={(event)=> createImg(event)}>
                        <div className="checkbox-style__container">
                            <InputRadio id="style-default" lblTitle="Стандартный"
                                onChange={()=> setImgParams({...imgParams, style:"DEFAULT"})}
                            />
            
                            <InputRadio id="style-uhd" lblTitle="UHD"
                                onChange={()=> setImgParams({...imgParams, style:"UHD"})}
                            />
                        
                            <InputRadio id="style-anime" lblTitle="Аниме"
                                onChange={()=> setImgParams({...imgParams, style:"ANIME"})}
                            />
                        
                            <InputRadio id="style-kandinsky" lblTitle="Канадский"
                                onChange={()=> setImgParams({...imgParams, style:"KANDINSKY"})}
                            />                
                        </div>

                        <div className="input-range__container">
                            <div className="input-range__wrapper">
                                <InputRange min="250" max="1024" value={imgParams["width"]}
                                    onChange={(event)=> setImgParams({...imgParams, width: event.target.value})}
                                />
                        
                                <InputRange min="250" max="1024" value={imgParams["height"]}
                                    onChange={(event)=> setImgParams({...imgParams, height: event.target.value})}
                                />
                            </div>
                            <div className="range-size">
                                {imgParams["width"]}x{imgParams["height"]}
                            </div>
                        </div>

                        <div className="prompt__container">
                            <Textarea maxLength="1000" placeholder="Введите промт для изображения"
                                onChange={(event)=> setImgParams({...imgParams, prompt: event.target.value})} 
                            />
                        </div>

                        <div className="form__create-btn-container">
                            <BtnSend>
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
