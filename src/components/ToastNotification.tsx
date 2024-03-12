import { ToastMessageProps } from "@/pages/anime/[slug]";

export default function ToastNotification({
  message,
}: {
  message: ToastMessageProps;
}) {
  return (
    <div
      className={`fixed left-1/2 top-4 z-50 mx-auto w-[95vw] max-w-[600px] -translate-x-1/2 animate-fade-in rounded-lg border-2 bg-gray-800 p-1 text-center text-lg font-semibold text-white md:px-3 md:py-2 md:text-xl ${message.type === "success" ? "border-green-500" : "border-red-500"}`}
    >
      {message.text}
    </div>
  );
}
