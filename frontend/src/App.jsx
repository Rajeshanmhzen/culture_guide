import { useEffect } from "react";
import Footer from "./components/Footer"
import Header from "./components/Header"
import { Outlet } from "react-router-dom"
import { setUser } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { setLocation } from "./store/LocationSlice";
import { Location_API_END_POINT } from "./utils/constant";
import axios from "axios";

function App() {
  const dispatch = useDispatch()

   const fetchLocations = async () => {
      try {
        const res = await axios.get(`${Location_API_END_POINT}`);
        dispatch(setLocation(res.data));
      } catch (error) {
        console.error("Error fetching locations:", error.message);
      }
    };
  useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    dispatch(setUser(JSON.parse(user)));
  }
 
  fetchLocations()

}, []);

  return (
    <>
      <Header/>
      <div>
        <Outlet/>
      </div>
    <Footer/>
    </>
  )
}

export default App
