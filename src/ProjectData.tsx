const projects = [
  {
    id: 'calico',
    title: 'Monitoring và Networking - ProJect Calico',
    author: {
      name: 'Thanh Lộc',
      avatar: '/public/avatar.jpg'
    },
    date: 'Đã đăng vào th 7 21, 2025 15:37',
    views: 1,
    tags: ['kubernetes', 'Network', 'Calico'],
    description: 'Calico Kubernetes là một giải pháp mạng mã nguồn mở được sử dụng để triển khai và quản lý mạng trong một cụm Kubernetes. Nó cung cấp các tính năng mạng mạnh mẽ và linh hoạt, cho phép các container và pod trong cụm Kubernetes giao tiếp với nhau một cách an toàn và tin cậy',
    detail: `
## Tổng quan

Project Calico là một giải pháp mạng và bảo mật mã nguồn mở, được thiết kế để cung cấp kiến trúc mạng phân tán, quản lý và kiểm soát lưu lượng giữa các pods, máy ảo (VMs), và hosts một cách an toàn, hiệu quả trong môi trường Kubernetes, Docker và OpenStack.

## Kiến trúc

Calico sử dụng mô hình định tuyến IP trực tiếp (pure IP networking) và chính sách mạng (Network Policies) để quản lý traffic một cách linh hoạt, hiệu quả, và bảo mật cao. Calico tích hợp mượt mà với các nền tảng orchestrator container phổ biến như Kubernetes.

## Tính năng chính

### 1. Chính sách mạng (Network Policy)
- Quản lý traffic giữa các ứng dụng.
- Áp dụng mô hình Zero Trust: chỉ cho phép các kết nối xác thực.
- Cấu hình chi tiết theo nguồn, đích, cổng, giao thức.

### 2. Routing & Quản lý IP
- Định tuyến lưu lượng dựa trên IP, đơn giản hóa việc quản lý mạng.

### 3. Tích hợp orchestrators
- Hỗ trợ Kubernetes, Docker, OpenStack.
- Tự động hóa triển khai và cấu hình mạng.

### 4. Bảo mật nâng cao
- Mã hóa lưu lượng.
- Kiểm tra, phát hiện bất thường.
- Tích hợp hệ thống SIEM để giám sát và cảnh báo.

### 5. Quan sát (Observability)
- Logging tập trung, theo dõi toàn diện traffic mạng.
- Giám sát hiệu năng (Prometheus, Grafana).
- Hỗ trợ tracing, phân tích sự cố nhanh chóng.
- Cảnh báo tự động khi có vấn đề xảy ra.

### 6. Networking mạnh mẽ
- Định tuyến tối ưu, giảm độ trễ.
- Load Balancing thông minh.
- Áp dụng chính sách Quality of Service (QoS).
- Hỗ trợ đa giao thức (TCP, UDP, SCTP).

## Triển khai và Demo

### Chuẩn bị môi trường
- Cluster Kubernetes (tối thiểu 3 nodes).
- Hệ điều hành: Ubuntu/CentOS/RHEL.
- Container runtime: Docker/containerd.
- Triển khai Calico bằng YAML hoặc Helm.

### Triển khai ứng dụng mẫu
- Ứng dụng bảo mật (app-secure): Pod nginx với label role=trusted.
- Ứng dụng mô phỏng attacker: Pod busybox không có label trusted.

### Áp dụng Network Policy
- Chính sách cho phép pod trusted truy cập vào app-secure.
- Chính sách chặn pod attacker.

### Kiểm thử
- Kiểm tra truy cập hợp lệ và trái phép.
- Xác thực tính hiệu quả của các Network Policies.

### Giám sát và Log
- Sử dụng OpenTelemetry để thu thập logs và metrics.
- Hiển thị logs và metrics trên Grafana.
- Cấu hình cảnh báo tự động khi có vấn đề.
## Hướng dẫn sử dụng

### Lệnh Calico thường dùng
- \`calicoctl get nodes\`: xem nodes Calico quản lý.
- \`calicoctl get networkpolicy\`: xem policies đang áp dụng.
- \`calicoctl ipam show\`: xem IP pool và trạng thái cấp phát IP.






    `,
    // ...
  },
  //...
];

export default projects
