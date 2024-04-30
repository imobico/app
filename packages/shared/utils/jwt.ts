export interface DecodedJWT {
  header: { alg: string; typ: string }
  payload: {
    aud: string
    exp: number
    iat: number
    iss: string
    jti: string
    nbf: number
    sub: string
    typ: string
  }
  signature: string
}

export const decodeJWT = (jwt: string | undefined): DecodedJWT | undefined => {
  if (!jwt) return
  const [header, payload, signature] = jwt.split('.')
  if (!header) return
  if (!payload) return
  if (!signature) return

  return {
    header: JSON.parse(atob(header)),
    payload: JSON.parse(atob(payload)),
    signature,
  }
}

export const refreshSessionInterval = (): number => {
  const refetchFromEnv = process.env.REFETCH_SESSION_INTERVAL
  return refetchFromEnv ? Number.parseInt(refetchFromEnv, 10) : 60
}

export const refreshTokenFn = async (currentRefreshToken: string) => {
  if (currentRefreshToken) {
    const opts = { method: 'post', headers: { Authorization: `Bearer ${currentRefreshToken}` } }
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh`, opts)
    if (resp.ok) {
      const data = await resp.json()
      return {
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
      }
    }
  }
}
