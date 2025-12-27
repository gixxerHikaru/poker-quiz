import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import Quiz from '../../app/routes/quiz';
import { createRoutesStub } from 'react-router';
import { userEvent } from '@testing-library/user-event';

const Stub = createRoutesStub([
  {
    path: '/quiz',
    Component: Quiz,
  },
]);

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
      src?.match(/C0[2-9]|C10|C[JQKA]|D0[2-9]|D10|D[JQKA]|H0[2-9]|H10|H[JQKA]|S0[2-9]|S10|S[JQKA]/)
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
])('解答ボタンを押すと、画面に解答が表示され、ボタンが見えなくなる', async (buttonName: string) => {
  render(<Stub initialEntries={['/quiz']} />);

  const user = userEvent.setup();
  const answerButton = await screen.findByRole('button', { name: buttonName });

  expect(screen.queryByText('Your Answer:')).toBeNull();

  await user.click(answerButton);

  await screen.findByText(`Your Answer: ${buttonName}`);
  expect(screen.queryByRole('button', { name: buttonName })).toBeNull();
});
