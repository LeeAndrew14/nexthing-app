import Metatags from '@components/Metatags';
import AuthCheck from '@components/AuthCheck';

export default function AdminPostsPage({ }) {
  return (
    <main>
      <Metatags title="admin page" />
      <AuthCheck>
      <h1>Edit Post</h1>
      </AuthCheck>
    </main>
  )
}
