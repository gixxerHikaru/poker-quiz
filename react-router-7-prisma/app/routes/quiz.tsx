import type { Route } from './+types/home';
import cardBack from '../../public/cards/card_back.png';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Quiz() {
  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16 min-h-0">
        <div className="flex gap-4">
          <img src={cardBack} alt="card1" className="w-24 h-auto" />
          <img src={cardBack} alt="card2" className="w-24 h-auto" />
          <img src={cardBack} alt="card3" className="w-24 h-auto" />
          <img src={cardBack} alt="card4" className="w-24 h-auto" />
          <img src={cardBack} alt="card5" className="w-24 h-auto" />
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
