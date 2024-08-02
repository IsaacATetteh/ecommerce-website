import { CiCircleCheck } from "react-icons/ci";

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="flex items-center gap-2 pl-4 py-4 bg-[#D2FBDF] text-[#32885F] my-5 w-full">
      <CiCircleCheck className="w-6 h-6" />
      <p className="font-medium">{message}</p>
    </div>
  );
};
