import * as admin from "firebase-admin";
import { Request, Response } from "firebase-functions";
import { ValidationError } from "yup";
import { validateFirebaseIdToken } from "../auth/AuthValidator";
import { HttpError } from "../model/HttpError";
import { inviteToChatBodySchema } from "./inviteToChat.model";

export function getInviteToChatHandler(adminApp: admin.app.App) {
  const db = adminApp.firestore();

  async function getChatById(chatId: string) {
    const chatRef = db.doc(`chats/${chatId}`);
    const chatSnapshot = await chatRef.get();
    return chatSnapshot.data();
  }

  async function updateChatById(chatId: string, fields: any) {
    const chatRef = db.doc(`chats/${chatId}`);
    await chatRef.update({ ...fields });
  }

  async function getUserByEmail(email: string) {
    const users = await db
      .collection(`users`)
      .where("email", "==", email)
      .limit(1)
      .get();

    return !users.empty ? users.docs[0] : undefined;
  }
  return async (request: Request, response: Response) => {
    try {
      const decodedToken = await validateFirebaseIdToken(request, adminApp);

      const { chatId, email } = await inviteToChatBodySchema.validate(
        request.body
      );

      const chat = await getChatById(chatId);
      if (!chat || chat.createdBy.uid !== decodedToken.uid) {
        return response.status(400).json({
          message: `Chat with Id "${chatId}" not found`,
        });
      }
      const userDocument = await getUserByEmail(email);
      if (!userDocument) {
        return response.status(400).json({
          message: `User with email "${email}" not found`,
        });
      }

      if (chat.memberIds.includes(userDocument.id)) {
        return response.status(400).json({
          message: `user already a chat member`,
        });
      }
      // Add user in chat
      await updateChatById(chatId, {
        memberIds: [...chat.memberIds, userDocument.id],
      });
      return response.status(200).json({ data: "User added to chat" });
    } catch (error) {
      if (error instanceof HttpError) {
        return response.status(error.code).json({
          message: error.message,
        });
      }
      if (error instanceof ValidationError) {
        return response.status(400).json({
          message: `Invalid body`,
          errors: error.message,
        });
      } else {
        console.error(error);
        return response.status(500).json({ message: "Server error" });
      }
    }
  };
}
