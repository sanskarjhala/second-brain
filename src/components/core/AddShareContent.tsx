import { useState } from "react";
import { PlusIcon } from "../../icons/PlusIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { Button } from "../ui/Button";
import { CreateContentModel } from "./CreateContentModel";
import { AddContent } from "../../apis/contentApis"; 
import toast from "react-hot-toast";

export const AddShareContent = ({ onContentAdded }: { onContentAdded?: () => void }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (data: { type: any; title: string; link: string }) => {
    const toastId = toast.loading("Saving to your brain...");

    const response = await AddContent({
      link: data.link,
      title: data.title,
      type: data.type,
    });

    if (!response.success) {
      toast.error(response.message || "Failed to add content", { id: toastId });
      return;
    }

    toast.success("Saved to your brain!", { id: toastId });
    onContentAdded?.(); 
  };

  return (
    <>
      <div className="flex justify-end gap-5">
        <Button
          text="Add Content"
          starticon={<PlusIcon />}
          variant="primary"
          onClick={() => setModalOpen(true)}
        />
        <Button
          text="Share Brain"
          starticon={<ShareIcon />}
          variant="secondary"
        />
      </div>

      <CreateContentModel
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};