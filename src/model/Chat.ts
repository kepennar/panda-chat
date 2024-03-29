import { struct } from "superstruct/lib/index.js";
import { ValidationError } from "./Errors";
import { TimestampStruct } from "./Timestamp";
import { UserStruct, User } from "./User";

export interface Chat {
  uid: string;
  name: string;
  isPrivate?: boolean;
  memberIds: string[];
  createdAt: firebase.firestore.Timestamp;
  createdBy: User;
}
export const CHAT_COLLECTION_NAME = "chats";

const ChatStruct = struct({
  uid: "string",
  name: "string",
  isPrivate: "boolean?",
  memberIds: ["string"],
  createdAt: TimestampStruct,
  createdBy: UserStruct,
});

export function validateChat(data: any): data is Chat {
  try {
    ChatStruct(data);
  } catch (error) {
    throw new ValidationError(error);
  }
  return true;
}

export const ChatConverter: firebase.firestore.FirestoreDataConverter<Chat> = {
  fromFirestore(snapshot, options) {
    const chatData = { uid: snapshot.id, ...snapshot.data() };

    if (validateChat(chatData)) {
      return chatData;
    } else {
      throw new Error("Invalidate chat data");
    }
  },
  toFirestore(chat) {
    return chat;
  },
};
