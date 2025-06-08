const assert = require('node:assert');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const supertest = require('supertest');

const { test, after, beforeEach, describe } = require('node:test');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app)

let token;

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added with valid token', async () => {
  const newBlog = {
    title: "Introduction to MongoDB",
    author: "Carlos Ruiz",
    url: "https://example.com/mongodb-intro",
    likes: 45
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((n) => n.title)
  assert(titles.includes(newBlog.title))

  const authors = blogsAtEnd.map((n) => n.author)
  assert(authors.includes(newBlog.author))

  const urls = blogsAtEnd.map((n) => n.url)
  assert(urls.includes(newBlog.url))

  const likes = blogsAtEnd.map((n) => n.likes)
  assert(likes.includes(newBlog.likes))
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: "Introduction to MongoDB",
    author: "Carlos Ruiz",
    url: "https://example.com/mongodb-intro",
    likes: 45
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('default 0 if likes missing', async () => {
  const newBlogWithoutLikes = {
    title: "Deploying Apps with Docker",
    author: "Aisha Khan",
    url: "https://example.com/docker-deploy"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const found = blogsAtEnd.find(blog =>
    blog.title === newBlogWithoutLikes.title &&
    blog.author === newBlogWithoutLikes.author &&
    blog.url === newBlogWithoutLikes.url
  )

  assert.strictEqual(found.likes, 0)
})

test('send 400 code if title or url missing', async () => {
  const blogWithoutTitle = {
    author: "Bob Johnson",
    url: "http://example.com/no-title",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutTitle)
    .expect(400)

  const blogWithoutUrl = {
    title: "Missing URL Blog",
    author: "Charlie Lee",
    likes: 8
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutUrl)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map((n) => n.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 400 if id is valid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('updation of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const idToUpdate = blogsAtStart[0].id
    const likesToUpdate = 248

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send({ likes: likesToUpdate })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd.find(blog => blog.id === idToUpdate)

    assert.strictEqual(updatedBlog.likes, likesToUpdate)
  })

  test('returns 400 if blog does not exist', async () => {
    const nonExistentId = '1234'

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send({ likes: 100 })
      .expect(400)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test.only('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'green_panda42',
      name: 'John Doe',
      password: 'StrongPass123!'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Marcus Lee',
      password: 'F@lcon#2025'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test.only('creation fails with proper statuscode and message if username or password missing or too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUsers = [
      { username: '', name: 'dfge', password: 'fghtt5' },
      { username: 'ab', name: 'dfgre', password: 'tuk9w3' },
      { username: 'dfgw', name: 'sdfggrg4', password: '' },
      { username: 'sdguo', name: 'sdfeq', password: 'ab' }
    ]

    for (const newUser of invalidUsers) {
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes('missing') ||
        result.body.error.includes('at least') ||
        result.body.error.includes('User validation failed')
      )
    }

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})