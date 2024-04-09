import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName='dashboard'
      screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='cog' color={color} />,
        }}
      />
    </Tabs>
  )
}
