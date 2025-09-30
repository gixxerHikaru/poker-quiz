import { useParams, useLoaderData } from "react-router";
import prisma from "../lib/prisma";
import type { Route } from "./+types/prefectures";

type LoaderData = {
  visit: {
    id: number;
    prefectureId: number;
    visitFromDate: string;
    visitToDate: string;
  } | null;
};

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
          <p>最後に訪問した日: </p>
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
              : "訪れたことがない、、、"}
          </p>
        </div>
      </div>
    </>
  );
}
