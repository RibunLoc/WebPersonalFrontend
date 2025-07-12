import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
  

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleMobileMenu  = () => {
    setIsMobileMenuOpen (!isMobileMenuOpen);
  };

  const handleScroll = () => {
    const sections = [ 'home', 'about', 'experience', 'education', 'hobbies' ]
    for (const id of sections) {
      const section = document.getElementById(id);
      if(section && window.scrollY >= section.offsetTop - 80) {
        setActiveLink('$#{id}')
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Avatar + tên */}
        <div className={styles.profile}>
          <img
            src="/avatar.jpg"
            alt="Avatar"
            className={styles.avatar}
          />
          <div>
            <h1 className={styles.name}>Thanh Lộc</h1>
            <p className={styles.subtitle}>Ri bún</p>
          </div>
        </div>

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
            <GiHamburgerMenu />
        </button>

        {/* Menu + DarkMode */}
        <div className={`${styles.rightMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <nav className={styles.navLinks}>
            {['home', 'about', 'experience', 'education', 'hobbies'].map((section) => (
             <a 
              key={section}
              href={`#${section}`}
              className={activeLink === `#${section}` ? 'active' : ''}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={styles.toggleButton}
          >
            {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
          </button>
        </div>
      </div>
    </header>
  );
}
