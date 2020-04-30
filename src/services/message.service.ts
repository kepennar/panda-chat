import firebase from "firebase/app";
import { db } from "../config/firebase.config";
import { Message, validateMessage, CHAT_COLLECTION_NAME } from "../model";
import { connectedUser } from "./auth.service";
import { createChangesListener } from "./changes.listeners";
import { firestoreSnapshotErrorManager } from "./Errors.service";

export type MessagesChangedCallbackType = (messages: Message[]) => void;

export const messagesChangesListener = createChangesListener<
  MessagesChangedCallbackType
>();

export function listChatMessages(chatId: string) {
  return db
    .collection(`${CHAT_COLLECTION_NAME}/${chatId}/messages`)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((message) => {
        try {
          const messageData = { uid: message.id, ...message.data() };
          if (validateMessage(messageData)) {
            messages.push(messageData);
          }
        } catch (error) {
          console.error(error.errors);
        }
      });
      messagesChangesListener.CALLBACKS.forEach((callback) => {
        callback(messages);
      });
    }, firestoreSnapshotErrorManager);
}

export async function saveChatMessageDocument(chatId: string, text: string) {
  await db.collection(`${CHAT_COLLECTION_NAME}/${chatId}/messages`).doc().set({
    text: text,
    createdAt: firebase.firestore.Timestamp.now(),
    createdBy: connectedUser,
  });
}
