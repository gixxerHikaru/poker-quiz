import { SUITS, RANKS } from './compornents';
import { getUniqueCards } from './compornents';

export function calculateScore(remainTime, systemAnswer) {
  if (remainTime < 1) remainTime = 1;

  switch (systemAnswer) {
    case 'ハイカード':
      return remainTime * 1;
      break;
    case 'ワンペア':
      return remainTime * 2;
      break;
    case 'ツーペア':
      return remainTime * 3;
      break;
    case 'スリーカード':
      return remainTime * 5;
      break;
    case 'ストレート':
      return remainTime * 8;
      break;
    case 'フラッシュ':
      return remainTime * 13;
      break;
    case 'フルハウス':
      return remainTime * 21;
      break;
    case 'フォーカード':
      return remainTime * 34;
      break;
    case 'ストレートフラッシュ':
      return remainTime * 55;
      break;
    case 'ロイヤルフラッシュ':
      return remainTime * 89;
      break;
    default:
      return 0;
  }
}
