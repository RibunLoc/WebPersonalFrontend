import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const NAV_LINKS = [
  { href: "#home", label: "Trang chủ" },
  { href: "#about", label: "Giới thiệu" },
  { href: "#experience", label: "Kinh nghiệm" },
  { href: "#project", label: "Dự án" },
  { href: "#contact", label: "Liên hệ" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.upper}>
          <div className={styles.brandColumn}>
            <a href="#home" className={styles.brand} aria-label="Về đầu trang">
              <span className={styles.brandDot} aria-hidden="true" />
              <span className={styles.brandName}>Thanh Lộc</span>
            </a>
            <p className={styles.brandTagline}>
              Sinh viên Mạng máy tính &amp; Truyền thông dữ liệu với niềm đam mê DevOps và hệ thống vận hành bền vững.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Điều hướng</h3>
              <ul className={styles.linkList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Liên hệ</h3>
              <ul className={styles.contactList}>
                <li>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span>TP. Hồ Chí Minh, Việt Nam</span>
                </li>
                <li>
                  <FaEnvelope aria-hidden="true" />
                  <a href="mailto:hothanhloc12345@gmail.com">hothanhloc12345@gmail.com</a>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Kết nối</h3>
              <div className={styles.socials}>
                <a
                  href="https://github.com/RibunLoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Github"
                >
                  <FaGithub aria-hidden="true" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/l%E1%BB%99c-h%E1%BB%93-86527637a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.lower}>
          <p className={styles.copy}>© {year} Thanh Lộc. All rights reserved.</p>
          <div className={styles.availability}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>Sẵn sàng cho cơ hội thực tập DevOps mới.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
