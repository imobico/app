import { auth } from '@/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

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

export default function AppHome({ session }: { session: Session }) {
  console.log("Dashboard", session)

  // const { data: currentUserData } = useCurrentUser()
  // console.log(currentUserData)

  const greeting = getGreeting()

  return (
    <>
      Logged {greeting} {session?.user}
    </>
  )
}

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  const session = await auth(req, res)
  console.log("getServerSideProps", { session })

  return {
    props: {
      session,
    },
  }
}
