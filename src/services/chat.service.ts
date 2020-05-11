import firebase from "firebase/app";
import { db, functions } from "../config/firebase.config";
import { CHAT_COLLECTION_NAME, User } from "../model";
import { connectedUser } from "./auth.service";

export function getPublicChatQuery() {
  return db.collection(CHAT_COLLECTION_NAME).where("isPrivate", "==", false);
}
export function getPrivateChatQuery(user: User) {
  return db
    .collection(CHAT_COLLECTION_NAME)
    .where("memberIds", "array-contains", user.uid)
    .where("isPrivate", "==", true);
}

export function getChatByIdRef(chatId: string) {
  return db.doc(`${CHAT_COLLECTION_NAME}/${chatId}`);
}

export async function saveChatDocument(chatName: string, isPrivate: boolean) {
  await db
    .collection(CHAT_COLLECTION_NAME)
    .doc()
    .set({
      name: chatName,
      isPrivate,
      memberIds: [connectedUser.get()?.uid],
      createdAt: firebase.firestore.Timestamp.now(),
      createdBy: connectedUser.get(),
    });
}

export async function deleteChatDocument(chatId: string) {
  await db.collection(CHAT_COLLECTION_NAME).doc(chatId).delete();
}

const inviteToChatFunction = functions.httpsCallable("inviteToChat");

export async function inviteToChat(chatId: string, email: string) {
  await inviteToChatFunction({ chatId, email });
}
