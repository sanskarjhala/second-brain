import { useState } from "react";
import frameImg from "../../../assets/images/frame.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, image, formType }: any) {
  // @ts-ignore
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-white text-black dark:text-white dark:bg-black flex items-center justify-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-[1160px] flex-col items-center justify-center gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12 md:items-start">
          
          {/* Left: Form Section */}
          <div className="w-full max-w-[450px]">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem]">
              {title}
            </h1>
            {/* <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p> */}
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          {/* Right: Image Section */}
          <div className="relative w-full max-w-112.5 flex items-center justify-center">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>

        </div>
      )}
    </div>
  );
}

export default Template;