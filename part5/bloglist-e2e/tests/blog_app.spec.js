const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'John Doe',
        username: 'testuser',
        password: 'testpassword'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Jane Doe',
        username: 'newuser',
        password: 'newpassword'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByTestId('loginForm')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByText('testuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')

      const errorDiv = await page.locator('.error')

      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('testuser logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, "Test title", "Test author", "https://test.com")

      await expect(page.locator('.titleAuthor')).toContainText('Test title by Test author')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, "Test title", "Test author", "https://test.com")

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()
      const likeButton = page.getByRole('button', { name: 'Like' })
      await likeButton.click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await createBlog(page, "Test blog", "Test author", "https://test.com")

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })

      const removeButton = page.getByRole('button', { name: 'Remove' })
      await removeButton.click()

      await expect(page.locator('.titleAuthor')).not.toBeVisible()
    })

    test('only the user who added the blog sees the blogs delete button', async ({ page }) => {
      await createBlog(page, "Test blog", "Test author", "https://test.com")

      await page.getByRole('button', { name: 'Log out' }).click()

      await loginWith(page, 'newuser', 'newpassword')

      const viewButton = page.getByRole('button', { name: 'view' })
      await viewButton.click()

      const removeButton = page.getByRole('button', { name: 'Remove' })
      await expect(removeButton).not.toBeVisible()
    })

    test('blogs are ordered by likes in descending order', async ({ page }) => {
      await createBlog(page, "First blog", "Author 1", "https://test1.com")
      await createBlog(page, "Second blog", "Author 2", "https://test2.com")
      await createBlog(page, "Third blog", "Author 3", "https://test3.com")

      // Liking the first blog twice
      const viewButton = page.getByRole('button', { name: 'view' }).first()
      await viewButton.click()
      let likeButton = page.getByRole('button', { name: 'Like' }).first()
      for (let i = 0; i < 2; i++) {
        await likeButton.click()
      }
      await page.getByRole('button', { name: 'hide' }).first().click()

      // Liking the second blog 5 times
      const viewButtons = await page.getByRole('button', { name: 'view' }).all()
      const secondViewButton = viewButtons[1]
      await secondViewButton.click()
      likeButton = page.getByRole('button', { name: 'Like' }).first()
      for (let i = 0; i < 5; i++) {
        await likeButton.click()
      }
      await page.getByRole('button', { name: 'hide' }).first().click()

      // No likes for third blog
      // Reload page
      await page.reload()

      await page.locator('.titleAuthor').first().waitFor()

      const blogTitles = await page.locator('.titleAuthor').allTextContents()

      expect(blogTitles[0]).toContain('Second blog')
      expect(blogTitles[1]).toContain('First blog')
      expect(blogTitles[2]).toContain('Third blog')
    })

  })
})