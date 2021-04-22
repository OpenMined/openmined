import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import VisuallyHidden from '@reach/visually-hidden'
import {auth} from '@/lib/firebase'

const SignUp = () => {
  const {
    handleSubmit,
    register,
    errors,
    formState: {isValid}
  } = useForm({mode: 'onBlur'})
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(
    auth
  )

  const onSubmit = (values: {
    email: string
    firstName: string
    lastName: string
    password: string
    passwordConfirmation: string
  }) => {
    const {email, password} = values
    createUserWithEmailAndPassword(email, password)
  }

  if (user) {
    // redirect to dashboard
  }

  // TODO: if error, notify user -- use a notification component from OMUI

  return (
    <article className="container pt-8 mx-auto">
      <VisuallyHidden as="h1">Sign up to OpenMined Courses</VisuallyHidden>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <header className="flex flex-col mr-8 space-y-4">
          <h2 className="text-5xl">Create your courses account</h2>
          <p>
            "Tell me and I forget, teach me and I may remember, involve me and I learn." - Benjamin
            Franklin
          </p>
        </header>
        <section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full space-y-4">
              <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                <div className="w-full">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full"
                    placeholder="First name"
                    ref={register({required: true})}
                  />
                  {errors.firstName && <span>The field is required</span>}
                </div>
                <div className="w-full">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full"
                    placeholder="Last name"
                    ref={register({required: true})}
                  />
                  {errors.lastName && <span>The field is required</span>}
                </div>
              </div>
              <div className="w-full">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full"
                  placeholder="Email address"
                  ref={register({required: true})}
                />
                {errors.email && <span>The field is required</span>}
              </div>
              <div className="flex flex-col w-full space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                <div className="w-full">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full"
                    ref={register({required: true})}
                  />
                  {errors.password && <span>The field is required</span>}
                </div>
                <div className="w-full">
                  <label htmlFor="passwordConfirmation">First name</label>
                  <input
                    type="password"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    className="w-full"
                    placeholder="Password confirmation"
                    ref={register({required: true})}
                  />
                  {errors.passwordConfirmation && <span>Passwords must match</span>}
                </div>
              </div>
              <div className="flex space-x-8">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-black rounded-md"
                  disabled={!isValid || loading}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-black rounded-md"
                >
                  Sign up with GitHub
                </button>
              </div>
              <div className="border" />
              <p>
                By signing up you agree to our{' '}
                <Link href="/terms">
                  <a className="text-blue-600">Terms of Use</a>
                </Link>{' '}
                and{' '}
                <Link href="/policy">
                  <a className="text-blue-600">Privacy Policy</a>
                </Link>
                .
              </p>
            </div>
          </form>
        </section>
      </div>
    </article>
  )
}

export default SignUp
