import { useEffect, useState } from "react"

import { api } from "../../../api/config.js"
import { useFetch } from "../../hook/useFetch.js"
import { CustomSelect } from "../select/CustomSelect.jsx"


export function MainSearch({value, setValue}) {
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
            options={options} placeholder={"#ПопулярныеТеги"} 
            value={value} setValue={setValue} isMulti={true} isSearchable={true}
            isLoading={isLoading ? true : false}
        />        
    )
}
