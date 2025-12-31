import type { Route } from './+types/home';
import { useState, memo, useMemo, useEffect } from 'react';

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

const CardList = memo(({ cards }) => {
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

export function judgeSystemAnswer(cardPaths: string[]): string {
  const cards = cardPaths.map(path => {
    return path.split('/').pop() || '';
  });

  const cardsSuits = { c: 0, d: 0, h: 0, s: 0 };
  const cardsRanks = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
  };
  setCardsSuits(cards);
  setCardsRanks(cards);

  if (royalFlashCheck()) {
    return ANSWER[9];
  }

  if (straightCheck() && flashCheck()) {
    return ANSWER[8];
  }

  if (sameRanksCheck(4)) {
    return ANSWER[7];
  }

  if (sameRanksCheck(3) && sameRanksCheck(2)) {
    return ANSWER[6];
  }

  if (flashCheck()) {
    return ANSWER[5];
  }

  if (straightCheck()) {
    return ANSWER[4];
  }

  if (sameRanksCheck(3)) {
    return ANSWER[3];
  }

  if (sameRanksCheck(2)) {
    const pairCount = Object.values(cardsRanks).filter(count => count === 2).length;
    if (pairCount === 2) {
      return ANSWER[2];
    }
    return ANSWER[1];
  }
  return ANSWER[0];

  function setCardsSuits(cards) {
    cards.map(card => {
      switch (card[0]) {
        case 'C':
          cardsSuits.c += 1;
          break;
        case 'D':
          cardsSuits.d += 1;
          break;
        case 'H':
          cardsSuits.h += 1;
          break;
        case 'S':
          cardsSuits.s += 1;
          break;
      }
    });
  }

  function setCardsRanks(cards) {
    cards.map(card => {
      const rank = card.slice(1, -4)[0] === '0' ? card.slice(2, -4) : card.slice(1, -4);

      switch (rank) {
        case '10':
          cardsRanks['10'] += 1;
          break;
        case 'J':
          cardsRanks['11'] += 1;
          break;
        case 'Q':
          cardsRanks['12'] += 1;
          break;
        case 'K':
          cardsRanks['13'] += 1;
          break;
        case 'A':
          cardsRanks['1'] += 1;
          break;
        default:
          cardsRanks[rank] += 1;
      }
    });
  }

  function royalFlashCheck() {
    return (
      flashCheck() &&
      cardsRanks['10'] === 1 &&
      cardsRanks['11'] === 1 &&
      cardsRanks['12'] === 1 &&
      cardsRanks['13'] === 1 &&
      cardsRanks['1'] === 1
    );
  }

  function sameRanksCheck(num: number) {
    return Object.values(cardsRanks).includes(num);
  }

  function flashCheck() {
    function sameRanksCheck(num: number) {
      return Object.values(cardsRanks).includes(num);
    }

    return cardsSuits.c === 5 || cardsSuits.d === 5 || cardsSuits.h === 5 || cardsSuits.s === 5;
  }

  function straightCheck() {
    const rankValues = Object.values(cardsRanks);
    if (sameRanksCheck(4) || sameRanksCheck(3) || sameRanksCheck(2)) {
      return false;
    }
    const rankPattern = Object.values(cardsRanks).join('');

    return rankPattern.includes('11111') || rankPattern == '1000000001111';
  }
}

export default function Quiz() {
  const [quizData, setQuizData] = useState<{
    cardsPath: string[];
    systemAnswer: string;
  } | null>(null);

  const [userSelectAnswer, setUserSelectAnswer] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const cardsPath = getUniqueCards(5);
    const systemAnswer = judgeSystemAnswer(cardsPath);

    setQuizData({ cardsPath, systemAnswer });
    setStartTime(Date.now());

    console.info('生成されたカード:', cardsPath);
  }, []);

  useEffect(() => {
    if (!startTime || userSelectAnswer) return;

    const timer = setTimeout(() => {
      setIsTimeout(true);
      setUserSelectAnswer('Time Out');
    }, 10000);

    return () => clearTimeout(timer);
  }, [startTime, userSelectAnswer]);

  if (!quizData)
    return (
      <main className="items-center justify-center pt-16 pb-4">
        <div className="flex flex-col items-center gap-16">
          <div>Loading...</div>
        </div>
      </main>
    );

  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16">
        <CardList cards={quizData.cardsPath} />

        {userSelectAnswer ? (
          <div className="flex flex-col items-end gap-4">
            <>
              <div>Your Answer: {userSelectAnswer}</div>
              <div>Field: {quizData.systemAnswer}</div>
              {userSelectAnswer == quizData.systemAnswer ? <div>正解</div> : <div>不正解</div>}
              {isTimeout ? (
                <div>解答時間: タイムアウト(10秒経過)</div>
              ) : (
                <div>解答時間: {elapsedTime / 1000}秒</div>
              )}
            </>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {ANSWER.map(answerName => (
              <button
                key={answerName}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => {
                  setUserSelectAnswer(answerName);
                  setElapsedTime(Date.now() - startTime);
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
