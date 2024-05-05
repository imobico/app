import { useAxios } from '@imoblr/shared/hooks/useAxios'
import { User } from '@imoblr/shared/types/user'
import { Paragraph, YStack } from '@imoblr/ui'
import React, { useEffect, useState } from 'react'

const Screen = () => {
  const { axios, status: authStatus } = useAxios()
  const [userData, setUserData] = useState()

  const getUserData = async () => {
    const resp = await axios.get('/profile')
    console.log(resp)
    const {
      data: { data },
      status,
    } = resp
    if (status === 200) {
      setUserData(data)
    }
  }

  useEffect(() => {
    if (!userData) getUserData()
    return () => {}
  }, [userData, getUserData])

  return (
    <YStack f={1} jc='center' ai='center' p='$4' gap='$4'>
      <Paragraph>Listings</Paragraph>
      <Paragraph>{JSON.stringify(userData)}</Paragraph>
    </YStack>
  )
}

export default Screen
