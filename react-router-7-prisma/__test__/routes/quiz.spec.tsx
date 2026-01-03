import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Quiz from '../../app/routes/quiz';
import { getUniqueCards } from '../../app/routes/compornents';
import { createRoutesStub } from 'react-router';
import { userEvent } from '@testing-library/user-event';
import Home from '../../app/routes/home';

vi.mock('../../app/routes/compornents', async importOriginal => {
  const mod = await importOriginal();
  return {
    ...mod,
    getUniqueCards: vi.fn(mod.getUniqueCards),
  };
});

const Stub = createRoutesStub([
  {
    path: '/quiz',
    Component: Quiz,
  },
]);

const highCardsList = {
  name: 'ハイカード',
  cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C07.png'],
  score: 1,
};
const onePairList = {
  name: 'ワンペア',
  cards: ['C02.png', 'D02.png', 'H04.png', 'S05.png', 'C07.png'],
  score: 2,
};
const twoPairList = {
  name: 'ツーペア',
  cards: ['C02.png', 'D03.png', 'H03.png', 'S05.png', 'C05.png'],
  score: 3,
};
const threeOfAKindList = {
  name: 'スリーカード',
  cards: ['C02.png', 'D03.png', 'H03.png', 'S03.png', 'C07.png'],
  score: 5,
};
const straightList = {
  name: 'ストレート',
  cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C06.png'],
  score: 8,
};
const flushList = {
  name: 'フラッシュ',
  cards: ['C02.png', 'C03.png', 'C04.png', 'C05.png', 'C07.png'],
  score: 13,
};
const fullHouseList = {
  name: 'フルハウス',
  cards: ['C02.png', 'D02.png', 'H04.png', 'S04.png', 'C04.png'],
  score: 21,
};
const fourOfAKindList = {
  name: 'フォーカード',
  cards: ['C04.png', 'D04.png', 'H04.png', 'S04.png', 'C07.png'],
  score: 34,
};
const straightFlushList = {
  name: 'ストレートフラッシュ',
  cards: ['D03.png', 'D04.png', 'D05.png', 'D06.png', 'D07.png'],
  score: 55,
};
const royalFlashList = {
  name: 'ロイヤルフラッシュ',
  cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'],
  score: 89,
};
const highAceStraightList = {
  name: 'ストレート',
  cards: ['S10.png', 'DJ.png', 'HQ.png', 'CK.png', 'SA.png'],
};
const lowAceStraightList = {
  name: 'ストレート',
  cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'CA.png'],
};
const notStraightList1 = {
  name: 'ハイカード',
  cards: ['C02.png', 'D03.png', 'H04.png', 'SK.png', 'CA.png'],
};
const notStraightList2 = {
  name: 'ハイカード',
  cards: ['C02.png', 'D03.png', 'HQ.png', 'SK.png', 'CA.png'],
};
const notStraightList3 = {
  name: 'ハイカード',
  cards: ['C02.png', 'DJ.png', 'HQ.png', 'SK.png', 'CA.png'],
};

