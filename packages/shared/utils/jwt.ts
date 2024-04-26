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

export const decodeJWT = (jwt: string): DecodedJWT | undefined => {
  if (!jwt) return
  const [header, payload, signature] = jwt.split('.')

  return {
    header: JSON.parse(atob(header)),
    payload: JSON.parse(atob(payload)),
    signature,
  }
}

export const refreshSessionInterval = (): number => {
  const refetchFromEnv = process.env.REFETCH_SESSION_INTERVAL
  return refetchFromEnv ? parseInt(refetchFromEnv, 10) : 60
}

export const isValidToken = (jwt: string | null, threshold = 1.0): boolean => {
  if (!jwt) return false
  const decodedToken = decodeJWT(jwt)
  if (decodedToken) {
    const expiresAt = decodedToken.payload.exp
    const issuedAt = decodedToken.payload.iat
    const totalSessionTime = expiresAt - issuedAt
    const nowUnix = Math.trunc(Date.now() / 1000) as number
    const elapsedTime = nowUnix - issuedAt
    const sessionLimit = totalSessionTime * threshold
    return elapsedTime <= sessionLimit
  }

  return false
}

export const refreshTokenFn = async (currentRefreshToken: string) => {
  if (currentRefreshToken) {
    const opts = { method: 'post', headers: { Authorization: `Bearer ${currentRefreshToken}` } }
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/token/refresh`, opts)
  }
}
