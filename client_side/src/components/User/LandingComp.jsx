import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { SignupForm } from "./UserSignup";
import { LoginForm } from "./UserLogin";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectIsLoggedIn } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/landing-page-img.jpg";

export function LandingPage() {
  const openSignupModal = () => {
    setShowSignupModal(true);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const modalStyles = {
    content: {
      width: "500px",
      height: "80vh",
      margin: "auto",
      backgroundColor: "transparent",
      borderRadius: "8px",
      overflow: "hidden",
      border: "none",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-black text-4xl mb-6">Welcome to Travel Freaks</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setShowSignupModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Signup
        </button>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          Login
        </button>

        <ReactModal
          isOpen={showSignupModal}
          onRequestClose={() => setShowSignupModal(false)}
          style={modalStyles}
        >
          <SignupForm
            closeSignupModal={closeSignupModal}
            openLoginModal={openLoginModal}
          />
        </ReactModal>

        <ReactModal
          isOpen={showLoginModal}
          onRequestClose={() => setShowLoginModal(false)}
          style={modalStyles}
        >
          <LoginForm
            closeLoginModal={closeLoginModal}
            openSignupModal={openSignupModal}
          />
        </ReactModal>
      </div>
    </div>
  );
}
