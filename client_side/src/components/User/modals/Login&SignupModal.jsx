/* eslint-disable no-unused-vars */
import { useState } from "react";
import ReactModal from "react-modal";
import { LoginForm } from "../UserLogin";
import { SignupForm } from "../UserSignup";

// eslint-disable-next-line react/prop-types
export function LoginModal({ isOpen, onRequestClose }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };
  const openSignupModal = () => {
    setShowSignupModal(true);
  };
  const closeSignupModal = () => {
    setShowSignupModal(false);
  };
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const modalStyles = {
    content: {
      width: "90%",
      height: "auto",
      maxWidth: "500px",
      margin: "auto",
      backgroundColor: "transparent",
      borderRadius: "8px",
      overflow: "hidden",
      border: "none",
    },
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.5)",
      zIndex: "50",
    },
  };

  return (
    <>
      <ReactModal
        className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full "
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={modalStyles}
      >
        <LoginForm
          closeLoginModal={onRequestClose}
          openSignupModal={openSignupModal}
        />
      </ReactModal>
      <ReactModal
        className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full "
        isOpen={showSignupModal}
        onRequestClose={() => setShowSignupModal(false)}
        style={modalStyles}
      >
        <SignupForm
          closeSignupModal={closeSignupModal}
          openLoginModal={openLoginModal}
        />
      </ReactModal>
    </>
  );
}
