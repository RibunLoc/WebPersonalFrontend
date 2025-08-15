import styles from './Experience.module.css';
import { useEffect, useRef } from 'react';

type Experience =  {
  title: string;
  company: string;
  time: string;
  location: string;
  desc: string;
  tags: string[];
}

const experiences: Experience[] = [
  {
    title: "Sinh viên - UIT",
    company: "Trường ĐH CNTT",
    time: "2022 - Nay",
    location: "HCM",
    desc: "Nghiên cứu chuyên ngành Mạng máy tính, thực hiện nhiều bài tập lớn về mạng, cloud, bảo mật.",
    tags: ["Networking", "Cloud", "Linux", "GO", "IOT"],
  },
  {
    title: "Đồ án chuyên nghành - Đảm nhiệm vai trò triển khai ứng dụng quản lý công việc bằng microservices và DevOps",
    company: "Trường ĐH CNTT",
    time: "02/2022 - 06/2022",
    location: "HCM",
    desc: "Tham gia phát triển ứng dụng web quản lý công việc trên nền điện toán đám mây AWS sử dụng công nghệ EKS (Elastic Kubernetes Service).",
    tags: ["Docker", "K8s", "MySQL", "AWS", "Microservices"],
  },
  {
    title: "Hệ thống nhúng - Ứng dụng IoT cho hệ thống nhà thông minh",
    company: "Trường ĐH CNTT",
    time: "2021 - 2022",
    location: "HCM",
    desc: "Nghiên cứu và phát triển hệ thống IoT cho nhà thông minh, bao gồm cảm biến và điều khiển từ xa.",
    tags: ["IoT", "Embedded Systems", "Android Studio", "Firebase"],
  }
];

export default function Experience() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // nếu user chọn reduce motion → hiện luôn
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      itemRefs.current.forEach(el => el?.classList.add(styles.revealed));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            (en.target as HTMLElement).classList.add(styles.revealed);
            io.unobserve(en.target); // chỉ chạy 1 lần
          }
        });
      },
      {
        threshold: 0.15,           // 15% item xuất hiện là kích hoạt
        rootMargin: "0px 0px -8% 0px" // kích hoạt sớm hơn 1 chút ở đáy
      }
    );

    itemRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.experienceSection} id="experience">
      <h2 className={styles.sectionTitle}>Kinh nghiệm</h2>

      <ol className={styles.timeline} role="list">
        {experiences.map((exp, idx) => (
          <li
            className={styles.item}
            key={`${exp.title}-${idx}`}
            ref={(el) => { itemRefs.current[idx] = el; }}
            style={{ ["--i" as any] : idx }}// stagger animation
            >
              {/* cọc dọc + chấm mốc*/}
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.dot} />
              </div>

              {/* card nội dung */}
              <div className={styles.card}>
                <header className={styles.header}>
                  <h3 className={styles.title}>
                    {exp.title} <span className={styles.company}>- {exp.company}</span>
                  </h3>
                  <div className={styles.meta}>
                    <time className={styles.time}>{exp.time}</time>
                    <span className={styles.bullet} aria-hidden="true">•</span>
                    <span className={styles.location}>{exp.location}</span>
                  </div>
                </header>

                <p className={styles.desc}>{exp.desc}</p>

                <ul className={styles.tags} role="list">
                  {exp.tags.map((tag) => (
                    <li className={styles.tag} key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>

              </div>

          </li>
        ))}
      </ol>
    </section>
  );
}
