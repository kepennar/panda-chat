import * as firebaseTest from "@firebase/testing";
import * as firebase from "firebase/app";
import { Response } from "firebase-functions";

import { Chat, Message, User } from "../src/model";

export type UserWithPassword = User & { password: string };

export function buildChatData(
  name: string,
  isPrivate: boolean,
  createdBy: User,
  TimestampInstance = firebase.firestore.Timestamp
): Chat {
  return {
    uid: `${createdBy.displayName}_${isPrivate}_chat`,
    name,
    isPrivate,
    memberIds: [createdBy.uid],
    createdBy,
    createdAt: TimestampInstance.now(),
  };
}

export function buildMessageData(
  text: string,
  createdBy: User,
  TimestampInstance = firebase.firestore.Timestamp
): Message {
  return {
    uid: `${createdBy.displayName}_message`,
    text,
    createdBy,
    createdAt: TimestampInstance.now(),
  };
}

export const alice: UserWithPassword = {
  uid: "alice_uid",
  displayName: "Alice",
  email: "alice@mail.com",
  password: "alice_password",
};

export const bob: UserWithPassword = {
  uid: "bob_uid",
  displayName: "Bob",
  email: "bob@mail.com",
  password: "bob_password",
};

export function anonymousApp(projectId: string) {
  return firebaseTest.initializeTestApp({ projectId });
}
export function authApp(
  projectId: string,
  auth: { uid: string; email: string }
) {
  return firebaseTest.initializeTestApp({ projectId, auth });
}

export function buildTestRequest(
  body: Record<string, string>,
  headers: Record<string, string> = {}
): any {
  return {
    headers,
    body: { data: { ...body } },
  };
}

export function mockResponse(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
