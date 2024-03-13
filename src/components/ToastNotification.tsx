import { MessageObject } from "@/hooks/useMessage";

type ToastNotificationProps = {
  message: MessageObject;
};

export default function ToastNotification({ message }: ToastNotificationProps) {
  return (
    <div
      className={`fixed left-1/2 top-0 z-50 mx-auto w-[95vw] max-w-[600px] -translate-x-1/2 animate-fade-in rounded-b-lg border-x-2 border-b-2 bg-gray-800 p-1 text-center text-lg font-semibold text-white md:px-3 md:py-2 md:text-xl ${message.type === "success" ? "border-green-500" : "border-red-500"}`}
    >
      {message.text}
    </div>
  );
}
