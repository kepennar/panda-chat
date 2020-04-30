import {
  publicChatsChangesListener,
  ChatsChangedCallbackType,
} from "../services/chat.service";
import { useEffect } from "react";

export function usePublicChatsChangedEffect(
  callback: ChatsChangedCallbackType
) {
  useEffect(() => {
    publicChatsChangesListener.registerOnChanges(callback);
    return () => {
      publicChatsChangesListener.unregisterOnChanges(callback);
    };
  }, [callback]);
}
