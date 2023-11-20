/* eslint-disable no-unused-vars */
import { useState } from "react";
import ReactModal from "react-modal";
import { LoginForm } from "../UserLogin";
import { SignupForm } from "../UserSignup";



// eslint-disable-next-line react/prop-types
export function LoginModal({isOpen,onRequestClose}) {
    const [showLoginModal,setShowLoginModal] = useState(false)
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

      return (
        <>
                <ReactModal
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
      )
}