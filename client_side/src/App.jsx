import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// user components 
import { LandingPage } from "./components/User/LandingComp";
import { SignupForm } from "./components/User/UserSignup";
import { LoginForm } from "./components/User/UserLogin";
import { Home } from "./components/User/home/HomeCom";
import { Profile } from "./components/User/profile/UserProfile";


// admin components 
import {AdminLoginForm} from "./components/Admin/AdminLogin"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />


        {/* Admin Routes starts below here */}
        <Route path="/admin/login" element={<AdminLoginForm />}/>
      </Routes>
    </Router>
  );
}

export default App;
