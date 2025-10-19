import { describe, test, expect, beforeEach, vi } from "vitest";

function makeFakeRequest(form: Record<string, any>) {
  return {
    formData: async () => ({
      get: (key: string) => (key in form ? form[key] : null),
    }),
  } as any;
}

const { mkdir, writeFile } = vi.hoisted(() => {
  return {
    mkdir: vi.fn(async () => undefined),
    writeFile: vi.fn(async () => undefined),
  };
});

vi.mock("fs", () => ({
  default: {
    promises: { mkdir, writeFile },
  },
  promises: { mkdir, writeFile },
}));

const prisma = vi.hoisted(() => ({
  visits: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  images: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("../../app/lib/prisma", () => ({
  default: prisma,
}));

describe("画像系", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test("新規訪問を作成し画像ファイルを保存してDBにパスを登録できる", async () => {
    prisma.visits.findFirst.mockResolvedValueOnce(null);
    prisma.visits.create.mockResolvedValueOnce({ id: 10 });
    prisma.images.create.mockResolvedValueOnce({});

    const { action } = await import("../../app/routes/prefectures");

    const fakeFile = {
      name: "test.jpg",
      size: 3,
      type: "image/jpeg",
      arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
    };
    const request = makeFakeRequest({
      prefectureId: "47",
      visitFromDate: "2025-09-10",
      visitToDate: "2025-09-12",
      memo: "画像あり",
      images: fakeFile,
    });

    const res = await action({ request } as any);

    expect(res).toEqual({ success: true });
    expect(prisma.visits.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.visits.create).toHaveBeenCalledTimes(1);
    expect(prisma.images.create).toHaveBeenCalledTimes(1);
    expect(prisma.images.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          visitId: 10,
          path: expect.stringMatching(/^\/trip_images\//),
        },
      })
    );
    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  test("既存訪問がある場合は更新し画像だけ追記できる", async () => {
    prisma.visits.findFirst.mockResolvedValueOnce({ id: 5 });
    prisma.visits.update.mockResolvedValueOnce({});
    prisma.images.create.mockResolvedValueOnce({});

    const { action } = await import("../../app/routes/prefectures");

    const fakeFile = {
      name: "test2.png",
      size: 3,
      type: "image/png",
      arrayBuffer: async () => Uint8Array.from([4, 5, 6]).buffer,
    };
    const request = makeFakeRequest({
      prefectureId: "47",
      visitFromDate: "2025-09-10",
      visitToDate: "2025-09-12",
      memo: "画像あり",
      images: fakeFile,
    });

    const res = await action({ request } as any);

    expect(res).toEqual({ success: true });
    expect(prisma.visits.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.visits.update).toHaveBeenCalledTimes(1);
    expect(prisma.visits.create).toHaveBeenCalledTimes(0);
    expect(prisma.images.create).toHaveBeenCalledTimes(1);
    expect(prisma.images.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          visitId: 5,
          path: expect.stringMatching(/^\/trip_images\//),
        },
      })
    );
    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  test("画像未選択の場合はファイル保存・画像登録をスキップする", async () => {
    prisma.visits.findFirst.mockResolvedValueOnce(null);
    prisma.visits.create.mockResolvedValueOnce({ id: 20 });

    const { action } = await import("../../app/routes/prefectures");

    const request = makeFakeRequest({
      prefectureId: "47",
      visitFromDate: "2025-09-10",
      visitToDate: "2025-09-12",
      memo: "画像なし",
    });

    const res = await action({ request } as any);

    expect(res).toEqual({ success: true });
    expect(prisma.visits.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.visits.create).toHaveBeenCalledTimes(1);
    expect(prisma.images.create).toHaveBeenCalledTimes(0);
    expect(mkdir).toHaveBeenCalledTimes(0);
    expect(writeFile).toHaveBeenCalledTimes(0);
  });
});
