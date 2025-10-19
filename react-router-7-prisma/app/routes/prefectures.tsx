import { useParams, useLoaderData, Link } from "react-router";
import prisma from "../lib/prisma";
import type { Route } from "./+types/prefectures";
import { useMemo, useState, useEffect } from "react";
import path from "path";
import { promises as fs } from "fs";
import MainBar from "~/components/MainBar";
import EndBar from "~/components/EndBar";

type ActionData = {
  success: boolean;
};

type submitData = {
  prefectureId: number;
  visitFromDate: string;
  visitToDate: string;
  memo: string;
  images: string;
};

type LoaderData = {
  visit: {
    id: number;
    prefectureId: number;
    visitFromDate: string;
    visitToDate: string;
    memo: string | null;
    images?: {
      id: number;
      visitId: number;
      path: string;
    }[];
  } | null;
};

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const prefectureIdRaw = formData.get("prefectureId");
  const visitFromDateRaw = formData.get("visitFromDate");
  const visitToDateRaw = formData.get("visitToDate");
  const memoRaw = formData.get("memo");
  const imageInput = formData.get("images");

  if (
    typeof prefectureIdRaw !== "string" ||
    typeof visitFromDateRaw !== "string" ||
    typeof visitToDateRaw !== "string" ||
    typeof memoRaw !== "string"
  ) {
    return { success: false };
  }

  if (visitToDateRaw < visitFromDateRaw) {
    return { success: false };
  }

  const prefectureId = Number(prefectureIdRaw);
  const visitFromDate = new Date(visitFromDateRaw);
  const visitToDate = new Date(visitToDateRaw);
  let imagePath: string | null = null;
  if (
    imageInput &&
    typeof imageInput === "object" &&
    "arrayBuffer" in imageInput
  ) {
    const file = imageInput as File;
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "trip_images");
      await fs.mkdir(uploadDir, { recursive: true });
      const ext = path.extname(file.name) || ".bin";
      const base = path.basename(file.name, ext) || "image";
      const filename = `${base}-${Date.now()}${ext}`;
      const fullPath = path.join(uploadDir, filename);
      await fs.writeFile(fullPath, buffer);
      imagePath = `/trip_images/${filename}`;
    }
  }

  const existing = await prisma.visits.findFirst({
    where: {
      prefectureId,
      visitFromDate,
      visitToDate,
    },
    orderBy: { visitToDate: "desc" },
  });

  if (existing) {
    await prisma.visits.update({
      where: { id: existing.id },
      data: {
        memo: memoRaw,
        visitFromDate,
        visitToDate,
      },
    });
    if (imagePath) {
      await prisma.images.create({
        data: {
          visitId: existing.id,
          path: imagePath,
        },
      });
    }
  } else {
    const created = await prisma.visits.create({
      data: {
        prefectureId,
        visitFromDate,
        visitToDate,
        memo: memoRaw,
      },
    });
    if (imagePath) {
      await prisma.images.create({
        data: {
          visitId: created.id,
          path: imagePath,
        },
      });
    }
  }
  return {
    success: true,
  };
}

export const loader = async ({
  params,
}: Route.LoaderArgs): Promise<LoaderData> => {
  const prefectureId = Number(params.prefectureId);
  const visit = await prisma.visits.findFirst({
    where: { prefectureId },
    orderBy: { visitToDate: "desc" },
  });
  const images = await prisma.images.findMany({
    where: { visitId: visit?.id },
  });
  return {
    visit: visit
      ? {
          id: visit.id,
          prefectureId: visit.prefectureId,
          visitFromDate: visit.visitFromDate.toISOString(),
          visitToDate: visit.visitToDate.toISOString(),
          memo: visit.memo,
          images,
        }
      : null,
  };
};

