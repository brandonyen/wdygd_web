import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

type CognitoConfig = {
  userPoolId: string;
  clientId: string;
};

function readCognitoConfig(): CognitoConfig {
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID?.trim();
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID?.trim();

  if (!userPoolId || !clientId) {
    throw new Error(
      "Missing Cognito configuration. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID.",
    );
  }

  return { userPoolId, clientId };
}

function getUserPool(): CognitoUserPool {
  const config = readCognitoConfig();
  return new CognitoUserPool({
    UserPoolId: config.userPoolId,
    ClientId: config.clientId,
  });
}

function buildCognitoUser(email: string): CognitoUser {
  return new CognitoUser({
    Username: email.trim(),
    Pool: getUserPool(),
  });
}

export async function signUpWithCognito(params: {
  email: string;
  password: string;
  fullName: string;
}): Promise<void> {
  const { email, password, fullName } = params;
  const pool = getUserPool();
  const attributes = [
    new CognitoUserAttribute({ Name: "email", Value: email.trim() }),
    new CognitoUserAttribute({ Name: "name", Value: fullName.trim() }),
  ];

  await new Promise<void>((resolve, reject) => {
    pool.signUp(email.trim(), password, attributes, [], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function signInWithCognito(params: {
  email: string;
  password: string;
}): Promise<void> {
  const { email, password } = params;
  const user = buildCognitoUser(email);
  const details = new AuthenticationDetails({
    Username: email.trim(),
    Password: password,
  });

  await new Promise<void>((resolve, reject) => {
    user.authenticateUser(details, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
      newPasswordRequired: () =>
        reject(new Error("A new password is required for this account.")),
    });
  });
}

export async function confirmSignUpWithCognito(params: {
  email: string;
  code: string;
}): Promise<void> {
  const { email, code } = params;
  const user = buildCognitoUser(email);

  await new Promise<void>((resolve, reject) => {
    user.confirmRegistration(code.trim(), true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function resendCognitoConfirmationCode(email: string): Promise<void> {
  const user = buildCognitoUser(email);
  await new Promise<void>((resolve, reject) => {
    user.resendConfirmationCode((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function changeCognitoPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const currentUser = getUserPool().getCurrentUser();
  if (!currentUser) {
    throw new Error("No active Cognito session found.");
  }

  await new Promise<void>((resolve, reject) => {
    currentUser.getSession((sessionErr: unknown) => {
      if (sessionErr) {
        reject(sessionErr);
        return;
      }

      currentUser.changePassword(
        currentPassword,
        newPassword,
        (changeErr, result) => {
          if (changeErr) {
            reject(changeErr);
            return;
          }
          if (result !== "SUCCESS") {
            reject(new Error("Password update did not complete."));
            return;
          }
          resolve();
        },
      );
    });
  });
}

export function signOutCognito(): void {
  getUserPool().getCurrentUser()?.signOut();
}

export async function getCurrentUserSub(): Promise<string | null> {
  const currentUser = getUserPool().getCurrentUser();
  if (!currentUser) return null;

  return new Promise((resolve) => {
    currentUser.getSession((err: unknown, session: any) => {
      if (err || !session.isValid()) {
        resolve(null);
        return;
      }
      resolve(session.getIdToken().payload.sub || null);
    });
  });
}

export async function getCurrentIdToken(): Promise<string | null> {
  const currentUser = getUserPool().getCurrentUser();
  if (!currentUser) return null;

  return new Promise((resolve) => {
    currentUser.getSession((err: unknown, session: any) => {
      if (err || !session.isValid()) {
        resolve(null);
        return;
      }
      resolve(session.getIdToken().getJwtToken() || null);
    });
  });
}
