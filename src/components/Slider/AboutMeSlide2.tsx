import styles from './SlideBox.module.css'
import { FaEnvelope, FaGithub, FaLinkedinIn, FaGlobe } from 'react-icons/fa';

export default function AboutMeSlide2() {
  return (
    <div className={styles.box} >
      <h3>📫 Contact Me</h3>
      <p>This is my Information</p>
      <ul className={styles.contactList}>
        <li>
          <FaEnvelope className={styles.icon} />
          <span> Email: </span> 
          <a href="mailto:hothanhloc12345@gmail.com" >hothanhloc12345@gmail.com</a>
        </li>
        <li>
          <FaGithub className={styles.icon} />
          <span> Github: </span>
          <a href="https://github.com/RibunLoc" target="_blank" rel='noopener noreferrer'>RibunLoc</a>
        </li>
        <li>
          <FaLinkedinIn className={styles.icon} />
          <span> LinkedIn: </span>
          <a href="https://www.linkedin.com/in/l%E1%BB%99c-h%E1%BB%93-7659aa374/" target="_blank" rel="noopener noreferrer">lộc-hồ</a>
        </li>
        <li>
          <FaGlobe className={styles.icon} /> 
          <span>Webiste:</span>
          <a href="https://holoc.id.vn" target="_blank" rel="noopener noreferrer">holoc.id.vn</a>
        </li>
      </ul>
    </div>
  );
}
