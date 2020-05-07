import firebase from "firebase/app";
import { db, functions } from "../config/firebase.config";
import { connectedUser } from "./auth.service";
import { Chat, validateChat, CHAT_COLLECTION_NAME } from "../model";
import { createChangesListener } from "./changes.listeners";
import { firestoreSnapshotErrorManager } from "./Errors.service";

export type ChatsChangedCallbackType = (chats: Chat[]) => void;

export const publicChatsChangesListener = createChangesListener<
  ChatsChangedCallbackType
>();

export const privateChatsChangesListener = createChangesListener<
  ChatsChangedCallbackType
>();

export function listPublicChats() {
  return db
    .collection(CHAT_COLLECTION_NAME)
    .where("isPrivate", "==", false)
    .onSnapshot((snapshot) => {
      const chats: Chat[] = [];
      snapshot.forEach((chat) => {
        try {
          const chatData = { uid: chat.id, ...chat.data() };
          if (validateChat(chatData)) {
            chats.push(chatData);
          }
        } catch (error) {
          firestoreSnapshotErrorManager(error.errors);
        }
      });
      publicChatsChangesListener.CALLBACKS.forEach((callback) => {
        callback(chats);
      });
    }, firestoreSnapshotErrorManager);
}

export function listPrivateChats() {
  return db
    .collection(CHAT_COLLECTION_NAME)
    .where("memberIds", "array-contains", connectedUser?.uid)
    .where("isPrivate", "==", true)
    .onSnapshot((snapshot) => {
      const chats: Chat[] = [];
      snapshot.forEach((chat) => {
        try {
          const chatData = { uid: chat.id, ...chat.data() };
          if (validateChat(chatData)) {
            chats.push(chatData);
          }
        } catch (error) {
          firestoreSnapshotErrorManager(error.errors);
        }
      });
      privateChatsChangesListener.CALLBACKS.forEach((callback) => {
        callback(chats);
      });
    }, firestoreSnapshotErrorManager);
}

export async function getChatById(chatId: string): Promise<Chat> {
  const chatDocument = await db.doc(`${CHAT_COLLECTION_NAME}/${chatId}`).get();
  const chatData = { uid: chatId, ...chatDocument.data() };
  validateChat(chatData);
  return chatData as Chat;
}

export async function saveChatDocument(chatName: string, isPrivate: boolean) {
  await db
    .collection(CHAT_COLLECTION_NAME)
    .doc()
    .set({
      name: chatName,
      isPrivate,
      memberIds: [connectedUser?.uid],
      createdAt: firebase.firestore.Timestamp.now(),
      createdBy: connectedUser,
    });
}

export async function deleteChatDocument(chatId: string) {
  await db.collection(CHAT_COLLECTION_NAME).doc(chatId).delete();
}

const inviteToChatFunction = functions.httpsCallable("inviteToChat");

export async function inviteToChat(chatId: string, email: string) {
  const response = await inviteToChatFunction({ chatId, email });
  console.log("[DEBUG]", { response });
}
