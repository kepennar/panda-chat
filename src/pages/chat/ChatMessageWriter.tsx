import React, { FC, FormEvent, useState } from "react";
import { saveChatMessageDocument } from "../../services/message.service";

interface ChatMessagesWriterProps {
  chatId: string;
}
export const ChatMessagesWriter: FC<ChatMessagesWriterProps> = ({ chatId }) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessageText("");
    saveChatMessageDocument(chatId, messageText);
  };
  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <div className="flex items-center border-b border-b-2 border-black py-2">
        <input
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          className="bg-white focus:outline-none focus:shadow-outline appearance-none bg-transparent border-none py-2 px-4 block w-full appearance-none leading-normal"
          type="text"
          placeholder="Send a message"
        />
        <button
          className="flex-shrink-0 bg-black hover:text-gray-400 border-black text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
          disabled={!messageText}
        >
          Send
        </button>
      </div>
    </form>
  );
};
