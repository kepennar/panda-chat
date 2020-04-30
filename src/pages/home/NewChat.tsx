import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import { Switch } from "../../components/Switch";

interface NewChatProps {
  onCreate: (chatName: string, isPrivate: boolean) => void;
}
export const NewChat: FC<NewChatProps> = ({ onCreate }) => {
  const [chatName, setChatName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  const handlePrivateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChatName("");
    onCreate(chatName, isPrivate);
  };
  return (
    <form
      className="flex flex-col items-center w-full border-b-2 pb-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h3>Create a chat</h3>
        <div className="flex items-center border-b border-b-2 border-black py-2 max-w-sm">
          <input
            value={chatName}
            onChange={(event) => setChatName(event.target.value)}
            className="bg-white focus:outline-none focus:shadow-outline appearance-none bg-transparent border-none py-2 px-4 block w-full appearance-none leading-normal"
            type="text"
            placeholder="Chat name"
          />
          <button
            className="flex-shrink-0 bg-black hover:text-gray-400 border-black text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
            disabled={!chatName}
          >
            Create
          </button>
        </div>
        <div>
          <Switch
            id="private"
            label="Private"
            checked={isPrivate}
            onChange={handlePrivateChange}
          />
        </div>
      </div>
    </form>
  );
};
