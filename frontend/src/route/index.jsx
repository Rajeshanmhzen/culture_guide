import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Register from "../pages/register";
import Login from "../pages/Login";
import About from "../pages/About";
import ChangePassword from "../pages/profile/ChangePassword";
import Profile from "../pages/profile/profile";
import AddLocationForm from "../pages/profile/AddLocation";
import AllLocations from "../pages/AllLocations";
import LocationDetail from "../pages/LocationDetail";
import LocationList from "../components/LocationList";
import Location from "../pages/Location/Admin/Location"
import LocationUpdate from "../pages/Location/Admin/UpdateLocation";
const router = createBrowserRouter([
{
    path:"/",
    element:<App/>,
    children:[
        {index:true, element:<Home/>},
        {path:"register", element:<Register/>},
        {path:"login", element:<Login/>},
        {path:"about", element:<About/>},
        {path:"change-password", element:<ChangePassword/>},
        {path:"user/profile", element:<Profile/>},
        { path:"add-location", element:<AddLocationForm />},
        { path:"places", element:<AllLocations />},
        { path:"places/:id", element:<LocationDetail />},
         {
    path: "/admin/location/",
    children: [
      { index: true, element: <Location /> },
      { path: ":id", element: <LocationList /> },
     { path:"update/:id", element:<LocationUpdate />},
    //   { path: "create", element: <LocationDetail /> },
    ],
  },
    ],
}
])

export default router
