import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

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
  if (!header || !payload || !signature) return

  return {
    header: JSON.parse(Base64.parse(header).toString(Utf8)),
    payload: JSON.parse(Base64.parse(payload).toString(Utf8)),
    signature,
  }
}

export const isValidToken = (token: string | undefined | null): boolean => {
  if (!token) return false
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const decoded = decodeJWT(token)
  const exp = decoded?.payload.exp
  if (exp) return exp > currentTimeInSeconds
  return false
}
