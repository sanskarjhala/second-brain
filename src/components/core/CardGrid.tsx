import { Card } from "../ui/Card";

type ContentType = "youtube" | "twitter";

const DUMMY_CARDS = [
  {
    id: 1,
    title: "React in 100 Seconds",
    link: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
    type: "youtube" as const,
  },
  {
    id: 2,
    title: "Andrej Karpathy on LLMs",
    link: "https://x.com/karpathy/status/1617979122625712128",
    type: "twitter" as const,
  },
  {
    id: 3,
    title: "CSS Grid Full Course",
    link: "https://www.youtube.com/watch?v=uuOXPWCh-6o",
    type: "youtube" as const,
  },
  {
    id: 4,
    title: "Sam Altman on AGI",
    link: "https://x.com/sama/status/1599669571795185664",
    type: "twitter" as const,
  },
  {
    id: 5,
    title: "TypeScript in 100 Seconds",
    link: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA",
    type: "youtube" as const,
  },
  {
    id: 6,
    title: "Dan Abramov on React",
    link: "https://x.com/dan_abramov/status/1620736054209757185",
    type: "twitter" as const,
  },
];

interface CardGridProps {
  filter?: ContentType;
}

export const CardGrid = ({ filter }: CardGridProps) => {
  const cards = filter
    ? DUMMY_CARDS.filter((c) => c.type === filter)
    : DUMMY_CARDS;

  return (
    <div className="flex flex-wrap justify-center">
      {cards.length === 0 ? (
        <p className="text-gray-500 mt-10">No content found.</p>
      ) : (
        cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            link={card.link}
            type={card.type}
          />
        ))
      )}
    </div>
  );
};
