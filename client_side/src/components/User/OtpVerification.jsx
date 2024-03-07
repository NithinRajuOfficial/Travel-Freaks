/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Typography, Input, Button } from "@material-tailwind/react";

Modal.setAppElement("#root");

const OtpVerificationModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  isVerification,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [remainingTime, setRemainingTime] = useState(68);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isVerification) {
      onSubmit(otp, remainingTime);
    } else {
      onSubmit(email);
    }
  };

  // function to decrement the remaining time
  const decrementTime = () => {
    setRemainingTime((prevRemainingTime) => {
      if (prevRemainingTime > 0) {
        return prevRemainingTime - 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setRemainingTime(68);
      const timer = setInterval(decrementTime, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={
        isVerification ? "OTP Verification Modal" : "Email Input Modal"
      }
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)", 
          zIndex: 1000, 
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the modal
          border: "none", // Remove border
          padding: "20px",
          maxWidth: "400px", // Adjust the modal width as needed
          zIndex: 1001, // Ensure it's higher than the overlay
        },
      }}
    >
      <div className="flex justify-center items-center flex-col w-full h-full">
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          {isVerification ? " OTP Verification" : "Enter Your Email"}
        </Typography>
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center">
          {isVerification ? (
            <div className="mb-4">
              <Input
                type="number"
                id="otp"
                label="OTP"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                className="w-60 border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                required
                disabled={remainingTime === 0}
              />
              <small>
                Time Remaining:{" "}
                <span className="text-red-900">{remainingTime} seconds</span>
              </small>
            </div>
          ) : (
            <div className="mb-4 ">
              <Input
                type="email"
                id="email"
                label="Email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="w-60 border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}
            <Button
              type="submit"
              disabled={remainingTime === 0}
              className=" bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              {isVerification ? "Verify OTP" : " Submit Email"}
              
            </Button>
        </form>
      </div>
    </Modal>
  );
};

export default OtpVerificationModal;
