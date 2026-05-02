const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('mindmates_token')

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}