import { describe, it, expect } from "vitest";
import { generateJoinCode } from "../src/utils/crypto.ts";

describe("Member 3 - TDD: Join Code Length Validation", () => {
  it("TDD-01: generates a default 6-character code", () => {
    const code = generateJoinCode();

    expect(code).toHaveLength(6);
  });

  it("TDD-02: rejects a zero-length join code", () => {
    expect(() => generateJoinCode(0)).toThrow(
      "Join code length must be a positive integer",
    );
  });

  it("TDD-03: rejects a negative join code length", () => {
    expect(() => generateJoinCode(-1)).toThrow(
      "Join code length must be a positive integer",
    );
  });

  it("TDD-04: rejects a decimal join code length", () => {
    expect(() => generateJoinCode(2.5)).toThrow(
      "Join code length must be a positive integer",
    );
  });
});
