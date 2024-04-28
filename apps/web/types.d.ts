import { config } from '@imoblr/config'

export type Conf = typeof config

declare module '@imoblr/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
