import { createAnimations } from '@tamagui/animations-react-native'
import type { AnimationDriver } from '@tamagui/web'

export const animations: AnimationDriver = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  fast: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  faster: {
    damping: 30,
    mass: 1.2,
    stiffness: 500,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})
