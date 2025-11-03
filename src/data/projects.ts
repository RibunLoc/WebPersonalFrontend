import calicoDetail from './md/calico.md?raw';
import quanlytaichinhDetail from './md/quanlytaichinh.md?raw';
import quanlycongviecDetail from './md/quanlycongviec.md?raw';

export type KeyLinks = {
  repo?: string; demo?: string; docs?: string; slides?: string; issue?: string; website?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  date: string;
  views: number;
  tags: string[];
  author: { name: string; avatar?: string; };
  cover?: string;
  detail?: string;           // giữ nguyên kiểu string
  links?: KeyLinks | string;
};

export const projects: Project[] = [
  {
    id: "calico",
    title: "Monitoring và Networking - ProJect Calico",
    author: { name: "Thanh Lộc", avatar: "/avatar.jpg" },
    date: "Đã đăng vào th 7 21, 2025 15:37",
    views: 1,
    tags: ["kubernetes", "Network", "Calico"],
    description:
      "Calico Kubernetes là một giải pháp mạng mã nguồn mở...",
    links: "https://projectcalico.docs.tigera.io/",
    detail: calicoDetail,    // <— Gán nội dung MD đã import
  },
  {
    id: 'quanlytaichinh',
    title: 'Mobile - Ứng dụng quản lý tài chính cá nhân và doanh nghiệp',
    author: {
      name: 'Thanh Lộc',
      avatar: '/avatar.jpg'
    },
    date: 'Đã đăng vào th 7 21, 2025 15:37',
    views: 1,
    tags: ['java', 'firebase', 'xml'],
    description: 'Quản lý tài chính là một vấn đề phức tạp và đóng vai trò quan trọng trong việc xây dựng \
          một tương lai tài chính ổn định và bền vững. Đối với cả cá nhân lẫn doanh nghiệp, việc quản lý hiệu quả các yếu tố như chi tiêu, thu nhập, ngân sách, và mục tiêu tài chính là điều cần thiết.',
    links: 'https://finecoin.example.com',
    detail: quanlytaichinhDetail,
  },
  {
    id: 'quanlycongviec',
    title: 'Xây dựng và triển khai ứng dụng web quản lý công việc dùng microservices và DevOps - Octaltask',
    author: {
      name: 'Hồ Thanh Lộc',
      avatar: '/avatar.jpg'
    },
    date: 'Đã đăng vào th 8 27, 2025 16:37',
    views: 1,
    tags: [ 'Docker', 'Kubernetes (EKS)', 'Helm', 'Terraform', 'Jenkins', 'ArgoCD','SonarQube', 'Trivy', 'Prometheus', 'Grafana', 'Vault', 'AWS (IAM, S3, ALB)', 'gRPC','JWT'],
    description: 'Quản lý công việc là một yếu tố quan trọng trong việc xây dựng \
          một quy trình làm việc hiệu quả và bền vững. Đối với cả cá nhân lẫn doanh nghiệp, việc quản lý hiệu quả các yếu tố như nhiệm vụ, thời gian, và tài nguyên là điều cần thiết.',
    links: {
      repo: 'https://github.com/RibunLoc/DevOps-task-management-web-platform',
      demo: 'https://youtu.be/MNqE1Cl2JGQ',
      docs: 'https://byvn.net/FGQo',
      slides: 'https://www.canva.com/design/DAGqnGcTiY4/sZPHtk3RUQalhn2B3I-jSg/edit?utm_content=DAGqnGcTiY4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      issue: 'https://octaltask.holoc.id.vn',
      website: 'https://octaltask.holoc.id.vn',
    },
    detail: quanlycongviecDetail
  }
];
