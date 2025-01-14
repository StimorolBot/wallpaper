import { useEffect, useState } from "react"

import { api } from "../../../api/config.js"
import { useFetch } from "../../hook/useFetch.js"
import { CustomSelect } from "../input/CustomSelect.jsx"


export function CustomSearch({value, setValue, isMulti, placeholder="#Поиск", isSearchable=false}) {
    const [options, setOptions] = useState([])
    
    const [request, isLoading, error] = useFetch(
            async () => {
                await api.get("/tag/get-popular-tag").then((r) => {
                    setOptions([...r.data.items])
                }
            )
        }
    )

    useEffect(() => {
        (async () => {
            await request()
        })()
    }, [])
    
    return(   
        <CustomSelect
            options={options} placeholder={placeholder} 
            value={value} setValue={setValue} isMulti={isMulti} isSearchable={isSearchable}
            isLoading={isLoading ? true : false}
        />        
    )
}
