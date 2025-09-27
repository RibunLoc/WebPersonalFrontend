import styles from './Home.module.css';
import useTypewriter  from './hooks/useTypewriter';

export default function Home() {
  const HIGHLIGHTS = [
  'Tôi Là sinh viên mạng máy tính và truyền thông dữ liệu',
  'Có sở thích triển khai và vận hành hệ thống',
  'Mục tiêu muốn hướng đến là DevOps engineer',
  ];
  const { text, isDeleting } = useTypewriter(HIGHLIGHTS, 60, 35, 1200);

  return (
    <>
      <section className={styles.hero} id="home" aria-labelledby="hero-title">
        <div className={styles.overlay} />

        <div className={styles.content}>
          <p className={styles.greeting}>
            <span className={styles.greetHi}>Xin chào,</span> tôi là
          </p>

          {/* Tên có glow dịu cho cả light/dark */}
           <h1 id="hero-title" className={styles.name}>Thanh Lộc</h1>

          {/* chữ chạy ra rồi thu lại */}
          <p
            className={`${styles.subtitle} ${isDeleting ? styles.deleting : ''}`}
            aria-live="polite"
          >
            {text}
            <span className={styles.cursor} aria-hidden="true" />
          </p>

          {/* nút Preview on GitHub */}
          <a
            href="https://github.com/RibunLoc"
            className={styles.btnGithub}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Preview my projects on GitHub"
          >
            <span className={styles.btnIconWrap}>
              <svg viewBox="0 0 24 24" className={styles.btnIcon} aria-hidden="true">
                <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z"/>
              </svg>
            </span>
            <span className={styles.btnLabel}>Preview on GitHub</span>
          </a>

          {/* nút Download CV */}
          <a
            href="/HoThanhLocResume.pdf"
            className={styles.btnCv}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View my CV"
          >
            <span className={styles.btnIconWrap}>
              <svg viewBox="0 0 24 24" className={styles.btnIcon} aria-hidden="true">
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6c-1.1 0-2-.9-2-2V4a2 2 0 0 1 2-2zM14 2v6h6" />
              </svg>
            </span>
            <span className={styles.btnLabel}>My CV</span>
          </a>
        </div>

        <img
          src="/avatar.jpg"
          alt="Avatar of Thanh Lộc"
          className={styles.avatar}
        />
      </section>
    </>
  );
}
