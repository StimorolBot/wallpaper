import { useState } from "react"

import { api } from "../api/config"
import { useFetch } from "../components/hook/useFetch"

import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { Loader } from "../components/loader/Loader"

import { BtnSend } from "../components/ui/btn/BtnSend"
import { BtnPublish } from "../components/ui/btn/BtnPublish"
import { Textarea } from "../components/ui/textarea/Textarea"
import { InputRadio } from "../components/ui/input/InputRadio"
import { InputRange } from "../components/ui/input/InputRange"
import { CreateTag } from "../components/img/CreateTag"

import style from "./style/create_img.module.sass"


export function CreateImg() {

    const [response, setResponse] = useState({"uuid_img": null, "base64_img": null}) 
    const [imgParams, setImgParams] = useState({
        "prompt": null, "negative_prompt": null, "style": "DEFAULT", "width": 512, "height": 512
    })

    const [request, isLoading, error] = useFetch(
        async (event) => {
            event.preventDefault()
            await api.post("/create", imgParams).then((r) => {setResponse({...r.data})})
        }
    )

    return(
        <div className="wrapper">
            <Header/>
            <main className="main main_flex">
                <h1 className="title-page"> Генерация изображения </h1>
                <div className="container">
                    <div className={style.create__inner}>
                    {isLoading
                    ? <Loader loaderMsg={"Пожалуйста подождите, идет генерация изображения..."}/>
                    :<>
                        <div className={style.create__img}>
                            {response.base64_img && 
                                <img src={`data:image/jpeg;base64,${response?.base64_img}`} alt="img-ai"/>
                            }
                            {response?.tag &&
                                <ul className={style.tag__list}>
                                    {response.tag.map((tag, index) => {
                                        return (
                                            <li className={style.tag__item} key={index}>{tag}</li>
                                        )
                                    })}
                                </ul>
                            }
                        </div>
                        <form className={style.form__create} onSubmit={async (event) => await request(event)}>
                            <div className={style.formStyle__container}>
                                <InputRadio id={"style-default"} name={"style-img"}
                                    onChange={()=> setImgParams({...imgParams, style:"DEFAULT"})}
                                >
                                    Стандартный
                                </InputRadio>
                                <InputRadio id={"style-uhd"} name={"style-img"}
                                    onChange={()=> setImgParams({...imgParams, style:"UHD"})}
                                >
                                    Детальное фото
                                </InputRadio>
                                <InputRadio id={"style-anime"} name={"style-img"}
                                    onChange={()=> setImgParams({...imgParams, style:"ANIME"})}
                                >
                                    Аниме
                                </InputRadio>
                                <InputRadio id={"style-kandinsky"} name={"style-img"}
                                    onChange={()=> setImgParams({...imgParams, style:"KANDINSKY"})}
                                >
                                    Кандинский
                                </InputRadio>
                            </div>
                            <div className={style.formSize__container}>
                                <InputRange titleLabel={"width"} imgParams={imgParams} setImgParams={setImgParams} />
                                <InputRange titleLabel={"height"} imgParams={imgParams} setImgParams={setImgParams} />
                            </div>
                            {response.base64_img && 
                                <CreateTag response={response} setResponse={setResponse}/>
                            }
                            <div className={style.formPrompt__container}>
                                <Textarea maxLength="1000" placeholder="Промт" keyDict={"prompt"}
                                    value={imgParams} setValue={setImgParams} required
                                />
                                <Textarea maxLength="1000" placeholder="Негативный промт"
                                    value={imgParams} setValue={setImgParams} keyDict={"negative_prompt"}
                                />
                            </div>
                            <div className={style.formBtn__container}>
                                <BtnSend> Сгенерировать </BtnSend>
                                {response.base64_img && response?.tag &&
                                    <BtnPublish uuidImg={response?.uuid_img} tagList={response.tag}/>
                                }
                            </div>
                        </form>
                    </>}
                    </div>
                </div>
            </main> 
            <Footer/>      
        </div>
    )
}
