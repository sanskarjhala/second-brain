import { useEffect, useState } from "react";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter";
}

export const Card = ({ title, link, type }: CardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (type === "twitter" && (window as any).twttr) {
      (window as any).twttr.widgets.load();

      setTimeout(() => {
        setIsLoading(false);
      }, 1500); 
    }
  }, [type, link]);
  return (
    <div>
      <div className=" p-4 m-2 bg-white shadow-md shadow-gray-800 rounded-md outline-2 outline-slate-200 max-w-96">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="px-2">
              <ShareIcon />
            </span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex gap-4 items-center ">
            <a href={link} target="_blank">
              <ShareIcon />
            </a>
            <DeleteIcon />
          </div>
        </div>

        <div className="pt-2">
          {isLoading && (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100">
              Loading ...
            </div>
          )}
          {type === "youtube" && (
            <iframe
              className={`w-full pt-5 ${isLoading ? "hidden" : "block"}`}
              src={link.replace("watch?v=", "embed/")}
              title="YouTube video player"
              //   frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={handleLoad}
            ></iframe>
          )}

          {type === "twitter" && (
            <blockquote className={`twitter-tweet ${isLoading ? "hidden" : "block"}`}>
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};
