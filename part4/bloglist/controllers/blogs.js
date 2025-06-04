const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body;

    if (!body.title || !body.url) {
        return response.status(400).end()
    }

    try {
        const blog = new Blog(body);
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
});

blogsRouter.delete('/:id', async (request, response, next) => {
    const id = request.params.id;

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (!deletedBlog) {
            return response.status(404).json({ error: 'blog not found' })
        }
        response.status(204).end()
    } catch (error) {
        next(error)
    }
});

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