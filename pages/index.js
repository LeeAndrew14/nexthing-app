import Loader from '@components/Loader';
import PostFeed from '@components/PostFeed';
import Metatags from '@components/Metatags';
import { firestore, postToJSON, fromMillis } from '@lib/firebase';
import { useState } from 'react';

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    if (!last) {
      setLoading(false);
      setPostsEnd(true);
      return;
    }

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title="Home Page" description="Check out the latest post on our site!" />
      <PostFeed posts={posts} />

      {!loading && !postEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postEnd && 'You have reached the end!'}
    </main>
  )
}
