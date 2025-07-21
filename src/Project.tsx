import styles from './Project.module.css'
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
    repoUrl: string;
  liveDemoUrl?: string;
}

const projects: Project[] = [
  {
    id: 'quanlytaichinh',
    title: 'Mobile - Ứng dụng quản lý tài chính cá nhân và doanh nghiệp',
    description: 'Ứng dụng mobile quản lý tài chính cá nhân và doanh nghiệp với android studio và firebase.',
    techStack: ['Java', 'Google firebase', 'chart'],
    imageUrl: '/public/background.jpg',
    repoUrl: 'https://github.com/RibunLoc/MobileApp',
  },
  {
    id: 'calico',
    title: 'Monitoring và Networking - ProJect_Calico',
    description: 'Cấu hình mạng ảo trên Kubernetes sử dụng Calico, gồm triển khai Calico CNI, thiết lập NetworkPolicy, BGP peer và IPAM.',
    techStack: ['Kubernetes', 'Calico', 'NetworkPolicy', 'BGP', 'loki', 'Opentelemetry', 'prometheus', ' Grafana'],
    imageUrl: '/public/Calico.png',
    repoUrl: 'https://github.com/RibunLoc/ProJect_Calico',
  },
  {
    id: 'musicweb',
    title: 'DevOps - Ứng dụng web nghe nhạc',
    description: 'Triển khai web nghe nhạc với AWS (vpc, ecs, ec2, iam, s3) và jenkins.',
    techStack: ['Terraform', 'AWS', 'Jenkins', 'ECS'],
    imageUrl: '/public/background.jpg',
    repoUrl: 'https://github.com/yourusername/terraform-aws',
    liveDemoUrl: 'https://infra.example.com',
  },
  {
    id: 'cloudcomputingOpenebula',
    title: 'System - Triển khai điện toán đám mây OpenNebula',
    description: '',
    techStack: ['ubuntu', 'nginx', 'Ansible', 'jmeter', 'vmware'],
    imageUrl: '/public/background.jpg',
    repoUrl: '',
  },
];

export default function ProjectsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Dự án nổi bật</h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.title} className={styles.card}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className={styles.image}
                />
              )}
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.description}>
                  {project.description}
                </p>
                <div className={styles.techStack}>
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={styles.techBadge}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={styles.links}>
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    GitHub Repo
                  </a>
                  <Link
                    to={`/projects/${project.id}`}
                    className={styles.moreBtn}
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
