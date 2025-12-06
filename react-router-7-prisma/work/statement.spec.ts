import { describe, it, expect } from "vitest";
import { statement, htmlStatement } from "./statement";
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

describe("htmlStatement", () => {
  it("should generate correct statement", () => {
    const result = htmlStatement(invoice[0], plays);

    const expected = [
      "<h1>Statement for BigCo</h1>",
      "<table>",
      "<tr><th>Play</th><th>Seats</th><th>Cost</th></tr>",
      " <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>",
      " <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>",
      " <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>",
      "</table>",
      "<p>Amount owed is <em>$1,730.00</em></p>",
      "<p>You earned <em>47</em> credits</p>",
      "",
    ].join("\n");

    expect(result).toBe(expected);
  });
});
