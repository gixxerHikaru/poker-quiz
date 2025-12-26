import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Quiz() {
  return (
    <main className="items-center justify-center pt-16 pb-4">
      <div className="flex flex-col items-center gap-16 min-h-0">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl">Quiz</h1>
        </div>
      </div>
    </main>
  );
}
