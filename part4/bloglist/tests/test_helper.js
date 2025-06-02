const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Understanding JavaScript Closures",
    author: "Jane Doe",
    url: "https://example.com/js-closures",
    likes: 124
  },
  {
    title: "A Guide to RESTful APIs",
    author: "John Smith",
    url: "https://example.com/rest-api-guide",
    likes: 98
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs: initialBlogs,
  nonExistingId,
  blogsInDb: blogsInDb,
}