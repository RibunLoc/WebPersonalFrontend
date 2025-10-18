import styles from "./AboutMe.module.css";

const highlights = [
  {
    title: "2+ năm",
    description: "Từng thực chiến với DevOps, Cloud và hệ thống phân tán trong môi trường học thuật lẫn dự án freelance.",
  },
  {
    title: "Hạ tầng chủ động",
    description: "Ưu tiên thiết kế kiến trúc tự động hoá, theo dõi được và có khả năng mở rộng ngay từ giai đoạn đầu.",
  },
  {
    title: "Tư duy sản phẩm",
    description: "Không chỉ vận hành, tôi luôn đặt câu hỏi về trải nghiệm người dùng, hiệu quả vận hành và chi phí.",
  },
];

const focusAreas = [
  "Cloud-native & Kubernetes",
  "Giám sát & Observability",
  "CI/CD và bảo mật quy trình",
  "Hệ thống IoT & giải pháp nhúng",
];

const capabilities = [
  "Thiết kế pipeline CI/CD đa môi trường",
  "Triển khai hạ tầng IaC với Terraform, Ansible",
  "Tối ưu hoá hiệu năng và chi phí vận hành",
  "Huấn luyện, chuyển giao quy trình cho đội ngũ",
];

export default function AboutMe() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Giới thiệu</p>
          <h2 className={styles.title}>Tôi là Thanh Lộc — người tạo nhịp cho hạ tầng hiện đại</h2>
          <p className={styles.intro}>
            Kết hợp tư duy hệ thống với sự tỉ mỉ của một người vận hành, tôi giúp các nhóm phát triển đưa sản phẩm ra
            thị trường nhanh hơn nhưng vẫn giữ được sự ổn định, khả năng mở rộng và bảo mật cần thiết.
          </p>
        </div>

        <div className={styles.heroLayout}>
          <article className={styles.profileCard}>
            <div className={styles.portraitWrap}>
              <span className={styles.portraitGlow} aria-hidden="true" />
              <img src="/avatar.jpg" alt="Chân dung Thanh Lộc" className={styles.portrait} />
            </div>
            <dl className={styles.metaList}>
              <div>
                <dt>Vị trí yêu thích</dt>
                <dd>DevOps / Cloud Engineer</dd>
              </div>
              <div>
                <dt>Thành phố</dt>
                <dd>TP. Hồ Chí Minh</dd>
              </div>
              <div>
                <dt>Sở trường</dt>
                <dd>Tự động hoá hệ thống, bảo mật vận hành</dd>
              </div>
            </dl>
          </article>

          <div className={styles.storyBlock}>
            <div className={styles.highlightGrid}>
              {highlights.map((highlight) => (
                <div key={highlight.title} className={styles.highlightCard}>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.focusCard}>
              <h3>Kinh nghiệm nổi bật</h3>
              <ul>
                {focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.capabilityPanel}>
          <div className={styles.capabilityCopy}>
            <h3>Tôi đóng góp giá trị như thế nào?</h3>
            <p>
              Mỗi dự án là một bài toán khác nhau. Tôi ưu tiên làm rõ mục tiêu kinh doanh, sau đó xây dựng lộ trình vận
              hành phù hợp để đội ngũ phát triển chỉ cần tập trung vào sản phẩm.
            </p>
          </div>
          <ul className={styles.capabilityList}>
            {capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
