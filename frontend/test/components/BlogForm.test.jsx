import { render, screen } from '@testing-library/react';
import { test, vi, assert } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import BlogForm from '../../src/components/BlogForm';

test('calls the event handler when a new blog is created', async () => {
  const submitHandler = vi.fn();
  render(<BlogForm submitFn={submitHandler}/>);

  const user = userEvent.setup();
  const createButton = screen.getByText('create');
  await user.click(createButton);

  assert(submitHandler.mock.calls.length === 1);
});
