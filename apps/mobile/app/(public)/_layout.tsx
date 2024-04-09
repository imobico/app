import React from 'react'
import { Stack } from 'expo-router'

const PublicLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='sign-in' options={{ headerShown: true }} />
      <Stack.Screen name='sign-up' options={{ headerShown: true }} />
    </Stack>
  )
}

export default PublicLayout
