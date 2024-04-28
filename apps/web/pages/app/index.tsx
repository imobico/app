import useCurrentUser from '@/shared/hooks/useCurrentUser'

const getGreeting = () => {
  const day = new Date()
  const hr = day.getHours()
  if (hr >= 4 && hr < 12) {
    return 'Bom dia'
  }

  if (hr >= 12 && hr <= 17) {
    return 'Boa tarde'
  }

  return 'Boa noite'
}

export default function AppHome() {
  const { data: currentUserData } = useCurrentUser()
  const greeting = getGreeting()

  console.log(currentUserData)

  return (
    <>
      Logged {greeting} {currentUserData?.user}
    </>
  )
}
