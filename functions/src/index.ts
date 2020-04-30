import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsMiddleware from "cors";

const cors = corsMiddleware({
  origin: true,
});
admin.initializeApp();

export const inviteToChate = functions.https.onRequest((request, response) =>
  cors(request, response, async () => {
    const { chatId, email } = request.body.data;
    if (!chatId || !email) {
      return response.status(400).json({
        message: `Invalid body. Required both "chatId" and "email" fields. Received "${JSON.stringify(
          request.body
        )}"`,
      });
    }

    const chatRef = admin.firestore().doc(`chats/${chatId}`);
    const chatSnapshot = await chatRef.get();
    const chat = chatSnapshot.data();
    if (!chat) {
      return response.status(400).json({
        message: `Chat with Id "${chatId}" not found`,
      });
    }

    const users = await admin
      .firestore()
      .collection(`users`)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (users.empty) {
      return response.status(400).json({
        message: `user with email "${email}" not found`,
      });
    }
    const userDocument = users.docs[0];

    if (chat.memberIds.includes(userDocument.id)) {
      return response.status(400).json({
        message: `user already a chat member`,
      });
    }
    // Add user in chat
    await chatRef.update({
      memberIds: [...chat.memberIds, userDocument.id],
    });
    return response.status(200).json({ data: "User added to chat" });
  })
);
