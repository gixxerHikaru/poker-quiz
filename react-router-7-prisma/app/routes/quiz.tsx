import type { Route } from './+types/home';
import { useState, memo } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

const SUITS = ['C', 'D', 'H', 'S'];
const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const ANSWER = [
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

function getUniqueCards(count: number = 5): string[] {
  const deck = SUITS.flatMap(suit => RANKS.map(rank => `cards/${suit}${rank}.png`));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
}

const CardList = memo(() => {
  const cards = getUniqueCards(5);
  return (
    <div className="flex gap-4">
      <img src={cards[0]} alt="card1" className="w-24 h-auto" />
      <img src={cards[1]} alt="card2" className="w-24 h-auto" />
      <img src={cards[2]} alt="card3" className="w-24 h-auto" />
      <img src={cards[3]} alt="card4" className="w-24 h-auto" />
      <img src={cards[4]} alt="card5" className="w-24 h-auto" />
    </div>
  );
});

const DisplayAnswer = ({ answer: userSelectAnswer }) => {
  return <div>Your Answer: {userSelectAnswer}</div>;
};

export default function Quiz() {
  const [userSelectAnswer, setUserSelectAnswer] = useState();

  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16 min-h-0">
        <CardList />
        {userSelectAnswer ? (
          <DisplayAnswer answer={userSelectAnswer} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {ANSWER.map(answerName => (
              <button
                key={answerName}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => {
                  setUserSelectAnswer(answerName);
                }}
              >
                {answerName}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
