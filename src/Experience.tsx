import styles from './Experience.module.css';

const experiences = [
  // {
  //   title: "Cloud/DevOps Project",
  //   company: "Freelance",
  //   time: "2023 - Nay",
  //   location: "Remote",
  //   desc: "Thiết kế và vận hành hệ thống quản lý công việc microservices, tự động hóa deploy với ArgoCD, quản lý hạ tầng bằng Terraform.",
  //   tags: ["Microservices", "ArgoCD", "Terraform", "Docker"],
  // },
  {
    title: "Sinh viên - UIT",
    company: "Trường ĐH CNTT",
    time: "2022 - Nay",
    location: "HCM",
    desc: "Nghiên cứu chuyên ngành Mạng máy tính, thực hiện nhiều bài tập lớn về mạng, cloud, bảo mật.",
    tags: ["Networking", "Cloud", "Linux", "GO"],
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
