import { auth } from '@/lib/firebase'
import { useForm } from 'react-hook-form'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'

const SignUp = () => {  
  const { handleSubmit, register, errors } = useForm();
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (data: any) => {
    createUserWithEmailAndPassword(data.email, data.password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="email" placeholder="email" ref={register({ required: true })} />
      {errors.email && <span>The field is required</span>}
      <br />
      <input
        type="password"
        name="password"
        placeholder="password"
        ref={register({ required: true })}
      />
      {errors.password && <span>The field is required</span>}
      <input type="submit" />
    </form>
  );
};

export default SignUp