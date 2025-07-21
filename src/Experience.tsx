import styles from './Experience.module.css';

const experiences = [
  {
    title: "DevOps Intern",
    company: "ABC Tech",
    time: "06/2024 - 09/2024",
    location: "Hồ Chí Minh",
    desc: "Tham gia xây dựng hệ thống CI/CD với Jenkins, quản lý Kubernetes (EKS) trên AWS, triển khai Vault và giám sát bằng Grafana, Prometheus.",
    tags: ["Jenkins", "Kubernetes", "AWS", "Vault", "Prometheus", "Grafana"],
  },
  {
    title: "Cloud/DevOps Project",
    company: "Freelance",
    time: "2023 - Nay",
    location: "Remote",
    desc: "Thiết kế và vận hành hệ thống quản lý công việc microservices, tự động hóa deploy với ArgoCD, quản lý hạ tầng bằng Terraform.",
    tags: ["Microservices", "ArgoCD", "Terraform", "Docker"],
  },
  {
    title: "Sinh viên - UIT",
    company: "Trường ĐH CNTT",
    time: "2022 - Nay",
    location: "HCM",
    desc: "Nghiên cứu chuyên ngành Mạng máy tính, thực hiện nhiều bài tập lớn về mạng, cloud, bảo mật.",
    tags: ["Networking", "Cloud", "Linux", "Python"],
  }
];

export default function Experience() {
  return (
    <section className={styles.experienceSection} id="experience">
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.timeline}>
        {experiences.map((exp, idx) => (
          <div className={styles.item} key={idx}>
            <div className={styles.dot}></div>
            <div className={styles.content}>
              <h3>{exp.title} <span>— {exp.company}</span></h3>
              <span className={styles.time}>{exp.time} | {exp.location}</span>
              <p>{exp.desc}</p>
              <div className={styles.tags}>
                {exp.tags.map(tag => (
                  <span className={styles.tag} key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
