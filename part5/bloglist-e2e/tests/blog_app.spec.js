const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

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
      await page.getByRole('button', { name: 'New blog' }).click()
      
      await page.getByTestId('title').fill('Test Blog Title')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('https://www.test.com')
      
      await page.getByRole('button', { name: 'Create' }).click()
      
      await page.getByText('Test Blog Title by Test Author added').waitFor()

      await expect(page.locator('.titleAuthor')).toContainText('Test Blog Title by Test Author')
    })
  })
})