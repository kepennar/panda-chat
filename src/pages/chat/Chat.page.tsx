import React, { FC } from "react";
import { useParams } from "react-router-dom";
import {
  useObservableFirestoreQuery,
  useObservableFirestoreReference,
} from "src/observable-firestore";
import { connectedUser } from "src/services/auth.service";
import { getChatMessageQuery } from "src/services/message.service";
import { ChatConverter, MessageConverter } from "../../model";
import { getChatByIdRef } from "../../services/chat.service";
import { ChatInfo } from "./ChatInfo";
import { ChatMessages } from "./ChatMessages";
import { ChatMessagesWriter } from "./ChatMessageWriter";

export const ChatPage: FC = () => {
  let { chatId } = useParams<{ chatId: string }>();

  const messages = useObservableFirestoreQuery(
    getChatMessageQuery(chatId),
    MessageConverter,
    [chatId]
  );

  const chat = useObservableFirestoreReference(
    getChatByIdRef(chatId),
    ChatConverter,
    [chatId]
  );

  return (
    <div>
      <ChatInfo chat={chat} />
      <div className="mb-12 flex flex-grow flex-col overflow-y-auto">
        {messages && (
          <ChatMessages user={connectedUser.get()} messages={messages} />
        )}
      </div>
      <div className="fixed bottom-0 w-full flex justify-center bg-white border-t-2 p-1">
        <ChatMessagesWriter chatId={chatId} />
      </div>
    </div>
  );
};
