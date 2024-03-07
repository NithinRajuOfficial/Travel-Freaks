import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// user components 
// import { LandingPage } from "./components/User/LandingComp";
import { SignupForm } from "./components/User/UserSignup";
import { LoginForm } from "./components/User/UserLogin";
import { Home } from "./components/User/home/HomeCom";
import { Profile } from "./components/User/profile/UserProfile";
import { PostDetails } from "./components/User/postDetails/PostDetailsMainComp";
import { ErrorPage } from "./components/ErrorComponent";

// admin components 
import {AdminLoginForm} from "./components/Admin/AdminLogin"
import { AdminDashboard } from "./components/Admin/Dashboard";
import {UserManagementMainComponent} from './components/Admin/userManagement/UserManagementMainCom'
import ChatComponent from "./components/User/chat/ChatMain";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/postDetails" element={<PostDetails />} />
        <Route path="/chat" element={<ChatComponent/>}/>

        {/* Admin Routes starts below here */}
        <Route path="/admin/login" element={<AdminLoginForm />}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/admin/userManagement" element={<UserManagementMainComponent />}/>
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Router>
  );
}

export default App;
