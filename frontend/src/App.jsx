import { Route, Routes } from "react-router-dom";
import NavBar from "../src/component/NavBar"
import ProfilePage from '../src/pages/ProfilePage'
import HomePage from '../src/pages/HomePage'
import SettingPage from '../src/pages/SettingPage'
import LoginPage from '../src/pages/LoginPage'
import SignupPage from '../src/pages/SignupPage'
function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile" element={<ProfilePage/>}  />
        <Route path="/settings" element={<SettingPage/>}  />
        <Route path="/login" element={<LoginPage/>}  />
        <Route path="/signup" element={<SignupPage/>}  />

      </Routes>
    </>
  );
}

export default App;
