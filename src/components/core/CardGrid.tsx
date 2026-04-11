import { useEffect, useState, useRef } from "react";
import { Card } from "../ui/Card";
import { useOutletContext } from "react-router-dom";
import { getAllContent } from "../../apis/contentApis";

type ContentType = "youtube" | "twitter" | "article" | "github" | "website";

interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  status: "processing" | "ready" | "failed";
}

interface CardGridProps {
  filter?: ContentType;
}

export const CardGrid = ({ filter }: CardGridProps) => {
  const [cards, setCards] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardsRef = useRef<ContentItem[]>([]);

  const context = useOutletContext<{ refreshKey: number } | null>();
  const refreshKey = context?.refreshKey ?? 0;

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token-brain");
      const response = await getAllContent(token!);

      if (!response.success) {
        setError(response.message ?? "Failed to load content");
        return;
      }

      const content = Array.isArray(response.content.response)
        ? response.content.response
        : [];
      setCards(content);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [refreshKey]);

  // polling — runs once on mount, uses ref internally
  useEffect(() => {
    const interval = setInterval(async () => {
      // check ref for processing cards
      const hasProcessing = cardsRef.current.some(
        (c) => c.status === "processing",
      );

      if (!hasProcessing) return; // nothing to poll for

      const token = localStorage.getItem("token-brain");
      const response = await getAllContent(token!);

      if (!response.success) return;

      const updated: ContentItem[] = Array.isArray(response.content)
        ? response.content
        : [];

      // check if any status actually changed
      const hasChanges = updated.some((fresh) => {
        const existing = cardsRef.current.find((c) => c._id === fresh._id);
        return existing && existing.status !== fresh.status;
      });

      if (!hasChanges) return; // nothing changed → skip re-render

      // only update status field, keep everything else same
      setCards((prevCards) =>
        prevCards.map((card) => {
          const fresh = updated.find((c) => c._id === card._id);
          if (fresh && fresh.status !== card.status) {
            return { ...card, status: fresh.status };
          }
          return card;
        }),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []); 

  const filteredCards = filter ? cards.filter((c) => c.type === filter) : cards;

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-80 h-48 bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 gap-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={fetchContent}
          className="text-sm px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 gap-2">
        <p className="text-gray-400 text-sm">
          {filter
            ? `No ${filter} content found.`
            : "Your brain is empty. Add some content!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center">
      {filteredCards.map((card) => (
        <Card
          key={card._id}
          title={card.title}
          link={card.link}
          type={card.type}
          status={card.status}
          onDelete={fetchContent}
        />
      ))}
    </div>
  );
};
