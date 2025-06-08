const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1
    })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    const id = request.params.id
    const user = request.user

    try {
        const blogToDelete = await Blog.findById(id)

        if (blogToDelete.user.toString() !== user._id) {
            return response.status(403).json({ error: 'action not allowed' });
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
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            { likes },
            { new: true }
        )
        if (!updatedBlog) {
            return response.status(404).json({ error: 'blog not found' })
        }
        return response.json(updatedBlog)
    }
    catch (error) {
        next(error)
    }
})

module.exports = blogsRouter