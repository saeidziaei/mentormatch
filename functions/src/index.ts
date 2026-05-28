import {onCall} from "firebase-functions/v2/https";

export {upsertTutorProfile, getMyTutorProfile, searchTutors, getTutorProfile} from "./tutors";
export {requestSignupCode, verifySignupCode} from "./emailVerification";
export {sendPasswordReset} from "./passwordReset";
export {claimAdminRole, grantAdminRole, listPendingTutors, reviewTutor} from "./admin";

export const helloWorld = onCall(() => {
  return {
    message: "Hello from Firebase!",
    timestamp: new Date().toISOString(),
  };
});
