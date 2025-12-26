import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import Home from '../../app/routes/home';
import Quiz from '../../app/routes/quiz';
import { createRoutesStub } from 'react-router';

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

test('renders the home page', () => {
  render(<Stub initialEntries={['/']} />);

  expect(screen.getByText('Poker Quiz'));
});

test('タイトル下にカードが3枚見える', () => {
  render(<Stub initialEntries={['/']} />);

  const card1 = screen.getAllByAltText('card back1');
  const card2 = screen.getAllByAltText('card back2');
  const card3 = screen.getAllByAltText('card back3');

  expect(card1).toBeDefined();
  expect(card2).toBeDefined();
  expect(card3).toBeDefined();
});

test('スタートボタンが見え、ボタンを押すとクイズ画面に遷移する', async () => {
  const user = userEvent.setup();

  render(<Stub initialEntries={['/']} />);

  const startButton = screen.getByRole('button', { name: 'スタート' });

  expect(startButton).toBeInTheDocument();

  await user.click(startButton);

  expect(await screen.findByText('Quiz')).toBeInTheDocument();
});
