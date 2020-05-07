import * as corsMiddleware from "cors";
import { https } from "firebase-functions";
import { getInviteToChatHandler } from "./inviteToChat";
import { adminApp } from "./firebaseAdmin";

const cors = corsMiddleware({
  origin: true,
});

const inviteToChatHandler = getInviteToChatHandler(adminApp);

export const inviteToChat = https.onRequest((request, response) =>
  cors(request, response, () => inviteToChatHandler(request, response))
);