vi.setConfig({ testTimeout: 15000 });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('解答ボタン押下前', () => {
  test('タイトル下に表になったカードが5枚見える', () => {
    render(<Stub initialEntries={['/quiz']} />);

    const card1 = screen.getAllByAltText('card1');
    const card2 = screen.getAllByAltText('card2');
    const card3 = screen.getAllByAltText('card3');
    const card4 = screen.getAllByAltText('card4');
    const card5 = screen.getAllByAltText('card5');

    expect(card1).toBeDefined();
    expect(card2).toBeDefined();
    expect(card3).toBeDefined();
    expect(card4).toBeDefined();
    expect(card5).toBeDefined();
  });

  test('トランプがランダムに配られる', async cards => {
    render(<Stub initialEntries={['/quiz']} />);

    const cardImages = await screen.findAllByRole('img');
    cardImages.map(img =>
      expect(img.getAttribute('src')).toSatisfy(src =>
        src?.match(
          /C0[2-9]|C10|C[JQKA]|D0[2-9]|D10|D[JQKA]|H0[2-9]|H10|H[JQKA]|S0[2-9]|S10|S[JQKA]/
        )
      )
    );
  });

  describe('トランプの重複チェック用に同じテストを複数回実行', () => {
    const repeatNumbers = Array.from({ length: 10 });
    test.each(repeatNumbers)('配られるトランプは重複しない', async () => {
      render(<Stub initialEntries={['/quiz']} />);

      const cardImages = await screen.findAllByRole('img');
      const srcList = cardImages.map(img => img.getAttribute('src'));
      const uniqueSrcList = Array.from(new Set(srcList));

      expect(srcList.length).toBe(uniqueSrcList.length);
    });
  });

  test('クイズの解答権(ポーカーの役)ボタンが10個見える', async () => {
    render(<Stub initialEntries={['/quiz']} />);
    const HighCardButton = await screen.findByRole('button', { name: 'ハイカード' });
    const OnePairButton = await screen.findByRole('button', { name: 'ワンペア' });
    const TwoPairButton = await screen.findByRole('button', { name: 'ツーペア' });
    const ThreeOfAKindButton = await screen.findByRole('button', { name: 'スリーカード' });
    const StraightButton = await screen.findByRole('button', { name: 'ストレート' });
    const FlushButton = await screen.findByRole('button', { name: 'フラッシュ' });
    const FullHouseButton = await screen.findByRole('button', { name: 'フルハウス' });
    const FourOfAKindButton = await screen.findByRole('button', { name: 'フォーカード' });
    const StraightFlushButton = await screen.findByRole('button', { name: 'ストレートフラッシュ' });
    const RoyalFlushButton = await screen.findByRole('button', { name: 'ロイヤルフラッシュ' });

    expect(HighCardButton).toBeInTheDocument();
    expect(OnePairButton).toBeInTheDocument();
    expect(TwoPairButton).toBeInTheDocument();
    expect(ThreeOfAKindButton).toBeInTheDocument();
    expect(StraightButton).toBeInTheDocument();
    expect(FlushButton).toBeInTheDocument();
    expect(FullHouseButton).toBeInTheDocument();
    expect(FourOfAKindButton).toBeInTheDocument();
    expect(StraightFlushButton).toBeInTheDocument();
    expect(RoyalFlushButton).toBeInTheDocument();
  });
});

