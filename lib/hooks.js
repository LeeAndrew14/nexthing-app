import { auth, firestore } from '@lib/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
  // turn off realtime subscription to
    let unsubscribe;

    if (user) {
        const ref = firestore.collection('user').doc(user.uid);
        unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        });
    } else {
        serUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}