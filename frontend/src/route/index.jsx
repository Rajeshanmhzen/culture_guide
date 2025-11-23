import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import About from "../Pages/About";
import ChangePassword from "../Pages/profile/ChangePassword";
import Profile from "../Pages/profile/profile";
import AddLocationForm from "../Pages/profile/AddLocation";
import AllLocations from "../Pages/AllLocations";
import LocationDetail from "../Pages/LocationDetail";
import LocationList from "../components/LocationList";
import Location from "../Pages/Location/Admin/Location"
import LocationUpdate from "../Pages/Location/Admin/UpdateLocation";
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