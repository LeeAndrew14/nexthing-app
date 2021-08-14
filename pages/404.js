import Link from 'next/link';

export default function Custom404() {
  return (
    <main>
      <h1>404 - Oops this page does not exists...</h1>
      <iframe
        src="https://giphy.com/embed/c20UV66B7zCWA"
        width="480"
        height="310"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
}
