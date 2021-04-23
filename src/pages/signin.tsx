import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'
import VisuallyHidden from '@reach/visually-hidden'
import {auth} from '@/lib/firebase'

const SignIn = () => {
  const {
    handleSubmit,
    register,
    errors,
    formState: {isValid}
  } = useForm({mode: 'onBlur'})
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth)

  const onSubmit = (values: {email: string; password: string}) => {
    const {email, password} = values
    signInWithEmailAndPassword(email, password)
  }

  const onGithubSubmit = () => {
    const githubProvider = new firebase.auth.GithubAuthProvider()            
    auth.signInWithPopup(githubProvider) 
  }

  if (user) {
    // TODO: redirect to dashboard    
    return (
      <div>
        <p>Signed In User</p>
      </div>
    );
  }

  if (error) {
    // TODO: Handle error in notification
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <article className="max-w-2xl px-2 mx-auto">
      <VisuallyHidden as="h1">Sign in to OpenMined Courses</VisuallyHidden>
      <header className="flex flex-col md:text-center">
        <h2 className="text-5xl">Welcome back!</h2>
        <p>
          "Tell me and I forget, teach me and I may remember, involve me and I learn." - Benjamin
          Franklin
        </p>
      </header>
      <section>        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="w-full">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full"
                  placeholder="Email address"
                  ref={register({required: true})}
                />
                {errors.email && <span>The field is required</span>}
              </div>
              <div className="w-full">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  className="w-full"
                  placeholder="Password"
                  ref={register({required: true})}
                />
                {errors.password && <span>The field is required</span>}
              </div>
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8 md:justify-center">
                <div>
                  <button
                    type="submit"
                    className="inline w-auto px-4 py-2 text-white bg-black rounded-md"
                    disabled={!isValid || loading}
                  >
                    Sign in
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    disabled={loading}
                    className="px-4 py-2 text-white bg-black rounded-md"
                    onClick={onGithubSubmit}
                  >
                    Sign in with GitHub
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:divide-x space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div>Forgot your password?</div>
                <div className="md:pl-4">
                  <span className="font-bold">Don't have an account? </span>
                  <Link href="/signup">
                    <a className="text-blue-600">Sign up for free!</a>
                  </Link>
                </div>
              </div>
              <hr role="separator" />
              <p>
                By signing in you agree to our{' '}
                <Link href="/terms">
                  <a className="text-blue-600">Terms of Use</a>
                </Link>{' '}
                and{' '}
                <Link href="/privacy">
                  <a className="text-blue-600">Privacy Policy</a>
                </Link>
                .
              </p>
            </div>
          </div>
        </form>
      </section>
    </article>
  )
}

export default SignIn
