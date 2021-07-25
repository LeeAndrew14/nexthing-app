import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Loader from '../components/Loader.js';

import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div className={styles.container}>
       <button onClick={() => toast.success('Hello toast!')}>
         Toast me!
       </button>
    </div>
  )
}
