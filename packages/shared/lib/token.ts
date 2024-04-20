import axios from 'axios'
import { isValidToken } from './jwt'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const refreshTokens = async (refreshToken: string | undefined | null) => {
  try {
    if (!refreshToken) return { ok: false }
    if (!isValidToken(refreshToken)) return { ok: false }

    const opts = { headers: { Authorization: `Bearer ${refreshToken}` } }
    const resp = await axios.post(`${API_URL}/token/refresh`, {}, opts)

    if (resp.status !== 201) return { ok: false }
    return {
      ok: true,
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
    }
  } catch (error) {
    console.error('refreshTokens exception', { error })
    return { ok: false }
  }
}
