import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

const SUITS = ['C', 'D', 'H', 'S'];
const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

function getUniqueCards(count: number = 5): string[] {
  const deck = SUITS.flatMap(suit => RANKS.map(rank => `cards/${suit}${rank}.png`));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.slice(0, count);
}

export default function Quiz() {
  const cards = getUniqueCards(5);

  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16 min-h-0">
        <div className="flex gap-4">
          <img src={cards[0]} alt="card1" className="w-24 h-auto" />
          <img src={cards[1]} alt="card2" className="w-24 h-auto" />
          <img src={cards[2]} alt="card3" className="w-24 h-auto" />
          <img src={cards[3]} alt="card4" className="w-24 h-auto" />
          <img src={cards[4]} alt="card5" className="w-24 h-auto" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ハイカード
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ワンペア
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ツーペア
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            スリーカード
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ストレート
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            フラッシュ
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            フルハウス
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            フォーカード
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ストレートフラッシュ
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            ロイヤルフラッシュ
          </button>
        </div>
      </div>
    </main>
  );
}
