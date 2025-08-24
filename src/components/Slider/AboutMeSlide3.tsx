import styles from './SlideBox.module.css'

export default function AboutMeSlide3() {
  return (
    <div className={styles.boxGrid}>

      <div className={styles.box}>
      <h3>☁️ Cloud</h3>
        <ul>
          <li><strong>AWS:</strong> EC2, EKS (Kubernetes), S3, IAM, VPC, (ALB/NLB khi cần)</li>
          <li><strong>Edge/CDN (Cloudflare):</strong> Reverse Proxy, DNS, Pages, Turnstile</li>
          <li><strong>Monitoring:</strong> Prometheus, Grafana</li>
          <li><strong>CI/CD & GitOps:</strong> Jenkins, ArgoCD, GitHub Actions; Docker build & scan (SonarQube, Snyk, Trivy)
          <br />
          <strong>IaC:</strong> Terraform, Helm</li>
          <li><strong>Observability:</strong> Prometheus, Grafana, Loki, Opentelemetry (tracing)</li>
        </ul>
      </div>


      <div className={styles.box}>
        <h3>🔧 System</h3>
        <ul>
          <li><strong>Scripting (Bash/Powershell):</strong> Tự động hóa bươc CI/CD trên jenkins, cron định kỳ, dọn rác Docker</li>
          <li><strong>OS:</strong> Ubuntu — Cấu hình môi trường cho Jenkins, Docker host, NGINX reverse proxy.</li>
          <li><strong>Web Server:</strong> NGINX - Cấp SSL Let’s Encrypt, reverse proxy cho Jenkins/ArgoCD, chuyển hướng HTTPS.</li>
          <li><strong>Cloudflare vận hành:</strong> Tự động hóa DNS qua API, quy tắc cache/bypass cho API & webhook; Turnstile tích hợp frontend</li>
          <li><strong>Secrets Management:</strong> HashiCorp Vault — Tích hợp Jenkins/ArgoCDđể inject secrets khi deploy.</li>
          <li><strong>Container runtime (Docker):</strong> Viết Dockerfile multi-stage, docker-compose, dùng private registry (Harbor).</li>
          <li><strong>Bảo mật & truy cập:</strong> Hardening SSH (no root, key-only), ufw/iptables, tự động gia hạn SSL (Certbot); Vault Approle/JWT</li>
          <li><strong>Tooling & chuẩn đoán:</strong> journalctl, curl -v, tcpdump, nc để debug mạng & TLS nhanh.</li>
        </ul>
      </div>

      <div className={styles.box}>
        <h3>🌐 Networking & Router</h3>
        <ul>
          <li><strong>L3 routing:</strong> Static route, OSPF (single-area), Policy-Based Routing, ECMP</li>
          <li><strong>Firewall:</strong> iptables, firewalld, UFW</li>
          <li><strong>VPN:</strong> site-to-site (IKEv2), OpenVPN, WireGuard</li>
          <li><strong>Load Balancing:</strong> NGINX, HAProxy</li>
          <li><strong>VLAN & segment:</strong> Thiết kế VLAN theo chức năng (prod/dev/guest/IoT), inter-VLAN routing an toàn.</li>
          <li><strong>Captive Portal:</strong> Triển khai/tuỳ biến portal, giới hạn băng thông, whitelist dịch vụ cần thiết.</li>
        </ul>
      </div>

    </div>
  );
}
