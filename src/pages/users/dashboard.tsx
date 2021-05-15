import {useDocument} from 'react-firebase-hooks/firestore'
import {firestore} from '@/lib/firebase'

// @stevenwuzz
export default function UserDashboard() {
  // const {user} = useUser() // still need to code this useUser hook
  const user = {}
  const [value, loading, error] = useDocument(firestore.doc(`users/${user.uid}`), {
    snapshotListenOptions: {includeMetadataChanges: true}
  })

  return (
    <div>
      <p>
        {error && <span>Error: {JSON.stringify(error)}</span>}
        {loading && <span>Document: Loading...</span>}
        {value && <span>Document: {JSON.stringify(value.data())}</span>}
      </p>
    </div>
  )
}
