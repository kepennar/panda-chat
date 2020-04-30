import React, { FC, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { usePrivateChatsChangedEffect } from "../../hooks/usePrivateChatsChangedEffect copy";
import { usePublicChatsChangedEffect } from "../../hooks/usePublicChatsChangedEffect";
import { Chat } from "../../model";
import {
  deleteChatDocument,
  listPrivateChats,
  listPublicChats,
  saveChatDocument,
  inviteToChat,
} from "../../services/chat.service";
import { ChatList } from "./ChatList";
import { NewChat } from "./NewChat";
import { Modal } from "../../components/Modal";
import { InviteForm } from "./InviteForm";

export const HomePage: FC = () => {
  const [publicChats, setPublicChats] = useState<Chat[]>([]);
  const [privateChats, setPrivateChats] = useState<Chat[]>([]);
  const [inviteModalChatId, setInviteModalChatId] = useState<string | null>(
    null
  );

  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    return listPublicChats();
  }, []);

  useEffect(() => {
    if (user) {
      return listPrivateChats();
    }
  }, [user]);

  const handleCreate = (chatName: string, isPrivate: boolean) => {
    saveChatDocument(chatName, isPrivate);
  };

  usePublicChatsChangedEffect(setPublicChats);
  usePrivateChatsChangedEffect(setPrivateChats);

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
      <NewChat onCreate={handleCreate} />
      <ChatList
        title="Public"
        chats={publicChats}
        onClick={handleChatSelected}
        onInviteToChat={handleAskInviteToChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatList
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
