import classnames from "classnames";
import React, { FC } from "react";
import { Message } from "../../model";
import { Avatar } from "../Avatar";

interface ChatMessageProps {
  message: Message;
  fromCurrentUser: boolean;
}
export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  fromCurrentUser,
}) => {
  return (
    <div
      className={classnames("flex items-center w-full max-w-lg", {
        "flex-row-reverse": fromCurrentUser,
      })}
    >
      <div>
        <Avatar user={message.createdBy} displayYou={fromCurrentUser} />
      </div>
      <div className="flex-grow">
        <div className="max-w-sm flex flex-grow p-6 my-4 mx-2 bg-white rounded-lg shadow-xl">
          <div className="flex w-full justify-between content-center pt-1">
            <p className="text-base text-gray-600 leading-normal">
              {message.text}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {message.createdAt.toDate().toLocaleDateString()}{" "}
          {message.createdAt.toDate().toLocaleTimeString()}
        </p>
      </div>
      <div className="w-20" />
    </div>
  );
};
