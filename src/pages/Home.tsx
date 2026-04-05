
import heroImage from "../assets/heroImage.png";
import heroimagedark4 from "../assets/heroimagedark4.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import LandingSection from "../components/ui/Landing";

export default function LandingPage() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-black dark:text-white transition-colors duration-300">

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row md:justify-center md:px-8 min-h-screen max-w-7xl mx-auto pt-24 md:pt-0">

        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-0">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-left">
            <span className="block ">Your Second Brain</span>
            <span className="block mt-2">
              with{" "}
              <span className="text-purple-600 font-extrabold">
                AI-Powered Search
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm md:text-base lg:text-lg font-medium text-slate-600 dark:text-gray-400 text-center md:text-left max-w-lg">
            Second Brain doesn't just store your knowledge — it thinks with you.
            Our AI understands context, connects ideas, and finds answers by
            meaning, not just keywords.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-10">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white 
                         px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-sm lg:text-lg 
                         font-semibold transition-all duration-200 shadow-md shadow-purple-300 dark:shadow-purple-900"
            >
              Get Started
            </button>

            <button
              type="button"
              // onClick={() => HandleDemo({ navigate, setLoader })}
              className="border-2 border-purple-600 text-purple-700 dark:text-white 
                         hover:bg-purple-100 dark:hover:bg-zinc-800 active:scale-95
                         px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-sm lg:text-lg 
                         font-semibold transition-all duration-200 min-w-[110px] flex items-center justify-center"
            >
              {loader ? <ThreeDots height={20} width={40} color="purple" /> : "Try Demo"}
            </button>
          </div>
        </div>

        {/* Right — Hero Image */}
        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 pb-6 md:pb-0">
          {/* Light mode image */}
          <img
            src={heroImage}
            alt="Second Brain App"
            className="w-72 min-[415px]:w-96 md:w-full md:max-w-md lg:max-w-lg xl:max-w-xl 
                       object-cover block dark:hidden drop-shadow-xl"
          />
          {/* Dark mode image */}
          <img
            src={heroimagedark4}
            alt="Second Brain App"
            className="w-72 min-[415px]:w-96 md:w-full md:max-w-md lg:max-w-lg xl:max-w-xl 
                       object-cover hidden dark:block drop-shadow-xl"
          />
        </div>
      </section>

      {/* Landing Sections below hero */}
      <LandingSection />
    </div>
  );
}
  
