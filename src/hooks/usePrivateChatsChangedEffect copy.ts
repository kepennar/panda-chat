import {
  privateChatsChangesListener,
  ChatsChangedCallbackType,
} from "../services/chat.service";
import { useEffect } from "react";

export function usePrivateChatsChangedEffect(
  callback: ChatsChangedCallbackType
) {
  useEffect(() => {
    privateChatsChangesListener.registerOnChanges(callback);
    return () => {
      privateChatsChangesListener.unregisterOnChanges(callback);
    };
  }, [callback]);
}
