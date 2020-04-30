import { createContext } from "react";
import { User } from "../model";

interface UserContextType {
  user: User | null;
}
export const UserContext = createContext<UserContextType>({ user: null });
