import { useParams, useLoaderData } from "react-router";

export default function Prefectures() {
  const { prefectureId, prefectureName } = useParams();

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-16 pb-4">
        <h1>{prefectureName}</h1>
        <div className="flex items-center"></div>
      </div>
    </>
  );
}
