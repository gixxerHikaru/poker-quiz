import { render, screen, fireEvent, act } from '@testing-library/react';
import { expect, test, describe, vi, afterEach } from 'vitest';
import Quiz from '../../app/routes/quiz';
import { getUniqueCards } from '../../app/routes/compornents';
import { createRoutesStub } from 'react-router';
import { userEvent } from '@testing-library/user-event';

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
      answer: 'ハイカード',
      cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C07.png'],
      description: 'ハイカード',
    },
    {
      answer: 'ワンペア',
      cards: ['C02.png', 'D02.png', 'H04.png', 'S05.png', 'C07.png'],
      description: 'ワンペア',
    },
    {
      answer: 'ツーペア',
      cards: ['C02.png', 'D03.png', 'H03.png', 'S05.png', 'C05.png'],
      description: 'ツーペア',
    },
    {
      answer: 'スリーカード',
      cards: ['C02.png', 'D03.png', 'H03.png', 'S03.png', 'C07.png'],
      description: 'スリーカード',
    },
    {
      answer: 'ストレート',
      cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C06.png'],
      description: 'ストレート',
    },
    {
      answer: 'フラッシュ',
      cards: ['C02.png', 'C03.png', 'C04.png', 'C05.png', 'C07.png'],
      description: 'フラッシュ',
    },
    {
      answer: 'フルハウス',
      cards: ['C02.png', 'D02.png', 'H04.png', 'S04.png', 'C04.png'],
      description: 'フルハウス',
    },
    {
      answer: 'フォーカード',
      cards: ['C04.png', 'D04.png', 'H04.png', 'S04.png', 'C07.png'],
      description: 'フォーカード',
    },
    {
      answer: 'ストレートフラッシュ',
      cards: ['D03.png', 'D04.png', 'D05.png', 'D06.png', 'D07.png'],
      description: 'ストレートフラッシュ',
    },
    {
      answer: 'ロイヤルフラッシュ',
      cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'],
      description: 'ロイヤルフラッシュ',
    },
    {
      answer: 'ストレート',
      cards: ['S10.png', 'DJ.png', 'HQ.png', 'CK.png', 'SA.png'],
      description: '特殊ケース_エースを高値として扱うストレート',
    },
    {
      answer: 'ストレート',
      cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'CA.png'],
      description: '特殊ケース_エースから始まるストレート',
    },
    {
      answer: 'ハイカード',
      cards: ['C02.png', 'D03.png', 'H04.png', 'SK.png', 'CA.png'],
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
    {
      answer: 'ハイカード',
      cards: ['C02.png', 'D03.png', 'HQ.png', 'SK.png', 'CA.png'],
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
    {
      answer: 'ハイカード',
      cards: ['C02.png', 'DJ.png', 'HQ.png', 'SK.png', 'CA.png'],
      description: '特殊ケース_ストレートに見えるが、つながっていない場合',
    },
  ])(
    '$description 配られたトランプの正しい役が画面に正解として出力される',
    async ({ answer, cards }) => {
      const cardPaths = cards.map(c => `cards/${c}`);
      vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

      render(<Stub initialEntries={['/quiz']} />);
      const user = userEvent.setup();

      const selectedAnswer = answer;
      const answerButton = await screen.findByRole('button', { name: selectedAnswer });
      await user.click(answerButton);

      expect(await screen.findByText(`Field: ${selectedAnswer}`)).toBeInTheDocument();
    }
  );

  test.each([
    {
      answer: 'ロイヤルフラッシュ',
      cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'],
      description: '正解',
    },
    {
      answer: 'ハイカード',
      cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'],
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
        const cards = ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C07.png'];
        const cardPaths = cards.map(c => `cards/${c}`);
        vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

        render(<Stub initialEntries={['/quiz']} />);
        const user = userEvent.setup();

        const answerButton = await screen.findByRole('button', { name: 'ロイヤルフラッシュ' });
        await user.click(answerButton);

        const fieldElement = await screen.findByText(/Field:/);
        const systemAnswer = fieldElement.textContent?.split(': ')[1];

        expect(screen.queryByText('正解')).toBeNull();
        expect(screen.getByText('不正解')).toBeInTheDocument();
        expect(screen.getByText('スコア: 0点')).toBeInTheDocument();
      });
      test.each([
        {
          answer: 'ハイカード',
          cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C07.png'],
          score: 1,
          elapsedTime: 9000,
        },
        {
          answer: 'ワンペア',
          cards: ['C02.png', 'D02.png', 'H04.png', 'S05.png', 'C07.png'],
          score: 2,
          elapsedTime: 9000,
        },
        {
          answer: 'ツーペア',
          cards: ['C02.png', 'D03.png', 'H03.png', 'S05.png', 'C05.png'],
          score: 3,
          elapsedTime: 9000,
        },
        {
          answer: 'スリーカード',
          cards: ['C02.png', 'D03.png', 'H03.png', 'S03.png', 'C07.png'],
          score: 5,
          elapsedTime: 9000,
        },
        {
          answer: 'ストレート',
          cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C06.png'],
          score: 8,
          elapsedTime: 9000,
        },
        {
          answer: 'フラッシュ',
          cards: ['C02.png', 'C03.png', 'C04.png', 'C05.png', 'C07.png'],
          score: 13,
          elapsedTime: 9000,
        },
        {
          answer: 'フルハウス',
          cards: ['C02.png', 'D02.png', 'H04.png', 'S04.png', 'C04.png'],
          score: 21,
          elapsedTime: 9000,
        },
        {
          answer: 'フォーカード',
          cards: ['C04.png', 'D04.png', 'H04.png', 'S04.png', 'C07.png'],
          score: 34,
          elapsedTime: 9000,
        },
        {
          answer: 'ストレートフラッシュ',
          cards: ['D03.png', 'D04.png', 'D05.png', 'D06.png', 'D07.png'],
          score: 55,
          elapsedTime: 9000,
        },
        {
          answer: 'ロイヤルフラッシュ',
          cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'],
          score: 89,
          elapsedTime: 9000,
        },
      ])('残り1秒の時、その役の点数が表示される', ({ answer, cards, score, elapsedTime }) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-12-31T12:00:00.000Z'));

        const cardPaths = cards.map(c => `cards/${c}`);
        vi.mocked(getUniqueCards).mockReturnValue(cardPaths);

        render(<Stub initialEntries={['/quiz']} />);

        vi.advanceTimersByTime(elapsedTime);

        const answerButton = screen.getByRole('button', { name: answer });
        fireEvent.click(answerButton);

        expect(screen.getByText(`正解`)).toBeInTheDocument();
        expect(screen.getByText(`解答時間: ${elapsedTime / 1000}秒`)).toBeInTheDocument();
        expect(screen.getByText(`スコア: ${score}点`)).toBeInTheDocument();

        vi.useRealTimers();
      });
    });
  });
});
