import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})
