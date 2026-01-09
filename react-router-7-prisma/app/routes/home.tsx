import type { Route } from './+types/home';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Poker Quiz' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  const navigate = useNavigate();
  const [explainModalFlag, setExplainModalFlag] = useState(false);
  const cardBack = '/cards/card_back.png';

  const scoreTable = [
    { name: 'ハイカード', score: 1, describe: '役なし' },
    { name: 'ワンペア', score: 2 },
    { name: 'ツーペア', score: 3 },
    { name: 'スリーカード', score: 5 },
    { name: 'ストレート', score: 8 },
    { name: 'フラッシュ', score: 13 },
    { name: 'フルハウス', score: 21 },
    { name: 'フォーカード', score: 34 },
    { name: 'ストレートフラッシュ', score: 55 },
    { name: 'ロイヤルフラッシュ', score: 89 },
  ];

  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16 min-h-0">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl">Poker Quiz</h1>
        </div>
        <div className="flex gap-4">
          <img src={cardBack} alt="card back1" className="w-24 h-auto" />
          <img src={cardBack} alt="card back2" className="w-24 h-auto" />
          <img src={cardBack} alt="card back3" className="w-24 h-auto" />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40"
            onClick={() => {
              navigate('/quiz');
            }}
          >
            スタート
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-40"
            onClick={() => setExplainModalFlag(true)}
          >
            ルール説明
          </button>
        </div>
      </div>
      {explainModalFlag && (
        <div className="fixed inset-0 bg-black/50 flex items-start pt-10 justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[600px] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-black shrink-0">ゲーム説明</h2>
            <div className="mb-6 text-gray-700 space-y-2 overflow-y-auto">
              <p>ポーカーの役を当てるクイズゲームです。</p>
              <p>表示された5枚のカードから役を判断して回答してください。</p>
              <p>計5回クイズを行い、高得点を目指すゲームです！</p>
              <br />
              <p>役の珍しさで得点が決まります。（下部の得点一覧参照）</p>
              <p>回答時間は10秒。早く正解するほど高得点になります！</p>
              <p>例：3秒で回答、7秒のボーナス時間</p>
              <br />
              <p>得点は役の得点✖ボーナス時間</p>
              <p>例：ストレート（8点）で5秒で回答</p>
              <p>8✖5=40点</p>
              <br />
              <div className="">
                <p>得点一覧</p>
                <table className="table-auto w-full border-collapse border">
                  <thead className="bg-gray-100">
                    <tr className="border-b">
                      <th className="border p-2">役名</th>
                      <th className="border p-2">得点</th>
                      <th className="border p-2">補足</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreTable.map(score => {
                      return (
                        <tr key={score.name} className="border-b">
                          <td className="border p-2">{score.name}</td>
                          <td className="border p-2">{score.score}点</td>
                          <td className="border p-2">{score.describe}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end shrink-0">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setExplainModalFlag(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
