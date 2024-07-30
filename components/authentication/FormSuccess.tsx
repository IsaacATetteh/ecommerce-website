import { CiCircleCheck } from "react-icons/ci";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="bg-green-400">
      <CiCircleCheck className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
