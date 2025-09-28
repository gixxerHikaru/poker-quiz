import { PrismaClient, Prisma } from "../app/generated/prisma/client.js";

const prisma = new PrismaClient();

const prefectureData: Prisma.PrefecturesCreateInput[] = [
  { id: 1, name: "北海道", area: "北海道" },
  { id: 2, name: "青森県", area: "東北" },
  { id: 3, name: "岩手県", area: "東北" },
  { id: 4, name: "宮城県", area: "東北" },
  { id: 5, name: "秋田県", area: "東北" },
  { id: 6, name: "山形県", area: "東北" },
  { id: 7, name: "福島県", area: "東北" },
  { id: 8, name: "茨城県", area: "関東" },
  { id: 9, name: "栃木県", area: "関東" },
  { id: 10, name: "群馬県", area: "関東" },
  { id: 11, name: "埼玉県", area: "関東" },
  { id: 12, name: "千葉県", area: "関東" },
  { id: 13, name: "東京都", area: "関東" },
  { id: 14, name: "神奈川県", area: "関東" },
  { id: 15, name: "新潟県", area: "中部" },
  { id: 16, name: "富山県", area: "中部" },
  { id: 17, name: "石川県", area: "中部" },
  { id: 18, name: "福井県", area: "中部" },
  { id: 19, name: "山梨県", area: "中部" },
  { id: 20, name: "長野県", area: "中部" },
  { id: 21, name: "岐阜県", area: "中部" },
  { id: 22, name: "静岡県", area: "中部" },
  { id: 23, name: "愛知県", area: "中部" },
  { id: 24, name: "三重県", area: "関西" },
  { id: 25, name: "滋賀県", area: "関西" },
  { id: 26, name: "京都府", area: "関西" },
  { id: 27, name: "大阪府", area: "関西" },
  { id: 28, name: "兵庫県", area: "関西" },
  { id: 29, name: "奈良県", area: "関西" },
  { id: 30, name: "和歌山県", area: "関西" },
  { id: 31, name: "鳥取県", area: "中国" },
  { id: 32, name: "島根県", area: "中国" },
  { id: 33, name: "岡山県", area: "中国" },
  { id: 34, name: "広島県", area: "中国" },
  { id: 35, name: "山口県", area: "中国" },
  { id: 36, name: "徳島県", area: "四国" },
  { id: 37, name: "香川県", area: "四国" },
  { id: 38, name: "愛媛県", area: "四国" },
  { id: 39, name: "高知県", area: "四国" },
  { id: 40, name: "福岡県", area: "九州" },
  { id: 41, name: "佐賀県", area: "九州" },
  { id: 42, name: "長崎県", area: "九州" },
  { id: 43, name: "熊本県", area: "九州" },
  { id: 44, name: "大分県", area: "九州" },
  { id: 45, name: "宮崎県", area: "九州" },
  { id: 46, name: "鹿児島県", area: "九州" },
  { id: 47, name: "沖縄県", area: "九州" },
];

export async function main() {
  for (const p of prefectureData) {
    await prisma.prefectures.create({ data: p });
  }
}

main();
