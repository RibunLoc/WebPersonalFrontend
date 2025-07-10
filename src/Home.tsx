
import styles from './Home.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero} id="home">
        <h1 className={styles.name}>Thanh Lộc</h1>
        <p className={styles.subtitle}>
          Student | Computer Networks and Data Communication
        </p>
        <img src="/avatar.jpg" alt="Avatar" className={styles.avatar} />
      </section>

      {/* <section className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>ABOUT ME</h2>
        <p className={styles.aboutText}>
          I'm a student passionate about networks and system automation. This is a great place to share a bit more about yourself — your background, goals, and what makes you unique.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="#" style={{ margin: '0 10px' }}>🌐</a>
          <a href="#" style={{ margin: '0 10px' }}>🐦</a>
          <a href="#" style={{ margin: '0 10px' }}>📘</a>
        </div>
      </section> */}
    </>
  );
}
