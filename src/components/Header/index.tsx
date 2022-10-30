import Image from 'next/image';
import Link from 'next/link';
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from './SignInButton';
import styles from './styles.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'>
          <Image 
            src="/images/logo.svg" 
            alt="ig.news" 
            width="110" 
            height="31" 
            className={styles.imgLink}
          />
        </Link>
        <nav>
          <ActiveLink href='/' activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href='/posts' activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}