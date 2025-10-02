import type { Route } from "./+types/home";
import prisma from "../lib/prisma";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type Prefecture = {
  id: number;
  name: string;
  area: string;
};

export const loader = async () => {
  const prefectures = await prisma.prefectures.findMany();
  return {
    prefectures: prefectures.map((prefecture: Prefecture) => ({
      id: prefecture.id,
      name: prefecture.name,
      area: prefecture.area,
    })),
  };
};

export default function Home() {
  const { prefectures } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex items-center justify-center pt-16 pb-4">
        <h1>47都道府県旅行記録</h1>
      </div>
      <div className="flex items-center justify-center mb-8">
        <ul>
          {prefectures.map((prefecture: Prefecture) => (
            <li key={prefecture.id}>
              <a href={`/prefectures/${prefecture.id}/${prefecture.name}`}>
                {prefecture.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
