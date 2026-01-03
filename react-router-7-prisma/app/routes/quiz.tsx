import type { Route } from './+types/home';
import { memo, useEffect, useState } from 'react';
import { ANSWER, getUniqueCards } from './compornents';
import { judgeSystemAnswer } from './judgeSystemAnswer';
import { calculateScore } from './calculateScore';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'クイズ画面' }, { name: 'description', content: 'Welcome to React Router!' }];
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
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<{
    cardsPath: string[];
    systemAnswer: string;
  } | null>(null);

  const [userSelectAnswer, setUserSelectAnswer] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [remainTime, setRemainTime] = useState<number>(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [gameCount, setGameCount] = useState<number>(1);
  const [gameCountFlag, setGameCountFlag] = useState<boolean>(false);
  const [resultFlag, setResultFlag] = useState(false);
  const [scoreList, setScoreList] = useState<number[]>([]);

  useEffect(() => {
    const cardsPath = getUniqueCards(5);
    const systemAnswer = judgeSystemAnswer(cardsPath);

    setQuizData({ cardsPath, systemAnswer });
    setStartTime(Date.now());
    setIsTimeout(false);
    setElapsedTime(0);
    setRemainTime(0);

    console.info('ラウンド:', gameCount);
    console.info('生成されたカード:', cardsPath);
  }, [gameCount]);

  useEffect(() => {
    if (!startTime || userSelectAnswer) return;

    const timer = setTimeout(() => {
      setIsTimeout(true);
      setUserSelectAnswer('Time Out');
    }, 10000);

    return () => clearTimeout(timer);
  }, [startTime, userSelectAnswer]);

  useEffect(() => {
    if (gameCount >= 5) setGameCountFlag(true);
  }, [gameCount]);

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
        {resultFlag ? resultDiv() : gameDiv()}
      </div>
    </main>
  );

  function resultDiv() {
    return (
      <div className="p-8 w-full max-w-md text-center ">
        <h1 className="text-3xl font-extrabold mb-6  tracking-tight">クイズ結果</h1>
        <div className="space-y-4 mb-8">
          <div
            data-testid="round-1"
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium ">Round1</span>
            <span className="font-bold text-xl ">{scoreList[0]}点</span>
          </div>
          <div
            data-testid="round-2"
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium ">Round2</span>
            <span className="font-bold text-xl ">{scoreList[1]}点</span>
          </div>
          <div
            data-testid="round-3"
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium ">Round3</span>
            <span className="font-bold text-xl ">{scoreList[2]}点</span>
          </div>
          <div
            data-testid="round-4"
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium ">Round4</span>
            <span className="font-bold text-xl ">{scoreList[3]}点</span>
          </div>
          <div
            data-testid="round-5"
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium ">Round5</span>
            <span className="font-bold text-xl ">{scoreList[4]}点</span>
          </div>
          <div data-testid="total" className="flex justify-between items-center pb-2">
            <span className="font-bold text-xl">合計</span>
            <span className="font-bold text-xl ">
              {Number(scoreList.reduce((total, score) => total + score, 0).toFixed(3))}点
            </span>
          </div>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
          onClick={() => {
            navigate('/');
          }}
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  function gameDiv() {
    return (
      <>
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
                    スコア:{' '}
                    {Number(
                      calculateScore(Number(remainTime.toFixed(3)), quizData.systemAnswer).toFixed(
                        3
                      )
                    )}
                    点
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
            {gameCountFlag ? (
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  const score =
                    userSelectAnswer === quizData.systemAnswer
                      ? Number(
                          calculateScore(
                            Number(remainTime.toFixed(3)),
                            quizData.systemAnswer
                          ).toFixed(3)
                        )
                      : 0;
                  setScoreList([...scoreList, score]);
                  setResultFlag(true);
                }}
              >
                Result
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  const score =
                    userSelectAnswer === quizData.systemAnswer
                      ? Number(
                          calculateScore(
                            Number(remainTime.toFixed(3)),
                            quizData.systemAnswer
                          ).toFixed(3)
                        )
                      : 0;
                  setScoreList([...scoreList, score]);
                  setUserSelectAnswer(undefined);
                  setGameCount(gameCount + 1);
                }}
              >
                Next Game
              </button>
            )}
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
      </>
    );
  }
}
