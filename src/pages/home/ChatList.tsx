import React, { FC, useContext } from "react";
import { Dropdown } from "../../components/Dropdown";
import { UserContext } from "../../contexts/user.context";
import { Chat } from "../../model";

interface ChatListProps {
  title: string;
  chats: Chat[];
  onClick: (chatId: string) => void;
  onInviteToChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}
export const ChatList: FC<ChatListProps> = ({
  title,
  chats,
  onClick,
  onInviteToChat,
  onDeleteChat,
}) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h5>{title}</h5>
      {chats.map((chat, index) => (
        <div
          key={index}
          onClick={() => onClick(chat.uid)}
          className="flex justify-between px-2 py-2  hover:bg-gray-100 rounded border-b-1 cursor-pointer"
        >
          <h5 className="h-5 font-bold">{chat.name}</h5>
          <span className="text-sm">({chat.createdBy.displayName})</span>
          {chat.createdBy.uid === user?.uid && (
            <div>
              <Dropdown>
                {chat.isPrivate && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onInviteToChat(chat.uid);
                    }}
                    className="bg-white text-black hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4"
                  >
                    Invite
                  </button>
                )}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteChat(chat.uid);
                  }}
                  className="bg-white text-red-600 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4"
                >
                  Supprimer
                </button>
              </Dropdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
