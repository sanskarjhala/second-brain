import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../../apis/userApis";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { username, password } = formData;

  const handleOnChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(username, password, navigate);\
    const response = await Login(username, password);
    console.log(response);
    // @ts-ignore
    localStorage.setItem("token-brain", response);
    navigate("/dashboard");
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      {/* Email */}
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="username"
          value={username}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-style w-full"
        />
      </label>

      {/* Password */}
      <label className="relative w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full pr-10"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 bottom-8 z-10 cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100 hover:underline">
            Forgot Password
          </p>
        </Link>
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-4 font-semibold  hover:bg-yellow-25 transition-colors duration-200"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
