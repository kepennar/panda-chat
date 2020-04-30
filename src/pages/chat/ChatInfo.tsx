import React, { FC } from "react";
import { Chat } from "../../model";

interface ChatInfoProps {
  chat: Chat;
}

export const ChatInfo: FC<ChatInfoProps> = ({ chat }) => {
  return (
    <div className="flex  items-center space-x-2">
      <h4 className="text-xl">{chat.name}</h4>
      <p className="text-sm">Created by: {chat.createdBy.displayName}</p>
    </div>
  );
};
