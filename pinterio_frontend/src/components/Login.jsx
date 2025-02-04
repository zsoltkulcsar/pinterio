import React from "react";
import shareVideo from "../assets/share.mp4";
import logowhite from "../assets/logowhite.png";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const responseGoogle = async (credentialResponse) => {
  if (credentialResponse.access_token) {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentialResponse.access_token}`,
        },
      });

      const userInfo = await res.json();

      const { name, sub: googleId, picture: imageUrl } = userInfo;

      localStorage.setItem(
        "user",
        JSON.stringify({ name, googleId, imageUrl })
      );

      const doc = {
        _id: googleId,
        _type: "user",
        userName: name,
        image: imageUrl,
      };

      console.log("User Document:", doc);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  } else {
    console.log("Google login failed");
  }
};

const Login = () => {
  const login = useGoogleLogin({
    onSuccess: (tokenresponse) => responseGoogle(tokenresponse),
    onError: (error) => {
      console.error("Login failed with error:", error);
      console.log("Login Failed");
    },
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover brightness-30"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logowhite} width="130px" />
          </div>

          <div className="shadow-2xl p-4 flex flex-col items-center space-y-4">
            <button
              className="py-2 px-4 max-w-md flex justify-center items-center bg-red-0 hover:bg-red-700 focus:ring-red-500 
          focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base 
          font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              onClick={() => login()}
            >
              <FcGoogle className="mr-4" />
              Sign in with Google 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
