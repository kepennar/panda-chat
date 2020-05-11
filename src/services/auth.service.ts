import firebase from "firebase/app";
import { observable, IObservableValue, runInAction } from "mobx";
import { observeAuthChanged } from "src/observable-firestore/observableFirestore";
import { db } from "../config/firebase.config";
import { User, validateUser } from "../model";

export let connectedUser: IObservableValue<User | null> = observable.box(null);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export function initAuth() {
  const { item } = observeAuthChanged(auth);
  item.observe(async (change) => {
    const firebaseUser = change.newValue;
    const user: User | null = firebaseUser
      ? await getUserDocument(firebaseUser.uid)
      : null;
    runInAction(() => {
      connectedUser.set(user);
    });
  });
}

export async function googleSignIn() {
  const { user } = await auth.signInWithPopup(googleProvider);
  if (!user) {
    throw new Error("Unable to authenticate");
  }
  return saveUserDocument(user);
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
) {
  const { user } = await auth.signInWithEmailAndPassword(email, password);
  if (!user) {
    throw new Error("Unable to authenticate");
  }
  return saveUserDocument(user);
}

export async function registerWithEmailPassword(
  { email, displayName }: Omit<User, "uid">,
  password: string
) {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);

  if (!user) {
    throw new Error("Unable to create user");
  }
  return saveUserDocument({ ...user, displayName });
}

export async function logout() {
  return auth.signOut();
}

async function saveUserDocument(user: firebase.User) {
  const userRef = db.doc(`users/${user.uid}`);
  const userSnapshot = await userRef.get();
  if (!userSnapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
}

const getUserDocument = async (userUid: string): Promise<User> => {
  try {
    const userDocument = await db.doc(`users/${userUid}`).get();
    const data = userDocument.data() as User;
    const userData = {
      uid: userUid,
      ...data,
    };

    validateUser(userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user", error);
    throw error;
  }
};
