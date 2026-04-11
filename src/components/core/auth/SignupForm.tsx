import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Signup } from "../../../apis/userApis";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { username, password } = formData;

  const handleOnChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();

    const toastId = toast.loading("Creating account...");

    try {
      const response = await Signup(username, password);

      if (!response.success) {
        toast.error(response.message || "Signup failed", { id: toastId });
        return;
      }

      toast.success("Account created! Please login.", { id: toastId });
      setFormData({ username: "", password: "" });
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong. Try again.", { id: toastId });
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
            Username <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="username"
            value={username}
            onChange={handleOnChange}
            placeholder="Enter username"
            className="form-style w-full"
          />
        </label>

        <label className="relative w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
            Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter password"
            className="form-style w-full pr-10"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 bottom-3 z-10 cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-4 font-semibold hover:bg-yellow-25 transition-colors duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
