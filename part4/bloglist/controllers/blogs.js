const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  const blogId = request.params.id
  const { comment } = request.body

  if (!comment || !comment.trim()) {
    return response.status(400).json({ error: 'no comment given' })
  }

  try {
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if (!blog.comments) {
      blog.comments = []
    }
    blog.comments.push(comment)
    const updatedBlog = await blog.save()
    response.status(201).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id
  const user = request.user

  try {
    const blogToDelete = await Blog.findById(id)

    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'action not allowed' })
    }

    const deletedBlog = await Blog.findByIdAndDelete(id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    return response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
