import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import Home from "~/routes/home";

describe("初期画面表示", async () => {
  const { default: Prefectures } = await import("../../app/routes/prefectures");
  const Stub = createRoutesStub([
    {
      path: "/prefectures/:prefectureId/:prefectureName",
      Component: Prefectures,
      loader: () => {
        return {
          visit: null,
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

  test.each([
    {
      prefectureId: 1,
      prefectureName: "北海道",
      visit: {
        id: 1,
        prefectureId: 1,
        visitFromDate: "2025-09-01",
        visitToDate: "2025-09-01",
      },
    },
    {
      prefectureId: 2,
      prefectureName: "青森県",
      visit: {
        id: 2,
        prefectureId: 2,
        visitFromDate: "2025-09-02",
        visitToDate: "2025-09-02",
      },
    },
    {
      prefectureId: 3,
      prefectureName: "岩手県",
      visit: {
        id: 3,
        prefectureId: 3,
        visitFromDate: "2025-09-03",
        visitToDate: "2025-09-03",
      },
    },
    {
      prefectureId: 47,
      prefectureName: "沖縄県",
      visit: {
        id: 47,
        prefectureId: 47,
        visitFromDate: "2025-09-04",
        visitToDate: "2025-09-04",
      },
    },
  ])(
    "最後に訪問した期間がわかる (%s.prefectureName)",
    async ({ prefectureId, prefectureName, visit }) => {
      const { default: Prefectures } = await import(
        "../../app/routes/prefectures"
      );
      const Stub = createRoutesStub([
        {
          path: "/prefectures/:prefectureId/:prefectureName",
          Component: Prefectures,
          loader: () => {
            return {
              visit,
            };
          },
        },
      ]);
      render(
        <Stub
          initialEntries={[`/prefectures/${prefectureId}/${prefectureName}`]}
        />
      );

      expect(
        await screen.findByText("最後に訪問した期間:")
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          visit.visitFromDate.replaceAll("-", "/") +
            " ~ " +
            visit.visitToDate.replaceAll("-", "/")
        )
      ).toBeInTheDocument();
    }
  );

  test("訪問したことがないことがわかる", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: null,
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    expect(await screen.findByText("最後に訪問した期間:")).toBeInTheDocument();
    expect(
      await screen.findByText("訪れたことがない、、、")
    ).toBeInTheDocument();
  });

  test("戻るボタンを押すと、前のページに戻る", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Home,
        loader: () => {
          return { prefectures: [] };
        },
      },
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: null,
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    const backButton = await screen.findByRole("link", { name: "戻る" });
    expect(backButton).toBeInTheDocument();
    await userEvent.click(backButton);
    expect(window.history.length).toBe(1);
    expect(await screen.findByText("47都道府県旅行記録")).toBeInTheDocument();
  });
});
