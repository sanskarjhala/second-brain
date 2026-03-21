import { AddShareContent } from "../components/core/AddShareContent";

export const Notes = () => {
  return (
    <div className="mt-4 mr-5">
      <div className="flex justify-between items-center my-6">
        <h1 className="font-semibold text-4xl">All Notes</h1>
        <AddShareContent />
      </div>
    </div>
  );
};
