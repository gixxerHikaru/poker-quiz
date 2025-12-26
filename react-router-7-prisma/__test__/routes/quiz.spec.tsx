import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Quiz from '../../app/routes/quiz';
import { createRoutesStub } from 'react-router';
import userEvent from '@testing-library/user-event';

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
