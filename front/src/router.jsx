import { createBrowserRouter } from "react-router-dom"

import { Home } from "./page/Home"
import { Popular } from "./page/Popular"
import { AboutImg } from "./page/AboutImg"
import { CreateImg } from "./page/CreateImg"

import { Login } from "./page/auth/Login"
import { Register } from "./page/auth/Register"
import { ResetPassword } from "./page/auth/ResetPassword"

import { Error } from "./page/Error"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>  
    },

    {
        path: "/create",
        element: <CreateImg/>
    },

    {
        path: "/wallpaper/:uuid",
        element: <AboutImg/>
    },

    {
        path: "/popular",
        element: <Popular/>
    },

    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login/>
            },
            
        {
            path: "register",
            element: <Register/>
        },

        {
            path: "reset-password",
            element: <ResetPassword/>
        },
    ]},
    
    {
        path: "*",
        element: <Error/>,
    }
])

export default router
