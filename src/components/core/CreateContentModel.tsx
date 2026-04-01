import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "../ui/Button";

interface ModelProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const CreateContentModel = ({ isOpen, onClose }: ModelProps) => {
  return (
    <form>
      {isOpen && (
        <div className="w-screen h-screen bg-slate-400 fixed top-0 left-0 opacity-55 flex justify-center items-center">
          <div className="bg-white opacity-100 p-5 rounded-lg">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  onClose;
                }}
              >
                <CrossIcon />
              </button>
            </div>
            <div>
              <Input placeholder="title" label="Title" />
              <Input placeholder="Link" label="Link" />
            </div>
            <div>
              <Button variant="primary" text="Submit" />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

// @ts-ignore
function Input({
  onChange,
  placeholder,
  label,
}: {
  label: string;
  onChange?: () => void;
  placeholder: string;
}) {
  return (
    <div className="my-2 flex flex-col ">
      <label className="font-semibold">{label}</label>
      <input
        className="px-2 py-2 border-2 rounded-md border-amber-300"
        type="text"
        //@ts-ignore
        onChange={onchange}
        placeholder={placeholder}
      />
    </div>
  );
}
