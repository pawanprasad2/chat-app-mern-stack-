import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../src/component/NavBar";
import ProfilePage from "../src/pages/ProfilePage";
import HomePage from "../src/pages/HomePage";
import SettingPage from "../src/pages/SettingPage";
import LoginPage from "../src/pages/LoginPage";
import SignupPage from "../src/pages/SignupPage";
import {useSelector,useDispatch} from "react-redux"

import { useEffect } from "react";
import { Loader } from "lucide-react";
import { checkAuth } from "./redux/AuthSlice";
import { Toaster } from "react-hot-toast";
function App() {
 const dispatch =useDispatch();
 const {authUser,isCheckingAuth}= useSelector((state)=>state.auth)

 useEffect(()=>{
  dispatch(checkAuth())
 },[dispatch])

 if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser? <HomePage />: <Navigate to='/login'/>} />
        <Route path="/profile" element={ authUser?  <ProfilePage />  :<Navigate to='/login'/>} />
        <Route path="/settings" element={ <SettingPage />} />
        <Route path="/login" element={ !authUser?  <LoginPage />:<Navigate to='/'/>} />
        <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to='/'/>} />
      </Routes>
      <Toaster/>
    </>
  );
}

export default App;
