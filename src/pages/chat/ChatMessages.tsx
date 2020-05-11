import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { ChatMessage } from "../../components/ChatMessage";
import { Message, User } from "../../model";

interface ChatMessagesProps {
  user: User | null;
  messages: Message[];
}

export const ChatMessages: FC<ChatMessagesProps> = observer(
  ({ user, messages }) => {
    return (
      <div className="flex flex-col items-center h-full">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            fromCurrentUser={message.createdBy.uid === user?.uid}
          />
        ))}
      </div>
    );
  }
);
