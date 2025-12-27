import type { Route } from './+types/home';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const cardBack = '/cards/card_back.png';

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
        <div className="justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              navigate('/quiz');
            }}
          >
            スタート
          </button>
        </div>
      </div>
    </main>
  );
}
