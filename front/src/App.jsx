import router from "./router"
import { useState } from "react"
import { RouterProvider } from "react-router-dom"
import { TagContext } from "./context/tagContext"


export function App(){
    const [tag, setTeg] = useState([])

    return(
        <TagContext.Provider value={{tag, setTeg}}>
            <RouterProvider router={ router }/>
        </TagContext.Provider>
    )
}