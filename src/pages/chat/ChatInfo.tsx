import React, { FC } from "react";
import { Chat } from "../../model";
import { IObservableValue } from "mobx";
import { observer } from "mobx-react-lite";

interface ChatInfoProps {
  chat: IObservableValue<Chat | undefined>;
}

export const ChatInfo: FC<ChatInfoProps> = observer(({ chat }) => {
  const chatData = chat.get();
  if (!chatData) {
    return <div>LOADING</div>;
  }

  return (
    <div className="flex  items-center space-x-2">
      <h4 className="text-xl">{chatData.name}</h4>
      <p className="text-sm">Created by: {chatData.createdBy.displayName}</p>
    </div>
  );
});
