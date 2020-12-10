import { User } from 'firebase/app';

interface firebaseUser extends User {
  uid: string;
}

export default firebaseUser;
