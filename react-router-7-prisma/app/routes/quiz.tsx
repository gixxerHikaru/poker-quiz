import type { Route } from './+types/home';
import { memo, useEffect, useState } from 'react';
import { ANSWER, getUniqueCards } from './compornents';
import { judgeSystemAnswer } from './judgeSystemAnswer';
import { calculateScore } from './calculateScore';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

const CardList = memo(({ cards }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-2">
      <img src={cards[0]} alt="card1" className="w-16 sm:w-24 h-auto" />
      <img src={cards[1]} alt="card2" className="w-16 sm:w-24 h-auto" />
      <img src={cards[2]} alt="card3" className="w-16 sm:w-24 h-auto" />
      <img src={cards[3]} alt="card4" className="w-16 sm:w-24 h-auto" />
      <img src={cards[4]} alt="card5" className="w-16 sm:w-24 h-auto" />
    </div>
  );
});

export default function Quiz() {
  const [quizData, setQuizData] = useState<{
    cardsPath: string[];
    systemAnswer: string;
  } | null>(null);

  const [userSelectAnswer, setUserSelectAnswer] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [remainTime, setRemainTime] = useState<number>(0);
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
              {userSelectAnswer == quizData.systemAnswer ? (
                <>
                  <div>正解</div>
                  <div>解答時間: {Number((elapsedTime / 1000).toFixed(3))}秒</div>
                  <div>
                    ボーナス時間:{' '}
                    {elapsedTime <= 9000 ? `${Number(remainTime.toFixed(3))}秒` : 'なし'}
                  </div>
                  <div>
                    スコア: {calculateScore(Number(remainTime.toFixed(3)), quizData.systemAnswer)}点
                  </div>
                </>
              ) : (
                <>
                  <div>不正解</div>
                  {isTimeout ? (
                    <div>解答時間: タイムアウト(10秒経過)</div>
                  ) : (
                    <div>解答時間: {Number((elapsedTime / 1000).toFixed(3))}秒</div>
                  )}
                  <div>スコア: 0点</div>
                </>
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
                  setRemainTime((10000 - (Date.now() - startTime)) / 1000);
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
