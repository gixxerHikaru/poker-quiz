import { render, screen, fireEvent, act } from '@testing-library/react';
import { expect, test, describe, vi, afterEach } from 'vitest';
import Quiz, { judgeSystemAnswer } from '../../app/routes/quiz';
import { createRoutesStub } from 'react-router';
import { userEvent } from '@testing-library/user-event';

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

  describe('役判定の関数', () => {
    test.each([
      { answer: 'ハイカード', cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C07.png'] },
      { answer: 'ワンペア', cards: ['C02.png', 'D02.png', 'H04.png', 'S05.png', 'C07.png'] },
      { answer: 'ツーペア', cards: ['C02.png', 'D03.png', 'H03.png', 'S05.png', 'C05.png'] },
      { answer: 'スリーカード', cards: ['C02.png', 'D03.png', 'H03.png', 'S03.png', 'C07.png'] },
      { answer: 'ストレート', cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'C06.png'] },
      { answer: 'フラッシュ', cards: ['C02.png', 'C03.png', 'C04.png', 'C05.png', 'C07.png'] },
      { answer: 'フルハウス', cards: ['C02.png', 'D02.png', 'H04.png', 'S04.png', 'C04.png'] },
      { answer: 'フォーカード', cards: ['C04.png', 'D04.png', 'H04.png', 'S04.png', 'C07.png'] },
      {
        answer: 'ストレートフラッシュ',
        cards: ['D03.png', 'D04.png', 'D05.png', 'D06.png', 'D07.png'],
      },
      { answer: 'ロイヤルフラッシュ', cards: ['S10.png', 'SJ.png', 'SQ.png', 'SK.png', 'SA.png'] },
    ])(
      '$answer 配られたトランプの正しい役が画面に正解として出力される',
      async ({ answer, cards }) => {
        const result = await judgeSystemAnswer(cards);
        expect(result).toBe(answer);
      }
    );

    test.each([
      {
        answer: 'ストレート',
        cards: ['S10.png', 'DJ.png', 'HQ.png', 'CK.png', 'SA.png'],
        description: 'エースを高値として扱うストレート',
      },
      {
        answer: 'ストレート',
        cards: ['C02.png', 'D03.png', 'H04.png', 'S05.png', 'CA.png'],
        description: 'エースから始まるストレート',
      },
      {
        answer: 'ハイカード',
        cards: ['C02.png', 'D03.png', 'H04.png', 'SK.png', 'CA.png'],
        description: 'ストレートに見えるが、つながっていない場合',
      },
      {
        answer: 'ハイカード',
        cards: ['C02.png', 'D03.png', 'HQ.png', 'SK.png', 'CA.png'],
        description: 'ストレートに見えるが、つながっていない場合',
      },
      {
        answer: 'ハイカード',
        cards: ['C02.png', 'D0J.png', 'HQ.png', 'SK.png', 'CA.png'],
        description: 'ストレートに見えるが、つながっていない場合',
      },
    ])(
      '$description 特殊ケースでも正しい役が画面に正解として出力される',
      async ({ answer, cards }) => {
        const result = await judgeSystemAnswer(cards);
        expect(result).toBe(answer);
      }
    );
  });

  test('正解・不正解の判定が表示される', async () => {
    render(<Stub initialEntries={['/quiz']} />);
    const user = userEvent.setup();

    const selectedAnswer = 'ロイヤルフラッシュ';
    const answerButton = await screen.findByRole('button', { name: selectedAnswer });
    await user.click(answerButton);

    const fieldElement = await screen.findByText(/Field:/);
    const systemAnswer = fieldElement.textContent?.split(': ')[1];

    if (systemAnswer === selectedAnswer) {
      expect(screen.getByText('正解')).toBeInTheDocument();
      expect(screen.queryByText('不正解')).toBeNull();
    } else {
      expect(screen.getByText('不正解')).toBeInTheDocument();
      expect(screen.queryByText('正解')).toBeNull();
    }
  });
});
