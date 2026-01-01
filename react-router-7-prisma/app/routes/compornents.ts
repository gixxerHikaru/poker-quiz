export const SUITS = ['C', 'D', 'H', 'S'];
export const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
export const ANSWER = [
  'ハイカード',
  'ワンペア',
  'ツーペア',
  'スリーカード',
  'ストレート',
  'フラッシュ',
  'フルハウス',
  'フォーカード',
  'ストレートフラッシュ',
  'ロイヤルフラッシュ',
];

export function getUniqueCards(count: number = 5): string[] {
  const deck = SUITS.flatMap(suit => RANKS.map(rank => `cards/${suit}${rank}.png`));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
}
