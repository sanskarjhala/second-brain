import { PlusIcon } from "../../icons/PlusIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { Button } from "../ui/Button";

export const AddShareContent = () => {

  return (
    <div>
      <div className="flex justify-end gap-5">
        <Button text="Add Content" starticon={<PlusIcon />} variant="primary"/>
        <Button
          text="Share Brain"
          starticon={<ShareIcon />}
          variant="secondary"
        />
      </div>
    </div>
  );
};
