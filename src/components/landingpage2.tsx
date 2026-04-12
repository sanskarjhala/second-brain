import { FaThumbtack } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { VideoDemo } from "./ui/videodemo";

export default function LandingSection() {
  const features = [
    {
      icon: <FaThumbtack size={28} className="text-purple-600" />,
      title: "Save Anything",
      desc: "Whether it’s a YouTube tutorial, GitHub project, tweet, or handwritten note—keep everything in one organized space.",
    },
    {
      icon: <FaSearch size={28} className="text-purple-600" />,
      title: "Smart Search",
      desc: "AI-powered search understands your content and helps you retrieve exactly what you need without scrolling endlessly.",
    },
    {
      icon: <FaFolder size={28} className="text-purple-600" />,
      title: "Stay Organized",
      desc: "Categorize by tags, types, and collections to keep your brain clutter-free.",
    },
    {
      icon: <FaLink size={28} className="text-purple-600" />,
      title: "Share Easily",
      desc: "Generate shareable links and let your friends or team access your saved content.",
    },
  ];

  return (
    <div className="min-h-screen text-gray-800 md:-mt-40 -mt-4 dark:bg-darkbg">
      <section
        className="flex justify-center relative max-w-[1280px] md:-mt-72 lg:-mt-4 
  mx-auto"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 lg:gap-4 px-4
   sm:px-10 md:px-16 lg:px-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className=" aspect-video w-full mb-10 lg:mb-0"
          >
            <VideoDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:pl-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold border-l-4 border-purple-500 pl-4 dark:text-white">
              How It Works
            </h2>
            <ul className="space-y-3 mt-6">
              {[
                "Upload or sync notes, articles, videos, bookmarks, and more—all in one place that’s easy to access anytime.",
                "We embed and index your content using vector search.",
                "Type a question — and instantly get answers and suggestions powered by AI.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 lg:w-6 flex-shrink-0 text-purple-600" />
                  <p className="text-gray-700 dark:text-secondary text-[18px]">
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Heading---> why choose second brain */}
      <div className="text-center mb-12 mt-28">
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
          Why Choose Our
          <span className="text-purple-600 ml-2">Second Brain?</span>
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2 max-w-6xl mx-auto px-2 mb-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl dark:bg-cardbg 
                      dark:border-black shadow-md border p-6 
                      dark:shadow-sm dark:transition-all
                       dark:shadow-purple-900 dark:hover:shadow-sm
                        text-center hover:shadow-2xl transition md:mx-0 mx-6"
          >
            <div className="mb-4 flex justify-center">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">
              {f.title}
            </h3>
            <p className="text-gray-600 text-sm dark:text-secondary">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
