export function calculateScore(remainTime: number, systemAnswer: string) {
  if (remainTime < 1) remainTime = 1;

  switch (systemAnswer) {
    case 'ハイカード':
      return remainTime * 1;
    case 'ワンペア':
      return remainTime * 2;
    case 'ツーペア':
      return remainTime * 3;
    case 'スリーカード':
      return remainTime * 5;
    case 'ストレート':
      return remainTime * 8;
    case 'フラッシュ':
      return remainTime * 13;
    case 'フルハウス':
      return remainTime * 21;
    case 'フォーカード':
      return remainTime * 34;
    case 'ストレートフラッシュ':
      return remainTime * 55;
    case 'ロイヤルフラッシュ':
      return remainTime * 89;
    default:
      return 0;
  }
}
