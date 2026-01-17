export function displayRoleScore(systemAnswer: string) {
  switch (systemAnswer) {
    case 'ハイカード':
      return 1;
    case 'ワンペア':
      return 2;
    case 'ツーペア':
      return 3;
    case 'スリーカード':
      return 5;
    case 'ストレート':
      return 8;
    case 'フラッシュ':
      return 13;
    case 'フルハウス':
      return 21;
    case 'フォーカード':
      return 34;
    case 'ストレートフラッシュ':
      return 55;
    case 'ロイヤルフラッシュ':
      return 89;
    default:
      return 0;
  }
}
