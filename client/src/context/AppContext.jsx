import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(0); // Initialize with 0 instead of false
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const loadCreditsData = async () => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.get(backendUrl + `/api/user/credits`, {
        headers: {
          token: token,
        },
      });

      console.log("response :>> ", response);

      if (response.data.success) {
        setCredit(response.data.userCredits);
      } else {
        console.warn("Failed to load credits:", response.data.message);
        setCredit(0);
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error("Credits error:", error);
      setCredit(0);

      // More specific error handling
      if (error.response?.status === 404) {
        toast.error(
          "User account not found. Please ensure your account is properly set up."
        );
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please try logging in again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load credits");
      }
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }
      setImage(image);
      setResultImage(false);

      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/image/remove-bg",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        data.creditBalance && setCredit(data.creditBalance);
      } else {
        toast.error(data.message);
        data.creditBalance && setCredit(data.creditBalance);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
      toast.error(error.message);
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
