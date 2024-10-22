import { createBrowserRouter } from "react-router-dom"

import { Home } from "./page/Home"
import { Error } from "./page/Error"
import { Popular } from "./page/Popular"
import { Login } from "./page/auth/Login"
import { AboutImg } from "./page/AboutImg"
import { CreateImg } from "./page/CreateImg"
import { Register } from "./page/auth/Register"
import { ResetPassword } from "./page/auth/ResetPassword"


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

        {
            path: "",
            element: <Error/>
        }
    ]},

    {
        path: "*",
        element: <Error/>,
    },
])

export default router
