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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}