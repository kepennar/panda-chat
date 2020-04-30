import * as firebase from "@firebase/testing";
import * as fs from "fs";
import { saveChatDocument } from "../services/chat.service";
import { User, Chat, Message } from "../model";
import { resolve } from "dns";

const rules = fs.readFileSync("firestore.rules", "utf8");
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error(
    `"REACT_APP_FIREBASE_PROJECT_ID" must be defined in env file`
  );
}

const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;
const testConfig = {
  projectId,
  auth: { uid: "alice", email: "alice@example.com" },
};
firebase.initializeTestApp(testConfig);

function anonymousApp() {
  return firebase.initializeTestApp({ projectId }).firestore();
}
function authApp(auth: { uid: string; email: string }) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

function buildChatData(
  name: string,
  isPrivate: boolean,
  createdBy: User
): Chat {
  return {
    uid: `${createdBy.displayName}_${isPrivate}_chat`,
    name,
    isPrivate,
    memberIds: [createdBy.uid],
    createdBy,
    createdAt: firebase.firestore.Timestamp.now(),
  };
}

function buildMessageData(text: string, createdBy: User): Message {
  return {
    uid: `${createdBy.displayName}_message`,
    text,
    createdBy,
    createdAt: firebase.firestore.Timestamp.now(),
  };
}

const alice: User = {
  uid: "alice_uid",
  displayName: "Alice",
  email: "alice@mail.com",
};

const bob: User = {
  uid: "bob_uid",
  displayName: "Bob",
  email: "bob@mail.com",
};

describe("Firestore rules", () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId,
      rules,
    });
  });

  beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId: testConfig.projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
  });

  describe("Anonymous user", () => {
    it("should require user logged in", async () => {
      const db = anonymousApp();
      const profileRes = db.collection("users").doc("alice").get();
      await expect(profileRes).rejects.toBeDefined();
    });
  });

  describe("Authenticated user", () => {
    it("should get current user", async () => {
      const db = authApp(alice);
      const profile = db.collection("users").doc(alice.uid).get();
      await expect(profile).resolves.toBeDefined();
    });

    it("should be able to create a chat", async () => {
      const db = authApp(alice);
      const chatRes = db
        .collection("chats")
        .doc()
        .set(buildChatData("test", false, alice));
      await expect(chatRes).resolves.toBeUndefined();
    });

    it("should be able to access a public chat", async () => {
      const aliceApp = authApp(alice);

      const aliceChatData = buildChatData("test", false, alice);
      const chatRes = aliceApp
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);

      await expect(chatRes).resolves.toBeUndefined();

      const bobApp = authApp(bob);
      const bobReadAliceChat = bobApp.doc(`chats/${aliceChatData.uid}`).get();

      await expect(bobReadAliceChat).resolves.toBeDefined();
    });

    it("should not be able to access a private chat", async () => {
      const aliceApp = authApp(alice);
      const aliceChatData = buildChatData("test", true, alice);

      const chatRes = aliceApp
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);
      await expect(chatRes).resolves.toBeUndefined();

      const bobApp = authApp(bob);
      const bobReadAliceChat = bobApp.doc(`chats/${aliceChatData.uid}`).get();
      await expect(bobReadAliceChat).rejects.toBeDefined();
    });

    it("should not be able to access a private message", async () => {
      const aliceApp = authApp(alice);
      const aliceChatData = buildChatData("test", true, alice);

      const chatRes = aliceApp
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);
      await expect(chatRes).resolves.toBeUndefined();

      const aliceChatMessageData = buildMessageData("Hey !", alice);
      const messageRes = aliceApp
        .collection(`chats/${aliceChatData.uid}/messages`)
        .doc(aliceChatMessageData.uid)
        .set(aliceChatMessageData);
      await expect(messageRes).resolves.toBeUndefined();

      const bobApp = authApp(bob);
      const bobReadAliceMessageChat = bobApp
        .doc(`chats/${aliceChatData.uid}/messages/${aliceChatMessageData.uid}`)
        .get();
      await expect(bobReadAliceMessageChat).rejects.toBeDefined();
    });
  });
});
