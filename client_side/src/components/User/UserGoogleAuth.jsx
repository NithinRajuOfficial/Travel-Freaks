import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../assets/firebase";
import { Button } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess, setUser } from "../../redux/userSlice";
import { api } from "../../api/api";
import { showError, showSuccess } from "../../assets/tostify";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // Force account selection
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        console.log("Successfully signed in with Google:", result.user);
        const userDataObj = {
          name: result.user.displayName,
          email: result.user.email,
          profileImage: result.user.photoURL,
        };
        const response = await api.post("auth/googleAuth", userDataObj);
        const { accessToken, refreshToken, user } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const filteredUserData = {
          _id: user._id,
          name: user.name,
          bio: user.bio,
          profileImage: user.profileImage,
        };

        dispatch(setUser(filteredUserData));
        dispatch(loginSuccess());
        showSuccess("Login Success")
        navigate("/home");
      }
    } catch (error) {
      console.error("Could not sign in with Google:", error);
      showError("Login failed, please again.")
    }
  };

  return (
    <Button
      className="mt-2"
      fullWidth
      type="button"
      onClick={handleGoogleClick}
    >
      Login with Google 
    </Button>
  );
}
