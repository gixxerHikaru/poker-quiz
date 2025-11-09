import { describe, test, expect, beforeEach, vi } from "vitest";

const prisma = vi.hoisted(() => ({
  visits: {
    findFirst: vi.fn(),
  },
  images: {
    findMany: vi.fn(),
  },
}));

vi.mock("../../app/lib/prisma", () => ({
  default: prisma,
}));

describe("prefectures loader（画像含む）", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test("最新の訪問データと紐づく画像一覧を返す", async () => {
    const visit = {
      id: 30,
      prefectureId: 47,
      visitFromDate: new Date("2025-09-01T00:00:00.000Z"),
      visitToDate: new Date("2025-09-02T00:00:00.000Z"),
      food: "f",
      activity: "a",
      memo: "m",
    } as any;
    const imageRows = [
      { id: 1, visitId: 30, path: "/trip_images/a.jpg" },
      { id: 2, visitId: 30, path: "/trip_images/b.jpg" },
    ];
    prisma.visits.findFirst.mockResolvedValueOnce(visit);
    prisma.images.findMany.mockResolvedValueOnce(imageRows);

    const { loader } = await import("../../app/routes/prefectures");
    const res = await loader({ params: { prefectureId: "47" } } as any);

    expect(prisma.visits.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.images.findMany).toHaveBeenCalledTimes(1);
    expect(res.visit?.id).toBe(30);
    expect(res.visit?.images).toEqual(imageRows);
    expect(res.visit?.visitFromDate).toBe("2025-09-01T00:00:00.000Z");
    expect(res.visit?.visitToDate).toBe("2025-09-02T00:00:00.000Z");
    expect(res.visit?.food).toBe("f");
    expect(res.visit?.activity).toBe("a");
    expect(res.visit?.memo).toBe("m");
  });

  test("visit が見つからない場合は visit=null を返す", async () => {
    prisma.visits.findFirst.mockResolvedValueOnce(null);

    const { loader } = await import("../../app/routes/prefectures");
    const res = await loader({ params: { prefectureId: "47" } } as any);

    expect(prisma.visits.findFirst).toHaveBeenCalledTimes(1);
    expect(res.visit).toBeNull();
  });
});
