## Kiến trúc tổng quan

* Backend gồm các dịch vụ nhỏ: Auth, User, Task; giao tiếp nội bộ bằng gRPC, bên ngoài qua API Gateway REST.
* Frontend: React + Vite.
* Hạ tầng: Terraform (AWS VPC, EKS/ECS, Jenkins, Storage, Monitoring).
* Phát hành: Jenkins CI → cập nhật GitOps → ArgoCD auto-sync (self-heal).
* Secrets: HashiCorp Vault + argocd-vault-plugin (AVP).
* Dữ liệu: MySQL (PVC Longhorn), Monitoring: Prometheus + Grafana.

![Sơ đồ tổng quan về luồng hoạt động ứng dụng ](/Project/DACN/architect_web_application.png)

> Mẹo hiển thị: **không dùng** ký tự backtick cho tên thư mục ngắn (ví dụ: **vpc/**, **eks\_or\_ecs/**, **jenkins/**). Dùng **in đậm** để tránh ô code inline xấu trong giao diện.

---

## Sơ đồ thư mục (chính)

* **infra/**

  * **modules/** → thư viện module tái sử dụng: **vpc/**, **security-group/**, **s3/**, **nat-gateway/**, **route-table/** …
  * **stacks/** → ghép module thành stack: **eks\_or\_ecs/**, **jenkins/**, **monitoring/**, **storage/** …
  * **env/** → cấu hình theo môi trường: **dev.tfvars**, **stage.tfvars**, **prod.tfvars**
* **apps/** → source frontend & backend
* **gitops/** → manifests/Helm values (repo GitOps tách riêng)

---

## Khởi tạo hạ tầng

Chuẩn bị AWS CLI và thông tin truy cập (Access key/Secret).

```bash
aws configure
```

Khởi tạo Terraform (backend S3 + DynamoDB lock khuyến nghị):

```bash
terraform init
```

Lập kế hoạch và áp dụng:

```bash
terraform plan --var-file=<file-configure.tfvars>
terraform apply --var-file=<file-configure.tfvars> --auto--approve
```

Huỷ tài nguyên (khi cần):

```bash
terraform destroy -var-file=<file-configure.tfvars>
```

---

## CI/CD & GitOps

1. Jenkins build: phát hiện thay đổi theo thư mục dịch vụ, cài dependency, build, kiểm tra chất lượng (SonarQube), quét bảo mật (Snyk/Trivy), đóng gói và đẩy image (tag theo commit SHA).
2. Pipeline cập nhật **image tag** trong repo GitOps.
3. ArgoCD auto-sync & self-heal triển khai phiên bản mới lên EKS.
 
> Tránh vòng lặp: tách **source** và **gitops**; lọc webhook để Jenkins không tự kích hoạt chính nó.

---
![Pipeline triển khai](/Project/DACN/DevOps_Pipeline.gif)


Quy trình CI/CD được thiết kế theo hướng DevOps hiện đại, sử dụng các công cụ mã nguồn mở và dịch vụ cloud để đảm bảo **tự động hóa toàn diện, an toàn, và dễ mở rộng**.

Mỗi lần có thay đổi trong source code (ví dụ: commit mới lên nhánh **main**), Jenkins sẽ tự động kiểm tra xem có dịch vụ nào bị ảnh hưởng không. Việc này dựa trên việc so sánh sự khác biệt giữa các commit để xác định những thư mục **auth-service/**, **task-service/**, **user-service/** v.v. có thay đổi hay không.

Với những service thay đổi, pipeline sẽ thực hiện:

* **Cài đặt và build code** với **npm**, đảm bảo biên dịch thành công.
* **Phân tích chất lượng mã nguồn** bằng [SonarQube](https://www.sonarqube.org/) (chất lượng code, maintainability, security hotspots).
* **Quét lỗ hổng bảo mật** bằng **Snyk** (ở mức mã nguồn) và **Trivy** (ở mức image), giúp phát hiện các dependency hoặc gói nguy hiểm trong quá trình build.
* **Build Docker Image**, sau đó đẩy lên Docker Hub với tag được gắn theo timestamp (**v3.0-20250830-2105**) giúp truy vết và rollback dễ dàng.

---

### Đồng bộ hoá GitOps

Sau khi image mới được push, pipeline sẽ **tự động cập nhật file YAML trong repo GitOps**, cụ thể:

```yaml
containers:
  - name: task-service
    image: ribun/task-management-product-task-service:v3.0-20250830-2105
```

Thông qua công cụ **yq**, Jenkins sẽ tìm đúng container cần cập nhật image, commit và push lại manifest lên repo GitOps (**DevOps-task-management-gitops**).

---

### Tự triển khai & tự hồi phục với ArgoCD

ArgoCD hoạt động như một **controller GitOps**, tự động:

* Phát hiện thay đổi trong repo GitOps.
* Đồng bộ và áp dụng lên Kubernetes cluster.
* Đảm bảo trạng thái thực tế của hệ thống luôn khớp với Git.

Ngoài ra, nhờ cơ chế **self-healing** của ArgoCD, nếu có sự cố như Pod bị xóa hay image bị thay đổi ngoài Git, hệ thống sẽ tự rollback lại theo đúng YAML gốc.

---

### Mẹo hay & tối ưu

* 🔁 **Tránh vòng lặp CI ↔ CD**: pipeline cập nhật manifest, ArgoCD sync → nếu không cẩn thận, webhook có thể kích hoạt lại chính Jenkins. Để tránh:

  * Tách riêng repo **source code** và **GitOps**.
  * Lọc webhook: chỉ trigger khi file code thay đổi, không phải YAML.
* 📄 Tạo báo cáo bảo mật (**snyk-report.json**, **trivy-report.json**) và gửi email cuối mỗi pipeline → giúp developer dễ theo dõi & cải thiện.
* 🔐 Secrets như DB password, JWT key được inject bằng **Vault** & plugin **argocd-vault-plugin**, đảm bảo **không hard-code secrets vào YAML**.


> 🎯 Đây là một mô hình triển khai CI/CD hiện đại, phù hợp cho cả bài lab học thuật lẫn ứng dụng thực tế, giúp đảm bảo quy trình triển khai luôn sạch, an toàn và kiểm soát được.

---

## 🔐 Secrets & cấu hình Frontend

Một trong những thách thức phổ biến trong triển khai hệ thống microservices là **quản lý secrets an toàn** và **cấu hình động cho frontend mà không cần rebuild** mỗi lần thay đổi. Dự án này giải quyết cả hai bằng cách tích hợp **HashiCorp Vault** với **ArgoCD** và sử dụng **runtime config injection** cho frontend React.

###  Secrets với Vault + argocd-vault-plugin (AVP)

* **HashiCorp Vault** là nơi lưu trữ toàn bộ secrets, chẳng hạn: chuỗi kết nối CSDL, JWT secret key, API key, v.v.
* Khi cấu hình một **Application** trong ArgoCD, mình dùng annotation để chỉ định đường dẫn đến secret trong Vault:

```yaml
annotations:
  avp.kubernetes.io/path: "kv/dev/task-service"
```

* **argocd-vault-plugin (AVP)** sẽ tự động đọc secrets từ Vault và **render giá trị trực tiếp vào manifest YAML** tại thời điểm ArgoCD sync.
* Secrets không bao giờ nằm trong Git → tăng cường bảo mật và tuân thủ nguyên tắc GitOps.
* Cấu trúc path được chuẩn hoá theo môi trường: **kv/dev/service-name**, **kv/stage/...**, **kv/prod/...**, giúp dễ quản lý và scale.

### Cấu hình frontend động với runtime env.js

Frontend dùng React + Vite, được đóng gói sẵn và không thể đọc biến môi trường từ `.env` sau khi build. Để tránh việc phải **rebuild mỗi khi đổi API endpoint**, mình dùng giải pháp inject động tại runtime:

* Tạo file **env.js** được mount dưới dạng **ConfigMap** hoặc được render bằng AVP nếu cần giá trị từ Vault.
* File **env.js** được chèn vào **index.html** trước React app khởi chạy:

```html
//public/index.html
<script src="/env.js"></script>
```

* Trong code React, đọc cấu hình qua biến toàn cục:

```ts
const API_BASE = window.__RUNTIME_CONFIG__?.VITE_API_BASE || "http://localhost:3000";
```

* Khi cần đổi endpoint (dev → staging → prod), chỉ cần đổi **env.js** → GitOps sync → không rebuild lại image.

### Ưu điểm

* Secrets **luôn cập nhật an toàn** và **không lộ trong Git**.
* Frontend **dễ dàng cấu hình lại theo môi trường** mà không cần deploy mới.
* Cấu trúc rõ ràng, phân tách môi trường tốt, tuân thủ GitOps.

> 🎯 Kết hợp AVP + runtime config là cách làm hiệu quả, bảo mật và tối ưu chi phí build cho các dự án DevOps hiện đại.

---

## Monitoring & dữ liệu

* Prometheus thu thập metrics; Grafana dashboard và alert cơ bản (CPU, 5xx, restart…).
* MySQL chạy với PVC từ Longhorn (snapshot/backup/replica).

---


## Lỗi thường gặp & mẹo nhanh

* Vòng lặp CI↔GitOps → tách repo, lọc webhook, chỉ cập nhật manifest cần thiết.
* Secrets trùng lặp nhiều nơi → gom về Vault làm nguồn chân lý.
* Chi phí AWS tăng nhanh → giảm node ở môi trường dev, tắt ngoài giờ, lifecycle cho logs.

---

## Bản quyền & liên hệ

Tài liệu này phục vụ học thuật và thử nghiệm. Đóng góp/issues xin tạo tại repo.
