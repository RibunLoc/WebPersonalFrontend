export type Project = {
  id: string;
  title: string;
  description: string;
  date: string;
  views: number;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  cover?: string;
  detail?: string;
  links?: string;
}



export const projects: Project[] = [
  {
    id: 'calico',
    title: 'Monitoring và Networking - ProJect Calico',
    author: {
      name: 'Thanh Lộc',
      avatar: '/avatar.jpg'
    },
    date: 'Đã đăng vào th 7 21, 2025 15:37',
    views: 1,
    tags: ['kubernetes', 'Network', 'Calico'],
    description: 'Calico Kubernetes là một giải pháp mạng mã nguồn mở được sử dụng để triển khai và quản lý mạng trong một cụm Kubernetes. Nó cung cấp các tính năng mạng mạnh mẽ và linh hoạt, cho phép các container và pod trong cụm Kubernetes giao tiếp với nhau một cách an toàn và tin cậy',
    links: 'https://projectcalico.docs.tigera.io/',
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
    detail: `
## Giới thiệu
Chào bạn! Mình là một sinh viên tại UIT (Trường Đại học Công nghệ Thông Tin – ĐHQG HCM), và đây là hành trình của nhóm mình trong quá trình xây dựng FineCoin – một ứng dụng quản lý tài chính trên thiết bị di động, dành cho cả cá nhân lẫn doanh nghiệp nhỏ.

Với sự phát triển mạnh mẽ của công nghệ, việc theo dõi và kiểm soát tài chính không còn là đặc quyền của các tập đoàn. Ai cũng có quyền hiểu rõ dòng tiền của mình – từ những khoản chi nhỏ hàng ngày cho đến quản lý hàng tồn kho trong doanh nghiệp. Đó cũng chính là lý do chúng mình chọn đề tài này.
## Mục tiêu của ứng dụng
FineCoin ra đời với hai hướng chính:
- **Đối với cá nhân**:
  - Ghi lại thu/chi hàng ngày
  - Lập ngân sách theo danh mục
  - Nhắc nhở trả nợ, cảnh báo khi vượt ngân sách
  - Phân tích qua biểu đồ trực quan

- **Đối với doanh nghiệp nhỏ**:
  - Quản lý sản phẩm, đơn hàng, kho, nhà cung cấp
  - Báo cáo doanh thu, chi phí, tồn kho
  - Phân quyền người dùng (nhân viên/chủ doanh nghiệp)
  - Gửi thông báo tổng hợp mỗi ngày

---

## Công nghệ sử dụng

- Frontend: **XML + Java**
- Backend: **Java**
- IDE: **Android Studio + Gradle Plugin 8.7**
- Cơ sở dữ liệu: **Firebase Firestore**
- Target SDK: **34**

App được xây dựng native cho Android và hướng tới trải nghiệm mượt mà ngay cả trên thiết bị cấu hình trung bình.

---

## Một số giao diện nổi bật

- 🔐 **Giao diện đăng nhập/đăng ký**
- 📊 **Giao diện thống kê (cá nhân)**
- 🏢 **Giao diện quản lý doanh nghiệp**

Người dùng có thể chuyển đổi vai trò, tạo tài khoản, theo dõi thu chi cá nhân, hoặc quản lý toàn bộ hoạt động tài chính của doanh nghiệp.

---

## Một vài chức năng đáng chú ý

- ✅ **Tùy chọn vai trò**
- ✅ **Tính năng báo cáo mạnh mẽ**
- ✅ **Thông báo qua email hàng ngày**
- ✅ **Giao diện đơn giản, dễ dùng**

---

## Những điều tụi mình học được

- 💡 Làm việc nhóm, chia task hiệu quả
- 💡 Viết code sạch, cấu trúc logic
- 💡 Tư duy sản phẩm thay vì chỉ code
- 💡 Sử dụng Android Studio và Firebase chuyên sâu hơn

---

## Hạn chế & hướng phát triển

- ❌ Giao diện còn đơn giản
- ❌ Một số chức năng chưa hoàn chỉnh
- ❌ Khả năng đồng bộ chưa cao

### Định hướng phát triển:

- Cải thiện UI/UX
- Tích hợp quét mã vạch
- Đồng bộ hoá mạnh mẽ hơn
- Liên kết ngân hàng và đầu tư

---

## Tổng kết

FineCoin là đồ án mà cả nhóm 5 người tụi mình thực hiện từ A đến Z trong hơn 2 tháng. Mặc dù là sản phẩm sinh viên, nhưng bọn mình hướng đến tính **ứng dụng thực tiễn** – một công cụ tài chính hữu ích cho người trẻ, chủ quán, hay bất kỳ ai muốn kiểm soát dòng tiền.

Nếu bạn thấy ý tưởng hay ho, cần tư vấn hoặc góp ý, đừng ngại để lại comment hoặc liên hệ với mình nhé!

> 💬 **Bạn có đang theo dõi tài chính của bản thân mỗi ngày không?**
    `
  }
];
