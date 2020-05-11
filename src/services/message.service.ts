import firebase from "firebase/app";
import { db } from "../config/firebase.config";
import { CHAT_COLLECTION_NAME, Message } from "../model";
import { connectedUser } from "./auth.service";
export type MessagesChangedCallbackType = (messages: Message[]) => void;

export function getChatMessageQuery(chatId: string) {
  return db
    .collection(`${CHAT_COLLECTION_NAME}/${chatId}/messages`)
    .orderBy("createdAt", "desc");
}

export async function saveChatMessageDocument(chatId: string, text: string) {
  await db.collection(`${CHAT_COLLECTION_NAME}/${chatId}/messages`).doc().set({
    text: text,
    createdAt: firebase.firestore.Timestamp.now(),
    createdBy: connectedUser.get(),
  });
}
