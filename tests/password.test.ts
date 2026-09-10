/**
 * Password rules, and specifically who is allowed to set a new password
 * without proving the old one.
 *
 * This app cannot send email, so recovery goes through Google. That makes the
 * rule below security-critical: get it wrong in one direction and a forgotten
 * password is unrecoverable, wrong in the other and a stolen session can take
 * an account over silently.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { MIN_PASSWORD_LENGTH, passwordProblem, requiresCurrentPassword } from "../lib/password-policy";

test("a password must be long enough and not just whitespace", () => {
  assert.equal(passwordProblem("x".repeat(MIN_PASSWORD_LENGTH)), null);
  assert.match(passwordProblem("short")!, /at least/);
  assert.match(passwordProblem("        ")!, /only spaces/, "8 spaces passes the length check alone");
  assert.equal(passwordProblem(""), passwordProblem("a"), "both are simply too short");
});

test("an account with no password can set one without proving anything", () => {
  assert.equal(requiresCurrentPassword({ hasPassword: false, provider: "google" }), false);
  assert.equal(requiresCurrentPassword({ hasPassword: false, provider: "email" }), false);
});

test("a Google session may set a new password without the old one - this IS the recovery path", () => {
  assert.equal(requiresCurrentPassword({ hasPassword: true, provider: "google" }), false);
});

test("an email/password session must prove the current password", () => {
  assert.equal(requiresCurrentPassword({ hasPassword: true, provider: "email" }), true,
    "otherwise a stolen session could take the account over without knowing the password");
});
