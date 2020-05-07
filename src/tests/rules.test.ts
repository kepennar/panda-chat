import * as firebase from "@firebase/testing";
import * as fs from "fs";
import {
  alice,
  bob,
  buildChatData,
  buildMessageData,
  anonymousApp,
  authApp,
} from "../../tests/helpers";

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
      const aliceApp = anonymousApp(projectId);
      const profileRes = aliceApp
        .firestore()
        .collection("users")
        .doc("alice")
        .get();
      await expect(profileRes).rejects.toBeDefined();
    });
  });

  describe("Authenticated user", () => {
    it("should get current user", async () => {
      const aliceApp = authApp(projectId, alice);
      const profile = aliceApp
        .firestore()
        .collection("users")
        .doc(alice.uid)
        .get();
      await expect(profile).resolves.toBeDefined();
    });

    it("should be able to create a chat", async () => {
      const aliceApp = authApp(projectId, alice);
      const chatRes = aliceApp
        .firestore()
        .collection("chats")
        .doc()
        .set(buildChatData("test", false, alice));
      await expect(chatRes).resolves.toBeUndefined();
    });

    it("should be able to access a public chat", async () => {
      const aliceApp = authApp(projectId, alice);

      const aliceChatData = buildChatData("test", false, alice);
      const chatRes = aliceApp
        .firestore()
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);

      await expect(chatRes).resolves.toBeUndefined();

      const bobApp = authApp(projectId, bob);
      const bobReadAliceChat = bobApp
        .firestore()
        .doc(`chats/${aliceChatData.uid}`)
        .get();

      await expect(bobReadAliceChat).resolves.toBeDefined();
    });

    it("should not be able to access a private chat", async () => {
      const aliceApp = authApp(projectId, alice);
      const aliceChatData = buildChatData("test", true, alice);

      const chatRes = aliceApp
        .firestore()
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);
      await expect(chatRes).resolves.toBeUndefined();

      const bobApp = authApp(projectId, bob);
      const bobReadAliceChat = bobApp
        .firestore()
        .doc(`chats/${aliceChatData.uid}`)
        .get();
      await expect(bobReadAliceChat).rejects.toBeDefined();
    });

    it("should not be able to access a private message", async () => {
      const aliceApp = authApp(projectId, alice);
      const aliceChatData = buildChatData("test", true, alice);

      const chatRes = aliceApp
        .firestore()
        .collection("chats")
        .doc(aliceChatData.uid)
        .set(aliceChatData);
      await expect(chatRes).resolves.toBeUndefined();

      const aliceChatMessageData = buildMessageData("Hey !", alice);
      const messageRes = aliceApp
        .firestore()
        .collection(`chats/${aliceChatData.uid}/messages`)
        .doc(aliceChatMessageData.uid)
        .set(aliceChatMessageData);
      await expect(messageRes).resolves.toBeUndefined();

      const bobApp = authApp(projectId, bob);
      const bobReadAliceMessageChat = bobApp
        .firestore()
        .doc(`chats/${aliceChatData.uid}/messages/${aliceChatMessageData.uid}`)
        .get();
      await expect(bobReadAliceMessageChat).rejects.toBeDefined();
    });
  });
});
