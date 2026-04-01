import { useEffect, useState } from "react";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter";
}

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E24B4A">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3-5.5 3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#378ADD">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Card = ({ title, link, type }: CardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => setIsLoading(false);

  useEffect(() => {
    if (type === "twitter" && (window as any).twttr) {
      (window as any).twttr.widgets.load();
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [type, link]);

  return (
    <div className="p-4 m-2 bg-white shadow-md shadow-gray-800 rounded-md outline-2 outline-slate-200 max-w-84">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex gap-4 items-center">
          <a href={link} target="_blank" rel="noreferrer">
            <ShareIcon />
          </a>
          <DeleteIcon />
        </div>
      </div>

      <div className="pt-2">
        {isLoading && (
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded">
            Loading...
          </div>
        )}
        {type === "youtube" && (
          <iframe
            className={`w-full pt-5 ${isLoading ? "hidden" : "block"}`}
            src={link.replace("watch?v=", "embed/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={handleLoad}
          />
        )}
        {type === "twitter" && (
          <blockquote
            className={`twitter-tweet ${isLoading ? "hidden" : "block"}`}
          >
            <a href={link.replace("x.com", "twitter.com")} />
          </blockquote>
        )}
      </div>
    </div>
  );
};
