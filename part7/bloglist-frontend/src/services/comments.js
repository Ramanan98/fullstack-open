import axios from 'axios'

const baseUrl = '/api/blogs'

const addComment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment })
  return response.data
}

export default { addComment }
