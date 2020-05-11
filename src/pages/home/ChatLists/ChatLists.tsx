import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "src/components/Modal";
import { ChatConverter, User } from "src/model";
import { useObservableFirestoreQuery } from "src/observable-firestore";
import {
  deleteChatDocument,
  getPrivateChatQuery,
  getPublicChatQuery,
  inviteToChat,
} from "src/services/chat.service";
import { ChatList } from "./ChatList";
import { InviteForm } from "./InviteForm";

interface ChatListsProps {
  user: User;
}
export const ChatLists: FC<ChatListsProps> = ({ user }) => {
  const history = useHistory();
  const [inviteModalChatId, setInviteModalChatId] = useState<string | null>(
    null
  );
  const publicChats = useObservableFirestoreQuery(
    getPublicChatQuery(),
    ChatConverter,
    []
  );

  const privateChats = useObservableFirestoreQuery(
    getPrivateChatQuery(user),
    ChatConverter,
    [user]
  );

  const handleChatSelected = (chatId: string) => {
    history.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatDocument(chatId);
  };

  const handleAskInviteToChat = (chatId: string) => {
    setInviteModalChatId(chatId);
  };

  const handleInviteToChat = async (chatId: string, email: string) => {
    await inviteToChat(chatId, email);
    setInviteModalChatId(null);
  };

  return (
    <div>
      <ChatList
        user={user}
        title="Public"
        chats={publicChats}
        onClick={handleChatSelected}
        onInviteToChat={handleAskInviteToChat}
        onDeleteChat={handleDeleteChat}
      />

      <ChatList
        user={user}
        title="Private"
        chats={privateChats}
        onClick={handleChatSelected}
        onInviteToChat={handleAskInviteToChat}
        onDeleteChat={handleDeleteChat}
      />
      <Modal
        isOpen={!!inviteModalChatId}
        onClose={() => {
          setInviteModalChatId(null);
        }}
      >
        <InviteForm
          onInviteToChat={(email) =>
            inviteModalChatId && handleInviteToChat(inviteModalChatId, email)
          }
        />
      </Modal>
    </div>
  );
};
