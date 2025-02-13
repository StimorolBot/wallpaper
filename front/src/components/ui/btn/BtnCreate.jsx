import style from "./style/btn_create.module.sass"


export function BtnCreate({children, ...props}){
    return(
        <button className={style.btn__create} {...props}>
            {children}
        </button>
    )
}
