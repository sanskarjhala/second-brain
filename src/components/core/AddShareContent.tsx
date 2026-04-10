import { useState } from "react";
import { PlusIcon } from "../../icons/PlusIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { Button } from "../ui/Button";
import { CreateContentModel } from "./CreateContentModel";

export const AddShareContent = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
        onSubmit={(data) => {
          console.log("New content:", data);
          // hook up to your API/store here
        }}
      />
    </>
  );
};