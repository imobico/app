import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL

if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL and EXPO_PUBLIC_API_URL are missing!')

export const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})
