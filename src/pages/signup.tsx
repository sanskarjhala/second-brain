import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Inputcomponent } from "../components/ui/inputbox";
import { useNavigate, Link } from "react-router-dom";
import brainimg from "../assets/brainimg.png";
import brainimgdark from "../assets/brainimgdark.png";
import toast from "react-hot-toast";
import { UserApis } from "../apis/UserAPIs";
const userApi = new UserApis();

export function Signup() {
  const UsernameRef = useRef<HTMLInputElement>(null);
  const EmailRef = useRef<HTMLInputElement>(null);
  const PasswordRef = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  async function signup(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setLoader(true);

    try {
      const username = UsernameRef.current?.value.trim() || "";
      const password = PasswordRef.current?.value.trim() || "";
      const emailid = EmailRef.current?.value.trim().toLowerCase() || "";

      if (!emailid || !username || !password) {
        toast.error("All fields are required.", { id: "signup" });
        return;
      }

      toast.loading("Creating your Second brain...", { id: "signup" });

      await userApi.signupUser({
        emailID: emailid,
        username,
        password,
      });

      toast.success("Successfully created account, now sign in.", {
        id: "signup",
      });

      navigate("/signin");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message, { id: "signup" });
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="flex-grow mt-24 flex justify-center dark:bg-darkbg items-center px-6 py-12">
      <div className=" max-w-4xl w-full dark:bg-darkbg dark:text-white rounded-xl border-2 border-t-8 border-t-purple-400 bg-white overf grid grid-cols-1 md:grid-cols-2">
        {/* left part area. */}
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-10 flex justify-center  leading-tight">
            Create Your <br />
            Second Brain
          </h2>
          <form className="space-y-4 px-6 ">
            <div>
              Username
              <Inputcomponent reference={UsernameRef} placeholder="Username" />
            </div>

            <div>
              Gmail
              <Inputcomponent reference={EmailRef} placeholder="gmail" />
            </div>

            <div>
              Password
              <Inputcomponent
                reference={PasswordRef}
                placeholder="password"
                type="password"
              />
            </div>

            <div className="py-4">
              <Button
                variant="primary"
                text={loader ? "signing up ..." : "Sign up"}
                fullwidth={true}
                onClick={(e: any) => signup(e)}
              />
            </div>
          </form>
          <p className="text-sm text-gray-500 ml-20">
            Already have an Account? {"  "}{" "}
            <Link
              to="/signin"
              className="text-[#6A5ACD] hover:underline text-lg fond-md"
            >
              SignIn
            </Link>
          </p>
        </div>

        {/* another div for image part half */}
        <div className="dark:bg-[#0F0F0E] dark:text-white hidden rounded-xl md:flex flex-col items-center bg-white">
          <img
            src={brainimg}
            className="block dark:hidden w-80 mt-4"
            alt="logo"
          />
          <img
            src={brainimgdark}
            className="hidden dark:block w-80 mt-4"
            alt="logo"
          />

          <p className=" dark:text-secondary -mt-10 text-center text-[#333] text-md font-medium leading-relaxed">
            Second Brain doesn’t just store your knowledge — it thinks with you.
            Our AI understands context, connects ideas, and find ideas by
            meaning, not just keywords.
          </p>
        </div>
      </div>
    </div>
  );
}
