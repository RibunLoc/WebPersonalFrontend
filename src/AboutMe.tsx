import React from "react";
import styles from "./AboutMe.module.css";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";


const aboutSlides = [
    {
        left: "I'm a student passionate about networks and system automation. I love learning about cloude infrastructure, CI/CD pipelines, and modern DevOps practices.",
        right: "I'm also interested in building secure and scalable systems, enjoy working tools like Jenkins, Docker, Kubernetes, and always eager to explore new technologies."
    },
    {
        left: "I enjoy building CI/CD pipelines, working with Docker, Jenkins, GitHub Actions, and Kubernetes.",
        right: "Security and automation are my focus. I love writing documentation, testing infrastructure, and learning new DevOps tools every day.",
    }
];

export default function AboutMe() {
    const [index, setIndex] = React.useState(0);
    const handlerNext = () => setIndex((prev) => (prev + 1) % aboutSlides.length);
    const handlerPrev = () => setIndex((prev) => (prev - 1 + aboutSlides.length) % aboutSlides.length);

    return (
        <section className={styles.aboutSection} id="about">
            <div className={styles.header}>
                <h2 className={styles.title}>ABOUT ME</h2>
                <div className={styles.underline}></div>

                <div className={styles.socialLinks}>
                    <FaLinkedin />
                    <FaFacebook />
                    <FaTwitter />
                </div>
            </div>
            
            <div className={styles.content}>
                <button onClick={handlerPrev} className={styles.arrow}>&larr;</button>
                
                <div className={styles.textWrapper}>
                    <p>{aboutSlides[index].left}</p>
                    <p>{aboutSlides[index].right}</p>
                </div>

                <button onClick={handlerNext} className={styles.arrow}>&rarr;</button>
            </div>

            <div className={styles.dots}>
                {aboutSlides.map((_, i) => (
                    <span 
                        key={i}
                        className={`${styles.dot} ${i === index ? styles.active : ''}`}
                    />
                ))}
            </div>
        </section>
    );
}

