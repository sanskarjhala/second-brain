import { useState } from "react";
import { Button } from "../components/ui/Button";
import { AddIcons } from "../icons/PlusIcon";
import { ShareIcons } from "../icons/ShareIcon";
import { useContent } from "../hooks/useContent";
import { AIResponseCard } from "../components/AIresponse";
import React from "react";
import { DashboardContext } from "../context/DashboardContext";
import { BeatLoader } from "react-spinners";
import { SharebrainModal } from "../components/core/SharebrainModal";
import { DashboardShare } from "../components/dashboardShare";
import { Card } from "../components/ui/card";
import AddContentModal from "../components/core/modal";
import { ContentApis } from "../apis/ContentAPIs";

const contentApis = new ContentApis();

export function Dashboard() {
  const contextDashboard = React.useContext(DashboardContext);
  if (!contextDashboard) return null;

  const {
    query,
    setQuery,
    filter,
    showResults,
    setShowResults,
    isSidebarOpen,
  } = contextDashboard;

  const [shareModal, setShareModal] = useState(false);
  //----------  sharing link of the content  ---------
  const [sharelink, setSharelink] = useState("");

  //----full dashboard share
  const [shareDashboard, setShareDashboard] = useState(false);

  const [isTwitterScriptLoaded, setTwitterScriptLoaded] = useState(false);

  const [isOpen, setIsOpen] = useState(false); // Set to false initially in real project -->
  const { contents, loading, fetchcontents, setAllContents } =
    useContent(filter);

  const [results, setResults] = useState<any[]>([]);
  const [aiResult, setAiResult] = useState("");

  const [loadai, setLoadai] = useState(false);
  const [typingdone, setTypingdone] = useState(false);

  async function HandleSearch() {
    if (!query.trim()) return;
    //old clear saar
    setResults([]);
    setAiResult("");
    //new start
    setShowResults(true);
    setLoadai(true);
    setTypingdone(false);
    setShowResults(true);

    try {
      const res = await contentApis.aiSearch(query);
      console.log("API response:", res.data);
      //  safely extract values

      const cards = res.data?.cards || [];
      const aiResponse = res.data?.LLMresponses?.trim();
      setAiResult(
        aiResponse ||
          "AI didn’t return a response. Try again or check your saved cards.",
      );

      setResults(cards);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Service temporarily unavailable";

      setAiResult(`⚠ ${message}`);
      setResults([]);
      setShowResults(true);
    } finally {
      setLoadai(false);
    }
  }

  function handleDelete(id: string) {
    setAllContents((prev) => prev.filter((c) => c._id !== id));
  }

  const isDemo = localStorage.getItem("isDemo") === "true"; // it's stored as a string

  return (
    <div
      className={`transition-all duration-300 ease-linear  ${
        isSidebarOpen ? "md:ml-64" : "md:ml-16"
      } `}
    >
      <div
        className={`${isSidebarOpen ? `md:pr-6 md:pl-2` : ""}  pl-2 md:py-6 py-10  min-h-screen transition-all duration-300 ease-linear `}
      >
        {/* ----------- ye add content modal ka hai  ------------- */}
        {isOpen && (
          <AddContentModal
            isOpen={isOpen}
            setAllContents={setAllContents}
            fetchcontents={fetchcontents}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        )}

        {/* ------------  ye share content modal ka hai  ----------- */}
        {shareModal && (
          <SharebrainModal
            setShareModal={setShareModal}
            sharelink={sharelink}
          />
        )}

        {/* ------------  ye full dashboard share ka modal  --------- */}
        {shareDashboard && (
          <DashboardShare setShareDashboard={setShareDashboard} />
        )}

        {/* -------------------------   Demo section  ------------------------- */}
        {isDemo && (
          <div className="bg-yellow-100 text-yellow-800 md:p-3 pl-9 rounded mb-4 text-sm">
            You're using a <strong>temporary demo account</strong>. All data
            will be deleted after 2 hours.
            <br />
            <a href="/signup" className="text-blue-600 underline font-semibold">
              Sign up
            </a>{" "}
            to keep your content!
          </div>
        )}

        {/*  **** header of dashboard -> your sec brain* , search bar, share, add, theme button. */}

        <div
          className={` sm:ml-0 ml-10  md:flex md:gap-6 gap-2  items-center ${showResults ? `justify-center` : `justify-end`}`}
        >
          {/*--------------- search bar  ---------------- */}
          <div className="relative z-10 w-full max-w-xl mr-0 md:mr-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)} // $$$Each keystroke is captured by onChange.---> i think here no need of this??????
              type="text"
              placeholder="Let AI find it for you..."
              className="w-full pr-24 overflow-x-auto  sm:pr-28  md:pl-4 pl-2 py-2 border dark:bg-zinc-800 dark:text-white border-purple-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={HandleSearch}
              className=" font-semibold absolute right-1 top-1 bottom-1 px-2 sm:px-4
                bg-custom-gradient
                hover:bg-custom-gradient2
              text-white rounded-lg  transition"
            >
              AI search
            </button>
          </div>

          {/* -----------------   Two buttons add content  and  share brain ----------- */}
          <div
            className={`${showResults ? "hidden" : ""} md:flex-none flex justify-center md:gap-2 gap-10  items-center`}
          >
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
              variant="primary"
              text="Add content"
              startIcon={<AddIcons />}
            ></Button>
            <Button
              onClick={() => setShareDashboard(true)}
              variant="secondary"
              text="Share brain"
              startIcon={<ShareIcons />}
            ></Button>
          </div>
        </div>

        {/* -------------------------- all the cards are there ------------------ */}
        <div className=" transition-all duration-300 ease-linear md:ml-0 ml-10 mt-10  ">
          {showResults ? (
            // ai-responses---
            <>
              {/* ########---------- AI's Answer  -----------######## */}
              {/* <div className="p-4 mb-4  border border-purple-200 rounded-lg"> */}
              <div className="md:mb-4 mb-2 ml-3 md:ml-10">
                <strong className="text-xl dark:text-white text-purple-700">
                  AI Answer :
                </strong>
              </div>
              {/* <p className="text-md">{aiResult ? aiResult : "No AI answer found 🤔"}</p> */}
              <AIResponseCard
                text={aiResult}
                isLoading={loadai}
                onTypingComplete={() => setTypingdone(true)}
              />
              {/* </div> */}

              {/* Search Result Cards */}

              {typingdone && results.length > 0 && (
                <>
                  <div className="font-bold text-xl mt-12 ml-3 md:ml-10 text-purple-700 dark:text-white">
                    Your Saved Contents:
                  </div>
                  <div className="md:flex rounded-lg flex-wrap">
                    {results.map(({ _id, type, link, title }) => (
                      <div
                        key={_id}
                        className="break-inside-avoid mb-4 md:ml-8 scroll-mt-20"
                      >
                        {/* @ts-ignore */}
                        <Card
                          id={_id}
                          type={type}
                          link={link}
                          title={title}
                          isTwitterScriptLoaded={isTwitterScriptLoaded}
                          setTwitterScriptLoaded={setTwitterScriptLoaded}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            // default dashboard--
            <div className=" transition-all duration-300 ease-linear columns-1 mt-10 sm:columns-2   md:columns-3 xl:columns-4 space-y-6">
              <>
                {loading ? (
                  <div className="absolute left-1/2 top-1/2">
                    <BeatLoader
                      color="#8A27F2"
                      size={40}
                      margin={10}
                      loading={loading}
                    />
                  </div>
                ) : (
                  contents.map(({ _id, type, link, title, status }) => {
                    //const { type, link, title } = item;  // it is same as passing in the props like
                    // @ts-ignore
                    return (
                      <div
                        key={_id}
                        className="break-inside-avoid mb-4 md:ml-8 scroll-mt-20 transition"
                      >
                        {" "}
                        {/* @ts-ignore */}
                        <Card
                          id={_id}
                          type={type}
                          status={status}
                          link={link}
                          title={title}
                          isTwitterScriptLoaded={isTwitterScriptLoaded}
                          setTwitterScriptLoaded={setTwitterScriptLoaded}
                          onDelete={handleDelete}
                          setShareModal={setShareModal}
                          setSharelink={setSharelink}
                        />
                      </div>
                    );
                  })
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
