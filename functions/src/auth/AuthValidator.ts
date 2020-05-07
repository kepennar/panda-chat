import * as firebaseAdmin from "firebase-admin";
import { Request } from "firebase-functions";
import { HttpError } from "../model/HttpError";

export async function validateFirebaseIdToken(
  req: Request,
  adminApp: firebaseAdmin.app.App
): Promise<firebaseAdmin.auth.DecodedIdToken> {
  console.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    throw new HttpError(403, "Unauthorized");
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    throw new HttpError(403, "Unauthorized");
  }

  try {
    return await adminApp.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    throw new HttpError(403, "Unauthorized");
  }
}
