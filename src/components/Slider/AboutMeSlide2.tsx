import styles from './SlideBox.module.css'

export default function AboutMeSlide2() {
  return (
    <div className={styles.box} >
      <h3>My Journey</h3>
      <p>
        Started exploring Docker, Git, and CI/CD early on.  
        Now I’m building pipelines with Jenkins, ArgoCD, and managing Kubernetes on AWS.
      </p>
    </div>
  );
}
