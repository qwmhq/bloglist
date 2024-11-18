const { test, expect, beforeEach, describe, request } = require('@playwright/test');

const baseApiUrl = 'http:localhost:3003/api';

describe('Blog app', () => {
  const users = [
    {
      username: 'john',
      name: 'John Doe',
      password: 'password'
    },
    {
      username: 'jane',
      name: 'Jane Doe',
      password: 'password'
    }
  ];

  beforeEach(async ({ page, request }) => {
    await request.post(`${baseApiUrl}/testing/reset`);
    users.forEach(async (user) => {
      await request.post(`${baseApiUrl}/users`, {
        data: user
      });
    });

    await page.goto('http://localhost:5173')
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
  });

  describe('Login', async () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await logIn(page, users[0]);
      await expect(page.getByText(`${users[0].name} logged in`)).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await logIn(page, { ...users[0], password: 'invalidpassword' });
      await expect(page.getByText('invalid credentials')).toBeVisible();
    });
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill(users[0].username);
      await page.getByTestId('password').fill(users[0].password);
      await page.getByRole('button', { name: 'submit' }).click();
    });

    test('a new blog can be created', async ({ page }) => {
      const blog = {
        title: "You're NOT gonna need it!",
        author: "Ron Jeffries",
        url: "www.author.com/title",
      };

      await createBlog(page, blog);

      await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible();
    });

    describe('when blogs already exist', () => {
      const blogs = [
        {
          title: 'You\'re NOT gonna need it!',
          author: 'Ron Jeffries',
          url: 'www.author.com/title',
        },
        {
          title: 'Things I don\'t know as of 2018',
          author: 'Dan Abramov',
          url: 'www.author.com/title',
        }
      ];
      beforeEach(async ({ page }) => {
        await createBlog(page, blogs[0]);
      });

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        const locator = page.getByText(/likes \d/);
        const locatorText = await locator.textContent();
        const prevLikes = Number(locatorText.replace('likes ', ''));

        await page.getByRole('button', { name: 'like' }).click();

        await expect(locator).toHaveText(`likes ${prevLikes + 1}`);
      });

      test('a blog can be deleted by its creator', async({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();

        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();

        await expect(page.getByText('deleted blog successfully')).toBeVisible();

        const locator = page.getByText(`${blogs[0].title} ${blogs[0].author}`);
        await expect(locator).not.toBeVisible();
      });

      test('only a blog\'s creator can see it\'s delete button', async ({ page }) => {
        await logOut(page);
        await logIn(page, users[1]);

        await page.getByRole('button', { name: 'view' }).click();
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
      });
    });
  });

  const createBlog = async (page, blog) => {
    await page.getByRole('button', { name: 'create new' }).click();
    await page.getByTestId('title').fill(blog.title);
    await page.getByTestId('author').fill(blog.author);
    await page.getByTestId('url').fill(blog.url);
    await page.getByRole('button', { name: 'create' }).click();
  };

  const logIn = async (page, user) => {
    await page.getByTestId('username').fill(user.username);
    await page.getByTestId('password').fill(user.password);
    await page.getByRole('button', { name: 'submit' }).click();
  }

  const logOut = async (page) => {
    await page.getByRole('button', { name: 'log out' }).click();
  };

});
