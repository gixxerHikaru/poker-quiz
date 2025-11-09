import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
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

      expect(await screen.findByText("最後に訪問した期間")).toBeInTheDocument();
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
    expect(await screen.findByText("最後に訪問した期間")).toBeInTheDocument();
    expect(
      await screen.findByText("まだ行ったこと無い、、、今度行こ！")
    ).toBeInTheDocument();
  });

  test("食べ物を見ることができる", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: {
              id: 1,
              prefectureId: 47,
              visitFromDate: "2025-09-01",
              visitToDate: "2025-09-01",
              food: "食べ物書いてみた",
            },
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    expect(await screen.findByText("最後に訪問した期間"));
    expect(
      await screen.findByText("2025/09/01 ~ 2025/09/01")
    ).toBeInTheDocument();
    expect(await screen.findByText("食べたもの")).toBeInTheDocument();
    expect(await screen.findByText("食べ物書いてみた")).toBeInTheDocument();
  });

  test("活動を見ることができる", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: {
              id: 1,
              prefectureId: 47,
              visitFromDate: "2025-09-01",
              visitToDate: "2025-09-01",
              activity: "活動書いてみた",
            },
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    expect(await screen.findByText("最後に訪問した期間"));
    expect(
      await screen.findByText("2025/09/01 ~ 2025/09/01")
    ).toBeInTheDocument();
    expect(await screen.findByText("行った場所")).toBeInTheDocument();
    expect(await screen.findByText("活動書いてみた")).toBeInTheDocument();
  });

  test("メモを見ることができる", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: {
              id: 1,
              prefectureId: 47,
              visitFromDate: "2025-09-01",
              visitToDate: "2025-09-01",
              memo: "メモ書いてみた",
            },
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    expect(await screen.findByText("最後に訪問した期間"));
    expect(
      await screen.findByText("2025/09/01 ~ 2025/09/01")
    ).toBeInTheDocument();
    expect(await screen.findByText("その他")).toBeInTheDocument();
    expect(await screen.findByText("メモ書いてみた")).toBeInTheDocument();
  });

  describe("画像表示", () => {
    test("登録された画像を見ることができる", async () => {
      const { default: Prefectures } = await import(
        "../../app/routes/prefectures"
      );
      const Stub = createRoutesStub([
        {
          path: "/prefectures/:prefectureId/:prefectureName",
          Component: Prefectures,
          loader: () => {
            return {
              visit: {
                id: 1,
                prefectureId: 47,
                visitFromDate: "2025-09-01",
                visitToDate: "2025-09-01",
                memo: "メモ書いてみた",
                images: [
                  {
                    id: 1,
                    visitId: 1,
                    path: "test.jpg",
                  },
                ],
              },
            };
          },
        },
      ]);
      render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
      const imageElement = await screen.findByRole("img");
      await expect(screen.findByRole("写真"));
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute("alt");
    });

    test("画像をクリックすると拡大表示し、枠外をクリックすると閉じる", async () => {
      const { default: Prefectures } = await import(
        "../../app/routes/prefectures"
      );
      const Stub = createRoutesStub([
        {
          path: "/prefectures/:prefectureId/:prefectureName",
          Component: Prefectures,
          loader: () => {
            return {
              visit: {
                id: 1,
                prefectureId: 47,
                visitFromDate: "2025-09-01",
                visitToDate: "2025-09-01",
                memo: "メモ書いてみた",
                images: [
                  {
                    id: 1,
                    visitId: 1,
                    path: "test.jpg",
                  },
                ],
              },
            };
          },
        },
      ]);
      render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
      const imageElement = await screen.findByRole("img");
      await expect(screen.findByRole("写真"));
      await userEvent.click(imageElement);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

      const outsideElement = screen.getByRole("dialog");
      await userEvent.click(outsideElement);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("トップへ戻るボタンを押すと、トップページに戻る", async () => {
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
    const backButton = await screen.findByRole("link", {
      name: "トップへ戻る",
    });
    expect(backButton).toBeInTheDocument();
    await userEvent.click(backButton);
    expect(window.history.length).toBe(1);
    waitFor(async () => {
      expect(await screen.findByText("47都道府県旅行記録")).toBeInTheDocument();
    });
  });
});

describe("入力フォーム", async () => {
  const { default: Prefectures } = await import("../../app/routes/prefectures");
  const Stub = createRoutesStub([
    {
      path: "/prefectures/:prefectureId/:prefectureName",
      Component: Prefectures,
      loader: () => ({ visit: null }),
    },
  ]);

  let capturedFormData: Record<string, string> | null = null;
  const action = vi.fn(async ({ request }: any) => {
    const fd = await request.formData();
    capturedFormData = {
      prefectureId: fd.get("prefectureId") as string,
      visitFromDate: fd.get("visitFromDate") as string,
      visitToDate: fd.get("visitToDate") as string,
      memo: fd.get("memo") as string,
    };
    return { success: true };
  });

  const ActionStub = createRoutesStub([
    {
      path: "/prefectures/:prefectureId/:prefectureName",
      Component: Prefectures,
      loader: () => ({ visit: null }),
      action,
    },
  ]);

  test("フォーム要素が表示され、必須属性が付いている", async () => {
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);

    const fromInput = await screen.findByLabelText("訪問日");
    const toInput = await screen.findByLabelText("帰宅日");

    expect(fromInput).toBeInTheDocument();
    expect(toInput).toBeInTheDocument();
    expect(fromInput).toHaveAttribute("required");
    expect(toInput).toHaveAttribute("required");
    expect((fromInput as HTMLInputElement).value).toBe("");
    expect((toInput as HTMLInputElement).value).toBe("");
  });

  test("帰宅日が空白の時、訪問日に日付を入力すると、帰宅日に同じ日付が入力される", async () => {
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    const fromInput = await screen.findByLabelText("訪問日");
    const toInput = await screen.findByLabelText("帰宅日");
    await userEvent.clear(fromInput);
    expect((fromInput as HTMLInputElement).value).toBe("");
    await userEvent.type(fromInput, "2025-09-10");
    expect((toInput as HTMLInputElement).value).toBe("2025-09-10");
  });

  test("訪問日が空白の時、帰宅日に日付を入力すると、訪問日に同じ日付が入力される", async () => {
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);
    const fromInput = await screen.findByLabelText("訪問日");
    const toInput = await screen.findByLabelText("帰宅日");
    await userEvent.clear(toInput);
    expect((fromInput as HTMLInputElement).value).toBe("");
    await userEvent.type(toInput, "2025-09-10");
    expect((fromInput as HTMLInputElement).value).toBe("2025-09-10");
  });

  test("必須項目を入力して送信すると action に formData が渡る", async () => {
    render(<ActionStub initialEntries={[`/prefectures/47/沖縄県`]} />);

    const fromInput = await screen.findByLabelText("訪問日");
    const toInput = await screen.findByLabelText("帰宅日");
    const memoInput = await screen.findByLabelText("その他!!!");
    const submit = await screen.findByRole("button", { name: "登録" });

    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "2025-09-10");
    await userEvent.clear(toInput);
    await userEvent.type(toInput, "2025-09-12");
    await userEvent.clear(memoInput);
    await userEvent.type(memoInput, "メモ書いてみた");
    await userEvent.click(submit);

    waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    waitFor(() => {
      expect(capturedFormData).toEqual({
        prefectureId: "47",
        visitFromDate: "2025-09-10",
        visitToDate: "2025-09-12",
        memo: "メモ書いてみた",
      });
    });
  });

  describe("エラー系", () => {
    test("必須項目を入力しないと action に formData が渡らない", async () => {
      render(<ActionStub initialEntries={[`/prefectures/47/沖縄県`]} />);

      const fromInput = await screen.findByLabelText("訪問日");
      const toInput = await screen.findByLabelText("帰宅日");
      const submit = await screen.findByRole("button", { name: "登録" });

      await userEvent.clear(fromInput);
      await userEvent.clear(toInput);
      await userEvent.click(submit);

      waitFor(() => {
        expect(action).toHaveBeenCalledTimes(0);
      });

      waitFor(() => {
        expect(capturedFormData).toEqual(null);
      });
    });

    test("訪問日が帰宅日より後になるとエラーメッセージが表示される", async () => {
      render(<ActionStub initialEntries={[`/prefectures/47/沖縄県`]} />);

      const fromInput = await screen.findByLabelText("訪問日");
      const toInput = await screen.findByLabelText("帰宅日");

      await userEvent.clear(fromInput);
      await userEvent.type(fromInput, "2025-09-12");
      await userEvent.clear(toInput);
      await userEvent.type(toInput, "2025-09-10");
      waitFor(async () => {
        expect(await screen.findByText("訪問日が帰宅日より後です"));
      });
    });

    test("エラーメッセージが表示されているとき、登録ボタンが押せない", async () => {
      render(<ActionStub initialEntries={[`/prefectures/47/沖縄県`]} />);

      const fromInput = await screen.findByLabelText("訪問日");
      const toInput = await screen.findByLabelText("帰宅日");
      const submit = await screen.findByRole("button", { name: "登録" });

      await userEvent.clear(fromInput);
      await userEvent.type(fromInput, "2025-09-12");
      await userEvent.clear(toInput);
      await userEvent.type(toInput, "2025-09-10");

      waitFor(async () => {
        expect(submit).toBeDisabled();
      });
    });
  });

  test("既に旅行が記録してあるところにメモだけ書き換えても画面が更新される", async () => {
    const { default: Prefectures } = await import(
      "../../app/routes/prefectures"
    );
    const Stub = createRoutesStub([
      {
        path: "/prefectures/:prefectureId/:prefectureName",
        Component: Prefectures,
        loader: () => {
          return {
            visit: {
              id: 1,
              prefectureId: 47,
              visitFromDate: "2025-09-01",
              visitToDate: "2025-09-01",
              memo: "過去メモ",
            },
          };
        },
      },
    ]);
    render(<Stub initialEntries={[`/prefectures/47/沖縄県`]} />);

    const fromInput = await screen.findByLabelText("訪問日");
    const toInput = await screen.findByLabelText("帰宅日");
    const foodInput = await screen.findByLabelText("食べたもの!");
    const activityInput = await screen.findByLabelText("行った場所!");
    const memoInput = await screen.findByLabelText("その他!!!");
    const submit = await screen.findByRole("button", { name: "登録" });

    expect(await screen.findByText("過去メモ")).toBeInTheDocument();

    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "2025-09-10");
    await userEvent.clear(toInput);
    await userEvent.type(toInput, "2025-09-12");
    await userEvent.clear(foodInput);
    await userEvent.type(foodInput, "食べたもの更新");
    await userEvent.clear(activityInput);
    await userEvent.type(activityInput, "行った場所更新");
    await userEvent.clear(memoInput);
    await userEvent.type(memoInput, "メモ更新");
    await userEvent.click(submit);

    waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    waitFor(() => {
      expect(capturedFormData).toEqual({
        prefectureId: "47",
        visitFromDate: "2025-09-10",
        visitToDate: "2025-09-12",
        memo: "メモ更新",
        food: "食べたもの更新",
        activity: "行った場所更新",
      });
    });

    waitFor(async () => {
      expect(await screen.findByText("メモ更新")).toBeInTheDocument();
    });
  });
});
