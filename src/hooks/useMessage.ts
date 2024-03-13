import { useEffect, useState } from "react";

export type MessageObject = {
  text: string;
  type: "success" | "error" | "";
};

export default function useMessage() {
  const emptyMessage: MessageObject = {
    text: "",
    type: "",
  };

  const [message, setMessage] = useState<MessageObject>(emptyMessage);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setMessage(emptyMessage);
    }, 4000);
    return () => clearTimeout(timeOut);
  });

  return [message, setMessage] as const;
}
