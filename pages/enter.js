import { auth, firestore, googleAuthProvider } from '@lib/firebase';
import { UserContext } from '@lib/context';
import { useRouter } from 'next/router';
import Metatags from '@components/Metatags';

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';

const useUser = () => useContext(UserContext);

export default function Enter(props) {
  const { user, username } = useUser();

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameFrom />
  // 3. user signed in, has username <RedirectToFeed />

  return (
    <main>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? !username ? <UsernameForm /> : <RedirectToFeed /> : <SignInButton />}
    </main>
  );
}

function SignInButton() {
  // TODO add try catch
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google_logo.svg'} />Sign in with Google
    </button>
  );
}

function RedirectToFeed() {
  const { user, username } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && username) {
      router.push('/')
    }
  }, [user, username]);

  return  <p>Redirecting...</p>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const {user, username} = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the database for username match after each debounced onChange
  // useCallback is required for debounce to worker
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>

          <input name="username" placeholder="username" value={formValue} onChange={onChange}/>
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}