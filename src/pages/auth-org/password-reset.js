import { HowToVote, HowToVoteTwoTone, Lock } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { randomImages } from "../../components/contants/ui-data";
import SimpleNavbar from "../../components/simple-nav-bar/simple-navbar";
import { fontFamily5 } from "../../contants/ui-contants/ui-constants";
import FormGenerator from "../../contants/libraries/FormGenerator/FormGenerator";
import { fontFamily3 } from "../../components/contants/ui-constants";
import { FIELDS } from "../../contants/libraries/FormGenerator/FormGeneratorFields";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ALL_URLS } from "../../contants/urls/rout-links";
import { useAuthServices } from "./context/auth-context";
import { errorToast } from "../../components/toast/toastify";
import { useBasePath } from "../status-page/hook/usebasepath";
import StatusPage from "../status-page/status-page";
import { decodeFromB64 } from "../../contants/libraries/easy";
import Koinologo from "../../components/koino-logo/koino-logo";
import AuthWrapper from "./auth-wrapper";

export default function PasswordReset() {
  const navigate = useNavigate();
  const { loading, resetPassword, verifyLink } = useAuthServices();
  const params = useParams();
  const [verificationState, setVerificationState] = useState(undefined);
  const location = useLocation();
  const currentPath = useBasePath();
  // console.log(currentPath);
  const decodedEmail = decodeFromB64(params?.email);
  const token = params?.token;
  useEffect(() => {
    if (verificationState?.status === undefined) {
      verifyLink({ email: params?.email, token: params?.token }).then((res) => {
        if (res.success) {
          setVerificationState({ state: true, message: "Email is authentic" });
        } else {
          let message =
            res.message === "jwt expired"
              ? "Please try again the link has expired"
              : res.message;
          setVerificationState({ state: false, message });
        }
      });
    }
  }, []);

  const handleSubmit = (data) => {
    delete data.password_confirmation;
    let newData = {
      token: token,
      ...data,
    };
    resetPassword(newData)
      .then((res) => {
        console.log(res);
        if (res?.success) {
          navigate(ALL_URLS.succesfulPasswordReset.url);
        } else {
          errorToast(res?.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {verificationState?.state === undefined ? (
        <div className="w-full h-full flex-col flex justify-center items-center">
          <div className="border-l-2 mb-2 animate-rotate  border-indigo-500 rounded-full w-14 h-14"></div>
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : verificationState?.state === false ? (
        <StatusPage
          data={{
            state: false,
            title: "Expired or invalid link",
            buttonTwoUrl: ALL_URLS.base.url,
            buttonOneUrl: ALL_URLS.loginToOrganization.url,
            subtitle: verificationState?.message,
            buttontText: "",
          }}
        />
      ) : (
        // <div
        //   style={{ backgroundImage: `url(${randomImages})` }}
        //   className="w-full  fit-bg h-full bg-gray-500 flex  flex-col justify-start items-center"
        // >
        //   {/* <video ref={this.videoRef} loop autoPlay muted  style={{position:'fixed', right: 0, bottom: 0, minWidth: '100vw', minHeight: '100vh'}} >
        //             <source src={bgvideo} type="video/mp4"/>
        //         </video> */}
        //   <div
        //     style={{ backgroundColor: "rgb(255,255,255, 0.98)" }}
        //     className="w-full  h-full z-[55] flex flex-col justify-center items-center"
        //   >
        //     <div className="fixed top-0 left-0 w-full ">
        //       <SimpleNavbar
        //         buttonOneStyles={{
        //           color: "white",
        //           fontSize: 14,
        //           cursor: "pointer",
        //           fontWeight: "bolder",
        //           background: "linear-gradient(270deg,#e4bc2a,#db5151)",
        //         }}
        //         handleButtonOneClick={() => {
        //           navigate("/register");
        //         }}
        //         buttonOneText="Sign Up"
        //         noLogo={true}
        //         noMenuList
        //       />
        //     </div>
        //     <Koinologo />
        //     <div className="flex shadow-blend flex-col rounded-lg overflow-hidden">
        //       <div
        //         style={{
        //           background:
        //             "linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)",
        //         }}
        //         className="w-full h-[5px] animate-bgChange"
        //       ></div>
        //       <div className="w-[400px] h-[470px] j-space-around items-center flex flex-col  bg-white shadow-blend p-[30px]">
        //         <div
        //           style={{
        //             fontSize: 20,
        //             fontFamily: fontFamily3,
        //             color: "black",
        //           }}
        //           className="flex justify-center items-center mb-[40px]"
        //         >
        //           <Lock /> Reset your password
        //         </div>
        //         <div className="w-full  animate-rise">
        <AuthWrapper
          returnText={"Back to login"}
          returnUrl={ALL_URLS.loginToOrganization.url}
          buttonText="Sign in"
          buttonUrl={ALL_URLS.loginToOrganization.url}
          formTitle="Reset your passwo"
        >
          <FormGenerator
            fields={[
              {
                fieldType: FIELDS.input,
                locked: true,
                name: "email",
                label: "Email",
                placeholder: "Email",
                required: true,
                defaultValue: decodedEmail,
              },
              {
                fieldType: FIELDS.password,
                name: "password",
                label: "New password",
                placeholder: "New password",
                required: true,
              },

              {
                fieldType: FIELDS.password,
                name: "password_confirmation",
                label: "Confirm your password",
                placeholder: "Confirm your Password",
                required: true,
              },
            ]}
            handleOnSubmit={(data, resetFunc, completed) => {
              handleSubmit(data, resetFunc, completed);
            }}
            buttonStyles={{
              backgroundColor: "black",
              background: "linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)",
              borderRadius: "5px",
            }}
            loading={loading}
          />
        </AuthWrapper>

        // <div
        //   style={{ fontFamily: fontFamily3 }}
        //   className="justify-between"
        // >
        //   <span
        //     onClick={() => {
        //       navigate(ALL_URLS.loginToOrganization.url);
        //     }}
        //     style={{ color: "#FEA797" }}
        //     className="cursor-pointer"
        //   >
        //     Back to login
        //   </span>
        // </div>
        // </div>
        // </div>
        // </div>
        // </div>
        // </div>
      )}
    </>
  );
}
