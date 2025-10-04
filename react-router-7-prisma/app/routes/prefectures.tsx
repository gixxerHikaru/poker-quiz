import { useParams, useLoaderData, Link } from "react-router";
import prisma from "../lib/prisma";
import type { Route } from "./+types/prefectures";

type ActionData = {
  success: boolean;
};

type submitData = {
  prefectureId: number;
  visitFromDate: string;
  visitToDate: string;
};

type LoaderData = {
  visit: {
    id: number;
    prefectureId: number;
    visitFromDate: string;
    visitToDate: string;
  } | null;
};

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const prefectureIdRaw = formData.get("prefectureId");
  const visitFromDateRaw = formData.get("visitFromDate");
  const visitToDateRaw = formData.get("visitToDate");

  if (
    typeof prefectureIdRaw !== "string" ||
    typeof visitFromDateRaw !== "string" ||
    typeof visitToDateRaw !== "string"
  ) {
    return { success: false };
  }

  const prefectureId = Number(prefectureIdRaw);
  const visitFromDate = new Date(visitFromDateRaw);
  const visitToDate = new Date(visitToDateRaw);

  await prisma.visits.create({
    data: {
      prefectureId,
      visitFromDate,
      visitToDate,
    },
  });
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
  return {
    visit: visit
      ? {
          id: visit.id,
          prefectureId: visit.prefectureId,
          visitFromDate: visit.visitFromDate.toISOString(),
          visitToDate: visit.visitToDate.toISOString(),
        }
      : null,
  };
};

export default function Prefectures() {
  const { prefectureId, prefectureName } = useParams();
  const { visit } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-16 pb-4">
        <h1>{prefectureName}</h1>
        <div className="flex items-center">
          <p>最後に訪問した期間: </p>
          <p>
            {visit
              ? new Date(visit.visitFromDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }) +
                " ~ " +
                new Date(visit.visitToDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "まだ行ったこと無い、、、今度行こ！"}
          </p>
        </div>
        <div className="flex flex-col items-center border border-gray-500 p-4 mt-4">
          <form method="post">
            <input type="hidden" name="prefectureId" value={prefectureId} />
            <label htmlFor="visitFromDate" className="mt-2">
              訪問期間
            </label>
            <div className="flex mt-2">
              <div className="flex flex-col">
                <label htmlFor="visitFromDate">訪問日</label>
                <input
                  type="date"
                  id="visitFromDate"
                  name="visitFromDate"
                  className="mt-2"
                  defaultValue={visit?.visitFromDate || ""}
                />
              </div>
              <div className="mt-4 flex mx-6">~</div>
              <div className="flex flex-col">
                <label htmlFor="visitToDate">帰宅日</label>
                <input
                  type="date"
                  id="visitToDate"
                  name="visitToDate"
                  className="mt-2"
                  defaultValue={visit?.visitToDate || ""}
                />
              </div>
            </div>
            <div className="flex mt-4 justify-end">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                登録
              </button>
            </div>
          </form>
        </div>
        <div className="flex mt-4 ">
          <Link to="/">戻る</Link>
        </div>
      </div>
    </>
  );
}
