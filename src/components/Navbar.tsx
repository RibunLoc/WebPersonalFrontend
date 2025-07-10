
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Avatar + tên */}
        <div className={styles.profile}>
          <img
            src="/avatar.jpg"
            alt="Avatar"
            className={styles.avatar}
          />
          <div>
            <h1 className={styles.name}>Thanh Lộc</h1>
            <p className={styles.subtitle}>Ri bún</p>
          </div>
        </div>

        {/* Menu */}
        <nav className={styles.navLinks}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#hobbies">Hobbies & Interests</a>
        </nav>
      </div>
    </header>
  );
}
