import React, { FC } from "react";
import { useObserver } from "mobx-react-lite";
import { saveChatDocument } from "../../services/chat.service";
import { ChatLists } from "./ChatLists";
import { NewChat } from "./NewChat";
import { connectedUser } from "src/services/auth.service";

export const HomePage: FC = () => {
  const handleCreate = (chatName: string, isPrivate: boolean) => {
    saveChatDocument(chatName, isPrivate);
  };
  return (
    <div>
      <NewChat onCreate={handleCreate} />
      {useObserver(() => {
        const user = connectedUser.get();
        return user && <ChatLists user={user} />;
      })}
    </div>
  );
};
