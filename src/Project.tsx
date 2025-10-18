import { Link } from "react-router-dom";
import styles from "./Project.module.css";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  repoUrl?: string;
  liveDemoUrl?: string;
}

const projects: Project[] = [
  {
    id: "quanlytaichinh",
    title: "Ứng dụng quản lý tài chính cá nhân & doanh nghiệp",
    description:
      "Ứng dụng mobile giúp theo dõi thu chi, nhắc nhở hoá đơn và tổng hợp báo cáo realtime trên Android cùng Firebase.",
    techStack: ["Java", "Firebase", "Realtime Database"],
    imageUrl: "/mobile-app.png",
    repoUrl: "https://github.com/RibunLoc/MobileApp",
  },
  {
    id: "calico",
    title: "Tối ưu hoá hạ tầng mạng với Project Calico",
    description:
      "Thiết kế network policy, giám sát lưu lượng và tích hợp observability cho cụm Kubernetes quy mô doanh nghiệp.",
    techStack: ["Kubernetes", "Calico", "NetworkPolicy", "BGP", "Grafana"],
    imageUrl: "/Calico.png",
    repoUrl: "https://github.com/RibunLoc/ProJect_Calico",
  },
  {
    id: "musicweb",
    title: "Hệ thống DevOps cho nền tảng nghe nhạc",
    description:
      "Xây dựng kiến trúc hạ tầng và pipeline CI/CD trên AWS với Terraform, ECS, Jenkins và giám sát tập trung.",
    techStack: ["Terraform", "AWS", "Jenkins", "ECS"],
    imageUrl: "/background.jpg",
    repoUrl: "https://github.com/yourusername/terraform-aws",
    liveDemoUrl: "https://infra.example.com",
  },
  {
    id: "cloudcomputingOpenebula",
    title: "Triển khai điện toán đám mây OpenNebula",
    description:
      "Kết hợp VMware & KVM để xây dựng môi trường private cloud, tối ưu hoá tài nguyên và đảm bảo tính sẵn sàng.",
    techStack: ["Ubuntu", "Nginx", "Ansible", "JMeter", "VMware", "KVM"],
    imageUrl: "/background.jpg",
  },
  {
    id: "quanlycongviec",
    title: "Nền tảng quản lý công việc Octaltask",
    description:
      "Triển khai kiến trúc DevOps + Microservices toàn diện cho nền tảng quản trị công việc, tích hợp giám sát thời gian thực.",
    techStack: ["Terraform", "AWS", "Jenkins", "Git"],
    imageUrl: "/Project/bg-Octaltask.png",
    repoUrl: "https://github.com/RibunLoc/DevOps-task-management-web-platform",
    liveDemoUrl: "https://octaltask.holoc.id.vn",
  },
];

export default function Project() {
  return (
    <section className={styles.section} id="project">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Dự án nổi bật</p>
          <h2 className={styles.title}>Những sản phẩm tôi đã đồng hành & kiến tạo</h2>
          <p className={styles.lead}>
            Mỗi dự án đều là sự kết hợp giữa chiến lược hạ tầng, bảo mật và trải nghiệm người dùng. Tôi ưu tiên tính ổn định
            và khả năng mở rộng để đội ngũ phát triển an tâm triển khai tính năng mới.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.id} className={styles.card}>
              {project.imageUrl && (
                <div className={styles.media}>
                  <img src={project.imageUrl} alt={project.title} loading="lazy" />
                  <div className={styles.mediaOverlay} />
                </div>
              )}

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                <ul className={styles.techList}>
                  {project.techStack.map((tech) => (
                    <li key={`${project.id}-${tech}`}>{tech}</li>
                  ))}
                </ul>

                <div className={styles.actions}>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      Live demo
                    </a>
                  )}
                  <Link to={`/projects/${project.id}`} className={styles.detailButton}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
