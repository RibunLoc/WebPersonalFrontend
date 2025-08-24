import styles from './SkillBox.module.css'
import { FaGitAlt, FaAws, FaHtml5, FaJs } from 'react-icons/fa';
import { SiMysql, SiGo } from 'react-icons/si';

export default function AboutMeSlide4() {
    const skills = [
        { icon: <FaGitAlt />, name: 'Unix & Git', years: '1 year'},
        { icon: <SiMysql/>, name: 'SQL (MySQL, PostgreSQL)', years: '1 year'},
        { icon: <FaHtml5/>, name: 'HTML5/CSS', years: '1 year' },
        { icon: <FaAws/>, name: 'AWS', years: '1 year' },
        { icon: <FaJs />, name: 'JavaScript (Node.js, React)', years: '3 months' },
        { icon: <SiGo />, name: 'Go', years: '1 year' },
    ];

    return (
        <>
        <div className={styles.boxGrid}>
            {skills.map((skill, index) => (
                <div className={styles.skillBox} key={index}>
                    <div className={styles.icon}>{skill.icon}</div>
                    <div className={styles.skillName}>{skill.name}</div>
                    <div className={styles.years}>{skill.years}</div>
                </div>
            ))}
        </div>
        </>
    );
}