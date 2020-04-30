import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chat } from "../../model";
import { getChatById } from "../../services/chat.service";
import { ChatInfo } from "./ChatInfo";
import { ChatMessages } from "./ChatMessages";
import { ChatMessagesWriter } from "./ChatMessageWriter";

export const ChatPage: FC = () => {
  let { chatId } = useParams<{ chatId: string }>();

  const [chat, setChat] = useState<Chat>();

  useEffect(() => {
    getChatById(chatId).then((chat) => {
      setChat(chat);
    });
  }, [chatId]);

  if (!chat) {
    return <div>LOADING</div>;
  }
  return (
    <div>
      <ChatInfo chat={chat} />
      <div className="mb-12 flex flex-grow flex-col overflow-y-auto">
        <ChatMessages chatId={chatId} />
      </div>
      <div className="fixed bottom-0 w-full flex justify-center bg-white border-t-2 p-1">
        <ChatMessagesWriter chatId={chatId} />
      </div>
    </div>
  );
};
