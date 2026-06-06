import axios from 'axios'

// Vite proxy forwards /api -> http://localhost:8080
const client = axios.create({
  baseURL: '/api',
})

// Attach JWT from localStorage to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurum_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap the ApiResponse envelope and normalise errors
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// Returns the `data` field from the ApiResponse envelope
export const unwrap = (res) => res.data?.data

export default client
