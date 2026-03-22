import { ID } from "appwrite";
import { account } from "../config";
import type { SignupSchema, SigninSchema } from "../../../utils/validation";

/**
 * Creates a new user account.
 */
export const createUserAccount = async (user: SignupSchema) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Account creation failed");

    return newAccount;
  } catch (error) {
    console.error("AuthService :: createUserAccount error:", error);
    throw error;
  }
};

/**
 * Signs in an existing user with email and password.
 */
export const signInAccount = async (user: SigninSchema) => {
  try {
    return await account.createEmailPasswordSession(user.email, user.password);
  } catch (error) {
    console.error("AuthService :: signInAccount error:", error);
    throw error;
  }
};

/**
 * Fetches the currently logged-in user account.
 * Returns null if the user is not authenticated.
 */
export const getCurrentAccount = async () => {
  try {
    return await account.get();
  } catch {
    // 401 is expected if there is no session, do not log it as an error
    return null;
  }
};

/**
 * Logs out the current user by deleting the active session.
 */
export const signOutAccount = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("AuthService :: signOutAccount error:", error);
  }
};

/**
 * Sends a verification email to the current user.
 */
export const sendVerificationEmail = async (url: string) => {
  try {
    return await account.createVerification(url);
  } catch (error) {
    console.error("AuthService :: sendVerificationEmail error:", error);
    throw error;
  }
};

/**
 * Updates the user's verification status using the secret from the email link.
 */
export const updateVerificationStatus = async (userId: string, secret: string) => {
  try {
    return await account.updateVerification(userId, secret);
  } catch (error) {
    console.error("AuthService :: updateVerificationStatus error:", error);
    throw error;
  }
};
