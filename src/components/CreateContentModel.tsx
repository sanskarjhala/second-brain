import { CrossIcon } from "../icons/CrossIcon";

// @ts-ignore
export const CreateContentModel = ({ open, onClose }) => {
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 opacity-55 flex justify-center items-center ">
          <div className="bg-white opacity-100 max-h-64 max-w-96 p-5 rounded-lg">
            <div className="flex justify-end">
              <CrossIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
