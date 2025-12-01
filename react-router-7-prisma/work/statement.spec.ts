import { describe, it, expect } from "vitest";
import { statement } from "./statement";
import invoice from "./invoices.json";
import plays from "./plays.json";

describe("statement", () => {
  it("should generate correct statement", () => {
    const result = statement(invoice[0], plays);

    const expected = [
      "Statement for BigCo",
      " Hamlet: $650.00 (55 seats)",
      " As You Like It: $580.00 (35 seats)",
      " Othello: $500.00 (40 seats)",
      "Amount owed is $1,730.00",
      "You earned 47 credits",
      "",
    ].join("\n");

    expect(result).toBe(expected);
  });
});
