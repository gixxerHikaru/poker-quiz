import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Quiz from '../../app/routes/quiz';
import { createRoutesStub } from 'react-router';
import userEvent from '@testing-library/user-event';

test('renders the home page', () => {
  const Stub = createRoutesStub([
    {
      path: '/quiz',
      Component: Quiz,
    },
  ]);
  render(<Stub initialEntries={['/quiz']} />);

  expect(screen.getByText('Quiz'));
});
