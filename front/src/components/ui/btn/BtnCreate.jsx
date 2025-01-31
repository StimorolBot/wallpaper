import style from "./style/btn_create.module.sass"


export function BtnCreate({children}){
    return(
        <button className={style.btn__create}>
            {children}
        </button>
    )
}
