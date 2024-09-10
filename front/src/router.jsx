import { Reg } from "./page/Reg"
import { Home } from "./page/Home"
import { Error } from "./page/Error"
import { Login } from "./page/auth/Login"
import { CreateImg } from "./page/CreateImg"
import { createBrowserRouter } from "react-router-dom"
import { AboutImg } from "./page/AboutImg"


const router = createBrowserRouter([
    { path: "/", element: <Home/>},
    { path: "/create", element: <CreateImg/>},
    { path: "/wallpaper/:uuid", element: <AboutImg/>},
    { path: "/auth", children: [
      { path: "login", element: <Login/>},
      { path: "register", element: <Reg/>},
      { path: "", element: <Error errorCode={404} errorMsg={"Не далось найти страницу"}/>}
    ]},
    { path: "*", element: <Error/>},
  ]
)


export default router