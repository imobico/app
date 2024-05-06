import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useSession } from '@imoblr/shared/provider/session'
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
    return <Redirect href={'/entrar'} />
  }

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />,
        }}
      />
    </Tabs>
  )
}

export default AuthorizedLayout
