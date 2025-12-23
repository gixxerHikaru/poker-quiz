import cardBack from "../../public/cards/card_back.png";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-3xl">Poker Quiz</h1>
          <div className="w-[500px] max-w-[100vw] p-4 flex">
            <div className="flex">
              <img src={cardBack} alt="React Router" className="" />
            </div>
            <div className="flex">
              <img src={cardBack} alt="React Router" className="" />
            </div>
            <div className="flex">
              <img src={cardBack} alt="React Router" className="" />
            </div>
          </div>
        </header>
      </div>
    </main>
  );
}