describe('解答ボタン押下後', () => {
  test.each([
    'ハイカード',
    'ワンペア',
    'ツーペア',
    'スリーカード',
    'ストレート',
    'フラッシュ',
    'フルハウス',
    'フォーカード',
    'ストレートフラッシュ',
    'ロイヤルフラッシュ',
  ])(
    '解答ボタンを押すと、画面に解答が表示され、ボタンが見えなくなる',
    async (buttonName: string) => {
      render(<Stub initialEntries={['/quiz']} />);

      const user = userEvent.setup();
      const answerButton = await screen.findByRole('button', { name: buttonName });

      expect(screen.queryByText('Your Answer:')).toBeNull();

      await user.click(answerButton);

      await screen.findByText(`Your Answer: ${buttonName}`);
      expect(screen.queryByRole('button', { name: buttonName })).toBeNull();
    }
  );

  test('手札表示から解答ボタン押下までにかかった時間が表示される', () => {
    vi.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime, delay: null });
    const startTime = '2025-12-31T12:00:00.000Z';
    vi.setSystemTime(new Date(startTime));
    render(<Stub initialEntries={['/quiz']} />);

    const answerButton = screen.getByRole('button', { name: 'ハイカード' });
    vi.advanceTimersByTime(1111);
    fireEvent.click(answerButton);
    vi.advanceTimersByTime(1000);

    expect(screen.getByText('解答時間: 1.111秒')).toBeInTheDocument();

    vi.useRealTimers();
  });

  test.each([
    { advanceTime: 1000, remainTime: '9秒' },
    { advanceTime: 2222, remainTime: '7.778秒' },
    { advanceTime: 3333, remainTime: '6.667秒' },
    { advanceTime: 9000, remainTime: '1秒' },
    { advanceTime: 9999, remainTime: 'なし', description: 'ボーナス時間が1秒を切っている時は0' },
  ])(
    'ボーナス時間(解答時間の残り時間)が表示される_$description ',
    ({ advanceTime, remainTime }) => {
      vi.useFakeTimers();

      vi.mocked(getUniqueCards).mockReturnValue(highCardsList.cards.map(c => `cards/${c}`));

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime, delay: null });
      const startTime = '2025-12-31T12:00:00.000Z';
      vi.setSystemTime(new Date(startTime));
      render(<Stub initialEntries={['/quiz']} />);

      const answerButton = screen.getByRole('button', { name: 'ハイカード' });
      vi.advanceTimersByTime(advanceTime);
      fireEvent.click(answerButton);
      vi.advanceTimersByTime(1000);

      expect(screen.getByText(`ボーナス時間: ${remainTime}`)).toBeInTheDocument();

      vi.useRealTimers();
    }
  );

  test('手札表示から10秒経過するとタイムアウトされ、無回答になる', () => {
    vi.useFakeTimers();

    const startTime = '2025-12-31T12:00:00.000Z';
    vi.setSystemTime(new Date(startTime));
    render(<Stub initialEntries={['/quiz']} />);

    const answerButton = screen.getByRole('button', { name: 'ハイカード' });
    expect(answerButton).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(answerButton).not.toBeInTheDocument();
    expect(screen.getByText('Your Answer: Time Out')).toBeInTheDocument();
    expect(screen.getByText('不正解')).toBeInTheDocument();
    expect(screen.getByText('解答時間: タイムアウト(10秒経過)')).toBeInTheDocument();
  });

  test.each([
    {
      ...highCardsList,
      description: 'ハイカード',
    },
    {
      ...onePairList,
      description: 'ワンペア',
    },
    {
      ...twoPairList,
      description: 'ツーペア',
    },
    {
      ...threeOfAKindList,
      description: 'スリーカード',
    },
    {
      ...straightList,
      description: 'ストレート',
    },
    {
      ...flushList,
      description: 'フラッシュ',
    },
    {
      ...fullHouseList,
      description: 'フルハウス',
    },
    {
      ...fourOfAKindList,
      description: 'フォーカード',
    },
    {
      ...straightFlushList,
      description: 'ストレートフラッシュ',
    },
    {
      ...royalFlashList,
      description: 'ロイヤルフラッシュ',
    },
    {
      ...highAceStraightList,
      description: '特殊ケース_エースを高値として扱うストレート',
    },
    {
      ...lowAceStraightList,
      description: '特殊ケース_エースから始まるストレート',
    },
    {
      ...notStraightList1,
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
    {
      ...notStraightList2,
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
    {
      ...notStraightList3,
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
  ])(
    '$description 配られたトランプの正しい役が画面に正解として出力される',
    async ({ name, cards }) => {
      const cardPaths = cards.map(c => `cards/${c}`);
      vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

      render(<Stub initialEntries={['/quiz']} />);
      const user = userEvent.setup();

      const selectedAnswer = name;
      const answerButton = await screen.findByRole('button', { name: selectedAnswer });
      await user.click(answerButton);

      expect(await screen.findByText(`Field: ${selectedAnswer}`)).toBeInTheDocument();
    }
  );

  test.each([
    {
      answer: 'ロイヤルフラッシュ',
      cards: royalFlashList.cards,
      description: '正解',
    },
    {
      answer: 'ハイカード',
      cards: royalFlashList.cards,
      description: '不正解',
    },
  ])('$description の判定が表示される', async ({ answer, cards, description }) => {
    const cardPaths = cards.map(c => `cards/${c}`);
    vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

    render(<Stub initialEntries={['/quiz']} />);
    const user = userEvent.setup();

    const selectedAnswer = answer;
    const answerButton = await screen.findByRole('button', { name: selectedAnswer });
    await user.click(answerButton);

    expect(await screen.findByText(description)).toBeInTheDocument();
  });

  describe('採点機能', () => {
    describe('イージーモード', () => {
      test('不正解の時は0点が表示される', async () => {
        const cardPaths = highCardsList.cards.map(c => `cards/${c}`);
        vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

        render(<Stub initialEntries={['/quiz']} />);
        const user = userEvent.setup();

        const answerButton = await screen.findByRole('button', { name: 'ロイヤルフラッシュ' });
        await user.click(answerButton);

        await screen.findByText(/Field:/);

        expect(screen.queryByText('正解')).toBeNull();
        expect(screen.getByText('不正解')).toBeInTheDocument();
        expect(screen.getByText('スコア: 0点')).toBeInTheDocument();
      });

      test.each([
        { ...highCardsList, elapsedTime: 9000 },
        { ...onePairList, elapsedTime: 9000 },
        { ...twoPairList, elapsedTime: 9000 },
        { ...threeOfAKindList, elapsedTime: 9000 },
        { ...straightList, elapsedTime: 9000 },
        { ...flushList, elapsedTime: 9000 },
        { ...fullHouseList, elapsedTime: 9000 },
        { ...fourOfAKindList, elapsedTime: 9000 },
        { ...straightFlushList, elapsedTime: 9000 },
        { ...royalFlashList, elapsedTime: 9000 },
      ])('残り1秒の時、その役の点数が表示される', ({ name, cards, score, elapsedTime }) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-12-31T12:00:00.000Z'));

        const cardPaths = cards.map(c => `cards/${c}`);
        vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

        render(<Stub initialEntries={['/quiz']} />);

        vi.advanceTimersByTime(elapsedTime);

        const answerButton = screen.getByRole('button', { name });
        fireEvent.click(answerButton);

        expect(screen.getByText(`正解`)).toBeInTheDocument();
        expect(screen.getByText(`解答時間: ${elapsedTime / 1000}秒`)).toBeInTheDocument();
        expect(screen.getByText(`スコア: ${score}点`)).toBeInTheDocument();

        vi.useRealTimers();
      });

      test.each([
        { ...highCardsList, advanceTime: 1000, remainTime: '9秒', score: 9, description: '整数' },
        { ...onePairList, advanceTime: 2000, remainTime: '8秒', score: 16, description: '整数' },
        { ...twoPairList, advanceTime: 3000, remainTime: '7秒', score: 21, description: '整数' },
        {
          ...threeOfAKindList,
          advanceTime: 4000,
          remainTime: '6秒',
          score: 30,
          description: '整数',
        },
        { ...straightList, advanceTime: 5000, remainTime: '5秒', score: 40, description: '整数' },
        { ...flushList, advanceTime: 6000, remainTime: '4秒', score: 52, description: '整数' },
        { ...fullHouseList, advanceTime: 7000, remainTime: '3秒', score: 63, description: '整数' },
        {
          ...fourOfAKindList,
          advanceTime: 8000,
          remainTime: '2秒',
          score: 68,
          description: '整数',
        },
        {
          ...straightFlushList,
          advanceTime: 9000,
          remainTime: '1秒',
          score: 55,
          description: '整数',
        },
        { ...royalFlashList, advanceTime: 9000, remainTime: '1秒', score: 89, description: '整数' },

        {
          ...highCardsList,
          advanceTime: 9999,
          remainTime: 'なし',
          score: 1,
          description: 'ボーナス時間が1秒を切っている場合は掛け算をしない',
        },
        {
          ...highCardsList,
          advanceTime: 7777,
          remainTime: '2.223秒',
          score: 2.223,
          description: '少数',
        },
        {
          ...royalFlashList,
          advanceTime: 5555,
          remainTime: '4.445秒',
          score: 395.605,
          description: '整数',
        },
      ])(
        '$description ボーナス時間とその役の点数を掛け合わせたものが表示される',
        ({ name, cards, score, advanceTime, remainTime }) => {
          vi.useFakeTimers();
          vi.setSystemTime(new Date('2025-12-31T12:00:00.000Z'));

          const cardPaths = cards.map(c => `cards/${c}`);
          vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

          render(<Stub initialEntries={['/quiz']} />);

          vi.advanceTimersByTime(advanceTime);

          const answerButton = screen.getByRole('button', { name });
          fireEvent.click(answerButton);

          expect(screen.getByText(`正解`)).toBeInTheDocument();
          expect(screen.getByText(`ボーナス時間: ${remainTime}`)).toBeInTheDocument();
          expect(screen.getByText(`スコア: ${score}点`)).toBeInTheDocument();

          vi.useRealTimers();
        }
      );
    });
  });
});

