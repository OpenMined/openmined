import {useAuthState} from 'react-firebase-hooks/auth'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import {firestore, auth} from '@/lib/firebase'

export default function UserDashboard() {
  const [user, userLoading, userError] = useAuthState(auth)
  const [value, loading, error] = useDocumentData(
    user ? firestore.doc(`users/${user.uid}`) : undefined,
    {
      snapshotListenOptions: {includeMetadataChanges: true}
    }
  )

  if (userError || error) {
    return (
      <div>
        An error occurred:<p>{JSON.stringify(userError || error)}</p>
      </div>
    )
  }

  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(value)}</p>
    </div>
  )
}
