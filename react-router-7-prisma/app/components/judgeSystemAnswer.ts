import { ANSWER } from '../routes/components';

export function judgeSystemAnswer(cardPaths: string[]): [string, string[]] {
  const cards = cardPaths.map(path => {
    return path.split('/').pop() || '';
  });

  const cardsSuits = { c: 0, d: 0, h: 0, s: 0 };
  const cardsRanks = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
  };
  setCardsSuits(cards);
  setCardsRanks(cards);

  if (royalFlashCheck()) {
    return [ANSWER[9], ['・', '・', '・', '・', '・']];
  }

  if (straightCheck() && flashCheck()) {
    return [ANSWER[8], ['・', '・', '・', '・', '・']];
  }

  if (sameRanksCheck(4)) {
    return [ANSWER[7], positonCheck(cards, cardsRanks, ANSWER[7])];
  }

  if (sameRanksCheck(3) && sameRanksCheck(2)) {
    return [ANSWER[6], ['・', '・', '・', '・', '・']];
  }

  if (flashCheck()) {
    return [ANSWER[5], ['・', '・', '・', '・', '・']];
  }

  if (straightCheck()) {
    return [ANSWER[4], ['・', '・', '・', '・', '・']];
  }

  if (sameRanksCheck(3)) {
    return [ANSWER[3], positonCheck(cards, cardsRanks, ANSWER[3])];
  }

  if (sameRanksCheck(2)) {
    const pairCount = Object.values(cardsRanks).filter(count => count === 2).length;
    if (pairCount === 2) {
      return [ANSWER[2], positonCheck(cards, cardsRanks, ANSWER[2])];
    }
    return [ANSWER[1], positonCheck(cards, cardsRanks, ANSWER[1])];
  }
  return [ANSWER[0], ['', '', '', '', '']];

  function setCardsSuits(cards: string[]) {
    cards.map(card => {
      switch (card[0]) {
        case 'C':
          cardsSuits.c += 1;
          break;
        case 'D':
          cardsSuits.d += 1;
          break;
        case 'H':
          cardsSuits.h += 1;
          break;
        case 'S':
          cardsSuits.s += 1;
          break;
      }
    });
  }

  function setCardsRanks(cards: string[]) {
    cards.map(card => {
      const rank = card.slice(1, -4)[0] === '0' ? card.slice(2, -4) : card.slice(1, -4);

      switch (rank) {
        case '10':
          cardsRanks['10'] += 1;
          break;
        case 'J':
          cardsRanks['11'] += 1;
          break;
        case 'Q':
          cardsRanks['12'] += 1;
          break;
        case 'K':
          cardsRanks['13'] += 1;
          break;
        case 'A':
          cardsRanks['1'] += 1;
          break;
        default:
          (cardsRanks as Record<string, number>)[rank] += 1;
      }
    });
  }

  function positonCheck(cards: string[], cardsRanks: Record<string, number>, answer: string) {
    const expectNumber =
      answer === ANSWER[1] || answer === ANSWER[2]
        ? 2
        : answer === ANSWER[3]
          ? 3
          : answer === ANSWER[7]
            ? 4
            : 0;
    const transformPairKeys = Object.keys(cardsRanks)
      .filter(key => cardsRanks[key] === expectNumber)
      .map(pairKey => {
        switch (pairKey) {
          case '1':
            return 'A';
          case '11':
            return 'J';
          case '12':
            return 'Q';
          case '13':
            return 'K';
          default:
            return pairKey;
        }
      });

    return cards.map(card => {
      const rank = card.slice(1, -4)[0] === '0' ? card.slice(2, -4) : card.slice(1, -4);
      return rank === transformPairKeys[0] ? '・' : rank === transformPairKeys[1] ? '・' : '';
    });
  }

  function royalFlashCheck() {
    return (
      flashCheck() &&
      cardsRanks['10'] === 1 &&
      cardsRanks['11'] === 1 &&
      cardsRanks['12'] === 1 &&
      cardsRanks['13'] === 1 &&
      cardsRanks['1'] === 1
    );
  }

  function sameRanksCheck(num: number) {
    return Object.values(cardsRanks).includes(num);
  }

  function flashCheck() {
    function sameRanksCheck(num: number) {
      return Object.values(cardsRanks).includes(num);
    }

    return cardsSuits.c === 5 || cardsSuits.d === 5 || cardsSuits.h === 5 || cardsSuits.s === 5;
  }

  function straightCheck() {
    const rankValues = Object.values(cardsRanks);
    if (sameRanksCheck(4) || sameRanksCheck(3) || sameRanksCheck(2)) {
      return false;
    }
    const rankPattern = Object.values(cardsRanks).join('');

    return rankPattern.includes('11111') || rankPattern == '1000000001111';
  }
}