test('結果表示後、Next Gameボタンが見え、押すと再度ゲームが始まる', async () => {
  render(<Stub initialEntries={['/quiz']} />);

  const user = userEvent.setup();
  const answerButton = await screen.findByRole('button', { name: 'ハイカード' });

  await user.click(answerButton);

  const nextButton = await screen.findByRole('button', { name: 'Next Game' });
  await user.click(nextButton);

  expect(await screen.findByRole('button', { name: 'ハイカード' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Next Game' })).toBeNull();
});

test('計5回ゲームをしたら、結果表示画面で結果を確認でき、ホームに戻るボタンでホームに戻れる', () => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Home,
    },
    {
      path: '/quiz',
      Component: Quiz,
    },
  ]);

  vi.useFakeTimers();
  const startTime = '2025-01-03T12:00:00.000Z';
  vi.setSystemTime(new Date(startTime));
  render(<Stub initialEntries={['/quiz']} />);

  notAsyncHighCardsAndNextButtonPush();
  notAsyncHighCardsAndNextButtonPush();
  notAsyncHighCardsAndNextButtonPush();
  notAsyncHighCardsAndNextButtonPush();
  screen.getByRole('button', { name: 'ハイカード' });
  act(() => {
    vi.advanceTimersByTime(10000);
  });
  screen.getByText('Your Answer: Time Out');
  expect(screen.queryByRole('button', { name: 'Next Game' })).toBeNull();

  const resultButton = screen.getByRole('button', { name: 'Result' });
  expect(resultButton).toBeInTheDocument();
  fireEvent.click(resultButton);

  expect(screen.getByText('クイズ結果')).toBeInTheDocument();

  const round1 = screen.getByTestId('round-1');
  expect(within(round1).getByText('Round1')).toBeInTheDocument();
  expect(within(round1).getByText('0点')).toBeInTheDocument();

  const round2 = screen.getByTestId('round-2');
  expect(within(round2).getByText('Round2')).toBeInTheDocument();
  expect(within(round2).getByText('0点')).toBeInTheDocument();

  const round3 = screen.getByTestId('round-3');
  expect(within(round3).getByText('Round3')).toBeInTheDocument();
  expect(within(round3).getByText('0点')).toBeInTheDocument();

  const round4 = screen.getByTestId('round-4');
  expect(within(round4).getByText('Round4')).toBeInTheDocument();
  expect(within(round4).getByText('0点')).toBeInTheDocument();

  const round5 = screen.getByTestId('round-5');
  expect(within(round5).getByText('Round5')).toBeInTheDocument();
  expect(within(round5).getByText('0点')).toBeInTheDocument();

  const total = screen.getByTestId('total');
  expect(within(total).getByText('合計')).toBeInTheDocument();
  expect(within(total).getByText('0点')).toBeInTheDocument();
  const backButton = screen.getByRole('button', { name: 'ホームに戻る' });
  expect(backButton).toBeInTheDocument();

  fireEvent.click(backButton);
  expect(screen.getByText('Poker Quiz')).toBeInTheDocument();
});

