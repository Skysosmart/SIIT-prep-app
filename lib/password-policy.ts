/**
 * Password rules, kept pure and separate from the route so they can be tested.
 *
 * This app has no way to send email, so there is no "reset link" flow. Recovery
 * works through Google instead: signing in with Google proves control of the
 * address, which is the same thing a reset email proves - so that session is
 * allowed to set a new password without knowing the old one.
 */

export const MIN_PASSWORD_LENGTH = 8;

export type Provider = "email" | "google";

/** null when acceptable, otherwise the message to show the user. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (pw.trim().length === 0) return "Password cannot be only spaces.";
  return null;
}

/**
 * Must the caller prove the current password before setting a new one?
 *
 * No, in exactly two cases:
 *  - the account has no password yet (nothing to prove), or
 *  - the session was established through Google, which verified the email.
 *    This is the recovery path; an email/password session gets no such pass,
 *    so a stolen session cannot silently take the account over.
 */
export function requiresCurrentPassword(account: { hasPassword: boolean; provider: Provider }): boolean {
  if (!account.hasPassword) return false;
  return account.provider !== "google";
}
