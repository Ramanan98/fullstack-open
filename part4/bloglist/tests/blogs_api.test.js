const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Introduction to MongoDB",
    author: "Carlos Ruiz",
    url: "https://example.com/mongodb-intro",
    likes: 45
  }

  await api
    .post('/api/blogs')
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

test('default 0 if likes missing', async () => {
  const newBlogWithoutLikes = {
    title: "Deploying Apps with Docker",
    author: "Aisha Khan",
    url: "https://example.com/docker-deploy"
  }

  await api
    .post('/api/blogs')
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
    .send(blogWithoutTitle)
    .expect(400)

  const blogWithoutUrl = {
    title: "Missing URL Blog",
    author: "Charlie Lee",
    likes: 8
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map((n) => n.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 400 if id is valid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.delete(`/api/blogs/${invalidId}`).expect(400)

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

after(async () => {
  await mongoose.connection.close()
})