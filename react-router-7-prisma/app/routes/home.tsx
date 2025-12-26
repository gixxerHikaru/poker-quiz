import type { Route } from "./+types/home";

import cardBack from "../../public/cards/card_back.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <header className="flex flex-col items-center gap-9">
            <h1 className="text-3xl">Poker Quiz</h1>W
          </header>
        </div>
      </main>
  );
}