export default function Prefectures() {
  const { prefectureId, prefectureName } = useParams();
  const { visit } = useLoaderData<typeof loader>();

  const normalizeToDateInput = (value?: string | null) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    try {
      return new Date(value).toISOString().slice(0, 10);
    } catch (_) {
      return "";
    }
  };

  const [fromDate, setFromDate] = useState<string>(
    normalizeToDateInput(visit?.visitFromDate)
  );
  const [toDate, setToDate] = useState<string>(
    normalizeToDateInput(visit?.visitToDate)
  );
  const [memo, setMemo] = useState<string>(visit?.memo || "");
  useEffect(() => {
    if (fromDate && !toDate) {
      setToDate(fromDate);
    }
  }, [fromDate, toDate]);
  useEffect(() => {
    if (toDate && !fromDate) {
      setFromDate(toDate);
    }
  }, [toDate, fromDate]);

  const isRangeInvalid = useMemo(() => {
    if (!fromDate || !toDate) return false;
    return toDate < fromDate;
  }, [fromDate, toDate]);

  const resolveImageSrc = (raw: string) => {
    if (!raw) return "";
    const path = raw.trim();
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith("/")) return path;

    const marker = "trip_images/";
    let filePart = path;
    const idx = path.lastIndexOf(marker);
    if (idx !== -1) {
      filePart = path.slice(idx + marker.length);
    } else {
      const parts = path.split("/");
      filePart = parts[parts.length - 1];
    }
    return `/trip_images/${filePart}`;
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center bg-[#35a0ee]">
        <MainBar />
        <div className="w-full max-w-[960px] mx-auto px-4 pt-[80px] pb-[80px]">
          <div className="mb-6">
            <h1 className="mt-3 text-3xl font-bold text-white text-center">
              {prefectureName}
            </h1>
          </div>

          <div className="bg-white border border-black/20 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-black">最終訪問履歴</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-black">
              <div className="font-semibold">最後に訪問した期間</div>
              <div className="md:col-span-2">
                {visit
                  ? `${new Date(visit.visitFromDate).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })} ~ ${new Date(visit.visitToDate).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })}`
                  : "まだ行ったこと無い、、、今度行こ！"}
              </div>
              <div className="font-semibold">メモ(行ったところ等)</div>
              <div className="md:col-span-2">{visit?.memo ?? "-"}</div>
              <div className="font-semibold">写真</div>
              {visit?.images && visit.images.length > 0 && (
                <>
                  <div className="md:col-span-2">
                    <img
                      src={resolveImageSrc(visit.images[0].path)}
                      alt="訪問画像"
                      className="max-h-48 rounded-md border border-black/10"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white border border-black/20 rounded-xl shadow-sm p-6 mt-6">
            <form
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <input type="hidden" name="prefectureId" value={prefectureId} />
              <div>
                <label
                  htmlFor="visitFromDate"
                  className="block text-sm font-bold text-black"
                >
                  訪問日
                </label>
                <input
                  type="date"
                  id="visitFromDate"
                  name="visitFromDate"
                  className="mt-1 w-full md:w-[220px] rounded-md border border-black/40 px-2 py-1 text-sm bg-white text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="visitToDate"
                  className="block text-sm font-bold text-black"
                >
                  帰宅日
                </label>
                <input
                  type="date"
                  id="visitToDate"
                  name="visitToDate"
                  className="mt-1 w-full md:w-[220px] rounded-md border border-black/40 px-2 py-1 text-sm bg-white text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={toDate}
                  onChange={(e) => setToDate(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="memo"
                  className="block text-sm font-bold text-black"
                >
                  メモ
                </label>
                <input
                  type="text"
                  id="memo"
                  name="memo"
                  className="mt-1 w-full rounded-md border border-black/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-black"
                  value={memo}
                  onChange={(e) => setMemo(e.currentTarget.value)}
                  placeholder="例: 食べたもの・行った場所"
                />
              </div>
              <div className="mt-1 w-[330px]">
                <label htmlFor="images">写真</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  accept="image/*"
                />
              </div>
              {isRangeInvalid && (
                <p className="text-sm text-red-600">訪問日が帰宅日より後です</p>
              )}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={
                    isRangeInvalid
                      ? "px-5 py-2 rounded-md text-white bg-gray-400"
                      : "px-5 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                  }
                  disabled={isRangeInvalid}
                >
                  登録
                </button>
              </div>
            </form>
          </div>
          <div className="mt-6">
            <div className="flex justify-end">
              <Link
                to="/"
                className="text-sm px-4 py-2 rounded-md bg-white/90 hover:bg-white text-[#111] border border-black/20"
              >
                トップへ戻る
              </Link>
            </div>
          </div>
        </div>
        <EndBar />
      </div>
      {/* style tag scoped for calendar icon color on WebKit */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(28%) sepia(93%) saturate(1452%) hue-rotate(195deg) brightness(93%) contrast(94%);
        }
      `}</style>
    </>
  );
}
