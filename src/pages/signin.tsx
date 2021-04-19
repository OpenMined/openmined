import { auth } from '@/lib/firebase'
import { useForm } from 'react-hook-form';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Sign() {
  const { handleSubmit, register, errors } = useForm();
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
  const onSubmit = (data: any) => {
    signInWithEmailAndPassword(data.email, data.password)
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
}