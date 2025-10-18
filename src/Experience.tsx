import { useEffect, useRef } from "react";
import styles from "./Experience.module.css";

type Experience = {
  title: string;
  company: string;
  time: string;
  location: string;
  desc: string;
  tags: string[];
};

const experiences: Experience[] = [
  {
    title: "Sinh viên - UIT",
    company: "Trường ĐH CNTT",
    time: "2022 - Nay",
    location: "TP. Hồ Chí Minh",
    desc: "Chuyên sâu Mạng máy tính và Cloud, triển khai các đồ án lớn về bảo mật, hạ tầng và DevOps.",
    tags: ["Networking", "Cloud", "Linux", "Go", "IoT"],
  },
  {
    title: "Triển khai ứng dụng quản lý công việc bằng microservices",
    company: "Đồ án chuyên ngành",
    time: "02/2022 - 06/2022",
    location: "TP. Hồ Chí Minh",
    desc: "Xây dựng nền tảng quản lý công việc trên AWS với EKS, chia nhỏ microservices và tự động hoá CI/CD.",
    tags: ["Docker", "Kubernetes", "MySQL", "AWS", "Microservices"],
  },
  {
    title: "Nhà thông minh IoT",
    company: "Nghiên cứu hệ thống nhúng",
    time: "2021 - 2022",
    location: "TP. Hồ Chí Minh",
    desc: "Thiết kế hệ thống cảm biến và điều khiển từ xa, kết nối mobile app và hạ tầng Firebase thời gian thực.",
    tags: ["IoT", "Embedded", "Android Studio", "Firebase"],
  },
];

export default function Experience() {
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const elements = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    if (elements.length === 0) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add(styles.visible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="experience">
      <div className={styles.container}>
        <div className={styles.header}> 
          <p className={styles.eyebrow}>Hành trình nghề nghiệp</p>
          <h2 className={styles.title}>Xây hạ tầng vững chắc cho sản phẩm tăng trưởng</h2>
          <p className={styles.lead}>
            Tôi luôn tìm cách kết nối giữa nhu cầu kinh doanh và kiến trúc kỹ thuật. Mỗi dự án dưới đây đều là bài học
            về cách giữ hệ thống ổn định, có thể giám sát và mở rộng.
          </p>
        </div>

        <ol className={styles.timeline} role="list">
          {experiences.map((exp, index) => (
            <li
              key={`${exp.title}-${index}`}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={styles.timelineItem}
            >
              <div className={styles.node} aria-hidden="true">
                <span />
              </div>

              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{exp.title}</h3>
                    <p className={styles.company}>{exp.company}</p>
                  </div>
                  <div className={styles.meta}>
                    <time>{exp.time}</time>
                    <span aria-hidden="true">•</span>
                    <span>{exp.location}</span>
                  </div>
                </header>

                <p className={styles.description}>{exp.desc}</p>

                <ul className={styles.tagList}>
                  {exp.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
