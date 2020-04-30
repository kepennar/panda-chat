import { struct } from "superstruct/lib/index.js";
import { User } from "../model";
import { ValidationError } from "./Errors";
import { UserStruct } from "./User";
import { TimestampStruct } from "./Timestamp";

export interface Message {
  uid: string;
  text: string;
  createdAt: firebase.firestore.Timestamp;
  createdBy: User;
}

const MessageStruct = struct({
  uid: "string",
  text: "string",
  createdBy: UserStruct,
  createdAt: TimestampStruct,
});

export function validateMessage(data: any): data is Message {
  try {
    MessageStruct(data);
  } catch (error) {
    throw new ValidationError(error);
  }

  return true;
}
