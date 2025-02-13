import { BtnSend } from "../btn/BtnSend"
import { Textarea } from "../textarea/Textarea"

import { InputRadio } from "../input/InputRadio"
import { InputRange } from "../input/InputRange"

import style from "./style/create_img_form.module.sass"


export function CreateImgForm({request, imgParams, setImgParams}){

    return(
        <form className={style.form__createImg} onSubmit={async () => await request()}>
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
            </div>
        </form>
    )
}