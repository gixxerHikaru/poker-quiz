import { createStatementData } from "./createStatementData";

export function statement(invoice: any, plays: any) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data: any) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;

  return result;
}

function htmlStatement(invoice: any, plays: any) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data: any) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += `<table>\n`;
  result += `<tr><th>Play</th><th>Seats</th><th>Cost</th></tr>`;
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td><td>${usd(perf.amount)}</td></tr>`;
  }
  result += `</table>`;
  result += `<p>Amount owed is ${usd(data.totalAmount)}</p>\n`;
  result += `<p>You earned ${data.totalVolumeCredits} credits</p>\n`;

  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}
