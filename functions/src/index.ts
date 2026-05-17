import {onCall} from "firebase-functions/v2/https";

export {upsertTutorProfile, getMyTutorProfile} from "./tutors";
export {requestSignupCode, verifySignupCode} from "./emailVerification";

export const helloWorld = onCall(() => {
  return {
    message: "Hello from Firebase!",
    timestamp: new Date().toISOString(),
  };
});
