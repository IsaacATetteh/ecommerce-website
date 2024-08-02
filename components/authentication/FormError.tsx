import { CiCircleAlert } from "react-icons/ci";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="flex items-center gap-2 pl-4 py-4 bg-destructive/80 text-white my-5 w-full">
      <CiCircleAlert className="w-6 h-6" />
      <p className="font-medium">{message}</p>
    </div>
  );
};
