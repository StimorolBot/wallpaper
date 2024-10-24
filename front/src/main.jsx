import router from "./router"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"

import "./media.sass"


createRoot(document.getElementById('root')).render(
  <RouterProvider router={ router } />
)
