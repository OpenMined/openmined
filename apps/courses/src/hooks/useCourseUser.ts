import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import type { User } from '@openmined/shared/types';

// This hook is for pages where we are guaranteed to have a logged in user --
// basically the AuthRoute ones. This hook also subscribes to changes to the
// firestore user. Be careful! :)
export const useCourseUser = () => {
  const db = useFirestore();
  const loggedUser = useUser() as firebase.User;
  const docRef = db.collection('users').doc(loggedUser.uid);
  const user = useFirestoreDocData(docRef) as User;

  const update = useCallback(
    (data: Partial<User>) => {
      const docRef = db.collection('users').doc(loggedUser.uid);
      return docRef.set(data, { merge: true });
    },
    [db, loggedUser.uid]
  );

  const isMentorForCourse = useCallback(
    (course: string) =>
      user.is_mentor && user.mentorable_courses?.includes(course),
    [user]
  );

  return {
    uid: loggedUser.uid,
    authUser: loggedUser,
    user,
    isMentor: user.is_mentor && user.mentorable_courses?.length > 0,
    isMentorForCourse,
    update,
  };
};

export const useLoadFirestoreUser = (uid: string) => {
  const db = useFirestore();
  const [userId, setUid] = useState<string>(uid);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    async function fetchUser() {
      const dbUserRef = db.collection('users').doc(userId);
      const fetchedUser = (await dbUserRef.get())?.data() as User;
      setUser(fetchedUser);
    }

    userId && fetchUser();
  }, [db, userId]);

  return { user: userId ? user : null, fetchUserById: setUid };
};
