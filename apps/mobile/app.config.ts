import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  owner: process.env.EXPO_PUBLIC_EAS_OWNER,
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'Imoblr App',
  slug: 'imoblr-app',
  updates: {
    url: 'https://u.expo.dev/85fc6ccd-0ce1-4e4d-804c-b15df989f97e',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
