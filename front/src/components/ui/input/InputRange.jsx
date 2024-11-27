import "./style/input_range.sass"

export function InputRange({titleLabel, imgParams, setImgParams}){

    return(
        <div className="input-range__container">
            <label className="input-range-lbl" htmlFor="input-range">{titleLabel}: {imgParams[titleLabel]}</label>
            <input 
                id="input-range" type="range"
                min={250} max={1024} defaultValue={512}
                onChange={(event) => setImgParams({...imgParams, [titleLabel]: event.target.value})}
            />
        </div>
    )
}
