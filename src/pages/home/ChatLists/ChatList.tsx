import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Dropdown } from "../../../components/Dropdown";
import { Chat, User } from "../../../model";

interface ChatListProps {
  user: User;
  title: string;
  chats: Chat[] | undefined;
  onClick: (chatId: string) => void;
  onInviteToChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}
export const ChatList: FC<ChatListProps> = observer(
  ({ user, title, chats, onClick, onInviteToChat, onDeleteChat }) => {
    if (!chats) {
      return <div>LOADING ...</div>;
    }
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
            <span className="text-sm">{`${chat.memberIds.length} members`}</span>
            {user?.uid === chat.createdBy.uid && (
              <span className="text-sm">(Owner)</span>
            )}
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
  }
);