test('5回ゲームを行い、正解と不正解が混ざった場合の結果を確認できる', () => {
  vi.useFakeTimers();
  const startTime = '2025-01-03T12:00:00.000Z';
  vi.setSystemTime(new Date(startTime));

  const mockGetUniqueCards = vi.mocked(getUniqueCards);
  mockGetUniqueCards
    .mockReturnValueOnce(highCardsList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(onePairList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(twoPairList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(flushList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(fullHouseList.cards.map(c => `cards/${c}`));

  render(<Stub initialEntries={['/quiz']} />);

  screen.getByRole('button', { name: 'ハイカード' });
  vi.advanceTimersByTime(1111);
  fireEvent.click(screen.getByRole('button', { name: 'ハイカード' }));
  screen.getByText('正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'ワンペア' });
  vi.advanceTimersByTime(2000);
  fireEvent.click(screen.getByRole('button', { name: 'ワンペア' }));
  screen.getByText('正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'ツーペア' });
  vi.advanceTimersByTime(2000);
  fireEvent.click(screen.getByRole('button', { name: 'ツーペア' }));
  screen.getByText('正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'フラッシュ' });
  vi.advanceTimersByTime(5000);
  fireEvent.click(screen.getByRole('button', { name: 'フラッシュ' }));
  screen.getByText('正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'フルハウス' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));
  screen.getByText('不正解');
  const resultButton = screen.getByRole('button', { name: 'Result' });
  fireEvent.click(resultButton);

  screen.getByText('クイズ結果');

  const round1 = screen.getByTestId('round-1');
  expect(within(round1).getByText('Round1')).toBeInTheDocument();
  expect(within(round1).getByText('8.889点')).toBeInTheDocument();

  const round2 = screen.getByTestId('round-2');
  expect(within(round2).getByText('Round2')).toBeInTheDocument();
  expect(within(round2).getByText('16点')).toBeInTheDocument();

  const round3 = screen.getByTestId('round-3');
  expect(within(round3).getByText('Round3')).toBeInTheDocument();
  expect(within(round3).getByText('24点')).toBeInTheDocument();

  const round4 = screen.getByTestId('round-4');
  expect(within(round4).getByText('Round4')).toBeInTheDocument();
  expect(within(round4).getByText('65点')).toBeInTheDocument();

  const round5 = screen.getByTestId('round-5');
  expect(within(round5).getByText('Round5')).toBeInTheDocument();
  expect(within(round5).getByText('0点')).toBeInTheDocument();

  const total = screen.getByTestId('total');
  expect(within(total).getByText('合計')).toBeInTheDocument();
  expect(within(total).getByText('113.889点')).toBeInTheDocument();
});

test('5回とも不正解（選択ミス）だった場合の結果を確認できる', () => {
  vi.useFakeTimers();
  const startTime = '2025-01-03T12:00:00.000Z';
  vi.setSystemTime(new Date(startTime));

  const mockGetUniqueCards = vi.mocked(getUniqueCards);
  mockGetUniqueCards
    .mockReturnValueOnce(highCardsList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(onePairList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(twoPairList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(flushList.cards.map(c => `cards/${c}`))
    .mockReturnValueOnce(fullHouseList.cards.map(c => `cards/${c}`));

  render(<Stub initialEntries={['/quiz']} />);

  screen.getByRole('button', { name: 'ハイカード' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));
  screen.getByText('不正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'ワンペア' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));
  screen.getByText('不正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'ツーペア' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));
  screen.getByText('不正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'フラッシュ' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));
  screen.getByText('不正解');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));

  screen.getByRole('button', { name: 'フルハウス' });
  vi.advanceTimersByTime(1000);
  fireEvent.click(screen.getByRole('button', { name: 'ロイヤルフラッシュ' }));

  const resultButton = screen.getByRole('button', { name: 'Result' });
  fireEvent.click(resultButton);

  screen.getByText('クイズ結果');

  const round1 = screen.getByTestId('round-1');
  expect(within(round1).getByText('Round1')).toBeInTheDocument();
  expect(within(round1).getByText('0点')).toBeInTheDocument();

  const round2 = screen.getByTestId('round-2');
  expect(within(round2).getByText('Round2')).toBeInTheDocument();
  expect(within(round2).getByText('0点')).toBeInTheDocument();

  const round3 = screen.getByTestId('round-3');
  expect(within(round3).getByText('Round3')).toBeInTheDocument();
  expect(within(round3).getByText('0点')).toBeInTheDocument();

  const round4 = screen.getByTestId('round-4');
  expect(within(round4).getByText('Round4')).toBeInTheDocument();
  expect(within(round4).getByText('0点')).toBeInTheDocument();

  const round5 = screen.getByTestId('round-5');
  expect(within(round5).getByText('Round5')).toBeInTheDocument();
  expect(within(round5).getByText('0点')).toBeInTheDocument();

  const total = screen.getByTestId('total');
  expect(within(total).getByText('合計')).toBeInTheDocument();
  expect(within(total).getByText('0点')).toBeInTheDocument();
});

function notAsyncHighCardsAndNextButtonPush() {
  screen.getByRole('button', { name: 'ハイカード' });
  act(() => {
    vi.advanceTimersByTime(10000);
  });
  screen.getByText('Your Answer: Time Out');
  fireEvent.click(screen.getByRole('button', { name: 'Next Game' }));
}
