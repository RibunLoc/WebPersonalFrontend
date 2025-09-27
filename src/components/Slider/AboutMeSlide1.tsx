import styles from './SlideBox.module.css'

export default function AboutMeSlide1() {
  return (
    <div className={styles.boxGrid}>
      <div className={styles.box}>
        <h3>Xin chào, Tớ là Thanh Lộc 👋</h3>
        <p>
          Tớ đam mê về tự động hóa mạng, cơ sở hạ tầng và thực hành DevOps.
          Đây là nơi tớ chia sẻ tớ là ai và điều gì đã thúc đẩy tớ.
        </p>
      </div>

      <div className={styles.box}>
        <h3>👤 Đây là thông tin chút về tớ</h3>
        <ul>
          <li><strong>Full Name:</strong> Hồ Thanh Lộc</li>
          <li><strong>Nickname:</strong> Ri bún</li>
          <li><strong>Email:</strong> hothanhcloc12345@gmail.com</li>
          <li><strong>Quê nhà:</strong> Pleiku, Gia Lai</li>
          <li><strong>Nơi ở hiện tại:</strong> Ho Chi Minh City, Vietnam</li>
          <li><strong>Học tập:</strong> UIT – University of Information Technology</li>
          <li><strong>Bằng cấp:</strong> Computer Networking and Data Communication</li>
          <li><strong>Ngôn ngữ:</strong> Vietnamese (native), English (intermediate)</li>
        </ul>
      </div>
    </div>

  );
}
