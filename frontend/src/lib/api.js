const primaryApiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5010/api'
const fallbackApiBaseUrl = 'http://localhost:5010/api'

const apiBaseUrls = [...new Set([primaryApiBaseUrl, fallbackApiBaseUrl])]

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('mindmates_token')

  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }

  let response
  let fetchError

  for (const apiBaseUrl of apiBaseUrls) {
    try {
      response = await fetch(`${apiBaseUrl}${path}`, requestOptions)
      fetchError = null
      break
    } catch (error) {
      fetchError = error
    }
  }

  if (!response) {
    throw new Error(fetchError?.message || 'API server is not reachable')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}
