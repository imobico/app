import { getSession, signIn } from '@imoblr/shared/provider/session'
import { Button, Input, Paragraph, Stack, XStack, YStack } from '@imoblr/ui'
import { useEffect, useState } from 'react'
import { Link } from 'solito/link'
import { useRouter } from 'solito/navigation'

export const SignUpSignInComponent = ({ type }: { type: string }): React.ReactNode => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const onButtonPress = async () => {
    const signInResponse = await signIn('credentials', { email, password, redirect: false })
    if (signInResponse?.ok) {
      router.replace('/')
    } else {
      alert(signInResponse?.error)
    }
  }

  useEffect(() => {
    const retriveSession = async () => {
      const session = await getSession()
      if (session?.user?.refreshToken) {
        router.replace('/')
      }
    }

    retriveSession()

    return () => {}
  }, [router])

  return (
    <YStack
      borderRadius='$10'
      space
      paddingHorizontal='$7'
      paddingVertical='$6'
      width={350}
      shadowColor={'#00000020'}
      shadowRadius={26}
      shadowOffset={{ width: 0, height: 4 }}
      backgroundColor='$background'
    >
      <Paragraph size='$5' fontWeight={'700'} opacity={0.8} marginBottom='$1'>
        {/* {type === 'sign-up' ? 'Create your account' : 'Sign in to your account'} */}
      </Paragraph>
      <XStack alignItems='center' width='100%' justifyContent='space-between'>
        <Stack height='$0.25' backgroundColor='black' width='$10' opacity={0.1} />
        <Paragraph size='$3' opacity={0.5}>
          or
        </Paragraph>
        <Stack height='$0.25' backgroundColor='black' width='$10' opacity={0.1} />
      </XStack>

      {/* email sign up option */}
      <Input
        autoCapitalize='none'
        placeholder='Email'
        onChangeText={(text) => {
          setEmail(text)
        }}
      />
      <Input
        autoCapitalize='none'
        placeholder='Password'
        onChangeText={(text) => {
          setPassword(text)
        }}
        textContentType='password'
        secureTextEntry
      />

      {/* sign up button */}
      <Button
        themeInverse
        onPress={() => onButtonPress()}
        hoverStyle={{ opacity: 0.8 }}
        onHoverIn={() => {}}
        onHoverOut={() => {}}
        focusStyle={{ scale: 0.975 }}
      >
        {type === 'sign-up' ? 'Sign up' : 'Sign in'}
      </Button>

      {/* or sign in, in small and less opaque font */}
      <XStack>
        <Paragraph size='$2' marginRight='$2' opacity={0.4}>
          {type === 'sign-up' ? 'Already have an account?' : `Don't have an account?`}
        </Paragraph>
        <Link href={type === 'sign-up' ? '/entrar' : '/cadastro'}>
          <Paragraph
            cursor={'pointer'}
            size='$2'
            fontWeight={'700'}
            opacity={0.5}
            hoverStyle={{ opacity: 0.4 }}
          >
            {type === 'sign-up' ? 'Sign in' : 'Sign up'}
          </Paragraph>
        </Link>
      </XStack>

      {/* forgot password */}
      {/* {type === 'sign-in' && (
        <XStack marginTop='$-2.5'>
          <Paragraph size='$2' marginRight='$2' opacity={0.4}>
            Forgot your password?
          </Paragraph>
          <Link href='/password-reset'>
            <Paragraph
              cursor={'pointer'}
              size='$2'
              fontWeight={'700'}
              opacity={0.5}
              hoverStyle={{ opacity: 0.4 }}
            >
              Reset it
            </Paragraph>
          </Link>
        </XStack>
      )} */}
    </YStack>
  )
}
