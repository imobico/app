import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useSession } from '@imoblr/shared/provider/session/index.native'
import { Paragraph } from '@imoblr/ui'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

const AuthorizedLayout = () => {
  const { data: session, status: authState } = useSession()

  console.log('AuthorizedLayout', { session })

  if (authState === 'loading') {
    return <Paragraph>Loading...</Paragraph>
  }

  if (authState !== 'authenticated') {
    return <Redirect href={'/sign-in'} />
  }

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}
    >
      <Tabs.Screen
        name='home'
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='listings'
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='cogs' color={color} />,
        }}
      />
    </Tabs>
  )
}

export default AuthorizedLayout
