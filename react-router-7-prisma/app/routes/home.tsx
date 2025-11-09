import type { Route } from "./+types/home";
import prisma from "../lib/prisma";
import { useLoaderData, Link, Outlet } from "react-router";
import { useEffect, useState } from "react";
import MainBar from "../components/MainBar";
import EndBar from "../components/EndBar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "47都道府県旅行記録" },
    { name: "description", content: "Welcome to 47都道府県旅行記録!" },
  ];
}

type Prefecture = {
  id: number;
  name: string;
  area: string;
};

type Visit = {
  prefectureId: number;
};

type User = {
  id: number;
  name: string;
};

export const loader = async () => {
  const prefectures = await prisma.prefectures.findMany();
  const visits = await prisma.visits.findMany({
    select: {
      prefectureId: true,
    },
  });
  const users = await prisma.users.findMany();
  return {
    prefectures: prefectures.map((prefecture: Prefecture) => ({
      id: prefecture.id,
      name: prefecture.name,
      area: prefecture.area,
    })),
    visits: (visits as any[]).map((v: any) =>
      typeof v === "number" ? v : (v as Visit).prefectureId
    ),
    users: users.map((user: User) => user.name),
  };
};

export default function Home() {
  const data = useLoaderData<typeof loader>() as any;
  const prefectures = data.prefectures as Prefecture[];
  const rawVisited = Array.isArray(data.visits)
    ? data.visits
    : Array.isArray(data.visitedIds)
      ? data.visitedIds
      : [];
  const visitedPrefIds = new Set(
    rawVisited.map((v: any) => (typeof v === "number" ? v : v?.prefectureId))
  );
  const users = data.users;

  type Size = "square" | "rectW" | "rectH";
  const positions: Record<
    string,
    { row: number; col: number; diamond?: boolean; size?: Size }
  > = {
    北海道: { row: 1.3, col: 10.3, diamond: true, size: "square" },
    青森県: { row: 3, col: 10, size: "rectW" },
    秋田県: { row: 4, col: 10, size: "rectH" },
    岩手県: { row: 4, col: 11, size: "rectH" },
    山形県: { row: 5.3, col: 10, size: "square" },
    宮城県: { row: 5.3, col: 11, size: "square" },
    福島県: { row: 6.3, col: 10, size: "rectW" },
    新潟県: { row: 6, col: 9, size: "rectH" },
    群馬県: { row: 7.3, col: 10, size: "square" },
    栃木県: { row: 7.3, col: 11, size: "square" },
    茨城県: { row: 7.3, col: 12, size: "square" },
    埼玉県: { row: 8.3, col: 10, size: "rectW" },
    千葉県: { row: 8.3, col: 12, size: "square" },
    東京都: { row: 9.3, col: 10, size: "rectW" },
    神奈川県: { row: 10.3, col: 10, size: "rectW" },
    山梨県: { row: 8.3, col: 9, size: "square" },
    長野県: { row: 7.3, col: 9, size: "square" },
    静岡県: { row: 9.3, col: 8, size: "rectW" },
    富山県: { row: 7.3, col: 8, size: "square" },
    石川県: { row: 7, col: 7, size: "rectH" },
    福井県: { row: 8.3, col: 7, size: "square" },
    岐阜県: { row: 8.3, col: 8, size: "square" },
    愛知県: { row: 9.3, col: 7, size: "square" },
    三重県: { row: 8.3, col: 6, size: "square" },
    滋賀県: { row: 7.3, col: 6, size: "square" },
    京都府: { row: 7.3, col: 5, size: "square" },
    奈良県: { row: 8.3, col: 5, size: "square" },
    大阪府: { row: 8.3, col: 4, size: "square" },
    和歌山県: { row: 9.3, col: 4, size: "rectW" },
    兵庫県: { row: 7.3, col: 3, size: "rectW" },
    鳥取県: { row: 6.6, col: 2, size: "square" },
    島根県: { row: 6.6, col: 1, size: "square" },
    岡山県: { row: 7.6, col: 2, size: "square" },
    広島県: { row: 7.6, col: 1, size: "square" },
    山口県: { row: 7.3, col: 0, size: "square" },
    香川県: { row: 9.3, col: 2.5, size: "square" },
    徳島県: { row: 10.3, col: 2.5, size: "square" },
    愛媛県: { row: 9.3, col: 1.5, size: "square" },
    高知県: { row: 10.3, col: 1.5, size: "square" },
    福岡県: { row: 8.3, col: -1, size: "square" },
    佐賀県: { row: 8.3, col: -2, size: "square" },
    長崎県: { row: 9.3, col: -2, size: "rectH" },
    大分県: { row: 8.8, col: 0, size: "square" },
    熊本県: { row: 9.3, col: -1, size: "square" },
    宮崎県: { row: 10.3, col: -1, size: "square" },
    鹿児島県: { row: 10.6, col: -3, size: "rectW" },
    沖縄県: { row: 11, col: -4.5, size: "square" },
  };

  const [cell, setCell] = useState(50);
  const GAP = 0;
  const OFFSET_X = 420;
  const rectExtraRatio = 0.32;
  const diamondFactor = 1.5;
  const [offsetY, setOffsetY] = useState(4);

  const posToXY = (row: number, col: number) => ({
    left: OFFSET_X + (col - 1) * (cell + GAP),
    top: offsetY + (row - 1) * (cell + GAP),
  });

  useEffect(() => {
    const computeLayout = () => {
      if (typeof window === "undefined") return;
      const AVAILABLE_H = window.innerHeight - 80 - 50;
      let minTopUnits = Infinity;
      let maxBottomUnits = -Infinity;
      for (const key in positions) {
        const pos = positions[key as keyof typeof positions];
        const baseTopUnits = pos.row - 1;
        let hUnits = 1;
        if (pos.size === "rectH") hUnits = 1 + rectExtraRatio;
        if (pos.diamond) hUnits = diamondFactor;
        minTopUnits = Math.min(minTopUnits, baseTopUnits);
        maxBottomUnits = Math.max(maxBottomUnits, baseTopUnits + hUnits);
      }
      const mapUnitsHeight = Math.max(0, maxBottomUnits - minTopUnits);
      const targetCellFromH = Math.floor(
        (AVAILABLE_H * 0.96) / (mapUnitsHeight || 1)
      );
      const MIN_CELL = 40;
      const MAX_CELL = 64;
      const nextCell = Math.max(MIN_CELL, Math.min(MAX_CELL, targetCellFromH));
      setCell(nextCell);
      setOffsetY(8);
    };
    computeLayout();
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, [GAP, rectExtraRatio, diamondFactor]);

  const PrefCell = ({
    id,
    name,
    to,
    diamond,
  }: {
    id: number;
    name: string;
    to: string;
    diamond?: boolean;
  }) => {
    if (diamond) {
      return (
        <Link
          key={id}
          to={to}
          className={
            visitedPrefIds.has(id)
              ? "flex items-center justify-center w-full h-full bg-[#009119] border border-gray-500 rotate-45"
              : "flex items-center justify-center w-full h-full bg-gray-200 border border-gray-500 rotate-45"
          }
        >
          <span
            className={
              visitedPrefIds.has(id)
                ? "text-xl -rotate-45 font-bold text-white"
                : "text-xl -rotate-45 font-bold text-black"
            }
          >
            {name}
          </span>
        </Link>
      );
    }
    return (
      <Link
        key={id}
        to={to}
        className={
          visitedPrefIds.has(id)
            ? "flex items-center justify-center w-full h-full bg-[#009119] border border-gray-500"
            : "flex items-center justify-center w-full h-full bg-gray-200 border border-gray-500"
        }
      >
        <span
          className={
            visitedPrefIds.has(id)
              ? "text-s font-bold text-white text-center leading-tight"
              : "text-s font-bold text-black text-center leading-tight"
          }
        >
          {name}
        </span>
      </Link>
    );
  };

  return (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto md:overflow-hidden flex justify-center bg-[#35a0ee]">
        <div className="w-full max-w-[1440px] h-full relative">
          <MainBar />
          {/* Mobile layout: list/grid view */}
          <div className="block md:hidden pt-[80px] pb-[50px] w-full">
            <div className="px-3">
              <div className="mb-3 hidden">
                <select className="w-full rounded-md border border-black/30 px-3 py-2 bg-white text-black">
                  {(users as string[]).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {prefectures.map((p) => (
                  <li key={p.id} data-prefecture-id={p.id}>
                    <Link
                      to={`/prefectures/${p.id}/${p.name}`}
                      className={
                        visitedPrefIds.has(p.id)
                          ? "block w-full text-center px-3 py-3 rounded-md bg-[#009119] border border-gray-500"
                          : "block w-full text-center px-3 py-3 rounded-md bg-gray-200 border border-gray-500"
                      }
                    >
                      <span
                        className={
                          visitedPrefIds.has(p.id)
                            ? "font-bold text-white"
                            : "font-bold text-black"
                        }
                      >
                        {p.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop layout: map view */}
          <div className="hidden md:block absolute left-0 top-[80px] w-full h-[calc(100dvh-80px-50px)] bg-[#35a0ee]">
            <div className="absolute left-[10px] top-0 w-full h-full text-white hidden">
              <select className="absolute left-0 top-0">
                {(users as string[]).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="absolute left-[10px] top-0 w-full h-full">
              <ul className="relative w-full h-full">
                {prefectures.map((p) => {
                  const pos = positions[p.name as keyof typeof positions];
                  if (!pos) return null;
                  const { left, top } = posToXY(pos.row, pos.col);
                  const size = pos.size ?? "square";
                  let width = size === "rectW" ? cell * 2 : cell;
                  let height =
                    size === "rectH" ? cell * (1 + rectExtraRatio) : cell;
                  if (pos.diamond) {
                    width = cell * diamondFactor;
                    height = cell * diamondFactor;
                  }
                  return (
                    <li
                      key={p.id}
                      className="absolute"
                      style={{ left, top, width, height }}
                      data-prefecture-id={p.id}
                    >
                      <PrefCell
                        id={p.id}
                        name={p.name}
                        to={`/prefectures/${p.id}/${p.name}`}
                        diamond={pos.diamond}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* Nested routes will render here */}
          <Outlet />
          <EndBar />
        </div>
      </div>
    </>
  );
}
