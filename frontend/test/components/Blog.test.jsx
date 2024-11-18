import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import Blog from '../../src/components/Blog.jsx';

const blog = {
  title: 'A new blog',
  author: 'A good author',
  url: 'www.author.com/title',
  likes: '42',
  user: {
    name: 'john doe'
  }
};

test('renders title and author, but not url and likes by default', () => {
  const { container } = render(<Blog blog={blog} />);

  const blogElement = container.querySelector('.blog');
  expect(blogElement).toHaveTextContent(blog.title);
  expect(blogElement).toHaveTextContent(blog.author);

  const urlElement = screen.queryByText(blog.url);
  expect(urlElement).toBeNull();

  const likesElement = screen.queryByText(blog.url);
  expect(likesElement).toBeNull();
});

test('renders url and likes after "view" button has been clicked', async () => {
  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const urlElement = screen.queryByText(blog.url);
  expect(urlElement).toBeDefined();

  const likesElement = screen.queryByText(blog.likes);
  expect(likesElement).toBeDefined();
});

test('like button calls the associated event handler', async () => {
  const mockHandler = vi.fn();
  const { container } = render(<Blog blog={blog} updateFn={mockHandler} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText(('like'));
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
