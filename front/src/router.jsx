import { Home } from "./page/Home"
import { Error } from "./page/Error"
import { Popular } from "./page/Popular"
import { Login } from "./page/auth/Login"
import { AboutImg } from "./page/AboutImg"
import { CreateImg } from "./page/CreateImg"
import { Register } from "./page/auth/Register"
import { createBrowserRouter } from "react-router-dom"


const router = createBrowserRouter([
    { path: "/", element: <Home/>},
    { path: "/create", element: <CreateImg/>},
    { path: "/wallpaper/:uuid", element: <AboutImg/>},
    { path: "/popular", element: <Popular/>},
    { path: "/auth", children: [
      { path: "login", element: <Login/>},
      { path: "register", element: <Register/>},
      { path: "", element: <Error errorCode={404} errorMsg={"Не далось найти страницу"}/>}
    ]},
    { path: "*", element: <Error/>},
  ]
)


export default router