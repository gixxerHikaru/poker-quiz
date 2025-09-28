import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import { createRoutesStub } from "react-router";

const Visits = [
  {
    visitDate: "2025-09-22",
  },
];

describe("初期画面表示", async () => {
  const { default: Prefectures } = await import("../../app/routes/prefectures");
  const Stub = createRoutesStub([
    {
      path: "/prefectures/:prefectureId/:prefectureName",
      Component: Prefectures,
      loader: () => {
        return {
          lastVisitDate: "2025-09-22",
        };
      },
    },
  ]);

  test.each([
    { prefectureId: 1, prefectureName: "北海道" },
    { prefectureId: 2, prefectureName: "青森県" },
    { prefectureId: 3, prefectureName: "岩手県" },
    { prefectureId: 47, prefectureName: "沖縄県" },
  ])("都道府県名が見える (%s)", async ({ prefectureId, prefectureName }) => {
    render(
      <Stub
        initialEntries={[`/prefectures/${prefectureId}/${prefectureName}`]}
      />
    );
    expect(await screen.findByText(prefectureName)).toBeInTheDocument();
  });

  test.skip("最後に訪問した日がわかる", async () => {
    render(<Stub initialEntries={[`/prefectures/15/新潟県`]} />);
    expect(await screen.findByText("最後に訪問した日:")).toBeInTheDocument();
    expect(await screen.findByText("2025-09-22")).toBeInTheDocument();
  });
  test.skip("最後に訪問した日がわかる", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            Visits: {
              id: 1,
              visitDate: "2025-09-01",
              prefectureId: 1,
            },
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/1/北海道`]} />);
    expect(await screen.findByText("最後に訪問した日:")).toBeInTheDocument();
    expect(await screen.findByText("2025-09-01")).toBeInTheDocument();
  });
});
