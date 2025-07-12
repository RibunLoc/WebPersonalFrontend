import styles from './SlideBox.module.css'

export default function AboutMeSlide1() {
  return (
    <div className={styles.boxGrid}>
      <div className={styles.box}>
        <h3>Hello, I'm Thanh Lộc 👋</h3>
        <p>
          I’m passionate about network automation, infrastructure, and DevOps practices.  
          This is where I share who I am and what drives me.
        </p>
      </div>

      <div className={styles.box}>
        <h3>👤 My Information</h3>
        <ul>
          <li><strong>Full Name:</strong> Thanh Lộc</li>
          <li><strong>Nickname:</strong> Ri bún</li>
          <li><strong>Email:</strong> hothanhcloc12345@gmail.com</li>
          <li><strong>Location:</strong> Ho Chi Minh City, Vietnam</li>
          <li><strong>Education:</strong> UIT – University of Information Technology</li>
          <li><strong>Major:</strong> Computer Networking and Data Communication</li>
          <li><strong>Languages:</strong> Vietnamese (native), English (intermediate)</li>
        </ul>
      </div>

      <div className={styles.box}>
        <h3>My Journey</h3>
        <p>
          Started exploring Docker, Git, and CI/CD early on.  
          Now I’m building pipelines with Jenkins, ArgoCD, and managing Kubernetes on AWS.
        </p>
      </div>

    </div>
    
  );
}
