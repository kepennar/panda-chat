import * as firebaseApp from "firebase/app";
import * as firebaseTesting from "@firebase/testing";
import * as firebaseAdmin from "firebase-admin";
import {
  alice,
  bob,
  buildChatData,
  buildTestRequest,
  mockResponse,
  UserWithPassword,
} from "../../../../tests/helpers";
import { getInviteToChatHandler } from "../inviteToChat";

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error(`"FIREBASE_PROJECT_ID" must be defined in env file`);
}

const testConfig = {
  projectId,
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  credential: firebaseAdmin.credential.applicationDefault(),
};

const admin = firebaseAdmin.initializeApp(testConfig, "admin");
const db = admin.firestore();
firebaseTesting.initializeTestApp(testConfig);
const userApp = firebaseApp.initializeApp(testConfig, `user`);

const inviteToChatHandler = getInviteToChatHandler(admin);

async function getUserToken(user: UserWithPassword) {
  await admin.auth().createUser(user);
  const userCreds = await userApp
    .auth()
    .signInWithEmailAndPassword(user.email, user.password);
  return userCreds.user?.getIdToken();
}

describe("Invite to chat", () => {
  let aliceToken: string | undefined;
  let bobToken: string | undefined;

  beforeEach(async () => {
    // Clear the database between tests
    try {
      await admin.auth().deleteUser(alice.uid);
      await admin.auth().deleteUser(bob.uid);
    } catch (error) {
      console.log(error.message);
    }

    await firebaseTesting.clearFirestoreData({
      projectId: testConfig.projectId,
    });
    // Insert Bob and Alice in db
    await db.collection("users").doc(alice.uid).set(alice);
    await db.collection("users").doc(bob.uid).set(bob);

    // Get token for users
    aliceToken = await getUserToken(alice);
    bobToken = await getUserToken(bob);
  }, 10000);

  it("should not be able to call function if unauthenticated", async () => {
    const req = buildTestRequest({});
    const res = mockResponse();

    await inviteToChatHandler(req, res);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({ message: "Unauthorized" });
  });

  it("should reject an invalid query", async () => {
    const req = buildTestRequest(
      { wrongParam: "wrong" },
      { authorization: `Bearer ${bobToken}` }
    );
    const res = mockResponse();

    await inviteToChatHandler(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid body",
      errors: "chatId is a required field",
    });
  });

  it("should return an error if chat does not exist", async () => {
    const chatId = "test-chat-id";
    const req = buildTestRequest(
      { email: "test@user.com", chatId },
      { authorization: `Bearer ${bobToken}` }
    );
    const res = mockResponse();

    await inviteToChatHandler(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: `Chat with Id "${chatId}" not found`,
    });
  });

  it("should return an error if user does not exist", async () => {
    const aliceChat = buildChatData(
      "test",
      false,
      alice,
      firebaseAdmin.firestore.Timestamp
    );
    await db.collection("chats").doc(aliceChat.uid).set(aliceChat);

    const req = buildTestRequest(
      {
        email: "test@user.com",
        chatId: aliceChat.uid,
      },
      { authorization: `Bearer ${aliceToken}` }
    );

    const res = mockResponse();

    await inviteToChatHandler(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: `User with email "test@user.com" not found`,
    });
  });

  it("should add user to chat", async () => {
    // Insert Bob in db
    await db.collection("users").doc(bob.uid).set(bob);

    const aliceChat = buildChatData(
      "test",
      false,
      alice,
      firebaseAdmin.firestore.Timestamp
    );
    const aliceChatRef = db.collection("chats").doc(aliceChat.uid);
    await aliceChatRef.set(aliceChat);

    const req = buildTestRequest(
      { email: bob.email, chatId: aliceChat.uid },
      { authorization: `Bearer ${aliceToken}` }
    );
    const res = mockResponse();

    await inviteToChatHandler(req, res);
    const updatedChat = await aliceChatRef.get();

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ data: "User added to chat" });
    expect(updatedChat.data()?.memberIds).toEqual(
      expect.arrayContaining([alice.uid, bob.uid])
    );
  });

  it("should be executed only by the chat owner", async () => {
    const aliceChat = buildChatData(
      "test",
      false,
      alice,
      firebaseAdmin.firestore.Timestamp
    );
    const aliceChatRef = db.collection("chats").doc(aliceChat.uid);
    await aliceChatRef.set(aliceChat);

    const req = buildTestRequest(
      { email: bob.email, chatId: aliceChat.uid },
      { authorization: `Bearer ${bobToken}` }
    );
    const res = mockResponse();

    await inviteToChatHandler(req, res);
    const updatedChat = await aliceChatRef.get();

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: `Chat with Id "${aliceChat.uid}" not found`,
    });
    expect(updatedChat.data()?.memberIds).toEqual(
      expect.arrayContaining([alice.uid])
    );
  });
});
