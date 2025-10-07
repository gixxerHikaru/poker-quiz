import type { Route } from "./+types/home";
import prisma from "../lib/prisma";
import { useLoaderData } from "react-router";
import MainBar from "../components/MainBar";
import EndBar from "../components/EndBar";

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

  type Size = "square" | "rectW" | "rectH";
  const positions: Record<
    string,
    { row: number; col: number; diamond?: boolean; size?: Size }
  > = {
    北海道: { row: 1, col: 10.2, diamond: true, size: "square" },
    青森県: { row: 3, col: 10, size: "rectW" },
    秋田県: { row: 4, col: 10, size: "rectH" },
    岩手県: { row: 4, col: 11, size: "rectH" },
    山形県: { row: 5.3, col: 10, size: "square" },
    宮城県: { row: 5.3, col: 11, size: "square" },
    福島県: { row: 6.3, col: 10, size: "rectW" },
    新潟県: { row: 7, col: 9, size: "rectH" },
    群馬県: { row: 7.3, col: 10, size: "square" },
    栃木県: { row: 7.3, col: 11, size: "square" },
    茨城県: { row: 7.3, col: 12, size: "square" },
    埼玉県: { row: 8.3, col: 10, size: "rectW" },
    千葉県: { row: 8.3, col: 12, size: "square" },
    東京都: { row: 9.3, col: 10, size: "rectW" },
    神奈川県: { row: 10.3, col: 10, size: "rectW" },
    長野県: { row: 8.3, col: 9, size: "square" },
    山梨県: { row: 9.3, col: 9, size: "square" },
    静岡県: { row: 10.3, col: 8, size: "rectW" },
    富山県: { row: 8.3, col: 8, size: "square" },
    石川県: { row: 8, col: 7, size: "rectH" },
    福井県: { row: 9.3, col: 7, size: "square" },
    岐阜県: { row: 9.3, col: 8, size: "square" },
    愛知県: { row: 10.3, col: 7, size: "square" },
    三重県: { row: 9.3, col: 6, size: "square" },
    滋賀県: { row: 8.3, col: 6, size: "square" },
    京都府: { row: 8.3, col: 5, size: "square" },
    奈良県: { row: 9.3, col: 5, size: "square" },
    大阪府: { row: 9.3, col: 4, size: "square" },
    和歌山県: { row: 10.3, col: 4, size: "rectW" },
    兵庫県: { row: 8.3, col: 3, size: "rectW" },
    鳥取県: { row: 7.3, col: 2, size: "square" },
    島根県: { row: 7.3, col: 1, size: "square" },
    岡山県: { row: 8.3, col: 2, size: "square" },
    広島県: { row: 8.3, col: 1, size: "square" },
    山口県: { row: 8.3, col: 0, size: "square" },
    香川県: { row: 10.3, col: 2.5, size: "square" },
    徳島県: { row: 11.3, col: 2.5, size: "square" },
    愛媛県: { row: 10.3, col: 1.5, size: "square" },
    高知県: { row: 11.3, col: 1.5, size: "square" },
    福岡県: { row: 9.3, col: -1, size: "square" },
    佐賀県: { row: 9.3, col: -2, size: "square" },
    長崎県: { row: 10.3, col: -2, size: "rectH" },
    大分県: { row: 9.8, col: 0, size: "square" },
    熊本県: { row: 10.3, col: -1, size: "square" },
    宮崎県: { row: 11.3, col: -1, size: "square" },
    鹿児島県: { row: 11.6, col: -3, size: "rectW" },
    沖縄県: { row: 12, col: -4.5, size: "square" },
  };

  const CELL = 60;
  const GAP = 0;
  const OFFSET_X = 370;
  const OFFSET_Y = 50;

  const posToXY = (row: number, col: number) => ({
    left: OFFSET_X + (col - 1) * (CELL + GAP),
    top: OFFSET_Y + (row - 1) * (CELL + GAP),
  });

  const PrefCell = ({
    id,
    name,
    href,
    diamond,
  }: {
    id: number;
    name: string;
    href: string;
    diamond?: boolean;
  }) => {
    if (diamond) {
      return (
        <a
          key={id}
          href={href}
          className="flex items-center justify-center w-full h-full bg-gray-200 border border-gray-500 rotate-45"
        >
          <span className="text-xl -rotate-45 font-bold text-black">
            {name}
          </span>
        </a>
      );
    }
    return (
      <a
        key={id}
        href={href}
        className="flex items-center justify-center w-full h-full bg-gray-200 border border-gray-500"
      >
        <span className="text-s font-bold text-black text-center leading-tight">
          {name}
        </span>
      </a>
    );
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center bg-[#2580C3]">
        <div className="w-full max-w-[1440px] h-[1024px] relative">
          <MainBar>
            <h1 className="font-bold text-[40px] md:text-[64px] leading-[1.1] text-black">47都道府県旅行記録</h1>
          </MainBar>
          <div className="absolute left-0 top-[150px] w-full h-[824px] bg-[#2580C3]">
            <ul className="relative w-full h-full">
              {prefectures.map((p) => {
                const pos = positions[p.name as keyof typeof positions];
                if (!pos) return null;
                const { left, top } = posToXY(pos.row, pos.col);
                const size = pos.size ?? "square";
                let width = size === "rectW" ? CELL * 2 : CELL;
                let height = size === "rectH" ? CELL + 20 : CELL;
                if (pos.diamond) {
                  width = CELL * 1.8;
                  height = CELL * 1.8;
                }
                return (
                  <li
                    key={p.id}
                    className="absolute"
                    style={{ left, top, width, height }}
                  >
                    <PrefCell
                      id={p.id}
                      name={p.name}
                      href={`/prefectures/${p.id}/${p.name}`}
                      diamond={pos.diamond}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <EndBar />
        </div>
      </div>
    </>
  );
}
