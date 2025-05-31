const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likesSum = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return likesSum
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const mostLikedBlog = blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max;
    }, blogs[0]);
    return mostLikedBlog
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const count_authors = {}

    blogs.forEach(blog => {
        count_authors[blog.author] = (count_authors[blog.author] ? count_authors[blog.author] : 0) + 1
    })

    let max_author = null
    let max_blogs = 0

    for (const author in count_authors) {
        if (count_authors[author] > max_blogs) {
            max_author = author
            max_blogs = count_authors[author]
        }
    }

    return {
        author: max_author,
        blogs: max_blogs
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}