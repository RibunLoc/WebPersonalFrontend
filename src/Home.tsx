import type { ReactNode } from 'react';
import { FiCloud, FiTool, FiTrendingUp } from 'react-icons/fi';
import styles from './Home.module.css';
import useTypewriter from './hooks/useTypewriter';

type Insight = {
  title: string;
  description: string;
  icon: ReactNode;
};

export default function Home() {
  const HIGHLIGHTS = [
    'Tôi là sinh viên mạng máy tính và truyền thông dữ liệu',
    'Có sở thích triển khai và vận hành hệ thống',
    'Mục tiêu muốn hướng đến là DevOps engineer',
  ];
  const { text, isDeleting } = useTypewriter(HIGHLIGHTS, 60, 35, 1200);

  const INSIGHTS: Insight[] = [
    {
      title: 'Hạ tầng & Cloud',
      description: 'Triển khai và giám sát hệ thống Linux, Docker cùng các dịch vụ đám mây quen thuộc.',
      icon: <FiCloud aria-hidden="true" />,
    },
    {
      title: 'Automation mindset',
      description: 'Ưu tiên CI/CD, IaC và tự động hoá để giảm lỗi thủ công và tăng tốc độ phát hành.',
      icon: <FiTool aria-hidden="true" />,
    },
    {
      title: 'Không ngừng học hỏi',
      description: 'Luôn cập nhật công nghệ mới, luyện tập tư duy tối ưu hiệu năng và độ tin cậy.',
      icon: <FiTrendingUp aria-hidden="true" />,
    },
  ];

  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-title">
      <div className={styles.overlay} />
      <div className={styles.decor} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobOne}`} />
        <span className={`${styles.blob} ${styles.blobTwo}`} />
      </div>

      <div className={styles.content}>
        <p className={styles.greeting}>
          <span className={styles.greetHi}>Xin chào,</span> tôi là
        </p>

        <h1 id="hero-title" className={styles.name}>
          Thanh Lộc
        </h1>

        <p className={`${styles.subtitle} ${isDeleting ? styles.deleting : ''}`} aria-live="polite">
          {text}
          <span className={styles.cursor} aria-hidden="true" />
        </p>

        <div className={styles.ctaGroup}>
          <a
            href="https://github.com/RibunLoc"
            className={`${styles.btn} ${styles.btnPrimary}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Preview my projects on GitHub"
          >
            <span className={styles.btnIconWrap}>
              <svg viewBox="0 0 24 24" className={styles.btnIcon} aria-hidden="true">
                <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
              </svg>
            </span>
            <span className={styles.btnLabel}>Preview on GitHub</span>
          </a>

          <a
            href="/HoThanhLocResume.pdf"
            className={`${styles.btn} ${styles.btnGhost}`}
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

        <div className={styles.heroHighlights} role="list">
          {INSIGHTS.map((insight) => (
            <article key={insight.title} className={styles.highlightCard} role="listitem">
              <span className={styles.highlightIcon}>{insight.icon}</span>
              <div>
                <h3 className={styles.highlightTitle}>{insight.title}</h3>
                <p className={styles.highlightDesc}>{insight.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.portrait}>
        <span className={styles.portraitGlow} aria-hidden="true" />
        <img src="/avatar.jpg" alt="Avatar of Thanh Lộc" className={styles.avatar} />
        <div className={styles.portraitCard}>
          <span className={styles.portraitTag}>DevOps explorer</span>
          <p className={styles.portraitNote}>Đang tìm kiếm cơ hội thực tập thú vị ✨</p>
        </div>
      </div>
    </section>
  );
}
