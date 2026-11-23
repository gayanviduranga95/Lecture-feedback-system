import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../src/utils/password.ts";

describe("Member 3 - Password Verification Unit Tests", () => {
  it("UT-01: accepts a correct password", async () => {
    const password = "SecurePassword123!";
    const hashedPassword = await hashPassword(password);

    const result = await verifyPassword(hashedPassword, password);

    expect(result).toBe(true);
  });

  it("UT-02: rejects an incorrect password", async () => {
    const password = "SecurePassword123!";
    const hashedPassword = await hashPassword(password);

    const result = await verifyPassword(hashedPassword, "WrongPassword123!");

    expect(result).toBe(false);
  });

  it("UT-03: rejects a missing password hash", async () => {
    const result = await verifyPassword(null, "AnyPassword123!");

    expect(result).toBe(false);
  });

  it("UT-04: rejects an invalid password hash", async () => {
    const result = await verifyPassword("invalid-hash", "SecurePassword123!");

    expect(result).toBe(false);
  });
});
