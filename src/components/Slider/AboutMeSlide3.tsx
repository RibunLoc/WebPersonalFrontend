import styles from './SlideBox.module.css'

export default function AboutMeSlide3() {
  return (
    <div className={styles.boxGrid}>

      <div className={styles.box}>
      <h3>☁️ Cloud</h3>
        <ul>
          <li><strong>AWS:</strong> EC2, EKS (Kubernetes), S3</li>
          <li><strong>Cloudflare:</strong> Reverse Proxy, DNS, Pages, Workers</li>
          <li><strong>Monitoring:</strong> Prometheus, Grafana</li>
          <li><strong>Logging & Tracing:</strong> CloudWatch, OpenTelemetry</li>
          <li><strong>IaC:</strong> Terraform, Helm</li>
        </ul>
      </div>


      <div className={styles.box}>
        <h3>System 🔧</h3>
        <ul>
          <li><strong>Scripting:</strong> Bash, PowerShell — viết script tự động hóa CI/CD, tạo cronjob, cleanup Docker</li>
          <li><strong>OS:</strong> Ubuntu — cấu hình môi trường Jenkins, Docker host, NGINX reverse proxy</li>
          <li><strong>Web Server:</strong> NGINX — triển khai HTTPS với Let's Encrypt, reverse proxy cho Jenkins, ArgoCD</li>
          <li><strong>Serverless Platform:</strong> Cloudflare Workers — routing request theo geolocation</li>
          <li><strong>Secrets Management:</strong> HashiCorp Vault — tích hợp vào Jenkins & ArgoCD plugin</li>
          <li><strong>Automation:</strong> Systemd service, shell init script — tự động khởi động service app khi reboot VPS</li>
        </ul>
      </div>

     <div className={styles.box}>
        <h3>My Toolbox 🧰</h3>
        <ul>
          <li><strong>DevOps: </strong> Jenkins, GitHub Actions, ArgoCD</li>
          <li><strong>Cloud:</strong> AWS (EC2, EKS, S3)</li>
          <li><strong>IaC:</strong> Terraform, Helm</li>
          <li><strong>Monitoring:</strong> Prometheus, Grafana, Loki, Opentelemetry</li>
        </ul>
      </div>


    </div>
  );
}
