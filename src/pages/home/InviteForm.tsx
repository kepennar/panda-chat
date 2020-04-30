import React, { FC, FormEvent, useState } from "react";

interface InviteFormProps {
  onInviteToChat: (email: string) => void;
}
export const InviteForm: FC<InviteFormProps> = ({ onInviteToChat }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInviteToChat(email);
  };
  return (
    <form
      className="flex flex-col items-center w-full border-b-2 pb-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h3>Invite someone</h3>
        <div className="flex items-center border-b border-b-2 border-black py-2 max-w-sm">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-white focus:outline-none focus:shadow-outline appearance-none bg-transparent border-none py-2 px-4 block w-full appearance-none leading-normal"
            type="text"
            placeholder="Email"
          />
          <button
            className="flex-shrink-0 bg-black hover:text-gray-400 border-black text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
            disabled={!email}
          >
            Invite
          </button>
        </div>
      </div>
    </form>
  );
};
