import styles from './Footer.module.css'
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div>
                    <span className={styles.name}>© {year} Thanh Lộc</span>
                </div>
                <div className={styles.socials}>
                    <a href="https://github.com/RibunLoc" target="_blank" rel="noopener noreferrer" aria-label="Github">
                        <FaGithub/>
                    </a>
                    <a href="https://www.linkedin.com/in/l%E1%BB%99c-h%E1%BB%93-86527637a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedin/>
                    </a>
                    <a href="mailto:hothanhloc12345@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                        <FaEnvelope/>
                    </a>
                </div>
            </div>
        </footer>
    );
}