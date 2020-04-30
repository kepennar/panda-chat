import { struct } from "superstruct/lib/index.js";
import { ValidationError } from "./Errors";

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export const UserStruct = struct({
  uid: "string",
  displayName: "string",
  email: "string?",
  photoURL: "string",
});

export function validateUser(data: any): data is User {
  try {
    UserStruct(data);
  } catch (error) {
    throw new ValidationError(error);
  }
  return true;
}
