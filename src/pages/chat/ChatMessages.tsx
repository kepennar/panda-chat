import React, { FC, useContext, useState, useEffect } from "react";
import { ChatMessage } from "../../components/ChatMessage";
import { UserContext } from "../../contexts/user.context";
import { useMessagesChangedEffect } from "../../hooks/useMessagesChangedEffect";
import { Message } from "../../model";
import { listChatMessages } from "../../services/message.service";

interface ChatMessagesProps {
  chatId: string;
}

export const ChatMessages: FC<ChatMessagesProps> = ({ chatId }) => {
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState<Message[]>([]);
  useMessagesChangedEffect(setMessages);

  useEffect(() => {
    const unsubscribe = listChatMessages(chatId);
    return unsubscribe;
  }, [chatId]);

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
};
