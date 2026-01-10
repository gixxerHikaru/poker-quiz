export function displayRoleScore(systemAnswer) {
  switch (systemAnswer) {
    case 'ハイカード':
      return 1;
      break;
    case 'ワンペア':
      return 2;
      break;
    case 'ツーペア':
      return 3;
      break;
    case 'スリーカード':
      return 5;
      break;
    case 'ストレート':
      return 8;
      break;
    case 'フラッシュ':
      return 13;
      break;
    case 'フルハウス':
      return 21;
      break;
    case 'フォーカード':
      return 34;
      break;
    case 'ストレートフラッシュ':
      return 55;
      break;
    case 'ロイヤルフラッシュ':
      return 89;
      break;
    default:
      return 0;
  }
}
