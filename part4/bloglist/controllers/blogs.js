const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1
    })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body;

    const user = await User.findById(body.userId)

    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
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