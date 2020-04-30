import {
  messagesChangesListener,
  MessagesChangedCallbackType,
} from "../services/message.service";
import { useEffect } from "react";

export function useMessagesChangedEffect(
  callback: MessagesChangedCallbackType
) {
  useEffect(() => {
    messagesChangesListener.registerOnChanges(callback);
    return () => {
      messagesChangesListener.unregisterOnChanges(callback);
    };
  }, [callback]);
}
